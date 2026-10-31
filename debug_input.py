import json, subprocess, time, re, os

TOKEN = open(os.path.expanduser("~/.config/codingame/token")).read()
API = "https://www.codingame.com/api/v1"
PUZZLE = "mad-pod-racing"

def curl(args, data=None):
    cmd = ["curl.exe", "-s"] + args
    if data is not None:
        cmd += ["-H", "Content-Type: application/json", "--data-binary", "@" + data]
    return subprocess.run(cmd, capture_output=True, text=True).stdout

code = open("bot.py").read()
body = {"language": "Python3", "code": code, "opponents": ["boss"], "game_options": None}
open("tg_body.json", "w").write(json.dumps(body))

resp = curl(["-X", "POST", "-H", f"Authorization: Bearer {TOKEN}",
             f"{API}/puzzles/{PUZZLE}/test-games?wait=30"], "tg_body.json")
d = json.loads(resp)
tgid = d.get("test_game_id")
print("status:", d.get("status"), "test_game_id:", tgid)
if tgid:
    time.sleep(3)
    log = curl(["-H", f"Authorization: Bearer {TOKEN}", f"{API}/test-games/{tgid}", "--header", "Accept: text/plain"])
    # stderr lines
    for l in log.splitlines():
        if "BAD_INPUT" in l:
            print("STDERR:", l)
