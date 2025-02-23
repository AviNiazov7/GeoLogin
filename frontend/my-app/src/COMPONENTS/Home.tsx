import React, { useState } from 'react'
import './Home.css'
import { SingleValue } from "react-select";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';





const Home: React.FC = () => {
const [selectedLocation, setSelectedLocation] = useState<SingleValue<{ label: string; value: any }> | null>(null);
  
  
  
  return (

<div>
  <nav className="navbar">
  <div className="autocomplete-container"
  style={{ width: "300px", margin: "20px auto" }}>
  <GooglePlacesAutocomplete
    apiKey="AIzaSyCad6leGCz2HAUd-aHYoNNSbxoSC2h16wc"
    selectProps={{
      value: selectedLocation,
      placeholder: "הכנס מיקום...",
      onChange: (value) => setSelectedLocation(value),
      className: "custom-autocomplete",
    }}
  />
</div>
  
  <button>מלונות</button>
  <button>מסעדות</button>
  <button>תחנות דלק</button>
  <button>עסקים</button>

</nav>


    </div>
  );
};

export default Home
