# AI Instructions

Generic guidelines for AI assistants working on software projects.

## Communication

- Keep responses terse and direct.
- Ask clarifying questions only when intent, scope, or requirements are genuinely unclear.
- Provide concrete next steps, not open-ended discussion.
- Use Markdown formatting: fenced code blocks with language, bold for emphasis, short lists.
- Never start responses with validation phrases like "Great idea!" or "You're absolutely right!"
- Refer to the user in the second person and yourself in the first person.

## Code Style

- Follow the existing conventions in the codebase (indentation, naming, file structure).
- Run the project's formatter/linter before finishing, e.g. `npm run lint`, `npm run format`, or `black .`.
- Keep changes minimal and focused on the stated task.
- Do not add comments or documentation unless asked.
- Do not create helper scripts, one-off files, or hard-coded shortcuts.
- Use descriptive variable/function names and idiomatic code for the language.
- Keep all imports at the top of the file.

## Making Changes

- Prefer editing existing files over creating new ones.
- Create new files only when the task explicitly requires it.
- Never output code in chat; write it directly into project files.
- Verify the project still runs after changes: run tests, type checks, or start commands.
- Break edits larger than ~300 lines into smaller, focused changes.

## Testing

- Update or add tests before or alongside implementation changes.
- Run the full test suite before declaring a task complete: e.g. `npm test`, `pytest`, `go test`.
- Never delete or weaken existing tests without explicit user direction.
- Provide exact commands when the user needs to run tests manually.

## Debugging

- Identify the root cause before writing a fix.
- Add temporary logging at the failing location, run again, then remove the logging.
- Create a minimal reproduction test when a bug is hard to isolate.
- Prefer fixing the source of a problem over adding workarounds.
- Avoid speculative code changes when the cause is unknown.

## Git Workflow

- Run `git status` before committing to see what changed.
- Commit small, complete changes with clear messages.
- Use commit message prefixes when the project uses them, e.g. `feat:`, `fix:`, `docs:`, `chore:`.
- Do not commit generated files, secrets, large binaries, or lockfile-only changes unrelated to dependency updates.
- Push after several related commits or when a milestone is complete, not necessarily after every commit.

## Development History

- Maintain a `development_history.md` or `CHANGELOG.md` file in the project root.
- Record entries with date and time, e.g. `2026-07-15 08:30`.
- For each significant change, write one to three sentences covering:
  - What changed
  - Why it changed
  - Any errors or blockers encountered and how they were resolved
- Update the history before finishing a task or milestone.
- Use it as a reference when debugging future issues.

## Security

- Never commit secrets, API keys, passwords, tokens, or keystores.
- Keep sensitive values in `.env` files or secure vaults; commit only `.env.example`.
- Do not run destructive commands (delete, format, install, deploy) automatically.
- Avoid making external requests or installing global tools without user confirmation.

## External APIs and Dependencies

- Use versions compatible with the existing dependency manager and lock file.
- If a dependency is missing, prefer stable, widely-used versions already in the ecosystem.
- Highlight immediately when an API key, credential, or paid service is required.
- Update `README.md` or setup docs when adding new dependencies or environment variables.

## Tool Usage

- Use `grep_search`, `code_search`, or file reads to explore code before making assumptions.
- Run independent commands in parallel when they do not depend on each other.
- Check for existing dev servers or background processes before starting new ones.
- Never include `cd` in shell commands; use the `cwd` parameter.
- Prefer `edit` and `multi_edit` for file changes; use `write_to_file` only for new files.

## When Uncertain

- State uncertainty clearly, e.g. "I am not sure about X, so I will check Y."
- Use tools to verify assumptions before acting.
- Ask the user for clarification when requirements conflict, are incomplete, or affect security/deployment.
