import json, subprocess, time, re, os, sys

TOKEN = open(os.path.expanduser("~/.config/codingame/token")).read()
API = "https://www.codingame.com/api/v1"
PUZZLE = "mad-pod-racing"
BOT_FILE = sys.argv[1] if len(sys.argv) > 1 else "bot.py"

def curl(args, data=None):
    cmd = ["curl.exe", "-s"] + args
    if data is not None:
        cmd += ["-H", "Content-Type: application/json", "--data-binary", "@" + data]
    return subprocess.run(cmd, capture_output=True, text=True).stdout

code = open(BOT_FILE).read()
body = {"language": "Python3", "code": code, "opponents": ["boss"], "game_options": None}
open("tg_body.json", "w").write(json.dumps(body))

me_wins = 0
boss_wins = 0
for i in range(3):
    resp = curl(["-X", "POST", "-H", f"Authorization: Bearer {TOKEN}",
                 f"{API}/puzzles/{PUZZLE}/test-games?wait=30"], "tg_body.json")
    d = json.loads(resp)
    tgid = d.get("test_game_id")
    if not tgid:
        print(f"test {i+1}: failed to start")
        continue
    time.sleep(3)
    log = curl(["-H", f"Authorization: Bearer {TOKEN}",
                f"{API}/test-games/{tgid}"])
    m = re.search(r"scores: 0=(\d+) 1=(\d+)", log)
    if m:
        me, boss = int(m.group(1)), int(m.group(2))
        if me > boss:
            me_wins += 1
            result = "WIN"
        elif boss > me:
            boss_wins += 1
            result = "LOSS"
        else:
            result = "DRAW"
        print(f"test {i+1}: me={me} boss={boss}  {result}")
    else:
        print(f"test {i+1}: no score found")

print(f"\nTotal: me={me_wins} boss={boss_wins}")
