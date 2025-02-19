from flask import Flask
from flask_cors import CORS
from routes.auth_routes import users_blueprint 

app = Flask(__name__)
CORS(app)

app.register_blueprint(users_blueprint)

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Home Page!"

if __name__ == '__main__':
    app.run(debug=True, host="localhost", port=5001)