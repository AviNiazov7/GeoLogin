import React, { useState } from "react";
import GooglePlacesAutocomplete, { geocodeByPlaceId } from "react-google-places-autocomplete";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHotel,faUtensils ,faGasPump ,faStore} from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import AddPlace from "./AddPlace";
import SignupDialog from "./SignupDialog";
import DialogLogin from "./DialogLogin";

// טיפוס נתוני מיקום
interface Location {
  lat: number;
  lng: number;
  label: string;
}
const Home: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [openAddplace,setopenAddplace]=useState(false)
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [openlogin,setlogin]=useState(false);

// אייקון מותאם למרקר
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // אייקון מרקר מותאם
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});
const ChangeMapView = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  const newZoom = Math.min(map.getZoom()); 
  map.setView(center, newZoom);
  return null;
};

const handleopenAddplace=()=>{
  setopenAddplace(true)
}
const handleCloseAddPlace = () => {
  setopenAddplace(false);
};



  // פונקציה לטיפול בבחירת מיקום
  const handleLocationSelect = async (value: any) => {
    if (value && value.value.place_id) {
      const results = await geocodeByPlaceId(value.value.place_id);
      if (results[0] && results[0].geometry) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        setSelectedLocation({ lat, lng, label: value.label });
        setInputValue(value.label)
      }
    }
  };
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue); // מעדכן את הטקסט בשדה אבל לא משנה את המיקום
  };
  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
      border: "2px solid #4CAF50",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "5px",
      fontSize: "16px",
      backgroundColor: "white",
      "&:hover": {
        borderColor: "#388E3C",
      },
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

 <button onClick={handleopenAddplace}>➕</button> 
 <AddPlace isOpen={openAddplace} onClose={handleCloseAddPlace} />

 <button onClick={() => setSignupOpen(true)}>SIGN UP</button>
  <SignupDialog isOpen={isSignupOpen} onClose={() => setSignupOpen(false)} />

    
 <button onClick={() => setlogin(true)}>LOGIN</button>
<DialogLogin isOpen={openlogin} onClose={() => setlogin(false)} />

        <div className="autocomplete-container" style={{ width: "350px", margin: "10px auto" }}>
          <GooglePlacesAutocomplete
            apiKey="AIzaSyCad6leGCz2HAUd-aHYoNNSbxoSC2h16wc"
            selectProps={{
              placeholder: "...הכנס מיקום",
              onChange: handleLocationSelect,
              onInputChange:handleInputChange,
              inputValue:inputValue,
              styles:customStyles,
            
            }}
          />
        </div>


         <Tooltip className="Hotel" id="hotel-tooltip" place="bottom" content="מלונות במיקומך"/>
        <button data-tooltip-id="hotel-tooltip"><FontAwesomeIcon icon={faHotel} size="lg" color="blue" /></button>

        <Tooltip className="Hotel" id="restrount" place="bottom" content="מסעדות במיקומך"/>
        <button data-tooltip-id="restrount"><FontAwesomeIcon icon={faUtensils} size="lg" color="blue"  /></button>

        <Tooltip className="Hotel" id="gas-station" place="bottom" content="תחנות דלק במיקומך"/>
        <button data-tooltip-id="gas-station"><FontAwesomeIcon icon={faGasPump } size="lg" color="blue"  /></button>

        <Tooltip className="Hotel" id="Store" place="bottom" content="חנויות במיקומך"/>
        <button data-tooltip-id="Store"><FontAwesomeIcon icon={faStore } size="lg" color="blue" /></button>



      </nav>

      {/* מפת Leaflet */}
      <MapContainer
        center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [31.7683, 35.2137]} // ירושלים כברירת מחדל
        zoom={13}
        style={{ height: "700px", width: "100%" }}
      >
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