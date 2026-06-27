import React, { useState } from "react";
import GoogleMapReact from "google-map-react";

import {
  Rating,
  Paper,
  Typography,
  Box,
  Chip,
  useMediaQuery,
  IconButton,
} from "@mui/material";

import {
  LocationOnOutlined,
  Star,
  MyLocation,
} from "@mui/icons-material";

import { styled, keyframes } from "@mui/material/styles";

import mapStyles from "./mapStyles";

/* ==============================
   Animations
============================== */

const float = keyframes`
0%{
transform:translateY(0px);
}

50%{
transform:translateY(-6px);
}

100%{
transform:translateY(0px);
}
`;

/* ==============================
   Map Container
============================== */

const MapContainer = styled("div")({
  width: "100%",
  height: "100%",
  borderRadius: 28,
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 20px 40px rgba(0,0,0,.35)",
});

/* ==============================
   Marker
============================== */

const MarkerContainer = styled("div")({
  transform: "translate(-50%, -100%)",
  cursor: "pointer",
});

const Pin = styled(Box)({
  width: 48,
  height: 48,
  borderRadius: "50%",
  background: "linear-gradient(135deg,#00c6ff,#0072ff)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  boxShadow: "0 10px 25px rgba(0,114,255,.45)",
  animation: `${float} 2.8s ease infinite`,
  transition: ".25s",

  "&:hover": {
    transform: "scale(1.15)",
  },
});

/* ==============================
   Popup Card
============================== */

const MarkerCard = styled(Paper)({
  width: 190,
  overflow: "hidden",
  borderRadius: 18,
  background: "rgba(15,23,42,.96)",
  backdropFilter: "blur(15px)",
  color: "#fff",
  boxShadow: "0 15px 35px rgba(0,0,0,.4)",
});

const MarkerImage = styled("img")({
  width: "100%",
  height: 105,
  objectFit: "cover",
});

const MarkerContent = styled(Box)({
  padding: 12,
});

const PlaceName = styled(Typography)({
  fontWeight: 700,
  fontSize: ".95rem",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const RatingChip = styled(Chip)({
  background: "#0072ff",
  color: "#fff",
});

/* ==============================
   Floating Buttons
============================== */

const FloatingControls = styled(Box)({
  position: "absolute",
  right: 20,
  top: 20,
  zIndex: 5,
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

/* ==============================
   Component
============================== */

const Map = ({
  coordinates,
  setCoordinates,
  setBounds,
  places,
  setChildClicked,
}) => {
  const isDesktop = useMediaQuery("(min-width:600px)");

  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleMyLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((position) => {
      setCoordinates({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  return (
    <MapContainer>
      <FloatingControls>
        <IconButton
          onClick={handleMyLocation}
          sx={{
            bgcolor: "rgba(15,23,42,.9)",
            color: "#fff",
            "&:hover": {
              bgcolor: "#0072ff",
            },
          }}
        >
          <MyLocation />
        </IconButton>
      </FloatingControls>

      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        }}
        center={coordinates}
        defaultZoom={14}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: true,
          mapTypeControl: true,
          streetViewControl: false,
          styles: mapStyles,
        }}
        onChange={({ center, marginBounds }) => {
          setCoordinates(center);

          setBounds({
            ne: marginBounds.ne,
            sw: marginBounds.sw,
          });
        }}       >
        {/* ======================
            MAP MARKERS
        ======================= */}

        {places?.map((place, i) => {
          if (!place.latitude || !place.longitude) return null;

          return (
            <MarkerContainer
              key={i}
              lat={Number(place.latitude)}
              lng={Number(place.longitude)}
              onClick={() => {
                setSelectedPlace(place);
                setChildClicked(i); // Only update when marker is clicked
              }}
            >
              <Pin>
                <LocationOnOutlined />
              </Pin>
            </MarkerContainer>
          );
        })}

        {/* ======================
            SELECTED PLACE POPUP
        ======================= */}

        {selectedPlace && isDesktop && (
          <MarkerContainer
            lat={Number(selectedPlace.latitude)}
            lng={Number(selectedPlace.longitude)}
          >
            <MarkerCard elevation={10}>
              <MarkerImage
                src={
                  selectedPlace.photo?.images?.large?.url ||
                  "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                }
                alt={selectedPlace.name}
              />

              <MarkerContent>
                <PlaceName gutterBottom>
                  {selectedPlace.name}
                </PlaceName>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Rating
                    size="small"
                    precision={0.5}
                    value={Number(selectedPlace.rating) || 0}
                    readOnly
                  />

                  <RatingChip
                    size="small"
                    icon={<Star sx={{ color: "#fff !important" }} />}
                    label={selectedPlace.rating || "N/A"}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#cbd5e1",
                    fontSize: ".78rem",
                  }}
                >
                  {selectedPlace.address ||
                    selectedPlace.location_string ||
                    "Address unavailable"}
                </Typography>

                {selectedPlace.num_reviews && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1,
                      color: "#94a3b8",
                    }}
                  >
                    {selectedPlace.num_reviews} Reviews
                  </Typography>
                )}
              </MarkerContent>
            </MarkerCard>
          </MarkerContainer>
        )}
      </GoogleMapReact>
    </MapContainer>
  );
};

export default React.memo(Map);