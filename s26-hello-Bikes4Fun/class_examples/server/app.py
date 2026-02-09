from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello World</p>"

@app.route("/index")
def index():
    return "<p>index test<p>"

def run():
    app.run(port=8000, host='0.0.0.0')


# def get
    # access control

# def create
    # return 201

if __name__ == "__main__":
    run()
