#!/bin/bash
# Double-click this file to start the Intigris Admin Portal locally.
# Keep the window that opens OPEN while you use the portal — it IS the server.
# Closing the window stops the portal (that's why it becomes unreachable).

cd "$(dirname "$0")/admin" || { echo "Could not find the admin folder."; read -n 1 -s -r -p "Press any key to close."; exit 1; }

PORT=5174

# Check Node/npm is installed
if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js is not installed on this Mac."
  echo "Install it from https://nodejs.org (the LTS version), then double-click this file again."
  read -n 1 -s -r -p "Press any key to close."
  exit 1
fi

# Install dependencies on first run (or if they were removed)
if [ ! -d node_modules ]; then
  echo "First run — installing the portal's building blocks (about a minute)…"
  npm install || { echo "Install failed."; read -n 1 -s -r -p "Press any key to close."; exit 1; }
fi

echo ""
echo "Starting the Intigris Admin Portal…"
echo "When it says 'Local: http://localhost:$PORT/', your browser will open automatically."
echo "Leave this window open while you work. Close it to stop the portal."
echo ""

# Open the browser a few seconds after the server starts
( sleep 3; open "http://localhost:$PORT/" ) &

# Start the dev server (this keeps running until you close the window)
npm run dev
