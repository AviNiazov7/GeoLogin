# Geo Search App - Backend  

## Overview  
This is the backend service for the **Geo Search App**, built using **Flask** and **MongoDB**. It provides a RESTful API for **place searches, user authentication, and search history management**.  

## Features  
- **User Authentication:** Secure registration, login, and session management using JWT.  
- **Place Search:** Fetches data from **Google Places API** and returns relevant places based on user queries.  
- **Favorites & Search History:** Users can save places and view past searches.  
- **MongoDB as Database:** Stores user data, search history, and place details.  

## Folder Structure and File Explanations  
```bash
/backend
│── /controllers        # Manages API endpoints and request handling
│   ├── auth_controller.py    # Handles user authentication requests
│   ├── places_controller.py  # Manages place search operations
│   ├── users_controller.py   # Handles user profile operations
│   ├── searches_controller.py # Manages user search history
│   ├── __init__.py            # Initializes the controllers module
│
│── /database           # Database connection and setup
│   ├── db_connection.py   # Establishes connection with MongoDB
│   ├── db_setup.py        # Initializes database collections
│   ├── places_db.py       # 
│   ├── __init__.py        # Initializes the database module
│
│── /routes             # Flask routes for defining API endpoints
│   ├── auth_routes.py  # Defines authentication-related routes
│   ├── places_routes.py # Defines place search-related routes
│   ├── users_routes.py  # Defines user-related routes
│   ├── searches_routes.py # Defines search history routes
│   ├── __init__.py      # Initializes the routes module
│
│── /utils              # Utility functions (logging, authentication, etc.)
│   ├── jwt_handler.py  # Manages JWT token encoding/decoding
│   ├── config.py       # Handles configuration settings
│   ├── __init__.py     # Initializes the utils module
│
│── .env                # Environment variables (API keys, database connection)
│── .gitignore          # Ignores unnecessary files in Git
│── requirements.txt    # List of required Python dependencies
│── run.py              # Main Flask application entry point
│── wsgi.py             # WSGI configuration for production
│── README.md           # Backend documentation
```

## Installation
1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
2. Set up the environment variables (`.env`).
3. Start the Flask server:
   ```sh
   python run.py
   ```

## API Endpoints
- **`POST /api/auth/signup`** - User signup 
- **`POST /api/auth/login`** - User login
- **`POST /api/auth/logout`** - User logout
- **`POST /api/auth/deete`** - User delete
nbsp;
- **`POST /api/places/save`** - saving a new place 
- **`GET /api/places/get`** - Get user places 
- **`DELETE /api/places/delete`** -  delete a saved place

## Environment Variables
The backend requires an `.env` file for **API keys** and **database configuration**.  
Example `.env` file:
```sh
MONGO_URI=mongodb+srv://your_mongo_connection_string
SECRET_KEY=your_secret_key
```

## Deployment
For production deployment:
1. Configure `wsgi.py` for WSGI-based server hosting.
2. Use **Gunicorn** for running Flask in production:
   ```sh
   gunicorn -w 4 wsgi:app
   ```
3. Deploy the frontend separately on **Netlify, Vercel, or any static hosting provider**.

## Final Notes
This **README** provides a clear breakdown of the backend’s **folder structure**, **required files**, and **setup instructions** to help any developer quickly understand and start working on the project. 🚀
