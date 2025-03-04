import React, { useState } from "react";
import GooglePlacesAutocomplete, { geocodeByPlaceId } from "react-google-places-autocomplete";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHotel, faUtensils, faGasPump, faStore } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import AddPlace from "./AddPlace";
import SignupDialog from "./SignupDialog";
import DialogLogin from "./DialogLogin";
import { useAuth } from "../Contexts/AuthContext";

// טיפוס נתוני מיקום
interface Location {
  lat: number;
  lng: number;
  label: string;
}

// מקבל API Key מקובץ .env כדי לשמור על אבטחה
const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth(); // ✅ בדיקה אם המשתמש מחובר

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isAddPlaceOpen, setAddPlaceOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);

  // אייקון מותאם אישית למפה
  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  // שינוי תצוגת המפה כשמשנים מיקום
  const ChangeMapView = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
  };

  // פתיחה וסגירה של דיאלוג הוספת מקום
  const handleOpenAddPlace = () => setAddPlaceOpen(true);
  const handleCloseAddPlace = () => setAddPlaceOpen(false);

  // בחירת מיקום מתוך ה-Autocomplete - חיפוש מותר רק אם המשתמש מחובר
  const handleLocationSelect = async (value: any) => {
    if (!isAuthenticated) {
      alert("⚠️ עליך להתחבר כדי לחפש במפה.");
      return;
    }

    if (!value || !value.value || !value.value.place_id) {
      console.error("Invalid location selected.");
      return;
    }

    try {
      const results = await geocodeByPlaceId(value.value.place_id);
      if (results[0] && results[0].geometry) {
        setSelectedLocation({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
          label: value.label,
        });
        setInputValue(value.label);
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  // שינוי ערך שדה החיפוש
  const handleInputChange = (newValue: string) => setInputValue(newValue);

  // עיצוב מותאם אישית ל-Autocomplete
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
      border: "2px solid #4CAF50",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "5px",
      fontSize: "16px",
      backgroundColor: "white",
      "&:hover": { borderColor: "#388E3C" },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      backgroundColor: "white",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#4CAF50" : "#fff",
      color: state.isFocused ? "white" : "black",
      padding: "10px",
      cursor: "pointer",
      transition: "background-color 0.2s ease-in-out",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#333",
      fontWeight: "bold",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#999",
      fontStyle: "italic",
    }),
  };

  return (
    <div>
      <nav className="navbar">
        <button onClick={handleOpenAddPlace}>➕</button>
        <AddPlace isOpen={isAddPlaceOpen} onClose={handleCloseAddPlace} />

        <button onClick={() => setSignupOpen(true)}>SIGN UP</button>
        <SignupDialog isOpen={isSignupOpen} onClose={() => setSignupOpen(false)} />

        <button onClick={() => setLoginOpen(true)}>LOGIN</button>
        <DialogLogin isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />

        <div className="autocomplete-container" style={{ width: "350px", margin: "10px auto" }}>
          <GooglePlacesAutocomplete
            apiKey={googleMapsApiKey}
            selectProps={{
              placeholder: "...הכנס מיקום",
              onChange: handleLocationSelect,
              onInputChange: handleInputChange,
              inputValue: inputValue,
              styles: customStyles,
            }}
          />
        </div>
<div className="Buton">
   <Tooltip id="hotel-tooltip" place="bottom" content="מלונות במיקומך" />
        <button data-tooltip-id="hotel-tooltip"><FontAwesomeIcon icon={faHotel} size="lg" color="blue" /></button>

        <Tooltip id="restrount" place="bottom" content="מסעדות במיקומך" />
        <button data-tooltip-id="restrount"><FontAwesomeIcon icon={faUtensils} size="lg" color="blue" /></button>

        <Tooltip id="gas-station" place="bottom" content="תחנות דלק במיקומך" />
        <button data-tooltip-id="gas-station"><FontAwesomeIcon icon={faGasPump} size="lg" color="blue" /></button>

        <Tooltip id="Store" place="bottom" content="חנויות במיקומך" />
        <button data-tooltip-id="Store"><FontAwesomeIcon icon={faStore} size="lg" color="blue" /></button>
</div>
       
      </nav>

      {/* מפת Leaflet */}
      <MapContainer
        center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [31.7683, 35.2137]} // ירושלים כברירת מחדל
        zoom={13}
        style={{ height: "700px", width: "100%" }}>
      
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
        
        {selectedLocation && (
          <>
            <ChangeMapView center={[selectedLocation.lat, selectedLocation.lng]} />
            <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={customIcon}>
              <Popup>{selectedLocation.label}</Popup>
            </Marker>
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default Home;
