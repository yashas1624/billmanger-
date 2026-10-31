import json
code = open("bot.py").read()
body = {"language": "Python3", "code": code, "opponents": ["boss"], "game_options": None}
open("tg_body.json","w").write(json.dumps(body))
print("wrote")
