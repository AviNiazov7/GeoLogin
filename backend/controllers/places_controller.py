from backend.database.places_db import save_place, get_saved_places, delete_place
from flask import jsonify

class PlacesController:

    @staticmethod
    def save_new_place(user_id, data):

        required_fields = {"name", "address", "details", "category"}
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