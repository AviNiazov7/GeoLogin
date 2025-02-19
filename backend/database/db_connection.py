from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/") 
db = client["GeoLoginDB"]   
userCollection = db["users"]
placesCollection = db["places"]
