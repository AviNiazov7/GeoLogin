import os
from flask import Flask
from dotenv import load_dotenv
from backend.routes.auth_routes import users_blueprint  # ← ייבוא ה-Blueprint

# טוען משתני סביבה מקובץ .env
load_dotenv()

app = Flask(__name__)

# הגדרת SECRET_KEY מתוך משתני סביבה
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

# רישום ה-Blueprint
app.register_blueprint(users_blueprint, url_prefix="/auth")

if __name__ == "__main__":
    app.run(debug=True, port=5001)