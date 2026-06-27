import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import {
  CssBaseline,
  Grid,
  Container,
  Box,
} from "@mui/material";

import { getPlacesData } from "./api/apiService";

import Header from "./components/Header";
import List from "./components/List";
import Map from "./components/Map/Map";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import WeatherCard from "./components/Weather/WeatherCard";
import AskAI from "./components/AskAI";

import "./style/global.css";

const DEFAULT_COORDS = {
  lat: 18.5204,
  lng: 73.8567,
};

// Approx delta (~10km radius) used to compute bounds right after geocoding,
// so fetchPlaces fires immediately instead of waiting for the map onChange.
const DELTA = 0.09;

const App = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [childClicked, setChildClicked] = useState(null);
  const [coordinates, setCoordinates] = useState(DEFAULT_COORDS);
  const [bounds, setBounds] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const abortRef = useRef(null);

  /* ── Force page to top on load ── */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  /* ── Geolocation ── */
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) =>
        setCoordinates({ lat: latitude, lng: longitude }),
      (err) => console.warn("Geolocation denied:", err)
    );
  }, []);

  /* ── Filter places by rating ── */
  useEffect(() => {
    if (!places?.length) { setFilteredPlaces([]); return; }
    setFilteredPlaces(
      places.filter((p) => Number(p.rating || 0) >= Number(rating))
    );
  }, [rating, places]);

  /* ── Fetch places ── */
  const fetchPlaces = useCallback(async () => {
    if (!bounds?.sw || !bounds?.ne) return;
    setIsLoading(true);
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    try {
      const data = await getPlacesData(
        type, bounds.sw, bounds.ne, abortRef.current.signal
      );
      setPlaces(
        (data || []).filter((p) => p?.name && Number(p.num_reviews || 0) > 0)
      );
    } catch (err) {
      if (err.name !== "AbortError") console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [type, bounds]);

  useEffect(() => { fetchPlaces(); }, [fetchPlaces]);

  /**
   * searchCity
   * 1. Geocodes the city name via Google Geocoding API.
   * 2. Sets new coordinates (recenters the map).
   * 3. ALSO immediately computes approximate bounds so fetchPlaces
   *    re-runs right away — no waiting for the map's onChange callback.
   */
  const searchCity = useCallback(async (cityName) => {
    if (!cityName?.trim()) return;
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        cityName
      )}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === "OK" && data.results?.length) {
        const { lat, lng } = data.results[0].geometry.location;

        // Recenter the map
        setCoordinates({ lat, lng });

        // ✅ KEY FIX: immediately set approximate bounds so the
        // fetchPlaces effect fires without waiting for map onChange.
        setBounds({
          sw: { lat: lat - DELTA, lng: lng - DELTA },
          ne: { lat: lat + DELTA, lng: lng + DELTA },
        });

        // Reset child selection & rating for a fresh search
        setChildClicked(null);
        setRating(0);
      } else {
        console.warn("Geocoding failed:", data.status);
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  }, []);

  const activePlaces = filteredPlaces;

  return (
    <>
      <CssBaseline />
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearchSubmit={searchCity}
      />

      {/* ── HERO ── */}
      <Hero />

      {/* ── MAP + WEATHER ── */}
      <Container
        id="main-content"
        maxWidth="xl"
        sx={{ mt: 4, mb: 4 }}
      >
        <Grid container spacing={3} alignItems="stretch">

          {/* MAP */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ height: { xs: "500px", md: "650px" } }}>
              <Map
                coordinates={coordinates}
                setCoordinates={setCoordinates}
                setBounds={setBounds}
                places={activePlaces}
                setChildClicked={setChildClicked}
              />
            </Box>
          </Grid>

          {/* WEATHER */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ height: { xs: "auto", md: "100%" } }}>
              <WeatherCard coordinates={coordinates} />
            </Box>
          </Grid>

        </Grid>

        {/* ── LIST ── */}
        <Grid container spacing={3} sx={{ mt: 1 }} id="list-content">
          <Grid item xs={12}>
            <List
              places={activePlaces}
              childClicked={childClicked}
              isLoading={isLoading}
              type={type}
              setType={setType}
              rating={rating}
              setRating={setRating}
            />
          </Grid>
        </Grid>

        {/* ── AI ── */}
        <Box id="ai-section">
          <AskAI />
        </Box>

      </Container>

      <Footer />
    </>
  );
};

export default App;