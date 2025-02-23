📌 README for Geo Search App

🌍 Geo Search App

🚀 Overview
Geo Search App is a location-based search platform that helps users find places like restaurants, gas stations, and businesses in a selected area.
It includes a backend (Flask, MongoDB) and a frontend (React).

🔥 Features
✅ User Authentication – Signup, login, JWT-based session management
✅ Place Search – Uses Google Places API to fetch location data
✅ Interactive Map – Displays places visually
✅ Favorites Management – Save preferred locations
✅ Search History – Keeps track of past searches

📂 Project Structure

/GeoLogin
│── /backend            # Backend services (Flask, MongoDB)
│   ├── /controllers    # Handles business logic
│   ├── /database       # Database connection setup
│   ├── /routes         # API endpoints
│   ├── /utils          # Helpers (validators, security)
│   ├── app.py          # Flask app entry point
│   ├── requirements.txt # Backend dependencies
│── /frontend           # React frontend
│   ├── package.json    # Frontend dependencies
│── .gitignore          # Ignore unnecessary files  
│── README.md           # Project documentation

🛠 Technologies Used
	•	Backend: Python, Flask, MongoDB, JWT, Google Places API
	•	Frontend: React, Axios, CSS/Tailwind

⚙️ Installation & Setup

🔹 Backend

cd backend
pip install -r requirements.txt
python app.py

🔹 Frontend

cd frontend
npm install
npm start

🔑 Environment Variables
Create a .env file inside /backend with:

MONGO_URI=mongodb+srv://your_mongo_connection_string
SECRET_KEY=your_secret_key
GOOGLE_API_KEY=your_google_places_api_key

🚀 Deployment
	•	Backend (Flask): Deploy on Heroku, AWS, or any cloud provider
	•	Frontend (React): Deploy using Vercel, Netlify, or similar

🔄 Git Commands to Pull & Run the Project

git clone https://github.com/AviNiazov7/GeoLogin.git
cd GeoLogin

# Setup backend
cd backend
pip install -r requirements.txt
python app.py

# Setup frontend
cd ../frontend
npm install
npm start

✅ Project is ready to run! 🚀
