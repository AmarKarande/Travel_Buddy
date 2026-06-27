import axios from "axios";

// Travel Advisor API
export const getPlacesData = async (type, sw, ne) => {
  try {
    const {
      data: { data },
    } = await axios.get(
      `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
      {
        params: {
          bl_latitude: sw.lat,
          tr_latitude: ne.lat,
          bl_longitude: sw.lng,
          tr_longitude: ne.lng,
        },
        headers: {
          "X-RapidAPI-Key": process.env.REACT_APP_RAPIDAPI_KEY,
          "X-RapidAPI-Host": "travel-advisor.p.rapidapi.com",
        },
      }
    );

    return data;
  } catch (error) {
    console.log("RapidAPI Error:", error);
  }
};

// OpenWeatherMap API
// apiService.js


const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const getWeatherData = async (lat, lon) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        lat,
        lon,
        units: "metric", // ✅ IMPORTANT FIX
        appid: process.env.REACT_APP_OPENWEATHERMAP_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Weather API Error:", error);
    return null;
  }
};