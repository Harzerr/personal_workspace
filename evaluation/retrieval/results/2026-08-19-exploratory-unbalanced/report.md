# Personal AI Workspace Retrieval Evaluation

- Corpus: 202 chunks from 8 sources
- Fixed questions: 120 (40 dev / 80 test)
- Corpus hash: `d037ff550329d72498e7e35e24e05510e3ea9e6b4d89636352b990901b881d20`
- Embedding: `qwen/qwen3-embedding-8b` (1536 dimensions)
- Labeling: exact source quote + LLM candidate pooling; every item retains file and line evidence
- Production parity: 6/10 exact rankings; 99.0% mean top-10 overlap

## Test Results

| System | Hit@10 | Hits | MRR@10 | Retrieval P50 | Retrieval P95 |
|:--|--:|--:|--:|--:|--:|
| Vector | 95.0% | 76/80 | 0.840 | 16.89 ms | 18.09 ms |
| BM25 | 52.5% | 42/80 | 0.331 | 0.85 ms | 0.99 ms |
| BM25 + Vector + RRF | 93.8% | 75/80 | 0.712 | 17.79 ms | 19.08 ms |
| RRF + Query Rewrite | 96.2% | 77/80 | 0.711 | 17.76 ms | 18.61 ms |

## Interpretation

This is a fixed synthetic benchmark generated from the frozen private corpus. It measures retrieval
coverage, not end-user answer accuracy. Questions are accepted only when an exact answer quote exists
in the origin chunk; additional relevant chunks are added by pooled judging across all evaluated systems.
The test split is not used for parameter tuning. Model-assisted labels should still receive a sampled
human audit before the result is presented as an externally verified metric.
