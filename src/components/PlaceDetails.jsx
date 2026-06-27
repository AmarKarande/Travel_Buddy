import React, { useState } from "react";

import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Rating,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import LanguageIcon from "@mui/icons-material/Language";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";

import { styled } from "@mui/material/styles";

/* =========================
   Styled Components
========================= */

const CardStyled = styled(Card)(({ theme }) => ({
  background: "#111827",

  borderRadius: "24px",

  overflow: "hidden",

  border: "1px solid rgba(255,255,255,0.08)",

  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",

  transition: "all 0.35s ease",

  color: "#fff",

  height: "100%",

  display: "flex",

  flexDirection: "column",

  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
  },
}));

const MediaStyled = styled(CardMedia)({
  height: 240,
  position: "relative",
});

const Overlay = styled(Box)({
  position: "absolute",
  inset: 0,

  background:
    "linear-gradient(to top, rgba(0,0,0,0.75), transparent 60%)",
});

const PlaceTitle = styled(Typography)({
  fontWeight: 700,

  fontFamily: "'Poppins', sans-serif",

  color: "#fff",

  fontSize: "1.2rem",
});

const InfoText = styled(Typography)({
  color: "rgba(255,255,255,0.75)",

  fontFamily: "'Poppins', sans-serif",

  lineHeight: 1.7,
});

const ChipStyled = styled(Chip)({
  background: "rgba(255,255,255,0.08)",

  color: "#fff",

  border: "1px solid rgba(255,255,255,0.08)",

  margin: "4px",

  borderRadius: "10px",
});

const ButtonStyled = styled(Button)({
  background: "linear-gradient(to right, #0ea5e9, #2563eb)",

  color: "#fff",

  borderRadius: "12px",

  textTransform: "none",

  fontWeight: 600,

  padding: "8px 14px",

  transition: "0.3s ease",

  "&:hover": {
    background: "linear-gradient(to right, #2563eb, #0ea5e9)",

    transform: "translateY(-2px)",
  },
});

const IconButtonStyled = styled(IconButton)({
  color: "#fff",

  background: "rgba(255,255,255,0.08)",

  "&:hover": {
    background: "rgba(255,255,255,0.15)",
  },
});

/* =========================
   Component
========================= */

const PlaceDetails = ({
  place,
  selected,
  refProp,
}) => {
  const [isFavorited, setIsFavorited] =
    useState(false);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
  };

  if (selected) {
    refProp?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <CardStyled elevation={6}>
      {/* IMAGE */}
      <Box position="relative">
        <MediaStyled
          image={
            place.photo
              ? place.photo.images.large.url
              : "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          }
          title={place.name}
        />

        <Overlay />
      </Box>

      {/* CONTENT */}
      <CardContent sx={{ flexGrow: 1 }}>
        {/* TITLE */}
        <PlaceTitle gutterBottom>
          {place.name}
        </PlaceTitle>

        {/* RATING */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          flexWrap="wrap"
          gap={1}
        >
          <Rating
            value={Number(place.rating)}
            precision={0.5}
            readOnly
          />

          <InfoText variant="body2">
            {place.num_reviews} reviews
          </InfoText>
        </Box>

        {/* PRICE */}
        <InfoText variant="body2">
          <strong>Price:</strong>{" "}
          {place.price_level || "N/A"}
        </InfoText>

        {/* RANKING */}
        <InfoText variant="body2" mb={2}>
          <strong>Ranking:</strong>{" "}
          {place.ranking || "N/A"}
        </InfoText>

        {/* AWARDS */}
        {place?.awards?.map((award) => (
          <Box
            key={award.display_name}
            display="flex"
            alignItems="center"
            gap={1}
            my={1}
          >
            <img
              src={award.images.small}
              alt={award.display_name}
            />

            <InfoText variant="body2">
              {award.display_name}
            </InfoText>
          </Box>
        ))}

        {/* CUISINES */}
        <Box
          display="flex"
          flexWrap="wrap"
          my={2}
        >
          {place?.cuisine?.map(({ name }) => (
            <ChipStyled
              key={name}
              label={name}
              size="small"
            />
          ))}
        </Box>

        {/* ADDRESS */}
        <Box
          display="flex"
          alignItems="flex-start"
          gap={1}
          mb={1}
        >
          <LocationOnIcon
            sx={{
              color: "#38bdf8",
              mt: "2px",
            }}
          />

          <InfoText variant="body2">
            {place.address ||
              "No address available"}
          </InfoText>
        </Box>

        {/* PHONE */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          mb={2}
        >
          <PhoneIcon sx={{ color: "#38bdf8" }} />

          <InfoText variant="body2">
            {place.phone ||
              "No contact available"}
          </InfoText>
        </Box>
      </CardContent>

      {/* ACTIONS */}
      <CardActions
        sx={{
          px: 2,
          pb: 2,
          pt: 0,

          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: 2,
        }}
      >
        {/* BUTTONS */}
        <Box
          display="flex"
          gap={1}
          flexWrap="wrap"
        >
          {place.web_url && (
            <ButtonStyled
              size="small"
              startIcon={<TripOriginIcon />}
              onClick={() =>
                window.open(
                  place.web_url,
                  "_blank"
                )
              }
            >
              TripAdvisor
            </ButtonStyled>
          )}

          {place.website && (
            <ButtonStyled
              size="small"
              startIcon={<LanguageIcon />}
              onClick={() =>
                window.open(
                  place.website,
                  "_blank"
                )
              }
            >
              Website
            </ButtonStyled>
          )}
        </Box>

        {/* ICONS */}
        <Box display="flex" gap={1}>
          <IconButtonStyled
            onClick={handleFavoriteClick}
          >
            {isFavorited ? (
              <FavoriteIcon
                sx={{ color: "#ff4d6d" }}
              />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButtonStyled>

          <IconButtonStyled
            onClick={() =>
              alert(
                "Share functionality coming soon!"
              )
            }
          >
            <ShareIcon />
          </IconButtonStyled>
        </Box>
      </CardActions>
    </CardStyled>
  );
};

export default PlaceDetails;