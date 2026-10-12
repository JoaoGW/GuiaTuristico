# Review Workflow

Review `$ARGUMENTS`. If no scope is provided, review the current working-tree diff.

## Process

1. Identify the reviewed scope and inspect the relevant diff, callers, contracts, and tests.
2. Use the `code-reviewer` subagent when the scope is large enough to benefit from isolated analysis.
3. Check correctness, regressions, React Navigation and platform behavior, app–API contract consistency (consumer, handler, and `SwaggerAccordion.tsx`), AI and network failure handling, key exposure, LLM cost changes, and accessibility. Ignore the known baseline issues listed in `AGENTS.md` unless the change affects them.
4. Do not edit files, create comments, create issues, commit, or push.
5. Do not report subjective style preferences as defects.

## Output Contract

Return findings only when they are concrete and actionable:

- `[P0]` Blocks release, causes data loss, security exposure, or critical failure.
- `[P1]` Causes incorrect behavior, regression, or meaningful contract break.
- `[P2]` Is a contained quality, maintainability, or test-gap concern.

For every finding provide:

- file and line;
- evidence from the code;
- concrete impact;
- smallest recommended correction.

If no findings are identified, say: `No actionable findings found.`
