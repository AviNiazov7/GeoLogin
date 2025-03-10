from backend.database.db_connection import db
from bson.objectid import ObjectId
from datetime import datetime
import uuid  

def save_place(data):
    if "place_id" not in data or not data["place_id"]:
        data["place_id"] = str(uuid.uuid4())  

    initial_rating = data.get("score", 0)
    initial_rating_count = 1 if "score" in data else 0

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
        "opening_hours": data.get("opening_hours", ""),
        "updated_at": datetime.utcnow(),
        "average_rating": initial_rating, 
        "rating_count": initial_rating_count  
    }

    result = db["places"].insert_one(place)
    return True, str(result.inserted_id)

def get_saved_places(user_id):
    places = list(db["places"].find({"user_id": user_id}, {"_id": 0})) 
    return places

def delete_place(user_id, place_id):
    result = db["places"].delete_one({"user_id": user_id, "_id": ObjectId(place_id)})
    return (True, "Place deleted successfully") if result.deleted_count > 0 else (False, "Place not found")

def rate_place(place_id, score):
    place = db["places"].find_one({"place_id": place_id})
    if not place:
        return False, "Place not found"

    new_avg_rating = score  
    db["places"].update_one({"place_id": place_id}, {"$set": {"average_rating": new_avg_rating}})
    
    return True, "Rating updated successfully"