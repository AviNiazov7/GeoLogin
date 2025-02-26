import os
from flask import Flask, jsonify
from dotenv import load_dotenv
from backend.routes.auth_routes import users_blueprint
from backend.routes.places_routes import places_blueprint

load_dotenv()
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.register_blueprint(users_blueprint, url_prefix="/auth")
app.register_blueprint(places_blueprint, url_prefix="/places")

print("Registered routes:")
for rule in app.url_map.iter_rules():
    print(rule)

@app.route("/")
def home():
    return jsonify({"message": "Welcome to GeoLogin API!"})

if __name__ == "__main__":
    app.run(debug=True, host="localhost", port=5001)