import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

import ExploreIcon from "@mui/icons-material/Explore";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";

import { styled, keyframes } from "@mui/material/styles";

/* =========================
   Animation
========================= */

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* =========================
   Hero Section
========================= */

const HeroSection = styled("section")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",

  background: `
    linear-gradient(
      135deg,
      #141E30 0%,
      #243B55 50%,
      #0F2027 100%
    )
  `,

  overflow: "hidden",
  color: "#fff",
}));

const Overlay = styled(Box)({
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(circle at top right, rgba(0,114,255,0.15), transparent 30%)",
});

const LandingContent = styled(Container)(({ theme }) => ({
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(10),
}));

/* =========================
   Main Content
========================= */

const LandingIcon = styled(ExploreIcon)(({ theme }) => ({
  fontSize: "5rem",
  marginBottom: theme.spacing(3),
  color: "#00c6ff",
  animation: `${fadeUp} 0.8s ease`,
}));

const LandingTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 700,
  fontSize: "4rem",
  lineHeight: 1.2,
  marginBottom: theme.spacing(3),
  animation: `${fadeUp} 1s ease`,

  [theme.breakpoints.down("sm")]: {
    fontSize: "2.7rem",
  },
}));

const LandingSubtitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 400,
  color: "rgba(255,255,255,0.8)",
  maxWidth: "800px",
  margin: "0 auto",
  lineHeight: 1.8,
  marginBottom: theme.spacing(6),
  animation: `${fadeUp} 1.2s ease`,
}));

/* =========================
   Category Cards
========================= */

const CategoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "24px",

  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(14px)",

  border: "1px solid rgba(255,255,255,0.12)",

  transition: "0.4s",

  animation: `${fadeUp} 1.4s ease`,

  "&:hover": {
    transform: "translateY(-10px)",
    background: "rgba(255,255,255,0.12)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
}));

const CategoryIcon = styled(Box)(({ theme }) => ({
  fontSize: "3.5rem",
  color: "#00c6ff",
  marginBottom: theme.spacing(2),
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  color: "#fff",
  marginBottom: theme.spacing(1.5),
}));

const CategoryText = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  color: "rgba(255,255,255,0.7)",
  lineHeight: 1.7,
});

/* =========================
   Button
========================= */

const LandingButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(6),

  background: "linear-gradient(to right, #00c6ff, #0072ff)",

  color: "#fff",

  padding: "14px 36px",

  borderRadius: "40px",

  fontSize: "1rem",

  fontWeight: 600,

  textTransform: "none",

  boxShadow: "0 8px 24px rgba(0,114,255,0.35)",

  transition: "0.4s",

  animation: `${fadeUp} 1.6s ease`,

  "&:hover": {
    transform: "translateY(-3px)",
    background: "linear-gradient(to right, #0072ff, #00c6ff)",
    boxShadow: "0 10px 30px rgba(0,114,255,0.5)",
  },
}));

/* =========================
   Component
========================= */

const Hero = () => {
  const handleExploreClick = () => {
    const mainContent = document.getElementById("main-content");

    if (mainContent) {
      mainContent.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <HeroSection id="hero">
      <Overlay />

      <LandingContent maxWidth="lg">
        <Box display="flex" flexDirection="column" alignItems="center">
          <LandingIcon />

          <LandingTitle variant="h1">
            Discover Your Next Adventure
          </LandingTitle>

          <LandingSubtitle variant="h6">
            Explore restaurants, hotels, attractions, and personalized
            AI-powered travel recommendations designed to make every journey
            unforgettable.
          </LandingSubtitle>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <CategoryCard elevation={0}>
                <CategoryIcon>
                  <RestaurantIcon fontSize="inherit" />
                </CategoryIcon>

                <CategoryTitle variant="h6">
                  Restaurants
                </CategoryTitle>

                <CategoryText variant="body2">
                  Discover top-rated dining experiences and local favorites.
                </CategoryText>
              </CategoryCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <CategoryCard elevation={0}>
                <CategoryIcon>
                  <HotelIcon fontSize="inherit" />
                </CategoryIcon>

                <CategoryTitle variant="h6">
                  Hotels
                </CategoryTitle>

                <CategoryText variant="body2">
                  Find luxury, comfort, and budget-friendly stays worldwide.
                </CategoryText>
              </CategoryCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <CategoryCard elevation={0}>
                <CategoryIcon>
                  <LocalActivityIcon fontSize="inherit" />
                </CategoryIcon>

                <CategoryTitle variant="h6">
                  Attractions
                </CategoryTitle>

                <CategoryText variant="body2">
                  Explore iconic destinations and hidden travel gems.
                </CategoryText>
              </CategoryCard>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <CategoryCard elevation={0}>
                <CategoryIcon>
                  <EmojiObjectsIcon fontSize="inherit" />
                </CategoryIcon>

                <CategoryTitle variant="h6">
                  AI Recommendations
                </CategoryTitle>

                <CategoryText variant="body2">
                  Smart personalized suggestions powered by advanced AI.
                </CategoryText>
              </CategoryCard>
            </Grid>
          </Grid>

          <LandingButton
            variant="contained"
            onClick={handleExploreClick}
          >
            Explore Now
          </LandingButton>
        </Box>
      </LandingContent>
    </HeroSection>
  );
};

export default Hero;