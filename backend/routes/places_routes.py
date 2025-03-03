from flask import Blueprint, jsonify, request, current_app
import jwt
from functools import wraps
from backend.database.places_db import save_place, get_saved_places, delete_place
from backend.database.db_connection import db
from backend.utils.auth_middleware import token_required
from backend.controllers.places_controller import PlacesController

places_blueprint = Blueprint("places", __name__)

@places_blueprint.route("/save", methods=["POST"])
@token_required
def save_new_place(user_id):
    data = request.json
    print("📌 Received request data:", data)  # Print the received data
    
    if not data or "place_id" not in data or "name" not in data or "address" not in data:
        print("❌ Error: Missing required fields!")  # Print error if a field is missing
        return jsonify({"error": "Invalid input"}), 400

    success, message = PlacesController.save_new_place(user_id, data)
    if success:
        return jsonify({"message": message}), 201
    else:
        print("❌ Error while saving place:", message)  # Print error if saving failed
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

places_blueprint = Blueprint("places", __name__)

@places_blueprint.route("/save", methods=["POST"])
@token_required
def save_new_place(user_id):
    data = request.json
    success, message = PlacesController.save_new_place(user_id, data)

    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 400