from backend.database.db_connection import db
from bson.objectid import ObjectId
from datetime import datetime

def save_place(data):
    place = {
        "place_id": data.get("place_id", None),
        "user_id": data["user_id"],  
        "name": data["name"],
        "address": data["address"],
        "details": data.get("details", ""),  
        "category": data.get("category", "Unknown"),  
        "latitude": data.get("latitude", None),  
        "longitude": data.get("longitude", None),  
        "contact_info": data.get("contact_info", ""),  
        "rating": data.get("rating", 0),  
        "price_level": data.get("price_level", "Unknown"),  
        "opening_hours": data.get("opening_hours", ""),  
        "updated_at": datetime.utcnow()  
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