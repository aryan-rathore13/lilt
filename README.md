# Lilt

**Find your flow in any codebase.**

Lilt is a local code reader and review workbench with a warm, light interface. Open a folder or pull request, follow a change, and give your coding agent the context it needs. A single Go binary serves the interface in your browser, keeping your workspace on your machine.

Lilt is an independent adaptation of [px0](https://github.com/px0-ai/px0) by Arpit Bhayani, distributed under the original [MIT license](LICENSE). This first version preserves its backend functionality while introducing Lilt's name, interface, and landing page.

## What you can do

- **Get oriented:** fuzzy file navigation, workspace text and regex search, symbol outlines, and optional language-server intelligence.
- **Review changes:** split or unified diffs, unpushed commits, and GitHub pull requests with inline review comments.
- **Keep moving:** quick file edits, new files and folders, and Git staging, commits, pushes, and fast-forward pulls.
- **Work with your agent:** send selections or multi-turn threads to an installed coding harness, including Claude Code, Gemini CLI, Cursor Agent, OpenCode, Codex, Aider, and Goose.
- **Read more than code:** rendered Markdown with Mermaid diagrams, CSV/TSV tables, images, multiple themes, and optional Vim navigation.
- **Return to your work:** recent and pinned folders and pull requests in one review workbench.

## Get started

**The first Lilt release is pending.** Release downloads and the installer require the public repository and its first binary release to be published. Until then, build from this checkout.

### Build from source

Requires **Go 1.25+** and **Node.js or Bun** to bundle the browser interface. Git enables repository features; coding harnesses and language servers are optional, separately installed tools.

Once the repository is published:

```bash
git clone https://github.com/aryan-rathore13/lilt.git
cd lilt
```

From the repository directory:

```bash
node scripts/build-web.js
go build -trimpath -o lilt .
./lilt .
```

You can use `bun scripts/build-web.js` instead of Node.js, or `make build` with Node.js installed. The compiled application does not need a Node.js runtime, Electron, or a database.

### Install a published release

After the first release is available, macOS, Linux, and BSD users can run:

```bash
curl -fsSL https://raw.githubusercontent.com/aryan-rathore13/lilt/main/install.sh | sh
```

The installer selects a binary for your platform and verifies its release checksum. [Read the script](install.sh) before running it. Windows users can download the matching `.exe` from [Releases](https://github.com/aryan-rathore13/lilt/releases), rename it to `lilt.exe`, and add its folder to `PATH`.

The published landing page will also serve `/install.sh`. Its installation command uses the page's actual HTTPS origin; no custom domain is required.

## Make yourself at home

```bash
lilt                                          # open the review workbench
lilt .                                        # inspect the current directory
lilt ~/workspace/project                      # open a project
lilt main.go:42                               # jump to a line
lilt https://github.com/owner/repo/pull/123     # review a pull request
lilt --update                                 # update from published Lilt releases
```

Use `Cmd/Ctrl+P` to find a file, `Cmd/Ctrl+Shift+F` to search the workspace, `Cmd/Ctrl+D` to inspect a diff, and `Cmd/Ctrl+,` to adjust preferences. See the [feature guides](docs/features/README.md) for the complete interface.

Settings live in `$XDG_CONFIG_HOME/lilt/` or `~/.lilt/`. Workbench state lives in `$XDG_STATE_HOME/lilt/` or `~/.lilt/`. Lilt uses its own preferences and state; it does not migrate an existing px0 installation.

## Your workspace stays with you

Lilt binds to `127.0.0.1:7777` by default. The Go process reads your workspace, runs Git and optional language servers, and coordinates your installed coding harnesses. The browser talks to that process on the same origin.

The public landing page is a separate static site, prepared for **Vercel**. It distributes the installer; GitHub Releases distributes binaries. Installation needs no hosted application backend. See [deployment and first publication](docs/deployment.md).

For a remote workspace, run Lilt on a persistent machine and connect through a private network or authenticated tunnel. Anyone who can reach the workspace server may be able to read or modify files and run installed agents. The workbench can browse directories the server user can access. Keep it behind access controls; see [remote workspaces](docs/features/remote-workspaces.md).

## Development

```bash
make build                      # bundle interface and compile ./lilt
make test                       # bundle interface and run Go tests
node scripts/check-web.js       # validate browser modules and frontend tests
node scripts/build-site.js      # build the landing page into site/dist
go run . .                      # run the bundled application from source
```

After changing browser modules, rerun `node scripts/build-web.js` and restart the Go process to refresh its embedded assets.

Performance depends on the workspace, machine, browser, and optional tools. [BENCHMARKS.md](BENCHMARKS.md) retains historical upstream px0 measurements and reproduction commands; these are not new Lilt results.

- [Documentation](docs/README.md)
- [Architecture](docs/internals/architecture.md)
- [Publishing releases](PUBLISHING.md)
- [Contributing](CONTRIBUTING.md)

## Credits and license

Built on [px0](https://github.com/px0-ai/px0) by **Arpit Bhayani**. The original MIT copyright and license are preserved in [LICENSE](LICENSE). The external [`github.com/px0-ai/harness`](https://github.com/px0-ai/harness) integration remains an upstream dependency. Lilt is maintained independently by [Aryan Rathore](https://github.com/aryan-rathore13).
