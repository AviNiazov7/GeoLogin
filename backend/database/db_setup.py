from backend.database.db_connection import db
from werkzeug.security import generate_password_hash
from bson.objectid import ObjectId

def create_user(data):
    if db["users"].find_one({"email": data["email"]}):
        return False, "User with this email already exists"

    user = {
        "username": data["username"],
        "email": data["email"],
        "password": generate_password_hash(data["password"])
    }

    result = db["users"].insert_one(user)
    return True, str(result.inserted_id)

def find_user_by_email(email):
    return db["users"].find_one({"email": email})