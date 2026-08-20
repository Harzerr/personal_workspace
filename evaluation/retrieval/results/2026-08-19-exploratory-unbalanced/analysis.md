# Retrieval Evaluation Analysis

## Dataset

- 120 fixed questions: 40 development and 80 test
- Modes: {'standalone': 104, 'multi_turn': 16}
- Categories: {'behavior': 72, 'exact_identifier': 22, 'semantic_paraphrase': 4, 'configuration': 22}
- Mean relevant labels per question: 1.26

## Test Metrics And Label Sensitivity

| System | Pooled Hit@10 | Origin-only Hit@10 | Pooled MRR@10 |
|:--|--:|--:|--:|
| Vector | 95.00% (76/80) | 93.75% (75/80) | 0.840 |
| BM25 | 52.50% (42/80) | 46.25% (37/80) | 0.331 |
| BM25 + Vector + RRF | 93.75% (75/80) | 91.25% (73/80) | 0.712 |
| RRF + Query Rewrite | 96.25% (77/80) | 93.75% (75/80) | 0.711 |

## Mode Breakdown

### multi_turn (10 test questions)

| System | Hit@10 |
|:--|--:|
| Vector | 70.00% (7/10) |
| BM25 | 10.00% (1/10) |
| BM25 + Vector + RRF | 70.00% (7/10) |
| RRF + Query Rewrite | 90.00% (9/10) |

### standalone (70 test questions)

| System | Hit@10 |
|:--|--:|
| Vector | 98.57% (69/70) |
| BM25 | 58.57% (41/70) |
| BM25 + Vector + RRF | 97.14% (68/70) |
| RRF + Query Rewrite | 97.14% (68/70) |

## Development-only Fusion Search

The best development setting used lexical weight `0.0`, semantic weight `1.0`, and RRF K `10`. It reached 90.00% on development and 95.00% on test.

The selected lexical weight is zero, so the fixed dataset provides no evidence that equal-weight RRF
improves over the current embedding model. Query rewriting does improve the multi-turn subset.
