from flask import Blueprint, jsonify, request
from backend.controllers.places_controller import PlacesController
from backend.controllers.places_controller import FavoritesController
from backend.utils.auth_middleware import token_required

places_blueprint = Blueprint("places", __name__)

# Saves a new place for the user
@places_blueprint.route("/save", methods=["POST"])
@token_required
def save_new_place(user_id):
    data = request.json
    print(f"📌 Received request from user {user_id}: {data}")

    required_fields = {"name", "address", "details", "category"}
    if not isinstance(data, dict) or not required_fields.issubset(data.keys()):
        print("❌ Error: Missing required fields!")
        return jsonify({"error": "Invalid input: Missing required fields"}), 400

    success, message = PlacesController.save_new_place(user_id, data)

    if success:
        print(f"✅ Success: {message}")
        return jsonify({"message": message}), 201
    else:
        print(f"❌ Error while saving place: {message}")
        return jsonify({"error": message}), 400

# Retrieves all saved places for the user.
@places_blueprint.route("/get", methods=["GET"])
@token_required
def get_user_saved_places(user_id):
    print(f"📌 Fetching places for user {user_id}")
    
    places = PlacesController.get_user_saved_places(user_id)
    
    if places:
        print(f"✅ Retrieved {len(places)} places")
        return jsonify({"saved_places": places}), 200
    else:
        print("⚠️ No places found")
        return jsonify({"message": "No places found"}), 200

# Removes a saved place using place_id.
@places_blueprint.route("/delete", methods=["DELETE"])
@token_required
def remove_place(user_id):
    data = request.json
    print(f"📌 Received delete request from user {user_id}: {data}")

    if not data or "place_id" not in data:
        print("❌ Error: Missing place id")
        return jsonify({"error": "Invalid input: Missing place id"}), 400

    success, message = PlacesController.remove_place(user_id, data["place_id"])
    if success:
        print(f"✅ Place deleted: {message}")
        return jsonify({"message": message}), 200
    else:
        print(f"❌ Error deleting place: {message}")
        return jsonify({"error": message}), 404

# Adds a place to the user’s favorites.
@places_blueprint.route("/favorites/add", methods=["POST"])
@token_required
def add_place_to_favorites(user_id):
    data = request.json
    print(f"📌 Adding favorite for user {user_id}: {data}")

    if not data or "place_id" not in data:
        print("❌ Error: Missing place_id")
        return jsonify({"error": "Invalid input: Missing place_id"}), 400

    success, message = FavoritesController.add_place_to_favorites(user_id, data["place_id"])
    if success:
        print(f"✅ Place added to favorites: {message}")
        return jsonify({"message": message}), 201
    else:
        print(f"❌ Error adding place to favorites: {message}")
        return jsonify({"error": message}), 400

# Fetches all favorite places of the user.
@places_blueprint.route("/favorites/get", methods=["GET"])
@token_required
def get_favorite_places(user_id):
    print(f"📌 Fetching favorite places for user {user_id}")

    places = FavoritesController.get_favorite_places(user_id)
    if places:
        print(f"✅ Retrieved {len(places)} favorite places")
        return jsonify({"favorite_places": places}), 200
    else:
        print("⚠️ No favorite places found")
        return jsonify({"message": "No favorite places found"}), 200

# Removes a place from favorites.
@places_blueprint.route("/favorites/remove", methods=["DELETE"])
@token_required
def remove_favorite_place(user_id):
    data = request.json
    print(f"📌 Removing favorite for user {user_id}: {data}")

    if not data or "place_id" not in data:
        print("❌ Error: Missing place_id")
        return jsonify({"error": "Invalid input: Missing place_id"}), 400

    success, message = FavoritesController.remove_place_from_favorites(user_id, data["place_id"])
    if success:
        print(f"✅ Place removed from favorites: {message}")
        return jsonify({"message": message}), 200
    else:
        print(f"❌ Error removing place from favorites: {message}")
        return jsonify({"error": message}), 404