from backend.database.places_db import save_place, get_saved_places, get_places_by_category_and_location_db, delete_place
from backend.database.auth_db import add_place_to_favorites, get_favorite_places, remove_place_from_favorites
from backend.database.db_connection import db

class PlacesController:
    @staticmethod
    def save_new_place(user_id, data):
        required_fields = {"name", "address"} 
        if not isinstance(data, dict) or not required_fields.issubset(data.keys()):
            return False, "Invalid input: Missing required fields"

        data["user_id"] = user_id 
        success, message = save_place(data)
        
        if success:
            return True, "Place saved successfully"
        else:
            return False, message

    @staticmethod
    def get_user_saved_places(user_id: str) -> list:
        return get_saved_places(user_id)
    
    @staticmethod
    def get_places_by_category_and_location(category: str, latitude: float, longitude: float) -> list:
        places = get_places_by_category_and_location_db(category, latitude, longitude)

        if places:
            return [
                {
                    "name": place["name"],
                    "address": place["address"],
                    "latitude": place["latitude"],
                    "longitude": place["longitude"],
                    "category": place["category"]
                }
                for place in places
            ]
        else:
            return []
        
    @staticmethod
    def remove_place(user_id: str, place_id: str) -> tuple[bool, str]:
        if not user_id or not place_id:
            return False, "Invalid input: Missing user_id or place_id"

        success, message = delete_place(user_id, place_id)
        if success:
            return True, "Place removed successfully"
        else:
            return False, message
        
    @staticmethod
    def rate_place(place_id: str, score: float) -> tuple[bool, str]:
        place = db["places"].find_one({"place_id": place_id})
        if not place:
            return False, "Place not found"

        if not (1 <= score <= 5):
            return False, "Score must be between 1 and 5"

        new_rating_count = place.get("rating_count", 0) + 1
        current_avg_rating = float(place.get("average_rating", 0))
        new_average_rating = ((current_avg_rating * place.get("rating_count", 0)) + score) / new_rating_count

        db["places"].update_one(
            {"place_id": place_id},
            {"$set": {"average_rating": new_average_rating, "rating_count": new_rating_count}}
        )
        return True, "Rating added successfully"

class FavoritesController:
    @staticmethod
    def add_place_to_favorites(user_id: str, place_id: str) -> tuple[bool, str]:
        success = add_place_to_favorites(user_id, place_id)
        if success:
            return True, "Place added to favorites"
        else:
            return False, "Failed to add place to favorites"

    @staticmethod
    def get_favorite_places(user_id: str) -> list:
        return get_favorite_places(user_id)

    @staticmethod
    def remove_place_from_favorites(user_id: str, place_id: str) -> tuple[bool, str]:
        success = remove_place_from_favorites(user_id, place_id)
        if success:
            return True, "Place removed from favorites"
        else:
            return False, "Failed to remove place from favorites"