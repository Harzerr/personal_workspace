import json
import tempfile
import unittest
from pathlib import Path

import analyze
from evaluate import Chunk, Retriever, json_from_model, normalize_quote


class EvaluationUtilitiesTest(unittest.TestCase):
    def chunks(self):
        return [
            Chunk("a", "A.java", "java", "method", 1, 5,
                  "Redis stores twelve recent messages with a thirty day TTL.", "ha"),
            Chunk("b", "B.java", "java", "method", 1, 5,
                  "RRF combines lexical BM25 ranking and semantic vector ranking.", "hb"),
        ]

    def test_repairs_unescaped_model_backslash(self):
        value = '{"items":[{"path":"src\main"}]}'
        self.assertEqual("src\\main", json_from_model(value)["items"][0]["path"])

    def test_normalizes_quote_whitespace(self):
        self.assertEqual("one two three", normalize_quote("one\n  two\tthree"))

    def test_bm25_ranks_matching_chunk_first(self):
        retriever = Retriever(self.chunks(), {"a": [1.0, 0.0], "b": [0.0, 1.0]})
        ranking, _ = retriever.bm25("BM25 lexical ranking")
        self.assertEqual("b", ranking[0])

    def test_semantic_ranks_by_cosine_similarity(self):
        retriever = Retriever(self.chunks(), {"a": [1.0, 0.0], "b": [0.0, 1.0]})
        ranking, _ = retriever.semantic([0.1, 0.9])
        self.assertEqual(["b", "a"], ranking)

    def test_rrf_rewards_items_present_in_both_rankings(self):
        self.assertEqual("b", Retriever.hybrid(["a", "b"], ["b", "c"])[0])

    def test_hit_at_ten_uses_any_relevant_label(self):
        items = [{"id": "q", "originChunkId": "origin", "relevantChunkIds": ["origin", "equivalent"]}]
        runs = {"q": {"system": ["other", "equivalent"]}}
        result = analyze.score(items, runs, "system")
        self.assertEqual(1, result["hits"])
        self.assertEqual(0.5, result["mrrAt10"])


if __name__ == "__main__":
    unittest.main()
