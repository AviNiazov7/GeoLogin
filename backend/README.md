# 🌍 Geo Search App - Backend  

## 🚀 Overview  
This is the backend service for the **Geo Search App**, built using **Flask** and **MongoDB**. It provides a RESTful API for **place searches, user authentication, favorites management, and search history tracking**.  

## ✨ Features  
- 🔐 **User Authentication:** Secure registration, login, and session management using JWT.  
- 📌 **Place Management:** Users can add places, retrieve saved places, and delete places.  
- ⭐ **Favorites Management:** Users can save and remove favorite places.  
- 🛄 **MongoDB as Database:** Stores user data, favorite places, and place details.  

## 📂 Folder Structure and File Explanations  
```bash  
/backend  
│️— /controllers        # Manages API endpoints and request handling  
│   ├️ auth_controller.py    # Handles user authentication requests  
│   ├️ places_controller.py  # Manages place search operations  
│   ├️ favorites_controller.py  # Handles favorite places operations  
│   ├️ users_controller.py   # Handles user profile operations  
│   └️ __init__.py            # Initializes the controllers module  
│  
│️— /database           # Database connection and setup  
│   ├️ db_connection.py   # Establishes connection with MongoDB  
│   ├️ places_db.py       # Handles place-related database operations  
│   ├️ favorites_db.py    # Handles favorite places database operations  
│   ├️ auth_db.py         # Handles authentication-related database operations  
│   └️ __init__.py        # Initializes the database module  
│  
│️— /routes             # Flask routes for defining API endpoints  
│   ├️ auth_routes.py  # Defines authentication-related routes  
│   ├️ places_routes.py # Defines place search-related routes  
│   ├️ favorites_routes.py # Defines favorite places routes  
│   └️ __init__.py      # Initializes the routes module  
│  
│️— /utils              # Utility functions (authentication, validation, etc.)  
│   ├️ auth_middleware.py # Middleware for JWT authentication  
│   ├️ validators.py    # Validation helper functions  
│   └️ __init__.py     # Initializes the utils module  
│  
│️— .env                # Environment variables (API keys, database connection)  
│️— .gitignore          # Ignores unnecessary files in Git  
│️— requirements.txt    # List of required Python dependencies  
│️— app.py              # Main Flask application entry point  
│️— README.md           # Backend documentation  
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

<table>  
  <tr>  
    <th>👤 User Endpoints</th>  
    <th>📌 Places Endpoints</th>  
    <th>⭐ Favorites Endpoints</th>  
  </tr>  
  <tr>  
    <td>  

| Method | Endpoint              | Description         |  
|--------|-----------------------|---------------------|  
| POST   | `/auth/signup`        | User signup        |  
| POST   | `/auth/login`         | User login         |  
| POST   | `/auth/logout`        | User logout        |  
| DELETE | `/auth/delete`        | Delete user        |  

  </td>  
  <td>  

| Method  | Endpoint              | Description           |  
|---------|-----------------------|-----------------------|  
| POST    | `/places/save`        | Save a new place     |  
| GET     | `/places/get`         | Get user places      |  
| DELETE  | `/places/delete`      | Delete a saved place |  

  </td>  
  <td>  

| Method  | Endpoint                  | Description                 |  
|---------|---------------------------|-----------------------------|  
| POST    | `/favorites/add`           | Add place to favorites      |  
| GET     | `/favorites/get`           | Get user favorite places    |  
| DELETE  | `/favorites/remove`        | Remove place from favorites |  

  </td>  
  </tr>  
</table>  

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

## ✅ Final Notes  
This **README** provides a clear breakdown of the backend’s **folder structure**, **required files**, and **setup instructions**, including the **new features for favorites management**, to help any developer quickly understand and start working on the project. 🚀

