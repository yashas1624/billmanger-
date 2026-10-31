import sys

# Mad Pod Racing bot: constant 100, aim at checkpoint, correct 1-line-per-turn parsing
prev_x = None
prev_y = None
last_cp_x = None
last_cp_y = None

while True:
    try:
        line = input()
    except EOFError:
        break
    if not line:
        break
    inputs = line.split()
    if len(inputs) >= 4:
        x, y, cp_x, cp_y = [int(i) for i in inputs[:4]]
        last_cp_x, last_cp_y = cp_x, cp_y
    elif len(inputs) == 2 and last_cp_x is not None:
        x, y = [int(i) for i in inputs[:2]]
        cp_x, cp_y = last_cp_x, last_cp_y
    else:
        if last_cp_x is not None:
            print(f"{last_cp_x} {last_cp_y} 100", flush=True)
            continue
        else:
            print("0 0 100", flush=True)
            continue
    print(f"{cp_x} {cp_y} 100", flush=True)
