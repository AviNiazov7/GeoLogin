from backend.database.db_connection import db
from bson.objectid import ObjectId 
from datetime import datetime

# save sreach history 
def save_search(user_id, query):
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    
    search_entry = {
        "query": query,
        "timestamp": timestamp
    }

    user = db["users"].find_one({"_id": ObjectId(user_id)})
    if not user:
        return False, "User not found"

    if "search_history" not in user:
        db["users"].update_one({"_id": ObjectId(user_id)}, {"$set": {"search_history": []}})

    db["users"].update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"search_history": {"$each": [search_entry], "$slice": -10}}}
    )
    return True, "Search saved successfully"

# get search history
def get_search_history(user_id):
    user = db["users"].find_one({"_id": ObjectId(user_id)}, {"search_history": 1, "_id": 0})
    if not user:
        return []
    return user.get("search_history", [])