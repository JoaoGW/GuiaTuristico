#!/usr/bin/env bash

set -euo pipefail

node -e '
let input = "";

process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
  input += chunk;
});

process.stdin.on("end", () => {
  let event;

  try {
    event = JSON.parse(input);
  } catch {
    console.error("Blocked by project safety policy: invalid hook payload.");
    process.exit(2);
  }

  const command = String(event?.tool_input?.command ?? "");

  const blockedCommands = [
    {
      pattern: /\bgit\s+reset\s+--hard\b/i,
      reason: "destructive Git resets are not allowed."
    },
    {
      pattern: /\bgit\s+clean\b.*(?:-f|--force)/i,
      reason: "destructive Git clean operations are not allowed."
    },
    {
      pattern: /\brm\s+(?:-[a-z]*r[a-z]*f[a-z]*|-[a-z]*f[a-z]*r[a-z]*|--recursive)(?:\s|$)/i,
      reason: "recursive deletion is not allowed."
    },
    {
      pattern: /\bgit\s+push\b.*(?:--force(?:-with-lease)?|-f)(?:\s|$)/i,
      reason: "force-pushing is not allowed."
    },
    {
      pattern: /\bgit\s+push\b.*(?:\borigin\s+)?(?:main|master)\b/i,
      reason: "direct pushes to protected branches are not allowed."
    },
    {
      pattern: /\b(?:npm|pnpm|yarn)\s+publish\b/i,
      reason: "package publishing is not configured."
    }
  ];

  const blocked = blockedCommands.find(({ pattern }) => pattern.test(command));

  if (blocked) {
    console.error(`Blocked by project safety policy: ${blocked.reason}`);
    process.exit(2);
  }
});
'
