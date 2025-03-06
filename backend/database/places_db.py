from backend.database.db_connection import db
from bson.objectid import ObjectId
from datetime import datetime
import uuid  

def save_place(data):

    if "place_id" not in data or not data["place_id"]:
        data["place_id"] = str(uuid.uuid4())  

    place = {
        "place_id": data["place_id"],
        "user_id": data["user_id"],
        "name": data["name"],
        "address": data["address"],
        "details": data.get("details", ""),
        "category": data.get("category", ""),
        "latitude": data.get("latitude", None),
        "longitude": data.get("longitude", None),
        "contact_info": data.get("contact_info", ""),
        "rating": data.get("rating", 0),
        "price_level": data.get("price_level", "Unknown"),
        "opening_hours": data.get("opening_hours", ""),
        "updated_at": data.get("updated_at", None)
    }

    result = db["places"].insert_one(place)
    return True, str(result.inserted_id)

def get_saved_places(user_id):
    places = list(db["places"].find({"user_id": user_id}, {"_id": 0})) 
    return places

def delete_place(user_id, place_id):
    result = db["places"].delete_one({"user_id": user_id, "_id": ObjectId(place_id)})
    if result.deleted_count == 0:
        return False, "Place not found"
    return True, "Place deleted successfully"

# favorite functions
def add_place_to_favorites(user_id, place_id):
    result = db["users"].update_one(
        {"_id": ObjectId(user_id)},
        {"$addToSet": {"favorite_places": place_id}}
    )
    return result.modified_count > 0

def get_favorite_places(user_id):
    user = db["users"].find_one({"_id": ObjectId(user_id)}, {"favorite_places": 1})
    return user.get("favorite_places", []) if user else []

def remove_place_from_favorites(user_id, place_id):
    result = db["users"].update_one(
        {"_id": ObjectId(user_id)},
        {"$pull": {"favorite_places": place_id}}
    )
    return result.modified_count > 0