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
import axios from "axios";

// טיפוס נתוני מיקום
interface Location {
  lat: number;
  lng: number;
  label: string;
}

// מקבל API Key מקובץ .env כדי לשמור על אבטחה
const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const API_URL = process.env.REACT_APP_API_URL;

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth(); // ✅ בדיקה אם המשתמש מחובר

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isAddPlaceOpen, setAddPlaceOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [markers, setMarkers] = useState<Array<{ lat: number; lng: number; name: string }>>([]);
  const [openDetails,setDetails]=useState(false);


  const { logout } = useAuth(); 
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
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)", // גוון עדין יותר של צל
      padding: "8px 12px", // מרווחים טובים יותר
      fontSize: "14px", // גודל פונט קטן יותר
      backgroundColor: "#f9f9f9", // צבע רקע בהיר יותר
      border: "1px solid #ddd", // גבול בהיר יותר
      "&:hover": {
        borderColor: "#4CAF50", // צבע גבול יותר מודגש בעת ריחוף
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)", // צל עבה יותר
      backgroundColor: "#fff",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#4CAF50" : "#fff", // צבע רקע ירוק בריחוף
      color: state.isFocused ? "white" : "#333", // צבע טקסט יותר בהיר כאשר מרחפים
      padding: "10px 12px", // ריווח טוב יותר בין אופציות
      cursor: "pointer",
      transition: "background-color 0.2s ease, color 0.2s ease", // תוספת של שינוי צבע בשפתי טקסט
      fontSize: "14px", // גודל פונט קטן יותר
      "&:active": {
        backgroundColor: "#388E3C", // צבע רקע פעיל
      },
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#333", // צבע טקסט כהה
      fontWeight: "500", // משקל פונט בינוני
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#bbb", // צבע כהה פחות עבור placeholder
      fontStyle: "italic",
      fontSize: "14px", // גודל פונט קטן יותר
    }),
  };

  








  const fetchPlaces = async (type: string) => {


    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("⚠️ אין הרשאה, יש להתחבר תחילה.");
      return;
    }
    if (!selectedLocation) {
      alert("עליך לבחור מיקום תחילה.");
      return;
    }
  
    console.log(`🔎 מחפש ${type} ליד:`, selectedLocation);
  
    const { lat, lng } = selectedLocation;
  
    if (!google?.maps?.places) {
      console.error("❌ Google Maps Places API לא נטען כראוי.");
      return;
    }
  
    const service = new google.maps.places.PlacesService(new google.maps.Map(document.createElement("div")));
  
    let allResults: google.maps.places.PlaceResult[] = [];
  
    // ** שליפת מקומות מ-Google Places API לפי קטגוריה**
    const fetchFromGoogle = async () => {
      return new Promise<google.maps.places.PlaceResult[]>((resolve) => {
        const request = {
          location: new google.maps.LatLng(lat, lng),
          radius: 5000, // 📌 רדיוס 5 ק"מ
          type,
        };
  
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            resolve([]);
          }
        });
      });
    };
  
    allResults = await fetchFromGoogle();
    console.log(`✅ קיבלנו ${allResults.length} תוצאות מגוגל`);
  
    // ** שליפת מקומות מהשרת עם lat, lng, וקטגוריה**
    const fetchServerPlaces = async () => {
      const requestData = {
        category: type,  // שולח את הקטגוריה
        latitude: lat,   // שולח את ה-lat
        longitude: lng,  // שולח את ה-lng
      };
  
      console.log("📤 שולח בקשה לשרת עם הנתונים הבאים:", requestData);
  
      try {
        const response = await axios.post(`${API_URL}/places/category`, requestData);
  
        console.log("✅ תשובה מהשרת:", response.data);
  
        return response.data.places || [];
      } catch (error) {
        console.error("❌ שגיאה בשליפת מקומות מהשרת:", error);
        return [];
      }
    };
  
    const serverPlaces = await fetchServerPlaces();
    console.log(`✅ קיבלנו ${serverPlaces.length} תוצאות מהשרת`);
  
    // ** איחוד התוצאות משני מקורות (Google + שרת)**
    const allPlaces = [...allResults, ...serverPlaces].filter((place, index, self) =>
      index === self.findIndex((p) =>
        p.place_id ? p.place_id === place.place_id : p.name === place.name
      )
    );
    
  
    console.log(`✅ קיבלנו ${allPlaces.length} מקומות (Google + שרת)`);
  
    // **הצגת התוצאות על המפה**
    if (allPlaces.length > 0) {
      const newMarkers = allPlaces
      .map((place, index) => ({
        lat: place.geometry?.location?.lat?.() ?? place.latitude ?? 0,
        lng: place.geometry?.location?.lng?.() ?? place.longitude ?? 0,
        name: place.name || "מקום לא ידוע",
        type,
        latOffset: (index * 0.0001) || 0,  // הוספת זווית אקראית קטנה לכל מקום
        lngOffset: (index * 0.0001) || 0   // כדי למנוע הצגה על אותו המקום
      }))
      .map((place) => ({
        lat: place.lat + place.latOffset,  // הוספת ההזזה
        lng: place.lng + place.lngOffset,  // הוספת ההזזה
        name: place.name,
        type: place.type
      }));
    
    console.log("📍 סמנים שנוספו למפה:", newMarkers);
    setMarkers(newMarkers);
    
    }
  };
  
  const clearMap = () => {
    setMarkers([]);
  };
  
  




  
  
  // פונקציות ייעודיות לכל סוג מקום
  const fetchRestaurants = () => fetchPlaces("restaurant");
  const fetchGasStations = () => fetchPlaces("gas_station");
  const fetchStores = () => fetchPlaces("store");
  const fetchBusinesses = () => fetchPlaces("lodging");
  



  return (
    <div>
      <nav className="navbar">

       
        <button onClick={() => setSignupOpen(true)}>SIGN UP</button>
        <SignupDialog isOpen={isSignupOpen} onClose={() => setSignupOpen(false)} />

        <button onClick={() => setLoginOpen(true)}>LOGIN</button>
        <DialogLogin isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />

          
        <button onClick={() => setDetails(true)}>DETAILS</button>
        <Details isOpen={openDetails} onClose={() => setDetails(false)} />
        <button className="logout-button" onClick={logout}> LOGOUT</button>



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


 <Tooltip id="addplace" place="bottom" content="הוסף מקום"/>
        <button className="Buton" onClick={handleOpenAddPlace}data-tooltip-id="addplace">+</button>
        <AddPlace isOpen={isAddPlaceOpen} onClose={handleCloseAddPlace} />

   <button onClick={clearMap}>CLEAN </button>

</div>
       
      </nav>

      {/* מפת Leaflet */}
      <MapContainer
        center={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [31.7683, 35.2137]} // ירושלים כברירת מחדל
        zoom={13}
        style={{ height: "961px", width: "100%" }}>
      
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
