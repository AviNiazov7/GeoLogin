from backend.database.db_connection import db
from bson.objectid import ObjectId

def save_place(data):
    place = {
        "user_id": data["user_id"],  
        "name": data["name"],
        "address": data["address"],
        "details": data["details"],  
        "category": data["category"] 
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