"""Design-review preview for the Intigris website (http://localhost:8004).

Serves the built site (site/dist) like the normal preview on :8003, but the
start page (/) goes straight to the design-review page, where new section
variants are compared before one is chosen. Used by start-design-review.command.
"""
import functools
import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8004
REVIEW = "/review/home-sections/"
DIST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "dist")


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path in ("/", "/index.html"):
            self.send_response(302)
            self.send_header("Location", REVIEW)
            self.end_headers()
            return
        super().do_GET()

    def log_message(self, *args):  # keep the Terminal window quiet
        pass


if __name__ == "__main__":
    handler = functools.partial(Handler, directory=os.path.normpath(DIST))
    with http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler) as server:
        print(f"Design review running on http://localhost:{PORT} (close this window to stop)")
        server.serve_forever()
