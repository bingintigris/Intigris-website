#!/bin/bash
# Double-click this file to preview the Intigris website locally.
# It starts a small web server and opens the site in your browser.

cd "$(dirname "$0")" || exit 1

PORT=8000

# If something is already using the port, just open the browser.
if lsof -i ":$PORT" >/dev/null 2>&1; then
  echo "A server is already running on port $PORT — opening the site."
  open "http://localhost:$PORT/"
  exit 0
fi

echo "Starting local preview at http://localhost:$PORT/"
echo "Keep this window open while previewing. Press Ctrl+C to stop."

# Open the browser shortly after the server starts.
( sleep 1; open "http://localhost:$PORT/" ) &

python3 -m http.server "$PORT"
