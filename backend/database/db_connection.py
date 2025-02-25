from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["GeoLoginDB"]
userCollection = db["users"]
placesCollection = db["places"]