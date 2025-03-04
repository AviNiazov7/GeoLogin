import jwt
from flask import request, jsonify, current_app
from functools import wraps
from backend.database.db_connection import db
from bson.objectid import ObjectId

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "Token is missing"}), 401
        
        try:
            if "Bearer " in token:
                token = token.split(" ")[1]

            decoded_data = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            user_id = decoded_data.get("user_id")

            user = db["users"].find_one({"_id": ObjectId(user_id)})
            if not user:
                return jsonify({"error": "Invalid token"}), 401

            return f(user_id, *args, **kwargs)

        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

    return decorated