import re

def validate_signup_data(data):
    required_fields = ["username", "email", "password"]
    
    for field in required_fields:
        if field not in data or not data[field].strip():
            return False, f"Missing or empty field: {field}"

    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not re.match(email_regex, data["email"]):
        return False, "Invalid email address"

    if len(data["password"]) < 8:
        return False, "Password must be at least 8 characters long"

    if " " in data["password"]:
        return False, "Password cannot contain spaces"

    password_regex = r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
    if not re.match(password_regex, data["password"]):
        return False, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."

    return True, None