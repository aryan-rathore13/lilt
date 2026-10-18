# Deploying and publishing Lilt

Lilt has three separate distribution pieces:

| Piece | Runs where | Purpose |
| --- | --- | --- |
| Landing page and `install.sh` | Vercel static hosting | Introduce Lilt and serve the installer over HTTPS |
| Versioned binaries and checksums | GitHub Releases | Distribute the single-binary application and updates |
| Workspace backend and interface | The user's computer, or a protected persistent server | Read files, run Git and optional tools, and serve the working application |

The installer needs no hosted application backend. It downloads the matching binary from GitHub and verifies its checksum. The binary starts its own Go backend locally. Vercel hosts the public website, not a shared copy of someone's workspace.

## Current publication status

The first release is **v0.1.0**, pending publication. The public repository is **[`aryan-rathore13/lilt`](https://github.com/aryan-rathore13/lilt)**, using branch **`main`**. No custom domain is assumed or owned by this project. Use the real Vercel production URL until a domain has been purchased and connected.

Authenticate the required accounts before publishing. All GitHub publication must use **`aryan-rathore13`**. Local builds and previews do not require service login. Deployment uses Vercel CLI because no Vercel deployment MCP is connected to this workspace.

## 1. Authenticate the intended GitHub account

Sign in through the browser using the personal **`aryan-rathore13`** account:

```bash
gh auth login --hostname github.com --web --git-protocol https
gh auth switch --hostname github.com --user aryan-rathore13
gh api user --jq .login
```

The last command must print exactly `aryan-rathore13`. If your browser is signed into another GitHub account, switch it before completing authorization. Keep tokens out of chat, source files, and commit messages.

## 2. Create an independent public repository

Run from this checkout after reviewing and committing the intended Lilt changes using your personal Git identity. The upstream source history and original MIT license remain intact; the new repository is created independently, without the GitHub fork relationship.

Inspect `git status`, `git branch --show-current`, `git remote -v`, and `git config user.name` / `git config user.email` first. Use `main` as the branch. The upstream remote is retained for provenance with pushing disabled; `origin` should point only to the new personal repository.

This shell block verifies the active account before making the repository:

```sh
set -eu
lilt_github_login="$(gh api user --jq .login)"
if [ "$lilt_github_login" != "aryan-rathore13" ]; then
  printf '%s\n' 'Stop: authenticate aryan-rathore13 before publishing.' >&2
  exit 1
fi
gh repo create aryan-rathore13/lilt --public --source . --remote origin --push --description "A lighter way to explore and review code."
```

If the repository or `origin` already exists, inspect it before proceeding; do not rerun repository creation blindly. Confirm the result with:

```bash
gh repo view aryan-rathore13/lilt --json nameWithOwner,isFork,isPrivate,defaultBranchRef
```

Expected: the requested owner, `isFork: false`, `isPrivate: false`, and default branch `main`. Do not add assistant co-author trailers to your commits.

## 3. Publish and verify the first binary release

Complete the checks and version/tag steps in [PUBLISHING.md](../PUBLISHING.md), then push `v0.1.0`. The existing GitHub Actions release workflow builds **15 binaries plus `checksums.txt`**. Public repository Actions must be enabled; the workflow requests `contents: write` for release publication.

The platform matrix is:

- Linux: amd64, arm64, arm, 386, riscv64.
- macOS: amd64, arm64.
- Windows: amd64, arm64, 386.
- FreeBSD: amd64, arm64.
- OpenBSD: amd64, arm64.
- NetBSD: amd64.

Check the release and its assets:

```bash
gh run list --repo aryan-rathore13/lilt --workflow release.yml --limit 5
gh release view v0.1.0 --repo aryan-rathore13/lilt
```

Test a supported platform's installer and downloaded binary as described in the publishing guide. Do not advertise installation as ready before this succeeds. Once ready, this URL works independently of Vercel:

```bash
curl -fsSL https://raw.githubusercontent.com/aryan-rathore13/lilt/main/install.sh | sh
```

## 4. Deploy the public site to Vercel

Vercel is selected because the project owner already has an account and the landing page requires only static hosting. The same output could later move to another static host without changing the local application backend.

Authenticate and deploy from the repository root:

```bash
npx vercel login
npx vercel whoami
npx vercel link
node scripts/build-site.js
npx vercel deploy --prod
```

Choose the owner's intended Vercel account and create/link the **Lilt** project. Keep the project root at the repository root, framework preset **Other**, build command **`node scripts/build-site.js`**, and output directory **`site/dist`**. These settings are recorded in [`vercel.json`](../vercel.json). Building the static site requires Node.js and does not compile or run Go.

Vercel returns the actual deployment and production URLs. Open the production page and verify the desktop/mobile layout, reduced-motion behavior, install-command copying, sample-project interactions, navigation, and `/install.sh`. Ensure the production deployment is publicly reachable; deployment protection must not block the installer.

The website constructs its curl command using the actual page origin:

```text
curl -fsSL https://<actual-production-host>/install.sh | sh
```

The host above is a placeholder; use the URL returned by Vercel. The build copies the repository's `install.sh` into the static output. The route serves it as plain text with a short cache lifetime.

### Mark installation ready after release verification

Keep the default first-release notice until the release has been published and tested. Then add the production build variable:

```bash
npx vercel env add LILT_RELEASE_READY production
```

Enter **`1`** when prompted, then redeploy:

```bash
npx vercel deploy --prod
```

Setting this flag changes the website's availability notice; it does not publish binaries. Do not set it for a missing or failed release. Add it separately for Preview only if those deployments should also advertise the published installer.

For automatic deployments, import/connect `aryan-rathore13/lilt` through the Vercel GitHub integration and keep `main` as the production branch. The owner may need to approve GitHub App repository access in the browser. A custom domain can be attached later in Vercel's Domains settings using the DNS records Vercel supplies; no domain purchase is required for the initial launch.

## Backend hosting and remote use

Lilt's backend relies on persistent workspace files, Git, subprocesses for language servers and coding harnesses, and streaming HTTP. Vercel Functions and Cloudflare Pages cannot host that backend unchanged. The default `127.0.0.1:7777` local server already provides everything installed users need.

For private remote development, run the binary or build the supplied Dockerfile on a persistent VM/container and put it behind a private network or an authenticated access gateway. Bind loopback or private interfaces and preserve the user's settings/state directories as appropriate. A public URL alone is not authentication. Anyone with access to the workbench can browse directories readable by its service user; coding harnesses run with that user's permissions.

See [remote workspaces](features/remote-workspaces.md) for CLI examples. A public multi-user hosted product would need additional isolation, authentication, workspace lifecycle management, and credential handling; those capabilities are outside this branding release.

## When browser setup is required

The owner needs to complete GitHub and Vercel browser login, any requested Vercel GitHub App authorization, and optional domain DNS changes. Once authenticated, repository creation, release workflow management, and Vercel CLI deployment can be completed from the terminal. No Cloudflare account or additional installer backend is required.
