# Retrieval evaluation results

`2026-08-19-balanced` is the reportable benchmark. It uses a frozen corpus of
202 chunks from 8 sources and a balanced 120-question dataset:

- 30 exact-identifier questions
- 30 configuration questions
- 30 behavior questions
- 30 semantic-paraphrase questions
- 40 development / 80 test split

Every item has an exact source quote and pooled relevance labels. A blind
second pass accepted 106/120 questions and 70/80 test questions. The
conservative reportable metrics use only those 70 accepted test questions:

| System | Hit@10 |
|:--|--:|
| BM25 | 22.86% |
| Vector | 82.86% |
| BM25 + Vector + RRF | 82.86% |
| RRF + Query Rewrite | 88.57% |

On the eight blind-audited multi-turn test questions, Query Rewrite raises
Hit@10 from 25.00% to 75.00%.

`2026-08-19-exploratory-unbalanced` is retained for traceability but must not
be quoted. Its generated question categories were heavily imbalanced.

Recommended resume wording:

> 构建包含 120 条问题的固定检索评测集，通过原文引用校验、候选池标注与二阶段盲审；在 70 条通过盲审的测试样本上，完整检索链路相较 BM25 单路检索将 Hit@10 从 22.86% 提升至 88.57%，多轮追问子集经 Query 重写后由 25% 提升至 75%。
