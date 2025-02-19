from backend.database.db_setup import create_user
from backend.utils.validators import validate_signup_data  

class AuthController:
    @staticmethod
    def signup(data):
        valid, error_message = validate_signup_data(data)
        if not valid:
            return False, error_message

        return create_user(data)