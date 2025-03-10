# 🌍 Geo Search App - Backend  

## 🚀 Overview  
This is the backend service for the **Geo Search App**, built using **Flask** and **MongoDB**. It provides a RESTful API for **place searches, user authentication, favorites management, search history tracking, and a rating system for places**.  

## ✨ Features  
- 🔒 **User Authentication:** Secure registration, login, and session management using JWT.  
- 📌 **Place Management:** Users can add places, retrieve saved places, and delete places.  
- ⭐ **Favorites Management:** Users can save and remove favorite places.  
- ⭐ **Place Ratings:** Users can rate places and the system calculates an average rating for each place.  
- 🎢 **Search History Tracking:** Saves users' search history and allows them to retrieve it.  
- 🎢 **MongoDB as Database:** Stores user data, favorite places, place details, search history, and ratings.  

## 💂️ Folder Structure and File Explanations  
```bash  
/backend  
│➖ /controllers        # Manages API endpoints and request handling  
│   ├️ auth_controller.py    # Handles user authentication requests  
│   ├️ places_controller.py  # Manages place search operations  
│   ├️ search_controller.py  # Handles search history operations  
│   └️ __init__.py            # Initializes the controllers module  
│  
│➖ /database           # Database connection and setup  
│   ├️ db_connection.py   # Establishes connection with MongoDB  
│   ├️ places_db.py       # Handles place-related database operations  
│   ├️ search_db.py       # Handles search history operations  
│   ├️ auth_db.py         # Handles authentication-related database operations  
│   └️ __init__.py        # Initializes the database module  
│  
│➖ /routes             # Flask routes for defining API endpoints  
│   ├️ auth_routes.py  # Defines authentication-related routes  
│   ├️ places_routes.py # Defines place search-related routes  
│   ├️ search_routes.py  # Defines search history routes  
│   └️ __init__.py      # Initializes the routes module  
│  
│➖ /utils              # Utility functions (authentication, validation, etc.)  
│   ├️ auth_middleware.py # Middleware for JWT authentication  
│   ├️ validators.py    # Validation helper functions  
│   └️ __init__.py     # Initializes the utils module  
│  
│➖ .env                # Environment variables (API keys, database connection)  
│➖ .gitignore          # Ignores unnecessary files in Git  
│➖ requirements.txt    # List of required Python dependencies  
│➖ app.py              # Main Flask application entry point  
│➖ README.md           # Backend documentation  
```

## 🛠️ Installation  
1. Install dependencies:  
   ```sh  
   pip install -r requirements.txt  
   ```  
2. Set up the environment variables (`.env`).  
3. Start the Flask server:  
   ```sh  
   python app.py  
   ```  

## 🌐 API Endpoints  

### 👤 User Endpoints  
| Method | Endpoint              | Description         |  
|--------|-----------------------|---------------------|  
| POST   | `/auth/signup`        | User signup        |  
| POST   | `/auth/login`         | User login         |  
| POST   | `/auth/logout`        | User logout        |  
| DELETE | `/auth/delete`        | Delete user        |  

### 📌 Places Endpoints  
| Method  | Endpoint              | Description           |  
|---------|-----------------------|-----------------------|  
| POST    | `/places/save`        | Save a new place     |  
| GET     | `/places/get`         | Get user places      |  
| DELETE  | `/places/delete`      | Delete a saved place |  

### ⭐ Favorites Endpoints  
| Method  | Endpoint                  | Description                 |  
|---------|---------------------------|-----------------------------|  
| POST    | `/favorites/add`           | Add place to favorites      |  
| GET     | `/favorites/get`           | Get user favorite places    |  
| DELETE  | `/favorites/remove`        | Remove place from favorites |  

### ✨ Ratings Endpoints  
| Method  | Endpoint                  | Description                 |  
|---------|---------------------------|-----------------------------|  
| POST    | `/places/rate`            | Rate a place                |  
| GET     | `/places/get`              | Get places with average rating |  

### 📂 Search History Endpoints  
| Method  | Endpoint                  | Description                 |  
|---------|---------------------------|-----------------------------|  
| POST    | `/search/save`            | Save user search query      |  
| GET     | `/search/get`             | Get user search history     |  

## 🔑 Environment Variables  
The backend requires an `.env` file for **API keys** and **database configuration**.  
Example `.env` file:  
```sh  
MONGO_URI=mongodb+srv://your_mongo_connection_string  
SECRET_KEY=your_secret_key  
```  

## 🚀 Deployment  
For production deployment:  
1. Configure `gunicorn` for WSGI-based server hosting.  
2. Use **Gunicorn** for running Flask in production:  
   ```sh  
   gunicorn -w 4 app:app  
   ```  
3. Deploy the frontend separately on **Netlify, Vercel, or any static hosting provider**.  

## 📊 Search History System  
- Every search made by a user is stored in the database.  
- Users can retrieve their latest searches.  
- The system keeps up to **10 recent searches** per user.  

## ✅ Final Notes  
This **README** provides a clear breakdown of the backend’s **folder structure**, **required files**, and **setup instructions**, including the **new features for rating and search history**, to help any developer quickly understand and start working on the project. 🚀
