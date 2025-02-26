from flask import Blueprint, jsonify, request
from backend.database.places_db import save_place, get_saved_places, delete_place

places_blueprint = Blueprint("places", __name__)

@places_blueprint.route("/save", methods=["POST"])
def save_new_place():
    data = request.json
    if not data or "user_id" not in data or "place_id" not in data:
        return jsonify({"error": "Invalid input"}), 400

    success, message = save_place(data)
    if success:
        return jsonify({"message": "Place saved successfully", "place_id": message}), 201
    else:
        return jsonify({"error": message}), 400

@places_blueprint.route("/saved/<user_id>", methods=["GET"])
def get_user_saved_places(user_id):
 
    places = get_saved_places(user_id)
    return jsonify({"saved_places": places}), 200

@places_blueprint.route("/delete", methods=["DELETE"])
def remove_place():
    data = request.json
    if not data or "user_id" not in data or "place_id" not in data:
        return jsonify({"error": "Invalid input"}), 400

    success, message = delete_place(data["user_id"], data["place_id"])
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"error": message}), 404