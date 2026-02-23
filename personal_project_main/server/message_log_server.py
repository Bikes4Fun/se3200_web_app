from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Project 3 requirement: CORS implemented server-wide

MESSAGES_FILE = "messages.txt"


# Project 3 requirement: GET /messages - RESTful route to return all messages from file
@app.route("/messages", methods=["GET"])
def get_messages():
    try:
        # Project 3 requirement: Read messages from file on local filesystem
        with open(MESSAGES_FILE, "r") as f:
            messages = [line.strip() for line in f if line.strip()]
        # Project 3 requirement: Return JSON array with status code 200 OK
        return jsonify(messages), 200
    except FileNotFoundError:
        return jsonify([]), 200


# Project 3 requirement: POST /messages - RESTful route to receive and store messages
@app.route("/messages", methods=["POST"])
def post_message():
    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "message required"}), 400
    
    # Project 3 requirement: Write (append) message to file on local filesystem
    with open(MESSAGES_FILE, "a") as f:
        f.write(data["message"] + "\n")
    
    # Project 3 requirement: Respond with status code 201 Created
    return "", 201


# Project 3 requirement: 404 Not Found response for undefined routes
@app.errorhandler(404)
def not_found(error):
    return "404 Not Found: The requested resource does not exist.", 404


if __name__ == "__main__":
    app.run(port=8080, host="0.0.0.0")
