#!/usr/bin/env python3
"""সনাতন বিদ্যাপীঠ — ডেভ/প্রিভিউ সার্ভার (no-cache, যাতে এডিট সাথে সাথে দেখা যায়)"""
import http.server, socketserver, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))
PORT = int(os.environ.get("PORT", 8000))


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # কনসোল শান্ত রাখতে


socketserver.ThreadingTCPServer.allow_reuse_address = True
with socketserver.ThreadingTCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"সনাতন বিদ্যাপীঠ চলছে → http://0.0.0.0:{PORT}", flush=True)
    httpd.serve_forever()
