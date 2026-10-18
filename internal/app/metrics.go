package app

import (
	"github.com/aryan-rathore13/lilt/internal/metrics"
)

// ProcessMetrics captures system resource usage of the lilt server process
// and any child language server processes. Re-exported from internal/metrics.
type ProcessMetrics = metrics.ProcessMetrics

var (
	readProcessRSS     = metrics.ReadProcessRSS
	readRSSForPID      = metrics.ReadRSSForPID
	readProcessCPUTime = metrics.ReadProcessCPUTime
	getProcessRusage   = metrics.GetProcessRusage
	globalMetrics      = metrics.DefaultCollector
)

// getProcessMetrics samples lilt's own process stats, plus the combined
// memory of any running language server processes when lsp is non-nil and
// enabled (-no-lsp turns it off, but the manager itself is never nil).
func getProcessMetrics(lsp *lspManager) ProcessMetrics {
	var lspMem uint64
	var lspEnabled bool
	if lsp != nil {
		lspEnabled = lsp.Enabled()
		if lspEnabled {
			lspMem = lsp.memBytes()
		}
	}
	return metrics.Collect(lspMem, lspEnabled)
}
