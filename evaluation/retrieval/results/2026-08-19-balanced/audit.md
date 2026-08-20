# Retrieval Dataset Audit

- Overall: 106/120 passed (88.33%)
- Test split: 70/80 passed (87.50%)
- Issues: {'generic_knowledge': 1, 'incomplete_quote': 11, 'unsupported_answer': 2}

The audit is a blind second model pass over the question, reference answer, and exact quote.
It does not receive the first-pass relevance decision or retrieval rankings.
