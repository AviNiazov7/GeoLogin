from backend.database.places_db import save_place, get_saved_places, delete_place
from backend.database.auth_db import add_place_to_favorites, get_favorite_places, remove_place_from_favorites

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
    def remove_place(user_id: str, place_id: str) -> tuple[bool, str]:
        if not user_id or not place_id:
            return False, "Invalid input: Missing user_id or place_id"

        success, message = delete_place(user_id, place_id)
        if success:
            return True, "Place removed successfully"
        else:
            return False, message

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