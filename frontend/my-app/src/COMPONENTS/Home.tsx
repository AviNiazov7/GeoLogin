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
import Details from "./Details";

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
  const [markers, setMarkers] = useState<Array<{ lat: number; lng: number; name: string }>>([]);
  const [openDetails,setDetails]=useState(false);

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
      alert("!עליך להתחבר כדי לחפש במפה.");
      console.log(isAuthenticated)
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





  const fetchPlaces = async (type: string) => {
    if (!selectedLocation) {
      alert("עליך לבחור מיקום תחילה.");
      return;
    }
  
    console.log(`🔎 מחפש ${type} ליד:`, selectedLocation);
  
    const { lat, lng } = selectedLocation;
    const location = new google.maps.LatLng(lat, lng);
    const request = {
      location,
      radius: 8000, // חיפוש ברדיוס של 5 ק"מ
      type,
    };
  
    const service = new google.maps.places.PlacesService(new google.maps.Map(document.createElement("div")));
  
    service.nearbySearch(request, (results, status) => {
      console.log("🔄 קיבלנו תשובה מה-API", status, results);
  
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const newMarkers = results.map((place) => ({
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0,
          name: place.name || "מקום לא ידוע",
          type: type, // ✅ שמירת סוג המקום
        }));
  
        console.log("סמנים שנוספו למפה:", newMarkers);
        
        // 🔹 ננקה את `markers` ונציג רק את המקומות של הקטגוריה שנבחרה
        setMarkers(newMarkers);
      } else {
        alert(`⚠️ לא נמצאו ${type} באזור זה.`);
        setMarkers([]); // ננקה את הסמנים אם אין תוצאות
      }
    });
  };
  const clearMap=()=>{
    setMarkers([])
  }




  
  
  // פונקציות ייעודיות לכל סוג מקום
  const fetchRestaurants = () => fetchPlaces("restaurant");
  const fetchGasStations = () => fetchPlaces("gas_station");
  const fetchStores = () => fetchPlaces("store");
  const fetchBusinesses = () => fetchPlaces("point_of_interest");
  



  return (
    <div>
      <nav className="navbar">
        <button onClick={handleOpenAddPlace}>+</button>
        <AddPlace isOpen={isAddPlaceOpen} onClose={handleCloseAddPlace} />

        <button onClick={() => setSignupOpen(true)}>SIGN UP</button>
        <SignupDialog isOpen={isSignupOpen} onClose={() => setSignupOpen(false)} />

        <button onClick={() => setLoginOpen(true)}>LOGIN</button>
        <DialogLogin isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />

          
        <button onClick={() => setDetails(true)}>פרטים</button>
        <Details isOpen={openDetails} onClose={() => setDetails(false)} />





   
         

          

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
  <button onClick={fetchBusinesses} data-tooltip-id="hotel-tooltip">
    <FontAwesomeIcon icon={faHotel} size="lg" color="blue" />
  </button>

  <Tooltip id="restaurant-tooltip" place="bottom" content="מסעדות במיקומך" />
  <button onClick={fetchRestaurants} data-tooltip-id="restaurant-tooltip">
    <FontAwesomeIcon icon={faUtensils} size="lg" color="blue" />
  </button>

  <Tooltip id="gas-station-tooltip" place="bottom" content="תחנות דלק במיקומך" />
  <button onClick={fetchGasStations} data-tooltip-id="gas-station-tooltip">
    <FontAwesomeIcon icon={faGasPump} size="lg" color="blue" />
  </button>

  <Tooltip id="store-tooltip" place="bottom" content="חנויות במיקומך" />
  <button onClick={fetchStores} data-tooltip-id="store-tooltip">
    <FontAwesomeIcon icon={faStore} size="lg" color="blue" />
  </button>

   <button onClick={clearMap}>נקה תוצאות</button>

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


{markers.map((marker, index) => (
  <Marker key={index} position={[marker.lat, marker.lng]} icon={customIcon}>
    <Popup>{marker.name}</Popup>
  </Marker>
))}

      </MapContainer>
    </div>
  );
};

export default Home;
