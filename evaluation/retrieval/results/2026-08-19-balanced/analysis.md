# Retrieval Evaluation Analysis

## Dataset

- 120 fixed questions: 40 development and 80 test
- Modes: {'standalone': 105, 'multi_turn': 15}
- Categories: {'exact_identifier': 30, 'semantic_paraphrase': 30, 'behavior': 30, 'configuration': 30}
- Mean relevant labels per question: 1.18

## Test Metrics And Label Sensitivity

| System | Pooled Hit@10 | Origin-only Hit@10 | Pooled MRR@10 |
|:--|--:|--:|--:|
| Vector | 82.50% (66/80) | 81.25% (65/80) | 0.635 |
| BM25 | 25.00% (20/80) | 25.00% (20/80) | 0.123 |
| BM25 + Vector + RRF | 82.50% (66/80) | 82.50% (66/80) | 0.482 |
| RRF + Query Rewrite | 90.00% (72/80) | 90.00% (72/80) | 0.538 |

## Blind-audited Test Metrics

The second pass retained 70/80 test questions. Metrics below exclude every rejected item.

| System | Hit@10 | MRR@10 |
|:--|--:|--:|
| Vector | 82.86% (58/70) | 0.629 |
| BM25 | 22.86% (16/70) | 0.098 |
| BM25 + Vector + RRF | 82.86% (58/70) | 0.478 |
| RRF + Query Rewrite | 88.57% (62/70) | 0.524 |

- Audited `multi_turn` subset (8): Vector 25.00%, BM25 + Vector + RRF 25.00%, RRF + Query Rewrite 75.00%
- Audited `standalone` subset (62): Vector 90.32%, BM25 + Vector + RRF 90.32%, RRF + Query Rewrite 90.32%

## Mode Breakdown

### multi_turn (11 test questions)

| System | Hit@10 |
|:--|--:|
| Vector | 27.27% (3/11) |
| BM25 | 0.00% (0/11) |
| BM25 + Vector + RRF | 27.27% (3/11) |
| RRF + Query Rewrite | 81.82% (9/11) |

### standalone (69 test questions)

| System | Hit@10 |
|:--|--:|
| Vector | 91.30% (63/69) |
| BM25 | 28.99% (20/69) |
| BM25 + Vector + RRF | 91.30% (63/69) |
| RRF + Query Rewrite | 91.30% (63/69) |

## Development-only Fusion Search

The best development setting used lexical weight `1.0`, semantic weight `1.0`, and RRF K `10`. It reached 87.50% on development and 82.50% on test.

The development set retains lexical evidence, but tuned fusion does not improve test Hit@10 over the current embedding model. Query rewriting does improve the multi-turn subset.
