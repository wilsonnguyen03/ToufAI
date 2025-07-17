# backend/database.py
import os
from datetime import datetime  # <-- This line was missing
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

# --- MongoDB Connection ---
MONGO_URI = os.environ.get("MONGO_URI")
if not MONGO_URI:
    raise Exception("The MONGO_URI environment variable is not set. Please provide the MongoDB connection string.")

client = MongoClient(MONGO_URI)
db = client.get_database("ToufAI")

# --- Collections ---
users_collection = db.get_collection("users")
analysis_collection = db.get_collection("analyses")

# --- User Management Functions ---
def create_user(username, password):
    """Creates a new user in the database with a hashed password."""
    hashed_password = generate_password_hash(password)
    user_data = {
        "username": username,
        "password": hashed_password
    }
    return users_collection.insert_one(user_data)

def find_user_by_username(username):
    """Finds a user by their username."""
    return users_collection.find_one({"username": username})

def check_user_password(user, password):
    """Checks if the provided password matches the user's hashed password."""
    return check_password_hash(user['password'], password)

# --- Analysis Management Functions ---
def save_analysis(user_id, image_id, results):
    """Saves a hair analysis result to the database, linked to a user."""
    analysis_data = {
        "user_id": ObjectId(user_id),
        "image_id": image_id,
        "results": results,
        "created_at": datetime.utcnow()  # This will now work correctly
    }
    return analysis_collection.insert_one(analysis_data)
