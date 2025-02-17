README for the Main Project (README.md)

# Geo Search App  

## Overview  
Geo Search App is a **location-based search platform** that allows users to find places such as restaurants, gas stations, and businesses within a selected area. The application consists of a **backend service built with Flask and MongoDB** and a **frontend developed in React**.  

## Features  
- **User Authentication:** Secure registration, login, and session management using JWT.  
- **Place Search:** Fetches location data from **Google Places API** and displays results based on user queries.  
- **Interactive Map:** Users can see places plotted on a map.  
- **Favorites Management:** Users can save preferred locations.  
- **Search History:** Keeps track of previous searches for convenience.  

## Project Structure  
```bash
/geo-search-app
│── /backend               # Backend services
│── /frontend              # Frontend application
│── .gitignore             # Ignore unnecessary files in Git
│── README.md              # Main project documentation

Technologies Used
• Backend: Python, Flask, MongoDB, JWT Authentication, Google Places API
• Frontend: React, Axios, CSS/Tailwind

Installation & Setup

Backend
1. Navigate to the backend folder:
cd backend

2. Install dependencies:
pip install -r requirements.txt

3. Run the Flask application:
python run.py


Frontend
1. Navigate to the frontend folder:
cd frontend

2. Install dependencies:
npm install

3. Start the frontend development server:
npm start

Environment Variables

Both backend and frontend require a .env file for API keys and database configurations.
Example for backend (/backend/.env):

MONGO_URI=mongodb+srv://your_mongo_connection_string
SECRET_KEY=your_secret_key
GOOGLE_API_KEY=your_google_places_api_key

Deployment
For production, ensure you set the correct environment variables and configure WSGI for Flask. The frontend can be deployed on Vercel, Netlify, or any static hosting service.
