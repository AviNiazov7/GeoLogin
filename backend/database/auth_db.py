from backend.database.db_connection import db
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

def create_user(data):
    if db["users"].find_one({"username": data["username"]}):
        return False, "Username already exists"

    if db["users"].find_one({"email": data["email"]}):
        return False, "Email already exists"

    user = {
        "username": data["username"],
        "email": data["email"],
        "password": generate_password_hash(data["password"])
    }

    result = db["users"].insert_one(user)
    return True, str(result.inserted_id)

def find_user_by_username(username):
    return db["users"].find_one({"username": username})

def find_user_by_email(email):
    return db["users"].find_one({"email": email})

def find_user_by_id(user_id):
    return db["users"].find_one({"_id": ObjectId(user_id)})

def update_user(user_id, update_data):
    db["users"].update_one({"_id": ObjectId(user_id)}, {"$set": update_data})

def delete_user(user_id):
    db["users"].delete_one({"_id": ObjectId(user_id)})

def delete_user_by_username(username):
    result = db["users"].delete_one({"username": username})
    return result.deleted_count > 0

def delete_user_by_email(email):
    result = db["users"].delete_one({"email": email})
    return result.deleted_count > 0

def add_place_to_favorites(user_id, place_id):
    result = db["users"].update_one(
        {"_id": ObjectId(user_id)},
        {"$addToSet": {"favorite_places": place_id}}
    )
    return result.modified_count > 0

def get_favorite_places(user_id):
    user = db["users"].find_one({"_id": ObjectId(user_id)}, {"favorite_places": 1})
    if user and "favorite_places" in user:
        return user["favorite_places"]
    return []

def remove_place_from_favorites(user_id, place_id):
    result = db["users"].update_one(
        {"_id": ObjectId(user_id)},
        {"$pull": {"favorite_places": place_id}}
    )
    return result.modified_count > 0