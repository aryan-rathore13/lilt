//go:build windows

package app

import "os/exec"

func setProcessGroup(cmd *exec.Cmd) {
	// On Windows, exec.CommandContext kills the process directly on cancel.
}
