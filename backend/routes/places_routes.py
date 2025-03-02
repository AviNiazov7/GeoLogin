from flask import Blueprint, jsonify, request, current_app
import jwt
from functools import wraps
from backend.database.places_db import save_place, get_saved_places, delete_place
from backend.database.db_connection import db

places_blueprint = Blueprint("places", __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        
        try:
            token = token.split(" ")[1]
            decoded_data = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            user_id = decoded_data.get("user_id")

            user = db["users"].find_one({"_id": user_id})
            if not user:
                return jsonify({"error": "Invalid token"}), 401

            return f(user_id, *args, **kwargs)

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

    return decorated

@places_blueprint.route("/save", methods=["POST"])
@token_required
def save_new_place(user_id):
    data = request.json
    if not data or "place_id" not in data or "name" not in data or "address" not in data:
        return jsonify({"error": "Invalid input"}), 400

    data["user_id"] = user_id

    success, message = save_place(data)
    if success:
        return jsonify({"message": "Place saved successfully", "place_id": message}), 201
    else:
        return jsonify({"error": message}), 400

@places_blueprint.route("/get", methods=["GET"])
@token_required
def get_user_saved_places(user_id):
    places = get_saved_places(user_id)
    return jsonify({"saved_places": places}), 200

@places_blueprint.route("/delete", methods=["DELETE"])
@token_required
def remove_place(user_id):
    data = request.json
    if not data or "place_id" not in data:
        return jsonify({"error": "Invalid input"}), 400

    success, message = delete_place(user_id, data["place_id"])
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"error": message}), 404