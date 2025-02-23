# README for Geo Search App

## Geo Search App

### Overview
Geo Search App is a **location-based search platform** that allows users to find places such as restaurants, gas stations, and businesses within a selected area. The application consists of a **backend service built with Flask and MongoDB** and a **frontend developed in React**.

### Features
- ✅ **User Authentication** – Signup, login, and JWT-based session management
- ✅ **Place Search** – Uses **Google Places API** to fetch location data
- ✅ **Interactive Map** – Displays places visually
- ✅ **Favorites Management** – Users can save preferred locations
- ✅ **Search History** – Keeps track of past searches

### Project Structure
```
/GeoLogin
│── /backend               # Backend services (Flask, MongoDB)
│   ├── /controllers       # Business logic controllers
│   ├── /database          # Database connection setup
│   ├── /routes            # API route handlers
│   ├── /utils             # Helper functions (validators, security)
│   ├── app.py             # Main Flask application entry point
│   ├── requirements.txt   # Backend dependencies
│── /frontend              # Frontend application (React)
│   ├── package.json       # Frontend dependencies
│── .gitignore             # Ignore unnecessary files in Git
│── README.md              # Main project documentation
```

### Technologies Used
- **Backend:** Python, Flask, MongoDB, JWT Authentication, Google Places API  
- **Frontend:** React, Axios, CSS/Tailwind  

### Installation & Setup

#### 🔹 Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### 🔹 Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 🔑 Environment Variables
Create a `.env` file inside `/backend`:
```env
MONGO_URI=mongodb+srv://your_mongo_connection_string
SECRET_KEY=your_secret_key
GOOGLE_API_KEY=your_google_places_api_key
```

### 🚀 Deployment
- **Backend (Flask):** Can be deployed using Heroku, AWS, or any cloud provider. Ensure environment variables are properly set.
- **Frontend (React):** Can be deployed on Vercel, Netlify, or any static hosting service.

### 🔄 Git Commands to Pull & Run the Project
```bash
git clone https://github.com/AviNiazov7/GeoLogin.git
cd GeoLogin

# Running the backend
cd backend
pip install -r requirements.txt
python app.py

# Running the frontend
cd ../frontend
npm install
npm start
```

✅ **Now the project is ready to run! 🚀**

