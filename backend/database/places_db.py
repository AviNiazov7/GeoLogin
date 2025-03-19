from backend.database.db_connection import db
from bson.objectid import ObjectId
from datetime import datetime
import uuid  
from pymongo import GEOSPHERE

db["places"].create_index([("location", GEOSPHERE)])

def save_place(data):
    if "place_id" not in data or not data["place_id"]:
        data["place_id"] = str(uuid.uuid4())  

    from datetime import datetime

    initial_rating = data.get("score", 0)
    initial_rating_count = 1 if "score" in data else 0

    longitude = data.get("longitude", None)
    latitude = data.get("latitude", None)

    place = {
        "place_id": data["place_id"],
        "user_id": data["user_id"],
        "name": data["name"],
        "address": data["address"],
        "details": data.get("details", ""),
        "category": data.get("category", ""),
        "longitude": longitude, 
        "latitude": latitude,
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

from math import radians, cos, sin, sqrt, atan2

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371000  
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c   

def get_places_by_category_and_location_db(category, latitude, longitude, max_distance=5000):
    places = list(db["places"].find({"category": category}))  
    filtered_places = []

    for place in places:
        place_lat = float(place["latitude"])   
        place_lon = float(place["longitude"])  
        distance = haversine_distance(float(latitude), float(longitude), place_lat, place_lon)

        if distance <= max_distance:  
            place["distance"] = distance
            filtered_places.append(place)

    return sorted(filtered_places, key=lambda x: x["distance"])


def delete_place(user_id, place_id):
    result = db["places"].delete_one({"user_id": user_id, "_id": ObjectId(place_id)})
    return (True, "Place deleted successfully") if result.deleted_count > 0 else (False, "Place not found")

def rate_place(place_id, score):
    place = db["places"].find_one({"place_id": place_id})
    if not place:
        return False, "Place not found"

    if not (1 <= score <= 5):
        return False, "Score must be between 1 and 5"

    new_rating_count = place.get("rating_count", 0) + 1
    current_avg_rating = float(place.get("average_rating", 0))
    new_average_rating = ((current_avg_rating * place.get("rating_count", 0)) + score) / new_rating_count

    db["places"].update_one(
        {"place_id": place_id},
        {"$set": {"average_rating": new_average_rating, "rating_count": new_rating_count}}
    )
    return True, "Rating updated successfully"