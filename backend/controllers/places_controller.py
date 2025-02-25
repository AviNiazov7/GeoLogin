from backend.database.places_db import save_place, get_saved_places, delete_place

def save_new_place(data):
    if not data or "user_id" not in data or "place_id" not in data:
        return False, "Invalid input"
    return save_place(data)

def get_user_saved_places(user_id):
    return get_saved_places(user_id)

def remove_place(data):
    if not data or "user_id" not in data or "place_id" not in data:
        return False, "Invalid input"

    return delete_place(data["user_id"], data["place_id"])