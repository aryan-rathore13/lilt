# Contributing to Lilt

Lilt is an independent adaptation of [px0](https://github.com/px0-ai/px0). Changes should keep the application easy to install, responsive, and useful for reading and reviewing code.

## Report a problem or propose an improvement

Check [existing issues](https://github.com/aryan-rathore13/lilt/issues) before opening a report. Include the operating system, browser, Lilt version, a small reproduction, and expected and actual behavior. Remove credentials and private source code from logs and screenshots.

For feature requests, describe the user problem and a concrete example of the desired workflow. The [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) and [bug template](.github/ISSUE_TEMPLATE/bug_report.md) provide a starting point.

## Develop a change

Read [AGENT.md](AGENT.md) and the [architecture documentation](docs/internals/README.md). Build with Go 1.25+ and Node.js or Bun; the resulting application must remain a standalone binary without a database or Node.js runtime requirement.

The command starts in `cmd/lilt/`; backend services and their tests live in `internal/app/`. Keep standalone helpers in their focused `internal/` packages. The root `assets.go` only embeds the version and browser resources.

Keep changes focused. Preserve existing workspace behavior, respect timeouts for background commands, and keep user preferences outside workspace repositories. External coding harnesses and language servers remain optional.

When the implementation is complete, run the checks relevant to the change:

```bash
node scripts/check-web.js
make test
make build
```

For landing-page changes, also run `node scripts/build-site.js` and inspect the page at desktop and mobile sizes, including reduced-motion behavior. Update feature or architecture documentation when behavior changes. Identify the checks performed and any remaining limitations in the pull request.

Use your own Git identity for commits. Do not add generated assistant co-author trailers. Keep the original [MIT license](LICENSE) and upstream attribution with redistributed code.
