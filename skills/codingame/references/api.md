# CodinGame API reference

Base URL: `https://www.codingame.com/api/v1`

## Conventions

- **Authentication**: `Authorization: Bearer <token>` on every endpoint except `/auth/*`, `/docs*`,
  `/problems/*`, `GET /puzzles`, `GET /puzzles/{pretty_id}` and `GET /puzzles/{pretty_id}/stats`, which
  also accept a token to add the user's data. Tokens look like `cgp_` followed by 42 letters and digits.
- **Scopes**: each endpoint needs one scope, for challenges and puzzles alike: `challenge:play` for
  registering, starting test games and changing the nickname, squad or teams, `challenge:submit` for
  submitting, `challenge:read` for every other endpoint. The contribution endpoints need
  `contribution:read` or `contribution:write`. The endpoints that need no token check the scope when a
  token is sent.
- **Bodies**: JSON objects, read as JSON whatever the `Content-Type`. Send
  `Content-Type: application/json` anyway.
- **Dates**: ISO-8601 instants (`2026-10-11T15:00:00Z`). Durations are in seconds (`*_in_seconds`).
- **Absent members**: optional members are omitted rather than sent as `null`, unless stated.
- **Ids**: `public_id` identifies a challenge (e.g. `spring-challenge-2026`), `pretty_id` a puzzle
  (e.g. `coders-strike-back`). Numeric ids identify test games, games, submissions and agents.

## Errors

Every error is an RFC 9457 problem, served as `application/problem+json`:

```json
{
  "type": "https://www.codingame.com/api/v1/problems/not-registered",
  "title": "Not registered",
  "status": 409,
  "detail": "You are not registered to the contest spring-challenge-2026.",
  "hint": "Register with POST /api/v1/challenges/spring-challenge-2026/register (scope challenge:play), then retry."
}
```

- `hint` tells what to do next. Follow it.
- `code` is present when an existing CodinGame rule rejected the request (e.g. `INVALID_LANGUAGE`,
  `CHALLENGE_NOT_FOUND`, `ERROR_268`).
- `type` links to the description of the problem (`GET /problems/<slug>`).

| Status | Slug | Meaning |
|---|---|---|
| 400 | `bad-request` | Invalid query parameter or body. The hint shows a valid body. |
| 400 | `request-rejected` | A rule rejected the request; read `code` and `detail`. Also 422 for some rules. |
| 401 | `missing-token` | No `Authorization` header. Get a token with the device flow. |
| 401 | `invalid-token` | Unknown, malformed, expired or revoked token, or disabled account. Get a new token. |
| 403 | `insufficient-scope` | The token lacks a scope listed in `required_scope`. |
| 403 | `forbidden` | Not allowed for this user (e.g. `code` `REPLAYS_DISABLED`). |
| 403 | `arcade-game` | The puzzle is an arcade game (a classic puzzle): listed, never played. `url` is its page for the user. |
| 404 | `not-found` | Unknown URL or id. `code` tells which: `CHALLENGE_NOT_FOUND`, `PUZZLE_NOT_FOUND`, `TEST_GAME_NOT_FOUND`, `GAME_NOT_FOUND`, `SUBMISSION_NOT_FOUND`, `SQUAD_NOT_FOUND`, `SCHOOL_NOT_FOUND`, `CONTRIBUTION_NOT_FOUND`, `BUILD_NOT_FOUND`. |
| 405 | `method-not-allowed` | Wrong HTTP method. |
| 409 | `not-registered` | The user is not registered to the challenge. |
| 409 | `challenge-not-started` | The challenge has not started. |
| 409 | `challenge-ended` | The challenge has ended, or the user's site has no play window left: no more test games or submissions. |
| 409 | `challenge-paused` | The user's site is outside its play windows: `next_play_window` and `Retry-After` tell when play resumes. |
| 409 | `not-a-squad-contest` | Squad endpoint on a challenge without squads. |
| 409 | `no-school-company-teams` | Team endpoint on a challenge that does not rank schools and companies. |
| 409 | `puzzle-in-contest` | The puzzle is played as the contest `challenge_public_id`: use the challenge endpoints. |
| 409 | `unsupported-game-mode` | Opponents or battles of an optimization or code golf puzzle. |
| 422 | `nickname-rejected` | The nickname is taken, too long or uses forbidden characters. |
| 409 | `test-game-running` | A test game of the user is still running: `test_game_id` and `poll_url` point to it. Without them, another request of the user is running a test case that is not a game. |
| 409 | `contribution-version-conflict` | The contribution changed since the `base_version` of the update. |
| 409 | `contribution-already-exists` | The user created a contribution with this title less than a day ago: `handle`. |
| 422 | `contribution-invalid` | A rule of the contribution pages rejected the content: `field`, and `test_case` and `kind` for a test case. |
| 422 | `test-case-failed` | The solution of a contribution fails a test case or a validator: `test_case`, `kind`, `found`, `expected` or `error`. |
| 422 | `registration-form-invalid` | The registration form needs values, listed in `fields`, with the whole `form`. |
| 429 | `rate-limited` | A limit is reached. Wait `Retry-After` seconds. |
| 500 | `internal-error` | Server failure. Retry later. |

The device flow errors (`/auth/token`) are OAuth errors: see below.

## Limits

### API requests

Every request counts in a fixed window of one minute, per user for requests with a token and per IP
address for requests without one (currently 120 and 60 requests). The window is named `requests_1m`.
Every JSON object response carries it as `limits.requests`, and every response has it in the
`RateLimit` and `RateLimit-Policy` headers:

```json
"limits": {"requests": {"name": "requests_1m", "limit": 120, "used": 3, "remaining": 117, "window_seconds": 60, "resets_in_seconds": 41}}
```

`resets_in_seconds` is when the whole window resets. Over the limit, the request answers 429
`rate-limited` with `Retry-After` and `limits.requests`. Prefer `wait=30` to polling: it costs one
request.

### Test games and submissions

Test games and submissions are counted per user and per time window. The windows depend on the
challenge; typical values:

| Window | Limit |
|---|---|
| `submits_5m`, `submits_30m`, `submits_1h`, `submits_5h` | 5, 20, 40, 100 |
| `test_games_1m`, `test_games_5m`, `test_games_15m`, `test_games_1h`, `test_games_3h`, `test_games_6h`, `test_games_24h` | 10, 20, 30, 80, 150, 200, 600 |

A window object:

```json
{"name": "submits_5m", "limit": 5, "used": 2, "remaining": 3, "window_seconds": 300, "resets_in_seconds": 42}
```

`resets_in_seconds`: when `remaining` is 0, the seconds until one more request is allowed; otherwise
the seconds until the oldest counted request leaves the window (0 when nothing is counted).

The `limits` member of the test game, submission and progress responses also holds the tightest
window of each kind: `{"submits": <window>, "test_games": <window>, "requests": <window>}`.
`GET /limits` lists every window.

Headers on the same responses:

```
RateLimit-Policy: "submits_5m";q=5;w=300, "submits_30m";q=20;w=1800, ..., "requests_1m";q=120;w=60
RateLimit: "submits_5m";r=3;t=120, "requests_1m";r=117;t=41
```

`RateLimit` describes the tightest window of each kind, then the request window: `r` remaining, `t`
seconds until reset. The tightest window is the one with the fewest remaining requests, then the
longest wait.

When a window is exhausted, the request answers 429 `rate-limited` with a `Retry-After` header, a
`retry_after_seconds` member and the exhausted window in `rate_limit`. Wait that long; an earlier
retry is rejected again.

There are no windows (empty lists, absent `limits` members) until the session has been opened once,
with `GET /challenges/{public_id}` while the challenge is ongoing, or `GET /puzzles/{pretty_id}` with
a token.

## Authentication: OAuth device flow (RFC 8628)

These endpoints take form-encoded or JSON bodies, need no token and ignore any `Authorization` header.
Responses have `Cache-Control: no-store`.

### POST /auth/device

| Parameter | Required | Description |
|---|---|---|
| `client_name` | yes | Name of the agent, shown to the user on the approval page (100 characters at most). `client_id` is accepted as an alias. |
| `scope` | no | Space-separated scopes (or a JSON array). Default: every scope, `challenge:read challenge:play challenge:submit contribution:read contribution:write`. |

```sh
curl -s -X POST https://www.codingame.com/api/v1/auth/device -d client_name="Claude Code"
```

200:

```json
{
  "device_code": "...",
  "user_code": "BCDF-GHJK",
  "verification_uri": "https://www.codingame.com/authorize",
  "verification_uri_complete": "https://www.codingame.com/authorize?code=BCDF-GHJK",
  "expires_in": 900,
  "interval": 5
}
```

Show `verification_uri_complete` and `user_code` to the user. Keep `device_code` private.

### POST /auth/token

| Parameter | Required | Value |
|---|---|---|
| `grant_type` | yes | `urn:ietf:params:oauth:grant-type:device_code` |
| `device_code` | yes | From `/auth/device` |

Poll every `interval` seconds. 200 once the user has approved:

```json
{
  "access_token": "cgp_...",
  "token_type": "Bearer",
  "scope": "challenge:read challenge:play challenge:submit contribution:read contribution:write",
  "expires_in": 63072000,
  "expires_at": "2028-10-04T12:00:00Z"
}
```

A device code gives a token only once. Errors are 400 with OAuth members `error` and
`error_description` (plus the problem members), as `application/json`:

| `error` | What to do |
|---|---|
| `authorization_pending` | Not approved yet. Poll again after `interval` seconds. |
| `slow_down` | Polling too fast. Use the new `interval` from the response from now on. |
| `access_denied` | The user refused. Stop. |
| `expired_token` | The device code expired. Start again with `/auth/device`. |
| `invalid_grant` | Unknown or already used device code. Start again. |
| `invalid_request`, `invalid_scope`, `unsupported_grant_type` | Fix the parameters. |

Store the token in a file readable only by the user (e.g. `~/.config/codingame/token`, mode 600),
never in the conversation. The user can revoke tokens at `https://www.codingame.com/settings/tokens`.
