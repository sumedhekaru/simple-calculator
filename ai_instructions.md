# AI Instructions

Generic guidelines for AI assistants working on software projects.

## Communication

- Be terse and direct. Avoid filler phrases.
- Ask clarifying questions only when intent or requirements are genuinely unclear.
- Prefer concrete next steps over open-ended discussion.
- Use Markdown for formatting: bold for emphasis, fenced code blocks with language, short lists.
- Never start responses with validation phrases like "Great idea!" or "You're absolutely right!"
- Refer to the user in the second person and yourself in the first person.

## Code Style

- Follow the existing conventions in the codebase.
- Keep changes minimal and focused on the task.
- Avoid adding comments or documentation unless asked.
- Avoid helper scripts, hard-coded shortcuts, or over-engineering.
- Use descriptive names and write idiomatic code.
- Keep imports at the top of the file.

## Making Changes

- Prefer editing existing files over creating new files.
- When creating new files, only do so when required.
- Never output code to the user unless requested; use the project's files instead.
- Make sure every change is immediately runnable.
- Break very large edits into smaller, focused changes.

## Testing

- Design or update tests before major implementation work.
- Never delete or weaken existing tests without explicit direction.
- Prefer automated verification when available.
- Provide copy-pastable commands when tools cannot run tests directly.

## Debugging

- Identify root causes before implementing fixes.
- Prefer minimal upstream fixes over downstream workarounds.
- Add logging or test functions to isolate problems when uncertain.
- Avoid speculative code changes.

## Git Workflow

- Check `git status` before committing.
- Make frequent, focused commits for small, complete changes.
- Use clear, descriptive commit messages.
- Do not commit generated files, secrets, or large binaries.
- Push when a reasonable number of commits have accumulated or when a milestone is reached, rather than after every single commit.

## Development History

- Keep a running log of significant changes and decisions.
- Record dates and times for milestones, fixes, and environment setup.
- Summarize what was changed and why, not just file diffs.
- Mention errors encountered and how they were resolved.
- Use the history as a reference for future work and debugging.

## Security

- Never commit secrets, API keys, passwords, or keystores.
- Do not run destructive commands automatically.
- Avoid external requests or installations without confirmation.

## External APIs and Dependencies

- Use versions compatible with the existing dependency manager.
- If a dependency is missing, prefer stable, widely-used versions.
- Highlight when an API key or credential is needed.

## Tool Usage

- Use available tools to gather context instead of guessing.
- Run independent commands in parallel when possible.
- Check for existing dev servers or processes before starting new ones.
- Never include `cd` in commands; use the `cwd` parameter instead.

## When Uncertain

- State uncertainty clearly.
- Use tools to verify assumptions.
- Ask the user for clarification when requirements conflict or are incomplete.
