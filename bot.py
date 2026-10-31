import sys
import math

# Mad Pod Racing bot v14
# Input per turn: usually "x y nextCheckpointX nextCheckpointY";
# when the checkpoint is unchanged, only "x y" is sent (reuse last checkpoint).
# Output per turn: targetX targetY thrust (0 <= thrust <= 100)
#
# Strategy:
#   - On straights: aim slightly PAST the checkpoint to carry momentum through
#     (don't brake at each checkpoint).
#   - In curves: aim at the checkpoint and slow to 50 to take the corner cleanly.
#   - Thrust 100 on straights, 50 in curves.
#   - Read exactly one line per turn.

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
        x, y, next_checkpoint_x, next_checkpoint_y = [int(i) for i in inputs[:4]]
        last_cp_x, last_cp_y = next_checkpoint_x, next_checkpoint_y
    elif len(inputs) == 2 and last_cp_x is not None:
        x, y = [int(i) for i in inputs[:2]]
        next_checkpoint_x, next_checkpoint_y = last_cp_x, last_cp_y
    else:
        if last_cp_x is not None:
            print(f"{last_cp_x} {last_cp_y} 100", flush=True)
            continue
        else:
            print("0 0 100", flush=True)
            continue

    dx = next_checkpoint_x - x
    dy = next_checkpoint_y - y
    dist = math.hypot(dx, dy)

    thrust = 100
    target_x = float(next_checkpoint_x)
    target_y = float(next_checkpoint_y)

    if prev_x is not None:
        vx = x - prev_x
        vy = y - prev_y
        speed = math.hypot(vx, vy)

        if speed > 10 and dist > 0:
            dot = vx * dx + vy * dy
            cos_ang = dot / (speed * dist)

            if cos_ang < 0.5:
                # Curve: slow down, aim directly at checkpoint.
                thrust = 50
            else:
                # Straight: aim slightly past checkpoint to carry momentum.
                lead = min(500, speed * 0.4)
                target_x = next_checkpoint_x + (vx / speed) * lead
                target_y = next_checkpoint_y + (vy / speed) * lead

    prev_x, prev_y = x, y
    print(f"{int(round(target_x))} {int(round(target_y))} {thrust}", flush=True)
