from flask import Blueprint, jsonify, request
from backend.database.places_db import save_place, get_saved_places, delete_place

places_blueprint = Blueprint("places", __name__)

# Route for saving a new place
@places_blueprint.route("/save", methods=["POST"])
def save_new_place():
    print("📌 Received request to save a place.")  # Debugging log

    data = request.json
    print(f"🔍 Data received from frontend: {data}")  # Debugging log to check what frontend sends

    if not data or "user_id" not in data or "place_id" not in data:
        print("❌ Invalid input received. Missing required fields.")  # Debugging log
        return jsonify({"error": "Invalid input"}), 400

    success, message = save_place(data)
    
    if success:
        print(f"✅ Place saved successfully. Place ID: {message}")  # Debugging log
        return jsonify({"message": "Place saved successfully", "place_id": message}), 201
    else:
        print(f"⚠️ Error saving place: {message}")  # Debugging log
        return jsonify({"error": message}), 400

# Route to fetch all saved places for a specific user by their user ID
@places_blueprint.route("/get/<user_id>", methods=["GET"])
def get_user_saved_places(user_id):
 
    places = get_saved_places(user_id)
    return jsonify({"saved_places": places}), 200

# Route for deleting a saved place
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

