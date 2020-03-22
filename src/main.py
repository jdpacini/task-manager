from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
from urllib import parse
import os
import webbrowser
from threading import Timer


class G:
    PORT = 8000
    APP_DIR = os.path.dirname(os.path.realpath(__file__))
    STATIC_DIR = os.path.join(APP_DIR, "static")
    INDEX_PATH = os.path.join(STATIC_DIR, "index.html")
    ERROR_HTML = """
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Task Manager - File Not Found</title>
    </head>
    <body>
        <h1>File Not Found</h1>
        <a href="/">Home</a>
    </body>
    </html>
    """
    MIME_TYPES = {
        '.html':'text/html',
        '.htm':'text/html',
        '.css':'text/css',
        '.json':'application/javascript',
        '.js':'application/javascript',
        '.ico':'image/x-icon',
        '.png':'image/png',
        '.jpg':'image/jpeg',
        '.jpeg':'image/jpeg',
        '.svg':'image/svg+xml',
        '.txt':'text/plain',
    }


class ReqHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # parsed_path = parse.urlparse(self.path)
        # print(parsed_path)
        # print(self.headers)

        # Parse url path
        filename = None
        if self.path == None or self.path == '/':
            filename = G.INDEX_PATH
        elif self.path[:8].lower() == '/static/':
            fnames = self.path[8:].split('/')
            filename = os.path.join(G.STATIC_DIR, *fnames)
        elif self.path.lower() == 'favicon.ico' or self.path.lower() == '/favicon.ico':
            filename = os.path.join(G.STATIC_DIR, "favicon.ico")
        
        print(filename)
        
        # Return error page if file doesn't exist
        if filename is None or not os.path.exists(filename):
            self.send_response(404)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(G.ERROR_HTML.encode())
        else:
            # Build response header by filename
            self.send_response(200)
            ext = os.path.splitext(filename)[1].lower()
            self.send_header('Content-type', G.MIME_TYPES.get(ext, 'text/html'))
            self.end_headers()

            # Send index page
            with open(filename, "rb") as f:
                self.wfile.write(f.read())

    def do_POST(self):
        pass


def open_webpage(url):
    try:
        webbrowser.open_new(url)
    except webbrowser.Error:
        pass


def main():
    with TCPServer(("", G.PORT), ReqHandler) as httpd:
        url = f"http://localhost:{G.PORT}"
        print(f"Task Manager Server Started: '{url}'")
        print(f"Static Dir: {G.STATIC_DIR}")
        Timer(2, open_webpage, [url]).start()
        httpd.serve_forever()

if __name__ == "__main__":
    main()

