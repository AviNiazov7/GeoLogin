from datetime import datetime, timedelta
import jwt
from flask import current_app
from backend.database.db_setup import create_user, find_user_by_email, delete_user_by_email
from backend.utils.validators import validate_signup_data, validate_login_data
from werkzeug.security import check_password_hash

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

        exp_time = datetime.utcnow() + timedelta(hours=1)
        token = jwt.encode({
            "user_id": str(user["_id"]),
            "exp": exp_time
        }, current_app.config["SECRET_KEY"], algorithm="HS256")
        return True, token

    @staticmethod
    def logout():
        """ Logout is usually handled in frontend by removing the token, 
        but we can also blacklist tokens in DB if needed."""
        return True, "User logged out successfully"

    @staticmethod
    def delete_user(email):
        success = delete_user_by_email(email)
        if success:
            return True, "User deleted successfully"
        else:
            return False, "User not found"