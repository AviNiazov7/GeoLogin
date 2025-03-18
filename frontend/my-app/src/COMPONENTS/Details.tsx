import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Details.css";
import Modal from "react-modal";

interface Place {
  id: number;
  name: string;
  address: string;
  details?: string;
  category: string;
}

interface DetailsProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = process.env.REACT_APP_API_URL;

const Details: React.FC<DetailsProps> = ({ isOpen, onClose }) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!API_URL) throw new Error("❌ API_URL לא מוגדר!");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("❌ אין טוקן! המשתמש לא מחובר.");

      const response = await axios.get(`${API_URL}/places/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📌 מקומות מהשרת:", response.data);
      setPlaces(response.data.saved_places || []);
    } catch (err) {
      setError("אנא התחבר תחילה");
      console.error("❌ שגיאה:", err);
    } finally {
      setLoading(false);
    }
  };

  // שליפת הנתונים כשהמודאל נפתח 
  useEffect(() => {
    if (isOpen) fetchPlaces();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal2" overlayClassName="overlay2">
      <div >
        <h2 >רשימת מקומות</h2>
       
      </div>

      {loading && <p>טוען נתונים...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div>
        {places.map((place) => (
          <div key={place.id} >
           <div className="onedeatail">
            <div><strong>שם המקום:</strong>{place.name}</div>
            <p><strong>כתובת:</strong> {place.address}</p>
            <p><strong>קטגוריה:</strong> {place.category}</p>
            {place.details && <p><strong>תיאור:</strong> {place.details}</p>}
            <button>הסר</button>
           </div>
            
          </div>
        ))}
      </div>
        <button onClick={fetchPlaces} disabled={loading}>רענן</button>
        <button onClick={onClose}>סגור</button>

    </Modal>
  );
};

export default Details;
