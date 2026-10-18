// Package lilt embeds the version and browser assets shared by the application.
// Keeping resources here preserves the top-level VERSION and web/ source paths.
package lilt

import (
	"embed"
	"io/fs"
	"strings"
)

//go:embed VERSION
var rawVersion string

//go:embed web/index.html web/style.css web/themes web/vendor
//go:embed web/workbench.html web/workbench.css web/workbench.js web/app.js
var embedded embed.FS

// Version returns the release version embedded at build time.
func Version() string { return strings.TrimSpace(rawVersion) }

// Assets returns the embedded filesystem, with browser assets under web/.
func Assets() fs.FS { return embedded }
