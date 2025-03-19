from flask import Blueprint, jsonify, request
from backend.controllers.places_controller import PlacesController
from backend.controllers.places_controller import FavoritesController
from backend.utils.auth_middleware import token_required

places_blueprint = Blueprint("places", __name__)

# 📌 Saves a new place for the user
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

#📌 Retrieves all saved places for the user, including ratings
# @places_blueprint.route("/get", methods=["GET"])
# @token_required
# def get_user_saved_places(user_id):
#     print(f"📌 Fetching places for user {user_id}")
    
#     places = PlacesController.get_user_saved_places(user_id)

#     if places:
#         print(f"✅ Retrieved {len(places)} places")
#         return jsonify({"saved_places": places}), 200
#     else:
#         print("⚠️ No places found")
#         return jsonify({"message": "No places found"}), 200

@places_blueprint.route("/get", methods=["GET"])
@token_required
def get_user_saved_places(user_id): 
    places = PlacesController.get_user_saved_places(user_id)
    print(f"📊 Retrieved places: {places}") 
    if places:
        places_with_details = [{"place_id": place["id"],
                                "place_name": place["name"],
                                "address": place["address"],
                                "details": place["details"],
                                "category": place["category"],
                                "contact_info": place["contact_info"],
                                "opening_hours": place["opening_hours"],
                                "average_rating": place["average_rating"],
                                "rating_count": place["rating_count"],
                                "latitude": place["latitude"],
                                "longitude": place["longitude"]} for place in places]
        print(f"✅ Retrieved {len(places)} places")
        return jsonify({"saved_places": places_with_details}), 200
    else:
        print("⚠️ No places found")
        return jsonify({"message": "No places found"}), 200


#  Retrieves places by category & location (radius 5000 meters) using POST
@places_blueprint.route("/category", methods=["POST"])
def get_places_by_category_and_location():
    try:
        data = request.json
        category = data.get("category")
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        print(f"�� Received request: {data}\n")

        if not category or latitude is None or longitude is None:
            return jsonify({"error": "Category, latitude, and longitude are required"}), 400

        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except ValueError:
            return jsonify({"error": "Latitude and longitude must be numbers"}), 400

        print(f"📌 Fetching places in category '{category}' near ({latitude}, {longitude})")
        places = PlacesController.get_places_by_category_and_location(category, latitude, longitude)
        if places:
            print(f"✅ Retrieved {len(places)} places")
            return jsonify({
                "latitude": latitude,
                "longitude": longitude,
                "places": places
            }), 200
        else:
            print("⚠️ No places found in this radius")
            return jsonify({
                "latitude": latitude,
                "longitude": longitude,
                "message": "No places found"
            }), 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

# 📌 Removes a saved place using place_id
@places_blueprint.route("/delete", methods=["DELETE"])
@token_required
def remove_place(place_id):
    data = request.json
    print(f"📌 Received delete request from user {place_id}: {data}")

    if not data or "place_id" not in data:
        print("❌ Error: Missing place id")
        return jsonify({"error": "Invalid input: Missing place id"}), 400

    success, message = PlacesController.remove_place(place_id, data["place_id"])
    if success:
        print(f"✅ Place deleted: {message}")
        return jsonify({"message": message}), 200
    else:
        print(f"❌ Error deleting place: {message}")
        return jsonify({"error": message}), 404

# ❤️ Adds a place to the user’s favorites
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

# ❤️ Fetches all favorite places of the user
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

# ❤️ Removes a place from favorites
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
    
# ⭐ Updates the rating of a place (each place keeps only one final rating)
@places_blueprint.route("/rate", methods=["POST"])
@token_required
def rate_place(user_id):
    data = request.json
    place_id = data.get("place_id")
    score = data.get("score")

    if not place_id or not score:
        return jsonify({"error": "Missing place_id or score"}), 400

    if score < 1 or score > 5:
        return jsonify({"error": "Score must be between 1 and 5"}), 400

    success, message = PlacesController.rate_place(place_id, score)
    
    if success:
        return jsonify({"message": message}), 200
    else:
        return jsonify({"error": message}), 400
    
