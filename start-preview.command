#!/bin/bash
# Double-click to preview the new Intigris website (Astro) on http://localhost:8003
# It builds the site from site/ and serves the result. Keep the window open while you look;
# closing it stops the preview. After code changes: close it and double-click again.

cd "$(dirname "$0")/site" || { echo "Could not find the site folder."; read -n 1 -s -r -p "Press any key to close."; exit 1; }
PORT=8003

if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js is not installed. Install the LTS version from https://nodejs.org and try again."
  read -n 1 -s -r -p "Press any key to close."; exit 1
fi
if lsof -i ":$PORT" >/dev/null 2>&1; then
  echo "Something is already running on port $PORT; stopping it so the newest build is shown."
  lsof -ti ":$PORT" | xargs kill 2>/dev/null; sleep 1
fi
[ -d node_modules ] || { echo "First run: installing (about a minute)…"; npm install --no-audit --no-fund || exit 1; }

echo "Building the site…"
npx astro build || { echo "Build failed, see above."; read -n 1 -s -r -p "Press any key to close."; exit 1; }
( sleep 2; open "http://localhost:$PORT/" ) &
npx astro preview --port $PORT --host 127.0.0.1
