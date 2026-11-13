#!/usr/bin/env bash
# Runs each exploration scenario on the booted emulator and saves, for each one, a screenshot, the screen's UI tree and the step log.
# The scenarios are the "steps" of the exploratory sessions; the saved files are the evidence the defect reports use.
set +e
export PATH="$HOME/maestro/bin:$PATH"
adb install -r app/app.apk
mkdir -p artifacts
sleep 45
cd exploration || exit 1
for f in scenarios/*.yaml; do
  name=$(basename "$f" .yaml)
  # ONLY="s08|s09" runs just those scenarios (used to repeat part of a session)
  if [ -n "${ONLY:-}" ] && ! echo "$name" | grep -Eq "^(${ONLY})"; then continue; fi
  echo "=== $name"
  if [ "$name" = "s13-review-card-number" ]; then
    (adb shell screenrecord --time-limit 90 /sdcard/purchase.mp4 &) >/dev/null 2>&1
  fi
  timeout 240 maestro test "$f" > "../artifacts/$name.log" 2>&1
  echo "exit: $?"
  sleep 3
  adb exec-out screencap -p > "../artifacts/$name.png"
  timeout 90 maestro hierarchy > "../artifacts/$name.json" 2> "../artifacts/$name.err"
  if [ "$name" = "s13-review-card-number" ]; then
    sleep 2; adb shell pkill -l SIGINT screenrecord; sleep 3; adb pull /sdcard/purchase.mp4 "../artifacts/purchase.mp4"
  fi
done
echo done
