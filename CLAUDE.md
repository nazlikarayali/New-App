# JotForm App Builder - Monorepo

## Project Context
Before starting any task, read the project memory for full architecture details:
- `~/.claude/projects/-Users-okandungel/memory/project_jf_workspace.md`

## Key Rules
- Never override component styles from builder — fix at source in app-elements or design-system
- Never use hardcoded values — always use design tokens
- Builder UI uses `--ds-*` tokens and Circular font from design-system
- Canvas components use app-elements tokens (`--fg-*`, `--bg-*`, `--space-*`, `--radius-*`)
- Icons: builder UI uses design-system Icon (SVG fetch), canvas uses app-elements Icon (lucide/phosphor/tabler)
