import json, subprocess, time, re, os

TOKEN = open(os.path.expanduser("~/.config/codingame/token")).read()
API = "https://www.codingame.com/api/v1"
PUZZLE = "mad-pod-racing"

def curl(args, data=None):
    cmd = ["curl.exe", "-s"] + args
    if data is not None:
        cmd += ["-H", "Content-Type: application/json", "--data-binary", "@" + data]
    return subprocess.run(cmd, capture_output=True, text=True).stdout

# Build body
code = open("bot.py").read()
body = {"language": "Python3", "code": code, "opponents": ["boss"], "game_options": None}
open("tg_body.json", "w").write(json.dumps(body))

for i in range(3):
    resp = curl(["-X", "POST", "-H", f"Authorization: Bearer {TOKEN}",
                 f"{API}/puzzles/{PUZZLE}/test-games?wait=30"], "tg_body.json")
    d = json.loads(resp)
    status = d.get("status")
    tgid = d.get("test_game_id")
    if not tgid:
        print(f"test {i+1}: failed to start ({resp[:200]})")
        continue
    time.sleep(3)
    log = curl(["-H", f"Authorization: Bearer {TOKEN}",
                f"{API}/test-games/{tgid}"])
    m = re.search(r"scores: 0=(\d+) 1=(\d+)", log)
    if m:
        print(f"test {i+1}: me={m.group(1)} boss={m.group(2)}  status={status}")
    else:
        print(f"test {i+1}: no score found, status={status}")
