from flask import Blueprint, jsonify, request
from backend.controllers.auth_controller import AuthController

users_blueprint = Blueprint("users", __name__)

@users_blueprint.route("/signup", methods=["POST"])
def signup():
    data = request.json
    if not data or "username" not in data or "email" not in data or "password" not in data:
        return jsonify({"error": "Invalid input"}), 400

    success, message = AuthController.signup(data)
    if success:
        print("User signed up successfully", "\nUser ID: " + str(message))
        return jsonify({"message": "User created successfully"}), 201
    else:
        return jsonify({"error": message}), 400
    
@users_blueprint.route("/login", methods=["POST"])
def login():
    data = request.json
    success, token = AuthController.login(data)

    if success:
        return jsonify({"token": token}), 200
    else:
        return jsonify({"error": token}), 401