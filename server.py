import http.server
import socketserver
from assistant import assistant_query
from voicetest import recognition

PORT = 8080
DIRECTORY = 'website'

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        self.send_response(200)
        content_length = int(self.headers['Content-Length'])
        post_body = self.rfile.read(content_length)
        print(post_body)
        input = post_body.decode("utf-8")
        print(input)
        if input == 'true':
            print('reached')
            input = recognition()
            print(input)
        self.end_headers()
        if input == "ERROR":
            assistant_reply = input
        else:
            assistant_reply = assistant_query(input)
        self.wfile.write(str.encode(assistant_reply))

with socketserver.TCPServer(('', PORT), Handler) as httpd:
    print('serving at port', PORT)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()