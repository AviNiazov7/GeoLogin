from backend.database.db_setup import create_user, find_user_by_email
from backend.utils.validators import validate_signup_data, validate_login_data
from werkzeug.security import check_password_hash
import jwt
import datetime
from flask import current_app

class AuthController:
    @staticmethod       
    def signup(data):
        valid, error_message = validate_signup_data(data)
        if not valid:
            return False, error_message

        return create_user(data)

    @staticmethod
    def login(data):
        valid, error_message = validate_login_data(data)
        if not valid:
            return False, error_message

        user = find_user_by_email(data["email"])
        if not user or not check_password_hash(user["password"], data["password"]):
            return False, "Invalid email or password"

        
        token = jwt.encode({
            "user_id": str(user["_id"]),
            "exp": datetime.utcnow() + datetime.timedelta(hours=1)
        }, current_app.config["SECRET_KEY"], algorithm="HS256")
        print("token", token)

        return True, token