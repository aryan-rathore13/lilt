# Virtualized code viewer and memory reclamation

Lilt mounts the source rows visible in the viewport, with a small overscan buffer, instead of attaching every line to the browser DOM. This keeps navigation practical when reading large source files.

## What happens while you read

The viewer recycles rows as you scroll. A proportional scrollbar represents the document, while a separate caret and selection layer preserves navigation across repaints. The visible row count depends on viewport height and font settings; roughly 60 rows is an illustrative size, not a fixed limit.

Source files, indexes, caches, images, and optional language servers still consume memory. Virtualization reduces the DOM cost; opening a larger file can still require more I/O, processing, and memory than opening a smaller one.

## Idle memory reclamation

The Go server tracks recent activity. After at least 15 seconds of inactivity, a periodic scavenger can call `debug.FreeOSMemory()` to return unused heap pages to the operating system. This does not discard live indexes or promise a particular resident-memory level. Active queries and external tools can continue using resources.

## Measuring performance

[BENCHMARKS.md](../../BENCHMARKS.md) retains historical upstream px0 measurements and provides commands to reproduce them with Lilt. Those results have not been rerun for this branding release. Measure the server, browser, and optional tools together for an accurate comparison on your workspace.

For the implementation, see [Editor Virtualization & Caret Engine](../internals/editor-virtualization.md) and [System Architecture & Runtime Lifecycle](../internals/architecture.md).
