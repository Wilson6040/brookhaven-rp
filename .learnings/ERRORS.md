## [ERR-20260306-001] openclaw_system_event

**Logged**: 2026-03-06T00:00:00Z
**Priority**: medium
**Status**: pending
**Area**: tooling

### Summary
`openclaw system event` failed while sending the requested completion notification.

### Error
```
ERROR: SecItemCopyMatching failed -50
```

### Context
- Command attempted: `openclaw system event --text "Agent A: Brookhaven enhancement complete — jobs, buildings, NPCs, save/load added. Ready for review." --mode now`
- Environment: local macOS workspace

### Suggested Fix
Check the OpenClaw/keychain integration for the system event command, then retry once credentials or keychain access are available.

### Metadata
- Reproducible: unknown
- Related Files: .learnings/ERRORS.md

---
## [ERR-20260306-001] openclaw_system_event

**Logged**: 2026-03-06T00:00:00Z
**Priority**: medium
**Status**: pending
**Area**: tools

### Summary
`openclaw system event` failed while sending a completion notification after QA review.

### Error
```
ERROR: SecItemCopyMatching failed -50
```

### Context
- Command attempted: `openclaw system event --text "Agent B: Code review complete. Check /tmp/brookhaven-review.md for verdict." --mode now`
- Environment: local Codex CLI session on macOS
- Task impact: review report was written successfully, but notification was not sent

### Suggested Fix
Check the macOS keychain/credential setup used by `openclaw`, or provide a non-keychain fallback for local system events.

### Metadata
- Reproducible: unknown
- Related Files: /tmp/brookhaven-review.md

---
## [ERR-20260307-001] git_add_commit_push

**Logged**: 2026-03-07T00:00:00Z
**Priority**: high
**Status**: pending
**Area**: tooling

### Summary
Git write operations failed in this Codex session, blocking `git add`, commit, and push.

### Error
```
fatal: Unable to create '/Users/stuartwilson/.openclaw/workspace/projects/brookhaven-rp/.git/index.lock': Operation not permitted
```

### Context
- Command attempted: `git add -A && git commit -m 'fix: black screen error handling + mobile touch D-pad controls' && git push`
- Environment: Codex workspace sandbox
- Task impact: code changes are complete but not committed/pushed from this session

### Suggested Fix
Run the git commands directly in a shell with write access to `.git`, then retry push.

### Metadata
- Reproducible: yes
- Related Files: index.html

---
## [ERR-20260307-002] openclaw_system_event

**Logged**: 2026-03-07T00:00:00Z
**Priority**: medium
**Status**: pending
**Area**: tooling

### Summary
`openclaw system event` failed again due keychain lookup error.

### Error
```
ERROR: SecItemCopyMatching failed -50
```

### Context
- Command attempted: `openclaw system event --text 'Brookhaven fixed: black screen + mobile controls done, ready to play on iPad' --mode now`
- Environment: local macOS workspace

### Suggested Fix
Repair keychain credentials/config used by `openclaw system event`, then re-run the command.

### Metadata
- Reproducible: yes
- Related Files: .learnings/ERRORS.md
- See Also: ERR-20260306-001

---
## [ERR-20260307-001] git-add-commit-push-and-openclaw-event

**Logged**: 2026-03-07T09:38:29Z
**Priority**: high
**Status**: pending
**Area**: infra

### Summary
Requested release commands failed due to sandboxed git index lock permissions and macOS keychain access error.

### Error
```
fatal: Unable to create '/Users/stuartwilson/.openclaw/workspace/projects/brookhaven-rp/.git/index.lock': Operation not permitted
ERROR: SecItemCopyMatching failed -50
```

### Context
- Attempted: `git add -A && git commit -m 'fix: performance, controls redesign, wardrobe access, house roofs, camera pan touch'`
- Attempted: `openclaw system event --text 'Game update complete — controls, performance, wardrobe, houses, camera pan all fixed' --mode now`
- Environment: sandboxed Codex session with restricted permissions and no approval escalation.

### Suggested Fix
Run git and openclaw commands in a non-sandboxed shell with write access to `.git` and valid macOS keychain/session credentials.

### Metadata
- Reproducible: yes
- Related Files: /Users/stuartwilson/.openclaw/workspace/projects/brookhaven-rp/game.html

---
