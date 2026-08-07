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

# Serve with caching switched off, so you always get the newest version of a
# page without needing a hard refresh.
python3 - "$PORT" <<'PY'
import sys, functools, http.server, socketserver

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def send_response(self, *args, **kwargs):
        # Never answer "304 Not Modified" from the browser cache.
        super().send_response(*args, **kwargs)

port = int(sys.argv[1])
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", port), NoCacheHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nPreview stopped.")
PY
