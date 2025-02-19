from database.db_connection import db
from werkzeug.security import generate_password_hash
from bson.objectid import ObjectId

def create_user(data):
    try:
        if db["users"].find_one({"$or": [{"email": data["email"]}, {"username": data["username"]}]}):
            return False, "User already exists"

        user = {
            "username": data["username"],
            "email": data["email"],
            "password": generate_password_hash(data["password"])
        }

        result = db["users"].insert_one(user)
        return True, str(result.inserted_id)   
    except Exception as e:
        return False, str(e)