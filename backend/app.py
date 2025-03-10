import os
from flask import Flask, jsonify
from dotenv import load_dotenv
from backend.routes.auth_routes import users_blueprint
from backend.routes.places_routes import places_blueprint
from backend.routes.search_routes import search_blueprint
from flask_cors import CORS

load_dotenv()
app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

app.register_blueprint(users_blueprint, url_prefix="/auth")
app.register_blueprint(places_blueprint, url_prefix="/places")
app.register_blueprint(search_blueprint, url_prefix="/search") 

print("Registered routes:")
for rule in app.url_map.iter_rules():
    print(rule)

@app.route("/")
def home():
    return jsonify({"message": "Welcome to GeoLogin API!"})

@app.route("/places/get", methods=["OPTIONS"])
def preflight():
    response = jsonify({"message": "Preflight OK"})
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE")
    response.headers.add("Access-Control-Allow-Headers", "Authorization, Content-Type")
    return response, 200

if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5001)