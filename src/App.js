import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState({});
  const [mapUrl, setMapUrl] = useState("");
  const [showError, setShowError] = useState(false);
  const [weather, setWeather] = useState([]);

  // change the value of searchQuery whenever I type in the input
  function handleChange(event) {
    setSearchQuery(event.target.value);
  }

  async function handleSearch() {
    try {
      // get the location data
      const API = `https://eu1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_CITY_KEY}&q=${searchQuery}&format=json`;
      const res = await axios.get(API);
      console.log(res);
      setLocation(res.data[0]);

      // change the url for the map image
      const lat = res.data[0].lat;
      const lon = res.data[0].lon;
      setMapUrl(
        `https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_CITY_KEY}&center=${lat},${lon}&zoom=18`
      );
      getWeather();
      setShowError(false);
    } catch (error) {
      console.log(error);
      setLocation({});
      setMapUrl("");
      setShowError(true);
    }
  }

  async function getWeather() {
    try {
      const API = `http://localhost:8080/weather?searchQuery=${searchQuery}`;
      const res = await axios.get(API);
      console.log(res);
      setWeather(res.data);
    } catch (error) {
      console.log(error);
      setWeather([]);
    }
  }
  return (
    <div className="App">
      <input onChange={handleChange} />
      <button onClick={handleSearch}>Explore!</button>
      {showError && <p>That is not a valid location. Git gud.</p>}
      <h3>{location.display_name}</h3>
      <p>
        {location.lat} {location.lon}
      </p>
      <img src={mapUrl} alt="map" />
      {weather.map((day, index) => {
        return (
          <p key={index}>
            {day.date}: {day.description}
          </p>
        );
      })}
    </div>
  );
}

export default App;
