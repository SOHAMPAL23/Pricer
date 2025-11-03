"""
Flask API for Simple Market Pricers with MongoDB integration
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import os
import sys
import jwt
import datetime as dt

# Add the current directory to Python path to import pricers
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from pricers import price_option, price_bond, price_swap

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-this-in-production'
CORS(app)  # Enable CORS for all routes

# MongoDB connection
try:
    # Connect to MongoDB (default local connection)
    client = MongoClient('mongodb://localhost:27017/')
    db = client['simple_pricers']
    calculations_collection = db['calculations']
    users_collection = db['users']
    app.logger.info("Connected to MongoDB successfully")
except Exception as e:
    app.logger.error(f"Failed to connect to MongoDB: {e}")
    # Fallback to in-memory storage if MongoDB is not available
    calculations_collection = None
    users_collection = None

def save_calculation(calculation_type, parameters, results):
    """Save calculation to MongoDB"""
    if calculations_collection is None:
        return None
    
    try:
        calculation_data = {
            "type": calculation_type,
            "parameters": parameters,
            "results": results,
            "timestamp": datetime.utcnow()
        }
        result = calculations_collection.insert_one(calculation_data)
        return str(result.inserted_id)
    except Exception as e:
        app.logger.error(f"Failed to save calculation: {e}")
        return None

def get_recent_calculations(limit=10):
    """Get recent calculations from MongoDB"""
    if calculations_collection is None:
        return []
    
    try:
        calculations = calculations_collection.find().sort("timestamp", -1).limit(limit)
        return [
            {
                "id": str(calc["_id"]),
                "type": calc["type"],
                "parameters": calc["parameters"],
                "results": calc["results"],
                "timestamp": calc["timestamp"]
            }
            for calc in calculations
        ]
    except Exception as e:
        app.logger.error(f"Failed to retrieve calculations: {e}")
        return []

# Authentication routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        # Validate input
        if not username or not email or not password:
            return jsonify({"error": "Username, email, and password are required"}), 400
        
        # Check if user already exists
        if users_collection.find_one({"$or": [{"username": username}, {"email": email}]}):
            return jsonify({"error": "Username or email already exists"}), 400
        
        # Hash password
        hashed_password = generate_password_hash(password)
        
        # Create user
        user_data = {
            "username": username,
            "email": email,
            "password": hashed_password,
            "created_at": datetime.utcnow()
        }
        
        result = users_collection.insert_one(user_data)
        
        # Generate token
        token = jwt.encode({
            'user_id': str(result.inserted_id),
            'exp': dt.datetime.utcnow() + dt.timedelta(days=30)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            "message": "User registered successfully",
            "token": token,
            "user": {
                "id": str(result.inserted_id),
                "username": username,
                "email": email
            }
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        # Validate input
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        # Find user
        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Check password
        if not check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Generate token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': dt.datetime.utcnow() + dt.timedelta(days=30)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": str(user['_id']),
                "username": user['username'],
                "email": user['email']
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/price-option', methods=['POST'])
def api_price_option():
    try:
        data = request.get_json()
        
        # Extract parameters
        option_type = data.get('type', 'call')
        S = float(data.get('S', 100))
        K = float(data.get('K', 100))
        T = float(data.get('T', 0.25))
        r = float(data.get('r', 0.05))
        sigma = float(data.get('sigma', 0.20))
        
        # Validate parameters
        if S <= 0 or K <= 0 or T <= 0 or sigma <= 0:
            return jsonify({"error": "All numeric parameters must be positive"}), 400
        
        # Price the option
        results = price_option(option_type, S, K, T, r, sigma)
        
        # Save to database
        parameters = {
            "type": option_type,
            "S": S,
            "K": K,
            "T": T,
            "r": r,
            "sigma": sigma
        }
        calculation_id = save_calculation("option", parameters, results)
        
        return jsonify({
            "id": calculation_id,
            "results": results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/price-bond', methods=['POST'])
def api_price_bond():
    try:
        data = request.get_json()
        
        # Extract parameters
        face_value = float(data.get('faceValue', 1000))
        coupon_rate = float(data.get('couponRate', 0.05))
        years_to_maturity = float(data.get('yearsToMaturity', 5))
        yield_rate = float(data.get('yieldRate', 0.04))
        payments_per_year = int(data.get('paymentsPerYear', 2))
        
        # Validate parameters
        if face_value <= 0 or years_to_maturity <= 0 or payments_per_year <= 0:
            return jsonify({"error": "Face value, years to maturity, and payments per year must be positive"}), 400
        
        # Price the bond
        results = price_bond(face_value, coupon_rate, years_to_maturity, yield_rate, payments_per_year)
        
        # Save to database
        parameters = {
            "faceValue": face_value,
            "couponRate": coupon_rate,
            "yearsToMaturity": years_to_maturity,
            "yieldRate": yield_rate,
            "paymentsPerYear": payments_per_year
        }
        calculation_id = save_calculation("bond", parameters, results)
        
        return jsonify({
            "id": calculation_id,
            "results": results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/price-swap', methods=['POST'])
def api_price_swap():
    try:
        data = request.get_json()
        
        # Extract parameters
        notional = float(data.get('notional', 1000000))
        fixed_rate = float(data.get('fixedRate', 0.05))
        floating_rate = float(data.get('floatingRate', 0.04))
        years_to_maturity = float(data.get('yearsToMaturity', 2))
        payments_per_year = int(data.get('paymentsPerYear', 2))
        
        # Validate parameters
        if notional <= 0 or years_to_maturity <= 0 or payments_per_year <= 0:
            return jsonify({"error": "Notional, years to maturity, and payments per year must be positive"}), 400
        
        # Price the swap
        results = price_swap(notional, fixed_rate, floating_rate, years_to_maturity, payments_per_year)
        
        # Save to database
        parameters = {
            "notional": notional,
            "fixedRate": fixed_rate,
            "floatingRate": floating_rate,
            "yearsToMaturity": years_to_maturity,
            "paymentsPerYear": payments_per_year
        }
        calculation_id = save_calculation("swap", parameters, results)
        
        return jsonify({
            "id": calculation_id,
            "results": results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/calculations', methods=['GET'])
def api_get_calculations():
    try:
        limit = int(request.args.get('limit', 10))
        calculations = get_recent_calculations(limit)
        return jsonify({"calculations": calculations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "mongodb_connected": calculations_collection is not None
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)