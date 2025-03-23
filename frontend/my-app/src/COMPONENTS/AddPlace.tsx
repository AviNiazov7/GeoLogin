import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { SingleValue } from "react-select";
import "./AddPlace.css"; 

Modal.setAppElement("#root"); 

interface Option {
  label: string;
  value: any;
}

interface AddPlaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPlace: React.FC<AddPlaceProps> = ({ isOpen, onClose }) => {
  const [place, setPlace] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [name2, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("lodging");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("⚠️ אין הרשאה, יש להתחבר תחילה.");
      return;
    }
  
    if (!place.trim()) {
      alert("⚠️ יש להזין מיקום");
      return;
    }
  
    try {
      // 🔹 שליפת קואורדינטות מהמיקום שהוזן
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: place,
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // ודא שיש לך מפתח API
          },
        }
      );
  
      if (!geocodeResponse.data.results.length) {
        alert("⚠️ לא נמצאו קואורדינטות עבור המיקום שהוזן.");
        return;
      }
  
      const location = geocodeResponse.data.results[0].geometry.location;
      console.log("📌 קואורדינטות שנמצאו:", location);
  
      const placeData = {
        name: name2,
        details,
        category,
        address: place,
        latitude: location.lat,  // ✅ מוסיף קואורדינטות
        longitude: location.lng, // ✅ מוסיף קואורדינטות
      };
  
      console.log("📌 נתונים שנשלחים לשרת:", placeData);
  
      await axios.post(`${API_URL}/places/save`, placeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      alert("✅ המקום נוסף בהצלחה!");
      setPlace("");
      setDetails("");
      setName("");
      setCategory("");
      onClose();
    } catch (error) {
      console.error("🚨 שגיאה בשליחת הנתונים:", error);
  
      if (axios.isAxiosError(error) && error.response) {
        console.error("🔴 תגובת השרת:", error.response.data);
        alert(` שגיאה: ${error.response.data.message || " על מנת להשתמש בשירותי המערכת עליך להתחבר "}`);
      } else {
        alert("❌ שגיאת חיבור, נסה שוב מאוחר יותר.");
      }
    }
  };
  
  
  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal" overlayClassName="overlay">
      <button className="close-btn" onClick={onClose}>✖</button>

      <h2>הוספת מקום חדש</h2>
      <br />
      <form onSubmit={handleSubmit}>
        <label> הכנס מיקום</label>
        <GooglePlacesAutocomplete
          apiKey="AIzaSyCad6leGCz2HAUd-aHYoNNSbxoSC2h16wc"
          selectProps={{
            placeholder: "הכנס מיקום...",
            onChange: (value: SingleValue<Option>) => {
              if (value) {
                setPlace(value.label); 
              }
            },
          }}
        />
        <br />
        
        <label>שם המקום</label>
        <input 
          value={name2} 
          type="text" 
          onChange={(e) => setName(e.target.value)} 
        />

        <label> פרטים נוספים:</label>
        <textarea 
          value={details} 
          onChange={(e) => setDetails(e.target.value)} 
          placeholder="תיאור המקום..."
        />

        <label> קטגוריה:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="lodging">🏨 מלונות</option>
          <option value="restaurant">🍽️ מסעדות</option>
          <option value="gas_station">⛽ תחנות דלק</option>
          <option value="store">🏢 עסקים</option>
        </select>

        <div>
          <button type="submit">הוספה</button>
          {/* <button onClick={onClose} className="cancel"> ביטול</button> */}
        </div>
      </form>
    </Modal>
  );
};

export default AddPlace;
