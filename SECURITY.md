# Security Hardening Notes

## Mitigated attack vectors

- XSS reduction:
  - Added CSP on `index.html` and `game.html` with `default-src 'self'` and explicit script/CDN allowlist.
  - Added `X-Content-Type-Options: nosniff` via meta tags.
  - Added strict referrer policy (`strict-origin-when-cross-origin`).
  - Removed `innerHTML` assignment patterns in `game.html` and replaced with DOM-safe node APIs.
  - User-visible strings continue to be rendered with `textContent`.
- Input sanitization:
  - Room code from URL is sanitized with `sanitizeRoomCode()` (alphanumeric only, max 8 chars).
- Multiplayer message hardening:
  - Broadcast/relay messages are validated with `validateMultiplayerMessage()` and normalized before use.
  - Enforced schema: `{ type, playerId, position }`.
  - Allowed message types: `position`, `skin`, `emote`, `chat`.
  - `playerId` restricted to alphanumeric, max 16 chars.
  - Position numbers restricted to `[-1000, 1000]` per axis.
  - Chat payload text is HTML-tag stripped and capped to 200 chars.
  - Invalid messages are rejected.
- Save-data validation:
  - Added `validateSaveData()` before applying localStorage save state.
  - Validates shape/types, position bounds, weather/inventory/outfit data, and known inventory item families.
  - Invalid save payloads are removed from localStorage and ignored safely.
- Service worker hardening:
  - Caches only `200 OK` responses.
  - Stores cache metadata (`cachedAt`, `ETag`, `Last-Modified`, SHA-256 hash).
  - Performs integrity checks on cached payloads before serving offline.
  - Enforces max cached age of 7 days without successful revalidation.
  - Explicitly avoids `importScripts()` usage.

## Known limitations (static-hosted game)

- GitHub Pages static hosting cannot set strong runtime HTTP security headers per-route (e.g., full CSP/reporting/HSTS) from server logic.
- Client-side controls can be bypassed by a compromised browser extension or local user tampering.
- Offline mode necessarily trusts local cached assets and localStorage until validation fails.
- No backend authority exists to guarantee anti-cheat, identity proof, or server-verified game state.

## Multiplayer trust model

- `BroadcastChannel` messaging is same-origin scoped but still treated as low-trust input.
- All inbound multiplayer payloads are validated before state updates.
- Room codes are low-trust routing hints only, not authentication secrets.
- External WebSocket relay data is treated as untrusted and filtered through the same validators.
