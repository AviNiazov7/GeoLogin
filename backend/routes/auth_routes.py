from flask import Blueprint, jsonify, request
from backend.controllers.auth_controller import AuthController

users_blueprint = Blueprint("users", __name__)

@users_blueprint.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if not data or "username" not in data or "email" not in data or "password" not in data:
        return jsonify({"error": "Invalid input"}), 400

    success, message = AuthController.signup(data)
    if success:
        return jsonify({"message": "User created successfully"}), 201
    else:
        return jsonify({"error": message}), 400