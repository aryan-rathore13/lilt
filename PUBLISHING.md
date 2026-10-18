# Publishing Lilt

The first independent Lilt release is **[v0.1.0](https://github.com/aryan-rathore13/lilt/releases/tag/v0.1.0)**. Follow [the deployment guide](docs/deployment.md) to authenticate the required GitHub account and update the Vercel landing page.

## Before a release

- Use the personal GitHub account **`aryan-rathore13`**, with permission to publish `aryan-rathore13/lilt`.
- Install Go 1.25+ and Node.js or Bun. GitHub Actions reads the Go version from `go.mod`.
- Keep the working tree clean, review the changes, and choose a version that has not been released. Do not move or overwrite existing release tags.
- Keep [LICENSE](LICENSE) unchanged and preserve attribution to px0 and Arpit Bhayani.

Verify the interface, binary, and landing build after completing changes:

```bash
node scripts/check-web.js
make test
make build
./lilt --version
node scripts/build-site.js
```

Cross-platform builds can also be checked with `./build.sh`, which writes 15 OS/architecture binaries and `checksums.txt` into `dist/`.

## Publish a version

Update `VERSION` to the intended version, commit it with the release changes, and create an unused annotated tag. For example, the next patch release would be:

```bash
printf '0.1.1\n' > VERSION
git add VERSION
git commit -m "Release v0.1.1"
git tag -a v0.1.1 -m "Release v0.1.1"
git push origin main
git push origin v0.1.1
```

If the release version is already committed, omit the version-file commit. Use your configured personal Git identity; do not add assistant co-author trailers.

The [`Release` workflow](.github/workflows/release.yml) runs on `v*` tags. It bundles frontend assets, cross-compiles with CGO disabled, generates SHA-256 checksums, and publishes release assets with the repository's `GITHUB_TOKEN`. It does not need a separate hosting service or a personal access token secret. Optional telemetry is enabled only when a Lilt-specific key is configured.

You can also run the workflow manually from [Actions](https://github.com/aryan-rathore13/lilt/actions/workflows/release.yml), selecting the intended ref and specifying its version. Prefer tagging a reviewed commit so the release version and source are unambiguous.

## Verify the published release

```bash
gh run list --repo aryan-rathore13/lilt --workflow release.yml --limit 5
gh release view v0.1.0 --repo aryan-rathore13/lilt
```

Confirm the workflow succeeded, the release is published, and all **15 binaries plus `checksums.txt`** are present. Asset names follow `lilt-0.1.0-<os>-<arch>` with `.exe` on Windows. Both the installer and self-updater verify the downloaded binary using the checksum file.

Test the installer in a temporary installation directory and verify the version before advertising it:

```bash
lilt_install_check="$(mktemp -d)"
curl -fsSL https://raw.githubusercontent.com/aryan-rathore13/lilt/main/install.sh -o "$lilt_install_check/install.sh"
PATH="$lilt_install_check/bin:$PATH" VERSION=0.1.0 INSTALL_DIR="$lilt_install_check/bin" sh "$lilt_install_check/install.sh"
"$lilt_install_check/bin/lilt" --version
```

Including the temporary directory in `PATH` prevents the installer from adding it to your shell profile. Use an isolated environment to test upgrades or different platforms.

After the published release passes verification, set **`LILT_RELEASE_READY=1`** in the Vercel Production build environment and redeploy. This changes the landing page's first-release notice. Do not enable it while the release is missing or still building. See [deployment](docs/deployment.md) for the exact commands.
