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
MONGO_URI=mongodb://localhost:27017/GeoLoginDB  
SECRET_KEY=MySuperSecretKey123!  # JWT
GOOGLE_API_KEY=your_actual_google_api_key  # Google Places API
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

<img width="1337" alt="Screenshot 2025-03-05 at 15 30 29" src="https://github.com/user-attachments/assets/c35a40af-5a02-48ad-a97d-248ab9baff0f" />

<img width="1338" alt="Screenshot 2025-03-05 at 15 44 28" src="https://github.com/user-attachments/assets/8a729f35-244b-47ae-8de5-1dc9df04dd05" />

<img width="1336" alt="Screenshot 2025-03-05 at 15 44 30" src="https://github.com/user-attachments/assets/50de9481-cb35-4400-b1b1-151cfafc7a44" />

<img width="1336" alt="Screenshot 2025-03-05 at 15 44 37" src="https://github.com/user-attachments/assets/5bd9fc03-f0ac-4f81-9061-4f987aaf38bd" />

