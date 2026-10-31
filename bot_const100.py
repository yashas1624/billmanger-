import sys

# Mad Pod Racing bot: pure constant 100, aim at checkpoint
while True:
    inputs = []
    while len(inputs) < 4:
        line = input()
        if not line:
            break
        inputs.extend(line.split())
    if len(inputs) < 4:
        print("0 0 100", flush=True)
        continue
    x, y, cp_x, cp_y = [int(i) for i in inputs[:4]]
    print(f"{cp_x} {cp_y} 100", flush=True)
