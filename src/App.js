import React, { useRef, useState } from "react";
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api";

const App = () => {
  const inputRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLEMAPS_API_KEY,
    libraries: ["places"]
  });

  const [locationDetails, setLocationDetails] = useState({
    formatted_address: "",
    lat: "",
    lng: "",
    city_name: "",
    city_state: "",
    city_postalcode: "",
    country_name: ""
  });

  const [inputValue, setInputValue] = useState(""); // State for the input field value

  const handleOnPlacesChanged = () => {
    let places = inputRef.current.getPlaces();

    if (places && places.length > 0) {
      const place = places[0]; // Taking the first place result
      const addressComponents = place.address_components;

      // Extracting the details from address_components
      const city = addressComponents.find(comp => comp.types.includes("locality"))?.long_name || "";
      const state = addressComponents.find(comp => comp.types.includes("administrative_area_level_1"))?.long_name || "";
      const postalCode = addressComponents.find(comp => comp.types.includes("postal_code"))?.long_name || "";
      const country = addressComponents.find(comp => comp.types.includes("country"))?.long_name || "";

      // Geocoding: getting lat/lng from place.geometry
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      // Update input field value with formatted address
      setInputValue(place.formatted_address);

      // Set extracted location details to state
      setLocationDetails({
        formatted_address: place.formatted_address,
        lat: lat,
        lng: lng,
        city_name: city,
        city_state: state,
        city_postalcode: postalCode,
        country_name: country
      });

      // Log the results
      console.log("Formatted Address:", place.formatted_address);
      console.log("Latitude:", lat);
      console.log("Longitude:", lng);
      console.log("City:", city);
      console.log("State:", state);
      console.log("Postal Code:", postalCode);
      console.log("Country:", country);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Manually change input value if needed
  };

  return (
    <div style={{ marginTop: "5%", textAlign: "center" }}>
      {isLoaded && (
        <StandaloneSearchBox
          onLoad={ref => (inputRef.current = ref)}
          onPlacesChanged={handleOnPlacesChanged}
        >
          <input
            type="text"
            placeholder="Start typing your address"
            value={inputValue} // Bind input value to state
            onChange={handleInputChange} // Update state when user types
            style={{
              boxSizing: "border-box",
              border: "1px solid red",
              width: "50%",
              height: "50px",
              padding: "0 12px",
              borderRadius: "3px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
              fontSize: "14px",
              outline: "none",
              textOverflow: "ellipses"
            }}
          />
        </StandaloneSearchBox>
      )}

      {/* Display the extracted data */}
      <div style={{ marginTop: "20px" }}>
        <p>Formatted Address: {locationDetails.formatted_address}</p>
        <p>Latitude: {locationDetails.lat}</p>
        <p>Longitude: {locationDetails.lng}</p>
        <p>City: {locationDetails.city_name}</p>
        <p>State: {locationDetails.city_state}</p>
        <p>Postal Code: {locationDetails.city_postalcode}</p>
        <p>Country: {locationDetails.country_name}</p>
      </div>
    </div>
  );
};

export default App;
