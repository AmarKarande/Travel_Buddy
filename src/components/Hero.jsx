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
  // `100vh` on mobile browsers includes the address bar, which causes the
  // hero to overflow/jump as it collapses on scroll. `100dvh` tracks the
  // actual visible viewport; the plain 100vh above is the fallback for
  // browsers that don't support it.
  "@supports (height: 100dvh)": {
    minHeight: "100dvh",
  },
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
  // Generous on desktop, but doesn't eat half the screen on a phone where
  // vertical space is already tight.
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(6),
  [theme.breakpoints.up("sm")]: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.spacing(8),
  },
  [theme.breakpoints.up("md")]: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(10),
  },
}));

/* =========================
   Main Content
========================= */

const LandingIcon = styled(ExploreIcon)(({ theme }) => ({
  fontSize: "3rem",
  marginBottom: theme.spacing(2),
  color: "#00c6ff",
  animation: `${fadeUp} 0.8s ease`,
  [theme.breakpoints.up("sm")]: {
    fontSize: "4rem",
    marginBottom: theme.spacing(2.5),
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "5rem",
    marginBottom: theme.spacing(3),
  },
}));

const LandingTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 700,
  fontSize: "2.1rem",
  lineHeight: 1.25,
  marginBottom: theme.spacing(2),
  animation: `${fadeUp} 1s ease`,

  // Original code only had one cutoff (4rem -> 2.7rem at "sm"), which is
  // too large for phones under ~400px and leaves a visible jump at the
  // tablet boundary. This scales smoothly across all four breakpoints.
  [theme.breakpoints.up("sm")]: {
    fontSize: "2.6rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "3.4rem",
    lineHeight: 1.2,
    marginBottom: theme.spacing(3),
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "4rem",
  },
}));

const LandingSubtitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 400,
  fontSize: "1rem",
  color: "rgba(255,255,255,0.8)",
  maxWidth: "800px",
  margin: "0 auto",
  lineHeight: 1.7,
  marginBottom: theme.spacing(4),
  animation: `${fadeUp} 1.2s ease`,
  [theme.breakpoints.up("sm")]: {
    fontSize: "1.1rem",
    lineHeight: 1.8,
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.25rem",
    marginBottom: theme.spacing(6),
  },
}));

/* =========================
   Category Cards
========================= */

const CategoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "24px",
  // Grid's row-stretch only stretches the outer grid cell, not this card.
  // Without height: 100%, two cards in the same row with different amounts
  // of text (e.g. a 1-line vs 2-line title) end up visibly mismatched.
  height: "100%",
  display: "flex",
  flexDirection: "column",

  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(14px)",

  border: "1px solid rgba(255,255,255,0.12)",

  transition: "0.4s",

  animation: `${fadeUp} 1.4s ease`,

  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(3.5),
  },
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4),
  },

  "&:hover": {
    transform: "translateY(-10px)",
    background: "rgba(255,255,255,0.12)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },
}));

const CategoryIcon = styled(Box)(({ theme }) => ({
  fontSize: "2.75rem",
  color: "#00c6ff",
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.up("sm")]: {
    fontSize: "3.2rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "3.5rem",
    marginBottom: theme.spacing(2),
  },
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
  marginTop: theme.spacing(4),

  background: "linear-gradient(to right, #00c6ff, #0072ff)",

  color: "#fff",

  padding: "12px 28px",

  borderRadius: "40px",

  fontSize: "0.95rem",

  fontWeight: 600,

  textTransform: "none",

  boxShadow: "0 8px 24px rgba(0,114,255,0.35)",

  transition: "0.4s",

  animation: `${fadeUp} 1.6s ease`,

  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(5),
    padding: "13px 32px",
    fontSize: "1rem",
  },
  [theme.breakpoints.up("md")]: {
    marginTop: theme.spacing(6),
    padding: "14px 36px",
  },

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

          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            justifyContent="center"
            // Keeps every card the same height within a row at every
            // breakpoint (paired with height: 100% on CategoryCard above).
            alignItems="stretch"
          >
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