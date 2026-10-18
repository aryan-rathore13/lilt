# Remote workspaces

Lilt runs its Go backend on the machine that owns the workspace and serves its interface in your browser. It works locally by default and can also run on a persistent remote machine reached through a private network or authenticated tunnel.

The standalone binary includes the interface. Git, language servers, and coding harnesses are separate tools used by their corresponding features. No Node.js runtime or database is required to run the binary.

## Access and permissions

The default bind address is `127.0.0.1:7777`. Keep that default for a local installation or a tunnel that connects to loopback.

Anyone who can reach a workspace server may be able to read or change files, operate Git, or invoke installed coding agents. The workbench can browse and open directories its service user can read. Request-origin and path checks are useful boundaries, but they do not provide user authentication or isolate tenants. Coding harnesses execute with the launching user's permissions.

Protect remote access with a private network, SSH tunnel, or authenticated gateway. Do not expose an unprotected workspace server to the public internet. Mutating endpoints also enforce host/origin restrictions; arbitrary external hostnames may not support the same editing operations as direct localhost or private-IP access.

## Private remote machine

For a machine on Tailscale or WireGuard, bind to its private interface address:

```bash
lilt -host <private-interface-ip> -port 7777 -no-open ~/work/repo
```

Replace `<private-interface-ip>` with the actual address and restrict access to trusted devices. Alternatively, keep Lilt on loopback and forward its port through an authenticated SSH connection. Open the corresponding private or forwarded URL in your local browser.

## Container

Build the image from this checkout; no public container image is assumed:

```bash
docker build -t lilt:local .
docker run --rm -p 127.0.0.1:7777:7777 -v "$PWD:/workspace" lilt:local /workspace
```

The Docker image starts Lilt on all interfaces inside the container. Publishing its port on host loopback limits direct host access. The mounted workspace is writable, so review which files and credentials the container can access. Additional language servers or coding harnesses need to be installed separately if you want those features.

## Reverse proxy and subpaths

When a protected gateway routes Lilt under a path, set `-base-path`:

```bash
lilt -base-path /rev-123/ -host 127.0.0.1 -port 7777 -no-open ~/workspace
```

Configure the gateway to reach that loopback service and enforce authentication before proxying. The flag prefixes API and static-asset routes, inserts the correct base URL, and redirects the missing trailing slash. Example addresses such as `https://review.example.com/rev-123/` are placeholders, not hosted Lilt services.

## CLI reference

| Flag | Default | Description |
| --- | --- | --- |
| `-base-path P` | `/` | URL prefix; can also be set with `server.basePath` |
| `-port N` | `7777` | Listen port; `0` selects an available port |
| `-host H` | `127.0.0.1` | Bind address |
| `-no-open` | `false` | Do not open a browser on the server |
| `-no-lsp` | `false` | Disable language-server use |
| `-no-git` | `false` | Disable Git awareness |
| `-agent H` | unset | Pin a coding harness |
| `-no-agent` | `false` | Disable coding-harness features |
| `-verbose` | `false` | Log request and operation details |
| `-quiet` | `false` | Suppress CLI narration |
| `-update` | `false` | Install an available published release |
| `-version` | `false` | Print version and architecture |

See [deployment](../deployment.md) for the public landing page and release distribution. Vercel serves the static landing page; remote workspace execution needs a persistent machine. See [architecture](../internals/architecture.md) for routing, path checks, and memory reclamation.
