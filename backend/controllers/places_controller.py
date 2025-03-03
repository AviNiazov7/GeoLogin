from backend.database.places_db import save_place, get_saved_places, delete_place
from backend.database.auth_db import add_place_to_favorites
from flask import jsonify

class PlacesController:
    @staticmethod
    def save_new_place(user_id, data):
        if not data or "place_id" not in data or "name" not in data or "address" not in data:
            return False, "Invalid input"

        success, message = save_place(data)
        if not success:
            return False, message
        
        user_update_success = add_place_to_favorites(user_id, data["place_id"])
        if user_update_success:
            return True, "Place saved and added to favorites"
        else:
            return False, "Failed to add place to favorites"
        
def get_user_saved_places(user_id: str) -> list:
    return get_saved_places(user_id)

def remove_place(data: dict) -> tuple[bool, str]:
    if not isinstance(data, dict) or "user_id" not in data or "place_id" not in data:
        return False, "Invalid input: Missing required fields"

    success = delete_place(data["user_id"], data["place_id"])
    if success:
        return True, "Place removed successfully"
    else:
        return False, "Failed to remove place"