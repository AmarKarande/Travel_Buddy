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

const App = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] =
    useState([]);

  const [childClicked, setChildClicked] =
    useState(null);

  const [coordinates, setCoordinates] =
    useState(DEFAULT_COORDS);

  const [bounds, setBounds] = useState(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [type, setType] =
    useState("restaurants");

  const [rating, setRating] = useState(0);

  const abortRef = useRef(null);

  /* =========================
     USER LOCATION
  ========================= */

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({
          lat: latitude,
          lng: longitude,
        });
      },
      (err) => {
        console.warn(
          "Geolocation denied:",
          err
        );
      }
    );
  }, []);

  /* =========================
     FILTER PLACES
  ========================= */

  useEffect(() => {
    if (!places?.length) {
      setFilteredPlaces([]);
      return;
    }

    const filtered = places.filter(
      (place) =>
        Number(place.rating || 0) >=
        Number(rating)
    );

    setFilteredPlaces(filtered);
  }, [rating, places]);

  /* =========================
     FETCH PLACES
  ========================= */

  const fetchPlaces = useCallback(
    async () => {
      if (!bounds?.sw || !bounds?.ne) return;

      setIsLoading(true);

      if (abortRef.current) {
        abortRef.current.abort();
      }

      abortRef.current =
        new AbortController();

      try {
        const data = await getPlacesData(
          type,
          bounds.sw,
          bounds.ne,
          abortRef.current.signal
        );

        const validPlaces = (
          data || []
        ).filter(
          (place) =>
            place?.name &&
            Number(place.num_reviews || 0) > 0
        );

        setPlaces(validPlaces);
      } catch (error) {
        if (
          error.name !== "AbortError"
        ) {
          console.error(
            "Fetch Places Error:",
            error
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [type, bounds]
  );

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  return (
    <>
      <CssBaseline />

      <Header />

      <Hero />

      <Container
        maxWidth="xl"
        sx={{
          mt: 4,
          mb: 4,
        }}
      >
        {/* MAP + WEATHER */}
        <Grid
          container
          spacing={3}
          alignItems="stretch"
        >
          {/* MAP */}
          <Grid item xs={12} lg={8}>
            <Box
              sx={{
                height: {
                  xs: "500px",
                  md: "650px",
                },
              }}
            >
              <Map
                coordinates={coordinates}
                setCoordinates={
                  setCoordinates
                }
                setBounds={setBounds}
                places={
                  filteredPlaces.length
                    ? filteredPlaces
                    : places
                }
                setChildClicked={
                  setChildClicked
                }
              />
            </Box>
          </Grid>

          {/* WEATHER */}
          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                height: {
                  xs: "auto",
                  md: "650px",
                },
              }}
            >
              <WeatherCard
                coordinates={
                  coordinates
                }
              />
            </Box>
          </Grid>
        </Grid>

        {/* LIST */}
        <Grid
          container
          spacing={3}
          sx={{ mt: 1 }}
        >
          <Grid item xs={12}>
            <List
              places={
                filteredPlaces.length
                  ? filteredPlaces
                  : places
              }
              childClicked={
                childClicked
              }
              isLoading={isLoading}
              type={type}
              setType={setType}
              rating={rating}
              setRating={setRating}
            />
          </Grid>
        </Grid>

        <AskAI />
      </Container>

      <Footer />
    </>
  );
};

export default App;