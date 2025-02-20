import os
from flask import Flask
from dotenv import load_dotenv
from backend.routes.auth_routes import users_blueprint  

load_dotenv()
app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.register_blueprint(users_blueprint, url_prefix="/auth")

if __name__ == "__main__":
    app.run(debug=True, port=5001)
