from backend.database.db_connection import db
from backend.database.search_db import save_search, get_search_history


class SearchController:
    @staticmethod
    def save_search(user_id, query):
        return save_search(user_id, query)

    @staticmethod
    def get_search_history(user_id):
        return get_search_history(user_id)