import React, { useState, useEffect } from "react";
import "./WeatherCard.css";

import {
  WaterDrop,
  Air,
  Thermostat,
  LocationOn,
} from "@mui/icons-material";

import weatherClearIcon from "../../assets/images/weather-clear.png";
import weatherCloudsIcon from "../../assets/images/weather-clouds.png";
import weatherDrizzleIcon from "../../assets/images/weather-drizzle.png";
import weatherMistIcon from "../../assets/images/weather-mist.webp";
import weatherRainIcon from "../../assets/images/weather-rain.webp";
import weatherSmokeIcon from "../../assets/images/weather-smoke.png";
import weatherSnowIcon from "../../assets/images/weather-snow.webp";

import { getWeatherData } from "../../api/apiService";

const WeatherCard = ({ coordinates }) => {
  const [city, setCity] = useState("Pune");
  const [country, setCountry] = useState("India");

  const [temp, setTemp] = useState("--°C");
  const [humidity, setHumidity] = useState("--%");
  const [windSpeed, setWindSpeed] = useState("-- km/h");
  const [feelsLike, setFeelsLike] = useState("--°C");

  const [weatherType, setWeatherType] = useState("Cloudy");
  const [weatherIcon, setWeatherIcon] = useState(weatherCloudsIcon);

  const getIconForWeather = (main) => {
    switch (main) {
      case "Clouds":
        return weatherCloudsIcon;
      case "Clear":
        return weatherClearIcon;
      case "Mist":
        return weatherMistIcon;
      case "Rain":
        return weatherRainIcon;
      case "Drizzle":
        return weatherDrizzleIcon;
      case "Smoke":
        return weatherSmokeIcon;
      case "Snow":
        return weatherSnowIcon;
      default:
        return weatherCloudsIcon;
    }
  };

  useEffect(() => {
    if (coordinates?.lat && coordinates?.lng) {
      getWeatherData(coordinates.lat, coordinates.lng).then((data) => {
        if (!data) return;

        setCity(data.name);
        setCountry(data.sys.country);

        // ✅ Already in Celsius because of units=metric
        setTemp(`${Math.round(data.main.temp)}°C`);
        setFeelsLike(`${Math.round(data.main.feels_like)}°C`);

        setHumidity(`${data.main.humidity}%`);

        // ✅ Convert m/s → km/h
        setWindSpeed(`${Math.round(data.wind.speed * 3.6)} km/h`);

        setWeatherType(data.weather[0].main);
        setWeatherIcon(getIconForWeather(data.weather[0].main));
      });
    }
  }, [coordinates]);

  return (
    <div className="weather-card">
      <div className="weather-overlay"></div>

      <div className="weather-top">
        <div className="weather-type">{weatherType}</div>

        <img
          className="weather-icon"
          src={weatherIcon}
          alt="weather icon"
        />
      </div>

      <div className="temperature-section">
        <h1 className="temp">{temp}</h1>

        <div className="location">
          <LocationOn />
          <span>
            {city}, {country}
          </span>
        </div>
      </div>

      <div className="weather-stats">
        <div className="stat-card">
          <WaterDrop className="stat-icon" />
          <div>
            <h3>{humidity}</h3>
            <p>Humidity</p>
          </div>
        </div>

        <div className="stat-card">
          <Air className="stat-icon" />
          <div>
            <h3>{windSpeed}</h3>
            <p>Wind Speed</p>
          </div>
        </div>

        <div className="stat-card">
          <Thermostat className="stat-icon" />
          <div>
            <h3>{feelsLike}</h3>
            <p>Feels Like</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;