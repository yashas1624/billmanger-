---
name: codingame
description: Plays CodinGame bot programming challenges (contests), bot programming puzzles, optimization puzzles and code golf puzzles on behalf of the user through the CodinGame public API. Gets an API token with the OAuth device flow, finds the games, reads the rules, writes the bot, runs test games and reads their text logs, submits, and follows the ranking, battles, stats and leaderboard within the submit and test game limits. Never plays arcade games (classic puzzles, Clash of Code, Coding Escape). Use when the user asks to join, play, compete in or improve a bot for a CodinGame challenge, contest, multiplayer game, optimization game or code golf puzzle, or to find a CodinGame game to play.
license: Proprietary
metadata:
  author: codingame
  version: "1.0"
  homepage: https://www.codingame.com/api/v1/docs
---

# CodinGame

In CodinGame bot programming games, each player writes a program (a "bot") that reads the game state
on standard input and writes its actions on standard output, turn after turn. Bots play ranking
games ("battles") against other players' bots, and the leaderboard ranks the players. Games with
leagues (Wood, Bronze, Silver, Gold, Legend, though some stop below Legend, e.g. at Gold) promote the
players who beat the league boss, and a new league can bring new rules. They come in two forms:

- **Challenges** (contests): time-limited events, under `/challenges/<public_id>`.
- **Bot programming puzzles**: permanent multiplayer games, under `/puzzles/<pretty_id>`.

In **optimization puzzles**, the bot plays alone on test cases and the leaderboard ranks the best
score (e.g. the least fuel used). In **code golf puzzles**, the code must pass every test case and
the leaderboard ranks the shortest code. Both are also under `/puzzles/<pretty_id>`.

Classic puzzles, Clash of Code and Coding Escape are **arcade games**: the API lists the classic
puzzles, but never plays them (403 `arcade-game`), and you must not play them for the user. Point the
user to the website for those.

This skill drives these games with the REST API at `https://www.codingame.com/api/v1`, acting as the
user who approved the token.

- Full endpoint reference: [references/api.md](references/api.md), also at
  `https://www.codingame.com/api/v1/docs/api`.
- Stub generator syntax (the input/output format of the game): `https://www.codingame.com/api/v1/docs/stub-generator`.
- Every error is a JSON problem (RFC 9457) with a `hint` member: read the `hint`, it says what to do next.
- Request bodies are JSON objects. Dates are ISO-8601 instants.
- Scope: bot programming challenges, bot programming puzzles, optimization puzzles and code golf
  puzzles. No arcade games, no visual replays (game logs are text).
- To write the user's community contributions (classic puzzles, Clash of Code questions, games), use
  the contribution skill: `https://www.codingame.com/api/v1/docs/skills/codingame-contribution/SKILL.md`.
  The same token works for both.

## 1. Get a token (once)

The token lives in `~/.config/codingame/token`. If the file exists, use it and skip this section.

Never print the token, never paste it in the conversation, never commit it. Read it from the file in
each command: `-H "Authorization: Bearer $(cat ~/.config/codingame/token)"`.

Start the device authorization (`client_name` is shown to the user on the approval page):

```sh
mkdir -p ~/.config/codingame && chmod 700 ~/.config/codingame
curl -s -X POST https://www.codingame.com/api/v1/auth/device \
  -d client_name="Claude Code" > ~/.config/codingame/device.json
```

Show the `verification_uri_complete` and `user_code` from `device.json` to the user: "Open
`<verification_uri_complete>`, sign in or create your CodinGame account, check that the code
`<user_code>` matches, and click Accept." Accounts are only created in the browser, never through the
API. The user can pick the token lifetime there (2 years by default). The device code expires after
`expires_in` seconds (15 minutes).

Then poll until the user approves. This loop writes the token to the file without printing it:

```sh
DEVICE_CODE=$(sed -E 's/.*"device_code":"([^"]+)".*/\1/' ~/.config/codingame/device.json)
INTERVAL=5
while true; do
  sleep "$INTERVAL"
  RESP=$(curl -s -X POST https://www.codingame.com/api/v1/auth/token \
    -d grant_type=urn:ietf:params:oauth:grant-type:device_code -d device_code="$DEVICE_CODE")
  case "$RESP" in
    *'"access_token"'*)
      (umask 077; printf '%s' "$RESP" | sed -E 's/.*"access_token":"([^"]+)".*/\1/' > ~/.config/codingame/token)
      rm -f ~/.config/codingame/device.json; echo "Token saved."; break ;;
    *authorization_pending*) ;;
    *slow_down*) INTERVAL=$((INTERVAL + 5)) ;;
    *) echo "$RESP"; break ;;
  esac
done
```

- If your shell stops the loop before the user approves (command timeout), run the polling loop again as
  is: `device.json` keeps the device code. Never run the device authorization again while the user may
  still be on the approval page, or the code they approve is no longer the one you poll.
- `authorization_pending`: keep polling. `slow_down`: poll less often (the response has the new `interval`).
- `access_denied`: the user refused; stop. `expired_token` or `invalid_grant`: start again.
- The token covers every endpoint, contributions included. Ask for fewer scopes with
  `-d scope="challenge:read"` if the user wants a read-only agent.

**401 on any call** (`missing-token` or `invalid-token`): the token is missing, expired or revoked.
Delete `~/.config/codingame/token` and get a new one. Do not retry with the same token.
**403 `insufficient-scope`**: the token lacks a scope; get a new token with the `scope` given in the `hint`
(it keeps the scopes of the current token), then replace the token file.
The user can list and revoke tokens at `https://www.codingame.com/settings/tokens`.

## 2. Find a game

`GET /puzzles`, `GET /puzzles/<pretty_id>` and `GET /puzzles/<pretty_id>/stats` also work without
token, so you can show the user what to play before they approve one: call them with a plain
`curl -s` until the token file exists (an empty `Authorization` header answers 401). All paths below
are relative to `https://www.codingame.com/api/v1`. Define a helper first:

```sh
cg() { curl -s -H "Authorization: Bearer $(cat ~/.config/codingame/token)" "$@"; }
API=https://www.codingame.com/api/v1
```

- **Challenges**: `cg $API/challenges` lists ongoing, upcoming and recent ended contests with their
  `public_id`.
- **Puzzles**: `cg "$API/puzzles?arcade=false"` lists the bot programming, optimization and code golf
  puzzles, newest first, with their `pretty_id`, `category`, `rating` and, with a token, whether the
  user `played` them. Filter with `category=bot-programming`, `category=optimization` or
  `category=code-golf`,
  `search=<part of the title>`, `played=true`, and page with `offset` and `limit`.
- A puzzle with `challenge_public_id` is played as that contest: use `/challenges/<public_id>`.
- `cg $API/` lists the `game_modes`, with the website page of each and whether it is `arcade`.

## 3. Play a challenge

1. **Find the challenge**: see section 2.
2. **Look at the challenge**: `cg $API/challenges/<public_id>`. Before registration it returns the
   title, dates, the contest page `url` and the `registration_form`. The rules come only after
   registration.
3. **Register**: `cg -X POST $API/challenges/<public_id>/register` with
   `{"form_values": {"<field id>": "<value>"}}`. This registers the user under their name.
   - Fields with a `value` are filled in from the user's profile when you omit them.
   - `switch` and `select` fields list their accepted values in `options` (a switch takes `checked`
     or `unchecked`).
   - A 422 `registration-form-invalid` lists the rejected `fields` and the whole `form`: ask the user
     for those values and send them again.
   - Squad contests (`squad_max_size` in the challenge) also need `"squad_id"` in the body: see
     section 8.
4. **Read the rules**: `cg $API/challenges/<public_id>` now returns the `statement` in Markdown, the
   `languages` (send their `id`), `players_min`/`players_max` and the user's `league`. Read the whole
   statement: it defines the game, the input/output protocol and the time limits per turn.
5. **Get the input format**: `cg $API/challenges/<public_id>/stub-generator` returns the stub
   generator, a short description of every line the bot reads and writes. Read the
   [stub generator guide](https://www.codingame.com/api/v1/docs/stub-generator) and write the
   input parsing code yourself from it.
6. **Write the bot** locally, in a file (e.g. `bot.py`). Keep each turn within the time limit. Your
   code lives in your files only: every test game and submission sends it.
7. **Run a test game** (async): start it, then wait for the end with `wait` (up to 30 s per call).
   The JSON response holds the text log in `log`; `jq -r` prints it readable:

   ```sh
   jq -n --rawfile code bot.py '{language: "Python3", code: $code, opponents: ["default"]}' \
     | cg -X POST "$API/challenges/<public_id>/test-games?wait=30" -H 'Content-Type: application/json' --data-binary @- \
     | jq -r 'if .log then .log else . end'
   ```

   Options of the body that send the test game to the user's CodinGame IDE of the challenge
   (`https://www.codingame.com/ide/challenge/<public_id>`, same host as the API). All default to
   `false`; use them only when the user asks:
   - `show_in_ide: true`: the first response that reports the game done (`wait` or the poll below)
     shows it in the IDE's viewer, if the IDE is open then. When the user is not watching it yet,
     give them the link or open it in their browser before the game ends.
   - `overwrite_ide_code: true`: the code and language of this test game become the code of the
     user's IDE, saved on CodinGame and loaded in the open IDE at once. **This is a plain overwrite:
     nothing checks whether the user changed the code in the IDE since, and their IDE code is lost.**
     Ask the user before using it, unless they asked for it.
   - `overwrite_ide_game_parameters: true`: when the game ends, the open IDE's opponents and game
     options become the ones of this game, so the user's next Play in the IDE replays it. This
     replaces the IDE's play settings without asking, and only reaches an IDE open at that moment.

   A 202 means still running: poll `cg "$API/test-games/<test_game_id>?wait=30"` (plain text) until
   `status: done` or `status: failed`. Opponents: `default` (the default bot, or your league's boss),
   `boss`, `me` (your own code), or an `agent_id` from `cg $API/challenges/<public_id>/opponents`
   (the players and bosses of your league and of the lower leagues with the same rules, as in the
   IDE) or from a finished battle of your current league. Other agents answer 400 `INVALID_OPPONENT`.
   `status: failed` comes with a `hint`. "No code machine was available" means the code machines are
   busy: wait a minute or two before starting again, since every start counts against the limits.

   **Replay a game**: to debug a battle that went wrong, send `"replay_game_id": <game_id>` instead
   of `opponents` and `game_options`. The test game runs your code in your seat of that battle (or
   test game), with the same opponents in the same seats and the same game options, like the "Send
   game parameters to IDE" button of the IDE's last battles. Combine it with `show_in_ide` and
   `overwrite_ide_game_parameters` when the user wants to look at it in the IDE.
8. **Read the log**: the text log lists the agents, then every frame with the referee messages,
   your stderr, errors and each agent's stdout, then the scores and ranking. `$0`, `$1`... in the
   referee, summary and tooltip lines stand for the agents of index 0, 1... Fix the bot and test again.
9. **Submit** when the bot beats the boss or improves on the current submission:

   ```sh
   jq -n --rawfile code bot.py '{language: "Python3", code: $code}' \
     | cg -X POST $API/challenges/<public_id>/submissions -H 'Content-Type: application/json' --data-binary @-
   ```

10. **Follow the ranking**: `cg $API/challenges/<public_id>/progress` gives `percentage` (share of the
    ranking games played), `rank`, `league`, `eligible_for_promotion` and the `league_boss` (its rank
    and score in the league): players ranked above the boss are promoted. The ranking is final at
    100%. Poll it every minute or two, not in a tight loop.
11. **Read the battles**: `cg $API/challenges/<public_id>/battles` lists the ranking games of the
    current submission, newest first, with the user's `my_position` (0 = won). Add
    `submission=<submission_id>` for a past submission (ids from `GET .../submissions`), and page
    older games with `before=<next_before>` until `next_before` is absent. Read a lost game with
    `cg $API/games/<game_id>`.
12. **Compare**: `cg "$API/challenges/<public_id>/leaderboard?around_me=true"` shows the players around
    the user. The leaderboard spans every league: to test against players, take their `agent_id`
    from `cg $API/challenges/<public_id>/opponents`.
13. **After a promotion**, read the challenge again (step 4): the next league can change the rules
    and the input format. `league_history` in the progress tells when the user entered each league,
    e.g. to compare the battles played before and after a promotion.

Your code and the code in the user's CodinGame IDE are separate: the API leaves the IDE's code alone
(except with `overwrite_ide_code`), and the user can edit and play there while you work. Your
submissions show in the IDE's history with their battles, since they replace the user's arena
submission. To start from the user's own version, read it with `cg $API/challenges/<public_id>/code`.

No `jq`? Build the JSON body with Python:
`python3 -c 'import json,sys; print(json.dumps({"language": "Python3", "code": open("bot.py").read()}))'`.

## 4. Play a bot programming puzzle

The same loop as a challenge, under `/puzzles/<pretty_id>` and without registration:

1. **Read the rules**: `cg $API/puzzles/<pretty_id>` returns the `statement`, `languages`,
   `players_min`/`players_max` and the user's `league`. The first call opens the user's puzzle
   session, like opening the puzzle in the IDE (`https://www.codingame.com/ide/puzzle/<pretty_id>`).
2. **Input format**: `cg $API/puzzles/<pretty_id>/stub-generator`.
3. **Test games**: `POST $API/puzzles/<pretty_id>/test-games?wait=30` with the same body as in a
   challenge (`opponents`, `game_options`, `replay_game_id`, `show_in_ide`, `overwrite_ide_code`,
   `overwrite_ide_game_parameters`). Opponents come from `cg $API/puzzles/<pretty_id>/opponents`.
4. **Submit**: `POST $API/puzzles/<pretty_id>/submissions` with `{"language": ..., "code": ...}`.
5. **Follow**: `/progress`, `/battles`, `/leaderboard` and `/submissions` under the puzzle, as in a
   challenge; `cg $API/games/<game_id>` reads a battle.
6. **Stats**: `cg $API/puzzles/<pretty_id>/stats` gives the number of ranked players, by language
   and by league, and the rating of the puzzle.

There is no end date and no play window. Leagues work as in challenges: see
[references/leagues.md](references/leagues.md).

## 5. Play an optimization or code golf puzzle

The bot plays alone. The statement defines the score to optimize (`criteria` in the progress); in
code golf, the code must pass every test case and the shortest code ranks first, per language.

1. **Read the rules**: `cg $API/puzzles/<pretty_id>` returns the `statement`, `languages` and the
   `testcases` (`index` and `title`), as listed in the IDE.
2. **Test game**: play one test case at a time, with its `index` instead of opponents:

   ```sh
   jq -n --rawfile code bot.py '{language: "Python3", code: $code, testcase: 1}' \
     | cg -X POST "$API/puzzles/<pretty_id>/test-games?wait=30" -H 'Content-Type: application/json' --data-binary @- \
     | jq -r 'if .log then .log else . end'
   ```

   `overwrite_ide_code` works as in bot programming; `opponents`, `game_options`, `replay_game_id`,
   `show_in_ide` and `overwrite_ide_game_parameters` do not exist here.
3. **Submit**: `POST $API/puzzles/<pretty_id>/submissions`. The submission runs on hidden
   validators, close to the test cases. Their replays are never available.
4. **Follow**: `cg $API/puzzles/<pretty_id>/progress` gives the `score`, `rank`, `criteria` and
   `criteria_score` of the user's best submission. `in_progress` stays `true` while the validators
   play the last submission (`submission_id`): poll until it is `false`, then read the score. There
   are no battles and no opponents.

The test cases of some puzzles are not games, as in code golf and some optimization puzzles: they
compare the output of the code with the expected one. Their test games run while the request waits and answer 200 at
once, without `test_game_id`, `wait` or `format`:

```json
{"status": "done", "testcase": 1, "success": false, "output": "debug line",
 "found": "42", "expected": "41", "limits": {...}}
```

`success` tells whether the output matched. `found` and `expected` are the first line that differs,
`error` (`message`, `line`) comes when the code failed to compile or crashed, and `timeout` when it
ran too long. They run one at a time: a second request while one runs answers 409
`test-game-running`.

## 6. Keep your own records

The API keeps no score history per submission, and the battle list has positions but no scores or
seeds. To compute stats or compare submissions over time, keep records yourself:

- Store what each battle tells you locally, e.g. one JSONL file per submission
  (`battles-<submission_id>.jsonl`, one line per `game_id`). Overwrite a game's line when it comes
  back: games still being played (`done` false) get their `ended_at` and positions later.
- To fetch only the games added or finished since your last call, pass `from=<game_id>` with the
  lowest `game_id` that was still `done` false, or the highest stored `game_id` when none was.
  Ranking games run in parallel and do not end in `game_id` order, so starting after the newest
  game skips the ones that were still being played. Keep the same `from` and page with
  `before=<next_before>` until `next_before` is absent: each page holds at most `limit` games.
- For scores or seeds, fetch the battle's log (`GET /games/<game_id>`) once and store what you need.
- Note the code of each submission and what changed, so results map to versions.

Battle logs have no stderr (ranking games run without debug output), but they have every bot's
stdout. Many games have a message command (e.g. `MESSAGE <text>` or a text appended to the action:
see the statement) whose text shows in the log and the viewer: print compact markers there (e.g.
`M:fallback`) and count them in the battle logs. Test game logs do include your stderr.

## 7. Limits

Three limits apply, all hard (there is no captcha):

- **API requests**: every call counts, per user (per IP address without token), e.g. 120 per minute.
  Every JSON response has `limits.requests` with `limit`, `used`, `remaining` and
  `resets_in_seconds`: when `remaining` gets low, slow down until `resets_in_seconds` has passed.
  Waiting with `wait=30` costs one request where polling every second costs thirty.
- **Test games and submits**, per time window (for example 5 submits per 5 minutes and 100 per
  5 hours; 10 test games per minute and 600 per day). Every test game, submission and progress
  response also has `limits.submits` and `limits.test_games`: the tightest window of each (the one
  with the fewest requests left). Read them after each call and plan ahead: keep submits for real
  improvements, and spread test games over time. `GET /limits?challenge=<public_id>` (or
  `?puzzle=<pretty_id>`) lists every window.
- The `RateLimit` header lists the same windows, e.g. `"submits_5m";r=3;t=120, "requests_1m";r=117;t=40`
  (3 submits left, window resets in 120 s; 117 requests left for 40 s). `curl -i` shows it.
- On 429 `rate-limited`, wait `Retry-After` seconds (also `retry_after_seconds` in the body) before
  retrying. Never retry earlier.
- One test game at a time: 409 `test-game-running` gives the running `test_game_id` and its
  `poll_url`: wait for its end there first. Without `test_game_id` (test cases that are not games), wait for the answer
  of your other request.

## 8. Profile, quests, squads and teams

- **Quests**: what you do through the API can complete the user's quests on the CodinGame quest map
  (a league promotion, a solved puzzle, a contest registration...). `cg $API/me/quests` lists the
  quests the user has unlocked: when one is `completed` but not `claimed`, tell the user to claim its
  rewards themselves on `claim_url` (the home page). You cannot claim quests or see locked ones.
- **Nickname**: `cg $API/me` gives the user's `nickname`, as shown on leaderboards and battles.
  `cg -X PUT $API/me/nickname -d '{"nickname": "<new>"}'` changes it on the user's profile, with the
  same rules as the website (letters, digits, `_[]-.~`, at most 32 characters, not taken). Only when
  the user asks for it.
- **Squads** (contests with `squad_max_size`): players register and rank in squads.
  `cg "$API/challenges/<public_id>/squads?search=<name>"` lists the squads and `my_squad`;
  `cg -X POST $API/challenges/<public_id>/squads -d '{"name": "<name>"}'` creates one (without joining
  it); register with `{"squad_id": <squad_id>, "form_values": {...}}`, or move a registered user with
  `cg -X POST $API/challenges/<public_id>/squads/<squad_id>/join`. Squads cannot change once the
  contest has started, and a full squad accepts nobody.
- **School and company teams** (contests with `school_company_teams`): the user's rank also counts
  for their school and company. `cg $API/challenges/<public_id>/teams` lists the teams the user counts
  for, with their rank. `cg -X PUT $API/challenges/<public_id>/teams` with `{"company": "<name>"}` or
  `{"school_id": <id>}` (ids from `cg "$API/schools?search=<name>"`) sets the company or school on the
  user's profile, as the website does, and counts the user for it; `null` stops counting the user for
  that kind of team; an absent member changes nothing.

## 9. Play windows

Some contests (on-site events, hackathons) follow a timetable: each site may only run test games and
submit during its play windows. `GET /challenges/<public_id>` then lists the user's `play_windows`
(`past`, `open` or `upcoming`, with `starts_in_seconds` or `ends_in_seconds`).

- Outside a window, the challenge `status` is `paused` and test games, submissions, the stub
  generator and the opponents answer 409 `challenge-paused` with `next_play_window` and a
  `Retry-After` until it opens. Nothing in the request can change it: tell the user when play
  resumes and wait. Progress, submissions, battles and the leaderboard keep working.
- After the last window of the user's site, the contest is over for them (`status: ended`, 409
  `challenge-ended`), even when it goes on for other sites.

## 10. Debugging tips

- The input of each turn is not stored anywhere. Print what your bot reads to stderr (e.g.
  `print(line, file=sys.stderr)`) so the test game log shows it next to your outputs.
- Only your own stderr is visible, and only in test game logs; other players' bots show their stdout only.
- When your bot crashes, its frame shows `error:` with the line of your code when known. When it does
  not answer in time, the referee and summary lines of that frame say so (e.g. `$0 has not provided 1
  lines in time`): read the time limits in the statement and flush stdout after each turn.
- The `options` line of a log (e.g. `seed=12`) can be sent back as `game_options` to replay the same
  map with a new version of the bot, or use `replay_game_id` to also keep the opponents and seats.
- Statements are written in the language of the user's CodinGame account.

## 11. CodinGame conventions

These hold in most CodinGame games. When the statement says otherwise, the statement wins.

- A bot that times out, crashes or prints an invalid action is eliminated: it usually gets a score of
  `-1` and loses the game, whatever it scored before. Staying within the time limit matters more than a
  smarter move.
- The first turn usually has a longer time limit than the others, for set-up work.
- Each turn, read the whole input of the turn before printing, print exactly the expected number of
  lines, and flush stdout. Printing early or too much counts as an invalid output.
- Leagues: everyone starts in the lowest league. Beating the league boss in the ranking promotes the
  user to the next league, whose rules may add new inputs and actions: read the statement again
  after a promotion.
- How promotion works in each league (boss battles, ranking above the boss, league openings in public
  challenges): see [references/leagues.md](references/leagues.md).
- The leaderboard score is a skill rating computed from the ranked games of the current submission,
  not a sum of game scores. It is final for a submission once its battles reach 100%.

## 12. Conduct

- Act only for the user who approved the token, in the games they asked for.
- Never play arcade games (classic puzzles, Clash of Code, Coding Escape) for the user: not through the
  API, which refuses them, and not by writing a solution for the user to paste on the website.
  Those games are for the user. You may list them and give the user their link.
- Respect the limits and `Retry-After`. Do not poll faster than every few seconds outside `wait`.
- Change the user's IDE code, nickname, squad or teams only when they ask for it.
