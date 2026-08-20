#!/usr/bin/env python3
"""Create subgroup, label-sensitivity, and fusion-tuning reports."""

from __future__ import annotations

import argparse
import collections
import json
import statistics
from pathlib import Path
from typing import Any


SYSTEMS = ("vector", "bm25", "hybrid", "hybridRewrite")
SYSTEM_NAMES = {
    "vector": "Vector",
    "bm25": "BM25",
    "hybrid": "BM25 + Vector + RRF",
    "hybridRewrite": "RRF + Query Rewrite",
}


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def score(items: list[dict[str, Any]], runs: dict[str, dict[str, Any]],
          system: str, origin_only: bool = False) -> dict[str, Any]:
    hits = 0
    reciprocal_ranks: list[float] = []
    for item in items:
        relevant = {item["originChunkId"]} if origin_only else set(item["relevantChunkIds"])
        ranking = runs[item["id"]][system]
        ranks = [rank for rank, chunk_id in enumerate(ranking, start=1) if chunk_id in relevant]
        if ranks:
            hits += 1
            reciprocal_ranks.append(1.0 / min(ranks))
        else:
            reciprocal_ranks.append(0.0)
    return {
        "questions": len(items),
        "hits": hits,
        "hitAt10": hits / len(items) if items else 0.0,
        "mrrAt10": statistics.mean(reciprocal_ranks) if reciprocal_ranks else 0.0,
    }


def weighted_ranking(run: dict[str, Any], lexical_weight: float,
                     semantic_weight: float, rrf_k: int) -> list[str]:
    scores: collections.defaultdict[str, float] = collections.defaultdict(float)
    for rank, chunk_id in enumerate(run["bm25"], start=1):
        scores[chunk_id] += lexical_weight / (rrf_k + rank)
    for rank, chunk_id in enumerate(run["vector"], start=1):
        scores[chunk_id] += semantic_weight / (rrf_k + rank)
    return [chunk_id for chunk_id, _ in sorted(scores.items(), key=lambda value: value[1], reverse=True)[:10]]


def weighted_score(items: list[dict[str, Any]], runs: dict[str, dict[str, Any]],
                   lexical_weight: float, semantic_weight: float, rrf_k: int) -> dict[str, Any]:
    synthetic_runs = {
        item["id"]: {"weighted": weighted_ranking(runs[item["id"]], lexical_weight, semantic_weight, rrf_k)}
        for item in items
    }
    return score(items, synthetic_runs, "weighted")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("result_dir", type=Path)
    args = parser.parse_args()
    items = load_jsonl(args.result_dir / "questions.jsonl")
    runs = {row["id"]: row for row in load_jsonl(args.result_dir / "rankings.jsonl")}
    dev = [item for item in items if item["split"] == "dev"]
    test = [item for item in items if item["split"] == "test"]
    audit_path = args.result_dir / "audit.json"
    audited_test: list[dict[str, Any]] = []
    audit_summary: dict[str, Any] | None = None
    if audit_path.exists():
        audit_summary = json.loads(audit_path.read_text(encoding="utf-8"))
        valid_ids = {item["id"] for item in audit_summary["items"] if item["valid"]}
        audited_test = [item for item in test if item["id"] in valid_ids]

    overall = {system: score(test, runs, system) for system in SYSTEMS}
    origin_only = {system: score(test, runs, system, origin_only=True) for system in SYSTEMS}
    by_mode = {
        mode: {system: score([item for item in test if item["mode"] == mode], runs, system) for system in SYSTEMS}
        for mode in sorted({item["mode"] for item in items})
    }
    by_category = {
        category: {
            system: score([item for item in test if item["category"] == category], runs, system)
            for system in SYSTEMS
        }
        for category in sorted({item["category"] for item in items})
    }
    audited_metrics = ({system: score(audited_test, runs, system) for system in SYSTEMS}
                       if audited_test else {})
    audited_by_mode = ({
        mode: {
            system: score([item for item in audited_test if item["mode"] == mode], runs, system)
            for system in SYSTEMS
        }
        for mode in sorted({item["mode"] for item in audited_test})
    } if audited_test else {})

    grid: list[dict[str, Any]] = []
    for lexical_weight in (0.0, 0.1, 0.25, 0.5, 0.75, 1.0, 1.5, 2.0):
        for rrf_k in (10, 30, 60, 100):
            result = weighted_score(dev, runs, lexical_weight, 1.0, rrf_k)
            grid.append({"lexicalWeight": lexical_weight, "semanticWeight": 1.0, "rrfK": rrf_k, **result})
    grid.sort(key=lambda value: (value["hitAt10"], value["mrrAt10"]), reverse=True)
    best = grid[0]
    tuned_test = weighted_score(test, runs, best["lexicalWeight"], best["semanticWeight"], best["rrfK"])

    analysis = {
        "dataset": {
            "total": len(items),
            "dev": len(dev),
            "test": len(test),
            "modes": dict(collections.Counter(item["mode"] for item in items)),
            "categories": dict(collections.Counter(item["category"] for item in items)),
            "sources": dict(collections.Counter(item["sourcePath"] for item in items)),
            "averageRelevantLabels": statistics.mean(len(item["relevantChunkIds"]) for item in items),
        },
        "test": overall,
        "originOnlySensitivity": origin_only,
        "byMode": by_mode,
        "byCategory": by_category,
        "auditedTest": audited_metrics,
        "auditedByMode": audited_by_mode,
        "audit": ({key: value for key, value in audit_summary.items() if key != "items"}
                  if audit_summary else None),
        "fusionTuning": {"bestDevelopmentSetting": best, "testResult": tuned_test, "topGrid": grid[:12]},
    }
    (args.result_dir / "analysis.json").write_text(
        json.dumps(analysis, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    lines = [
        "# Retrieval Evaluation Analysis",
        "",
        "## Dataset",
        "",
        f"- 120 fixed questions: {len(dev)} development and {len(test)} test",
        f"- Modes: {analysis['dataset']['modes']}",
        f"- Categories: {analysis['dataset']['categories']}",
        f"- Mean relevant labels per question: {analysis['dataset']['averageRelevantLabels']:.2f}",
        "",
        "## Test Metrics And Label Sensitivity",
        "",
        "| System | Pooled Hit@10 | Origin-only Hit@10 | Pooled MRR@10 |",
        "|:--|--:|--:|--:|",
    ]
    for system in SYSTEMS:
        lines.append(
            f"| {SYSTEM_NAMES[system]} | {overall[system]['hitAt10'] * 100:.2f}% "
            f"({overall[system]['hits']}/{len(test)}) | {origin_only[system]['hitAt10'] * 100:.2f}% "
            f"({origin_only[system]['hits']}/{len(test)}) | {overall[system]['mrrAt10']:.3f} |"
        )
    if audited_metrics:
        lines += [
            "",
            "## Blind-audited Test Metrics",
            "",
            f"The second pass retained {len(audited_test)}/{len(test)} test questions. Metrics below exclude every rejected item.",
            "",
            "| System | Hit@10 | MRR@10 |",
            "|:--|--:|--:|",
        ]
        for system in SYSTEMS:
            value = audited_metrics[system]
            lines.append(
                f"| {SYSTEM_NAMES[system]} | {value['hitAt10'] * 100:.2f}% "
                f"({value['hits']}/{len(audited_test)}) | {value['mrrAt10']:.3f} |"
            )
        lines.append("")
        for mode in sorted(audited_by_mode):
            count = audited_by_mode[mode]["vector"]["questions"]
            values = ", ".join(
                f"{SYSTEM_NAMES[system]} {audited_by_mode[mode][system]['hitAt10'] * 100:.2f}%"
                for system in ("vector", "hybrid", "hybridRewrite")
            )
            lines.append(f"- Audited `{mode}` subset ({count}): {values}")
    lines += ["", "## Mode Breakdown", ""]
    for mode in sorted(by_mode):
        count = by_mode[mode]["vector"]["questions"]
        lines += [f"### {mode} ({count} test questions)", "", "| System | Hit@10 |", "|:--|--:|"]
        for system in SYSTEMS:
            value = by_mode[mode][system]
            lines.append(f"| {SYSTEM_NAMES[system]} | {value['hitAt10'] * 100:.2f}% ({value['hits']}/{count}) |")
        lines.append("")
    if best["lexicalWeight"] == 0:
        fusion_interpretation = (
            "The selected lexical weight is zero, so the fixed dataset provides no evidence that RRF "
            "improves over the current embedding model."
        )
    elif tuned_test["hitAt10"] <= overall["vector"]["hitAt10"]:
        fusion_interpretation = (
            "The development set retains lexical evidence, but tuned fusion does not improve test Hit@10 "
            "over the current embedding model."
        )
    else:
        fusion_interpretation = (
            "The development-selected fusion weights improve test Hit@10 over the embedding-only baseline."
        )
    lines += [
        "## Development-only Fusion Search",
        "",
        f"The best development setting used lexical weight `{best['lexicalWeight']}`, semantic weight "
        f"`{best['semanticWeight']}`, and RRF K `{best['rrfK']}`. It reached "
        f"{best['hitAt10'] * 100:.2f}% on development and {tuned_test['hitAt10'] * 100:.2f}% on test.",
        "",
        fusion_interpretation + " Query rewriting does improve the multi-turn subset.",
        "",
    ]
    (args.result_dir / "analysis.md").write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps(analysis, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
