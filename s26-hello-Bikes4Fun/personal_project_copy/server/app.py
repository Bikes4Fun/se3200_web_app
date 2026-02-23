from flask import Flask, request, jsonify

app = Flask(__name__)

# Your own API data
medications = [
    {"id": 1, "name": "Example Med", "dose": "10mg"},
]


@app.route("/")
def index():
    return "<p>OK</p>"


@app.route("/api/medications", methods=["GET"])
def get_medications():
    return jsonify(medications)


@app.route("/api/medications", methods=["POST"])
def create_medication():
    data = request.get_json(silent=True)
    if not data or not data.get("name"):
        return jsonify({"error": "name required"}), 400
    item = {"id": len(medications) + 1, "name": data["name"], "dose": data.get("dose", "")}
    medications.append(item)
    return jsonify(item), 201


def run():
    app.run(port=8000, host="0.0.0.0")


if __name__ == "__main__":
    run()
