from backend.database.db_connection import db
from bson.objectid import ObjectId
from datetime import datetime
import uuid  

def save_place(data):

    if "place_id" not in data or not data["place_id"]:
        data["place_id"] = str(uuid.uuid4())  

    ratings = []
    avg_rating = 0
    if "score" in data:
        ratings.append({
            "user_id": data["user_id"],
            "score": data["score"],
            "review": data.get("review", "")
        })
        avg_rating = data["score"]

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
        "price_level": data.get("price_level", "Unknown"),
        "opening_hours": data.get("opening_hours", ""),
        "updated_at": datetime.utcnow(),
        "ratings": ratings, 
        "average_rating": avg_rating
    }

    result = db["places"].insert_one(place)
    return True, str(result.inserted_id)

def get_saved_places(user_id):
    places = list(db["places"].find({"user_id": user_id}, {"_id": 0})) 
    for place in places:
        ratings = place.get("ratings", [])
        if ratings:
            place["average_rating"] = sum(r["score"] for r in ratings) / len(ratings)
        else:
            place["average_rating"] = None 

    return places

def delete_place(user_id, place_id):
    result = db["places"].delete_one({"user_id": user_id, "_id": ObjectId(place_id)})
    return (True, "Place deleted successfully") if result.deleted_count > 0 else (False, "Place not found")

def rate_place(user_id, place_id, score, review=""):
    place = db["places"].find_one({"place_id": place_id})
    if not place:
        return False, "Place not found"

    existing_rating = next((r for r in place.get("ratings", []) if r["user_id"] == user_id), None)
    if existing_rating:
        return False, "User already rated this place"

    new_rating = {
        "user_id": user_id,
        "score": score,
        "review": review
    }

    db["places"].update_one({"place_id": place_id}, {"$push": {"ratings": new_rating}})
    
    updated_place = db["places"].find_one({"place_id": place_id})
    ratings = updated_place.get("ratings", [])
    avg_rating = sum(r["score"] for r in ratings) / len(ratings)

    db["places"].update_one({"place_id": place_id}, {"$set": {"average_rating": avg_rating}})
    
    return True, "Rating added successfully"