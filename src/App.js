import { useState } from "react";
import "./App.css";
import { getCityWeather } from "./api";
import { Button, FormControl, InputGroup } from "react-bootstrap";

function App() {
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState([]);
  const [addedButtons, setAddedButtons] = useState([
    "Austin",
    "Dallas",
    "Houston",
  ]);
  const [newButtonInput, setNewButtonInput] = useState("");
  const [activeButton, setActiveButton] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleAddButton = () => {
    if (newButtonInput.trim() !== "") {
      setAddedButtons([...addedButtons, newButtonInput]);
      setNewButtonInput("");
    }
  };

  const handleInputChange = (event) => {
    setNewButtonInput(event.target.value);
  };

  const setCityData = async (city) => {
    setLoading(true);
    try {
      const retData = await getCityWeather(city);
      setWeatherData(retData);
    } catch (e) {
      console.error(e);
      setIsError(true);
      setWeatherData([]);
      //remove the city from the list of buttons
      setAddedButtons(addedButtons.filter((button) => button !== city));
    }
    setLoading(false);
  };

  const handleCityButtonClick = (city) => {
    setIsError(false);
    setActiveButton(city);
    setCityData(city);
  };

  return (
    <div className="App">
      {addedButtons.map((text) => (
        <Button
          variant={activeButton === text ? "primary" : "outline-secondary"}
          onClick={() => handleCityButtonClick(text)}
          key={text}
          style={{margin: '.5em'}}
        >
          {text}
        </Button>
      ))}

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Enter city name"
          aria-label="Enter city name"
          aria-describedby="basic-addon2"
          value={newButtonInput}
          onChange={handleInputChange}
        />
        <Button variant="outline-secondary" onClick={handleAddButton}>
          +
        </Button>
      </InputGroup>


      <div className="two-column-grid">
        <h3 style={{ textAlign: "left" }}>Time:</h3>
        <h3 style={{ textAlign: "left" }}>Temperature:</h3>
      </div>
      <br />
      {isError && <h4>City Could Not be found.</h4>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        weatherData.map((item) => {
          return (
            <div className="two-column-grid" key={item.time + item.temperature}>
              <p style={{ textAlign: "left" }}>{item.time}</p>
              <p style={{ textAlign: "left" }}>{item.temperature}</p>
            </div>
          );
        })
      )}
    </div>
  );
}

export default App;
