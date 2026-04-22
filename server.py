import http.server
import socketserver
import json
import random
import urllib.parse
import os

PORT = int(os.environ.get("PORT", 8081))

# In-memory Game State
state = {
    "pin": None,
    "status": "lobby", # lobby, case_1, grouping, next_cases, game_over
    "players": {}, # { player_id: { "name": "...", "score": 0, "team": None, "answers": {}, "has_answered_current": False } }
    "current_case": 0,
    "grouping_done": False
}

class GameHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

    def do_GET(self):
        if self.path == '/api/state':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(state).encode())
            return
        # Serve static files normally
        super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')
        data = json.loads(body) if body else {}

        parsed_path = urllib.parse.urlparse(self.path)

        if parsed_path.path == '/api/host/create':
            state["pin"] = str(random.randint(1000, 9999))
            state["status"] = "lobby"
            state["players"] = {}
            state["current_case"] = 0
            state["grouping_done"] = False
            self._send_json({"pin": state["pin"]})

        elif parsed_path.path == '/api/host/start':
            state["status"] = "case_1"
            self._send_json({"success": True})

        elif parsed_path.path == '/api/host/next_case':
            state["current_case"] += 1
            if state["current_case"] >= 5:
                state["status"] = "game_over"
            else:
                state["status"] = "next_cases"
            
            # Reset player answer status for new case
            for pid in state["players"]:
                state["players"][pid]["has_answered_current"] = False

            self._send_json({"success": True})

        elif parsed_path.path == '/api/host/do_grouping':
            # Assign teams based on their current case answer
            teams_map = {0: 'A', 1: 'B', 2: 'C', 3: 'D'}
            curr_str = str(state["current_case"])
            for pid, pdata in state["players"].items():
                if curr_str in pdata["answers"]:
                    ans = pdata["answers"][curr_str]
                    pdata["team"] = teams_map.get(ans, 'A')
                else:
                    pdata["team"] = 'A' # Default if didn't answer
            state["grouping_done"] = True
            state["status"] = "grouping"
            self._send_json({"success": True})

        elif parsed_path.path == '/api/player/join':
            pin = data.get("pin")
            name = data.get("name")
            emoji = data.get("emoji", "😎")
            if pin != state["pin"]:
                self._send_json({"error": "Invalid PIN"}, 400)
                return
            
            player_id = "p_" + str(random.randint(10000, 99999))
            state["players"][player_id] = {
                "name": name,
                "emoji": emoji,
                "score": 0,
                "team": None,
                "answers": {},
                "has_answered_current": False
            }
            self._send_json({"player_id": player_id, "name": name, "emoji": emoji})

        elif parsed_path.path == '/api/player/answer':
            player_id = data.get("player_id")
            answer_idx = data.get("answer")
            case_idx = state["current_case"]

            if player_id in state["players"]:
                state["players"][player_id]["answers"][str(case_idx)] = answer_idx
                state["players"][player_id]["has_answered_current"] = True
                
                # Assign 100 points if correct (Simplified logic - host can also manage score)
                # But actual score evaluation usually done by host. We just mark answered here.
                
                self._send_json({"success": True})
            else:
                self._send_json({"error": "Player not found"}, 404)
        else:
            self.send_response(404)
            self.end_headers()

    def _send_json(self, response_dict, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response_dict).encode())

# Change working dir to serve static files correctly
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

with ReusableTCPServer(("", PORT), GameHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()
