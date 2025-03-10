from flask import Blueprint, jsonify, request
from backend.controllers.search_controller import SearchController
from backend.utils.auth_middleware import token_required

search_blueprint = Blueprint("search", __name__)

# 🔍 Saves a search query for the user
@search_blueprint.route("/save", methods=["POST"])
@token_required
def save_search(user_id):
    data = request.json
    if "query" not in data or not data["query"]:
        return jsonify({"error": "Query is required"}), 400

    success, message = SearchController.save_search(user_id, data["query"])

    if success:
        return jsonify({"message": message}), 201
    else:
        return jsonify({"error": message}), 400

# 🔍 Fetches the search history of the user
@search_blueprint.route("/get", methods=["GET"])
@token_required
def get_search_history(user_id):
    search_history = SearchController.get_search_history(user_id)
    return jsonify({"search_history": search_history}), 200