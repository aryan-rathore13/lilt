# Operational Guidelines for AI Agents

Welcome agent! This document contains essential instructions and workflows for working productively and quickly in `lilt`.

---

## 1. Quick Development Workflow (Fast Inner Loop)

To keep iteration fast and avoid unnecessary delays:

> [!IMPORTANT]
> **Do NOT run tests after every intermediate change.** Running test suites repeatedly after every small edit severely slows things down. Complete all planned code and asset changes first. Run tests only once all changes are in place, and then iterate on fixing any failures until everything passes cleanly.

| Task | Command | Typical Time | Notes |
| :--- | :--- | :--- | :--- |
| **Frontend Check** | `make web-check` or `npm run check` | **<100ms** | Validates JS syntax, relative imports, and runs frontend tests. |
| **Frontend Bundle** | `make web` or `node scripts/build-web.js` | **<50ms** | Run whenever modifying files under `web/src/`. |
| **Build Binary** | `make build` | **~2s** | Bundles frontend (`web/app.js`) and compiles local `./lilt` binary. |
| **Fast Verification** | `make check` or `go test -short ./...` | **~7s** | Runs frontend validation, asset bundling, and fast Go unit tests. |
| **Full Test Suite** | `make test` or `go test ./...` | **~20s** | Run once all changes are done; iterate until all tests pass before concluding. |

> [!TIP]
> Isolated components in `internal/` can be tested in milliseconds without running the full test suite (e.g. `go test ./internal/table`, `go test ./internal/ignore`, `go test ./internal/fuzzy`, `go test ./internal/metrics` take ~5–10ms).

---

## 2. Codebase Organization

- **CLI Entrypoint**: [`cmd/lilt/main.go`](cmd/lilt/main.go) calls `app.Run()`. Build with `go build -o lilt ./cmd/lilt`.
- **Backend Architecture**: Runtime services and their tests live in [`internal/app/`](internal/app/) (`package app`), with decoupled subsystems in sibling `internal/` packages:
  - [`internal/table/`](internal/table/): Tabular formatting (CSV/TSV)
  - [`internal/ignore/`](internal/ignore/): `.gitignore` parsing, fnmatch globbing, and ignore trees
  - [`internal/fuzzy/`](internal/fuzzy/): Bounded two-pass fuzzy path finder and scoring algorithm
  - [`internal/metrics/`](internal/metrics/): System resource usage, RSS, CPU sampling, and OS-specific rusage
  The application uses small facades and type aliases for these helpers.
- **Embedded Resources**: [`assets.go`](assets.go) is the only root Go source file. It embeds the root `VERSION` and selected `web/` assets and exposes them to `internal/app`. Keep it free of runtime services; Go embed patterns cannot reach parent directories.
- **Frontend Architecture**: Modular ES modules reside in [`web/src/`](web/src/) and are bundled into [`web/app.js`](web/app.js) via [`scripts/build-web.js`](scripts/build-web.js). Checked via [`scripts/check-web.js`](scripts/check-web.js).
- **Landing Page**: Static assets live in `site/`; `node scripts/build-site.js` writes `site/dist/` and copies the root installer. Vercel serves this output using `vercel.json`; it does not run the workspace backend. See [deployment](docs/deployment.md).
- **Benchmark Corpus**: Heavy repositories for benchmarking live in `../bench-repos` (outside the project root) to keep workspace searches and indexers fast.
- **Detailed Map**: For a complete file catalog and UI element mapping, see [`docs/agents/README.md`](docs/agents/README.md).

---

## 3. Core Architectural Tenets

1. **Reads First, Explicit Edits**: Lilt focuses on code reading and review. It delegates larger changes to external coding harnesses (`agent.go`, `thread.go`). Explicit user actions can also save files, create files and folders, or change Git state through the browser interface.
2. **Zero Runtime Dependencies**: The output must remain a single, standalone static binary. No CGO, no Node.js runtime requirement for the user, no external databases.
3. **No Workspace Litter**: `lilt` never creates `.lilt/` folders or cache files inside a workspace tree. Persistent configuration and thread transcripts live in `$XDG_CONFIG_HOME/lilt/` or `~/.lilt/`.
4. **Fast & Non-Blocking**: Operations must remain responsive. All background tasks, network calls, and git operations must respect timeouts and set `GIT_TERMINAL_PROMPT=0`.

---

## 4. Documentation Policy

- **During Iterative Work**: Focus on completing code changes first before running verifications. Do not block your workflow with premature documentation edits.
- **On Feature Completion**: If you introduce a new feature, CLI flag, shortcut, or major architectural change, update the corresponding documentation:
  - CLI flags / Shortcuts -> [`README.md`](README.md)
  - Major architectural patterns -> [`docs/internals/`](docs/internals/)
  - User features -> [`docs/features/`](docs/features/)

---

## 5. Version Bump & Release Protocol

When committing a version bump (triggered after updating the `VERSION` file):
1. **Verify Release Pipeline**:
   - Verify frontend bundling: `node ./scripts/build-web.js`
   - Verify full test suite: `make test`
   - Verify builds: `build.sh` / `.github/workflows/release.yml`
2. **Commit Release Fixes First**: If bundlers or scripts need fixes, commit those separately first.
3. **Commit Version Bump**: Stage `VERSION` with the new version number using the standard release commit message.


## 6. Project Identity and Publication

- Use **Lilt** in prose, `lilt` for the executable and state directories, and `LILT_` for product environment variables.
- The Go module is `github.com/aryan-rathore13/lilt`. Keep the external `github.com/px0-ai/harness` dependency unchanged.
- The independent public repository is `aryan-rathore13/lilt`, default branch `main`. Authenticate that exact personal account before repository creation or push; never fall back to another active GitHub account.
- Use the owner's Git identity and omit generated assistant co-author trailers.
- Preserve the original MIT license and credit px0 by Arpit Bhayani. Historical upstream measurements in `BENCHMARKS.md` are not new Lilt results.
- Keep the first-release notice until the actual binary release is published and verified. Set `LILT_RELEASE_READY=1` only afterward.
- The public site serves the installer; the app backend remains local by default. Remote workspace servers require a private network or authenticated gateway.
