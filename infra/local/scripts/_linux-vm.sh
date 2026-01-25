#!/usr/bin/env bash
set -euo pipefail

is_vm_required() {
  if uname | grep -q "Darwin"; then
    echo "true"
  elif uname | grep -q "Linux"; then
    echo "false"
  else
    echo "❌ Unsupported kernel: $(uname)"
    exit 1
  fi
}

ignore_if_vm_not_required() {
  if [[ "$(is_vm_required)" = "false" ]]; then
    echo "ℹ️ Linux VM is not required on this machine. Request ignored."
    exit 0
  fi
}

start_linux_vm() {
  ignore_if_vm_not_required
  if ! colima start --cpu 4 --memory 8 --disk 60; then
    echo "❌ Failed to start Linux VM."
    exit 1
  else
    echo "✅ Linux VM started!"
  fi
}

stop_linux_vm() {
  ignore_if_vm_not_required
  if ! colima stop &> /dev/null; then
    echo "❌ Failed to stop Linux VM."
    exit 1
  else
    echo "✅ Linux VM stopped!"
  fi
}

clean_linux_vm() {
  ignore_if_vm_not_required
  stop_linux_vm
  if ! colima delete -f &> /dev/null && colima prune -f &> /dev/null; then
    echo "❌ Failed to clean Linux VM."
    exit 1
  else
    echo "✅ Linux VM cleaned!"
  fi
}
