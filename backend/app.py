# backend/app.py
import os
from flask import Flask, request, jsonify
from pyjwt import JWT
from pyjwt.exceptions import PyJWTError
from functools import wraps
from datetime import datetime, timedelta
from dotenv import load_dotenv # Import the dotenv library

# --- Load Environment Variables ---
# This line loads the variables from your .env file into the environment
load_dotenv()

from hair_attributes import hair_detector
from database import create_user, find_user_by_username, check_user_password, save_analysis

# --- App Initialization ---
app = Flask(__name__)

# --- JWT Configuration ---
# The JWT secret key is now fetched from the loaded .env file.
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
if not JWT_SECRET_KEY:
    raise Exception("The JWT_SECRET_KEY is not set in your .env file.")

jwt = JWT()

# --- Authentication Decorator ---
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({'message': 'Authentication token is missing!'}), 401

        try:
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
            current_user = find_user_by_username(data['username'])
            if not current_user:
                 return jsonify({'message': 'Token is invalid!'}), 401
        except PyJWTError as e:
            return jsonify({'message': f'Token is invalid: {str(e)}'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

# --- User Endpoints ---
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if find_user_by_username(username):
        return jsonify({"error": "Username already exists"}), 409

    create_user(username, password)
    return jsonify({"message": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = find_user_by_username(username)
    if not user or not check_user_password(user, password):
        return jsonify({"error": "Invalid username or password"}), 401

    token = jwt.encode(
        {
            'username': user['username'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        },
        JWT_SECRET_KEY,
        alg='HS256'
    )
    return jsonify({'token': token})

# --- Analysis Endpoint (Protected) ---
@app.route('/analyze_hair', methods=['POST'])
@token_required
def analyze_hair(current_user):
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    try:
        image_bytes = file.read()
        attributes = hair_detector.analyze_image(image_bytes)
        
        if "error" in attributes:
            return jsonify(attributes), 500

        import hashlib
        image_id = hashlib.md5(image_bytes).hexdigest()
        save_analysis(user_id=current_user['_id'], image_id=image_id, results=attributes)

        print(f"Analysis for user '{current_user['username']}' successful.")
        return jsonify(attributes)

    except Exception as e:
        return jsonify({"error": f"An unexpected server error occurred: {str(e)}"}), 500

# --- Main Entry Point ---
if __name__ == '__main__':
    # When running locally, Flask's development server is convenient.
    app.run(host='0.0.0.0', port=5000, debug=True)
