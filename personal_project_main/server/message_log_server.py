from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MESSAGES_FILE = "messages.txt"


@app.route("/messages", methods=["GET"])
def get_messages():
    try:
        with open(MESSAGES_FILE, "r") as f:
            messages = [line.strip() for line in f if line.strip()]
        return jsonify(messages), 200
    except FileNotFoundError:
        return jsonify([]), 200


@app.route("/messages", methods=["POST"])
def post_message():
    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "message required"}), 400
    
    with open(MESSAGES_FILE, "a") as f:
        f.write(data["message"] + "\n")
    
    return "", 201


@app.errorhandler(404)
def not_found(error):
    return "404 Not Found: The requested resource does not exist.", 404


if __name__ == "__main__":
    app.run(port=8080, host="0.0.0.0")
