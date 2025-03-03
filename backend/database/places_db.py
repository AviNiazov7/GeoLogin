from backend.database.db_connection import db
from bson.objectid import ObjectId

def save_place(data):
    if db["places"].find_one({"place_id": data["place_id"]}):
        return False, "Place already saved"

    result = db["places"].insert_one(data)
    return True, str(result.inserted_id)

def get_saved_places(user_id):
    places = list(db["places"].find({"user_id": user_id}, {"_id": 0})) 
    return places

def delete_place(user_id, place_id):
    result = db["places"].delete_one({"user_id": user_id, "place_id": place_id})
    if result.deleted_count == 0:
        return False, "Place not found"
    return True, "Place deleted successfully"

from backend.database.db_connection import db

def save_place(data):
    if db["places"].find_one({"place_id": data["place_id"]}):
        return False, "Place already exists"

    result = db["places"].insert_one(data)
    return True, str(result.inserted_id)

def get_saved_places(user_id):
    user = db["users"].find_one({"_id": user_id})
    if not user or "favorite_places" not in user:
        return []

    return list(db["places"].find({"place_id": {"$in": user["favorite_places"]}}))