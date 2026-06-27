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
  LocationOn,
  Star,
  MyLocation,
} from "@mui/icons-material";

import { styled } from "@mui/material/styles";

import mapStyles from "./mapStyles";

/* ==============================
   Design tokens
   Keep all color/shadow decisions
   here so the look stays consistent
   and easy to tune in one place.
============================== */

const colors = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  text: "#0F172A",
  textMuted: "#64748B",
  border: "#E2E8F0",
  surface: "#FFFFFF",
};

const shadow = {
  sm: "0 1px 2px rgba(15,23,42,.08)",
  md: "0 4px 12px rgba(15,23,42,.10)",
  lg: "0 12px 28px rgba(15,23,42,.14)",
};

/* ==============================
   Map Container
============================== */

const MapContainer = styled("div")({
  width: "100%",
  height: "100%",
  borderRadius: 16,
  overflow: "hidden",
  position: "relative",
  border: `1px solid ${colors.border}`,
  boxShadow: shadow.md,
});

/* ==============================
   Marker
============================== */

const MarkerContainer = styled("div")({
  transform: "translate(-50%, -100%)",
  cursor: "pointer",
});

const Pin = styled(Box)({
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: colors.primary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  border: "2px solid #fff",
  boxShadow: shadow.md,
  transition: "transform .15s ease, box-shadow .15s ease",

  "&:hover": {
    transform: "scale(1.12)",
    boxShadow: shadow.lg,
    background: colors.primaryDark,
  },

  "& svg": {
    fontSize: 18,
  },
});

/* ==============================
   Popup Card
============================== */

const MarkerCard = styled(Paper)({
  width: 200,
  overflow: "hidden",
  borderRadius: 12,
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  boxShadow: shadow.lg,
  marginBottom: 8,
});

const MarkerImage = styled("img")({
  width: "100%",
  height: 96,
  objectFit: "cover",
  display: "block",
});

const MarkerContent = styled(Box)({
  padding: "10px 12px 12px",
});

const PlaceName = styled(Typography)({
  fontWeight: 600,
  fontSize: ".9rem",
  color: colors.text,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  marginBottom: 4,
});

const RatingChip = styled(Chip)({
  height: 22,
  fontSize: ".72rem",
  fontWeight: 600,
  color: colors.primaryDark,
  background: "#EFF6FF",
  border: "1px solid #DBEAFE",

  "& .MuiChip-icon": {
    color: colors.primaryDark,
    marginLeft: 4,
  },
});

/* ==============================
   Floating Controls
============================== */

const FloatingControls = styled(Box)({
  position: "absolute",
  right: 16,
  top: 16,
  zIndex: 5,
});

const LocationButton = styled(IconButton)({
  width: 40,
  height: 40,
  background: colors.surface,
  color: colors.textMuted,
  border: `1px solid ${colors.border}`,
  boxShadow: shadow.sm,
  transition: ".15s ease",

  "&:hover": {
    background: colors.surface,
    color: colors.primary,
    boxShadow: shadow.md,
  },
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
        <LocationButton onClick={handleMyLocation} size="small">
          <MyLocation fontSize="small" />
        </LocationButton>
      </FloatingControls>

      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        }}
        center={coordinates}
        defaultZoom={14}
        options={(maps) => ({
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: true,
          streetViewControl: false,
          mapTypeId: "roadmap",
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: maps.ControlPosition.TOP_LEFT,
            mapTypeIds: ["roadmap", "terrain", "satellite", "hybrid"],
          },
          styles: mapStyles,
        })}
        onChange={({ center, marginBounds }) => {
          setCoordinates(center);

          setBounds({
            ne: marginBounds.ne,
            sw: marginBounds.sw,
          });
        }}
      >
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
                setChildClicked(i);
              }}
            >
              <Pin>
                <LocationOn />
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
            <MarkerCard elevation={0}>
              <MarkerImage
                src={
                  selectedPlace.photo?.images?.large?.url ||
                  "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                }
                alt={selectedPlace.name}
              />

              <MarkerContent>
                <PlaceName>{selectedPlace.name}</PlaceName>

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
                    icon={<Star sx={{ fontSize: 14 }} />}
                    label={selectedPlace.rating || "N/A"}
                  />
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: colors.textMuted,
                    fontSize: ".76rem",
                    lineHeight: 1.4,
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
                      color: colors.textMuted,
                      fontSize: ".7rem",
                    }}
                  >
                    {selectedPlace.num_reviews} reviews
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