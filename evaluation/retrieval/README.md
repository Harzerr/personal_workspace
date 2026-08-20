# Retrieval Hit@10 evaluation

This directory contains the reproducible retrieval benchmark for Personal AI
Workspace. It runs against a read-only snapshot of the deployed
`workspace_chunk` and `vector_store_openai` tables.

The pipeline performs these steps automatically:

1. Freeze the corpus manifest and vector count.
2. Generate source-grounded questions with exact answer quotes.
3. Generate production-style rewrites for multi-turn follow-ups.
4. Evaluate Vector, BM25, BM25 + Vector + RRF, and RRF + Query Rewrite.
5. Pool the top-10 candidates from every system and add relevance labels.
6. Create deterministic development and test splits.
7. Write the dataset, rankings, metrics, manifest, and Markdown report.

Run it on the deployment host, where the PostgreSQL container and configured
model APIs are available:

```bash
python3 evaluate.py \
  --workspace-id personal-workspace \
  --target 120 \
  --dev-size 40 \
  --output-dir /tmp/personal-workspace-retrieval-eval
```

The output contains no API keys. `questions.jsonl` retains the source path,
line range, exact answer quote, and relevance labels for every question so a
human can audit a sample before the number is used outside the project.

Generate subgroup metrics, origin-label sensitivity, and a development-only
RRF weight search after the evaluation:

```bash
python3 analyze.py /path/to/evaluation-results
```

Run a blind second-pass audit of every generated question and exact quote:

```bash
python3 audit.py /path/to/evaluation-results
```

Run the deterministic utility tests with:

```bash
python3 -m unittest -v test_evaluate.py
```

Hit@10 is defined as the proportion of questions for which at least one
labeled relevant chunk appears in the first 10 retrieved chunks. This is a
synthetic, corpus-grounded retrieval benchmark; it is not a measure of final
answer accuracy or production user satisfaction.
