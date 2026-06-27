import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Button,
  useMediaQuery,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import RestaurantIcon from "@mui/icons-material/Restaurant";

import { styled, alpha } from "@mui/material/styles";

const Header = () => {
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");

  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      setScrollDirection(currentScrollTop > lastScrollTop ? "down" : "up");
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  /* =========================
     SAFE SCROLL FUNCTIONS
  ========================= */

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <StyledAppBar hide={scrollDirection === "down"}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        {/* LOGO */}
        <LogoContainer>
          <Avatar
            src="/logo.png"
            sx={{
              width: 45,
              height: 45,
              mr: 1.5,
              border: "2px solid white",
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Travel Buddy
          </Typography>
        </LogoContainer>

        {/* NAVIGATION */}
        <NavLinks>
          <StyledIconButton onClick={() => scrollToSection("hero")}>
            <HomeIcon />
          </StyledIconButton>

          <StyledIconButton onClick={() => scrollToSection("main-content")}>
            <MapIcon />
          </StyledIconButton>

          <StyledIconButton onClick={() => scrollToSection("list-content")}>
            <RestaurantIcon />
          </StyledIconButton>
        </NavLinks>

        {/* AI BUTTON */}
        {!isMobile && (
          <AiButton
            onClick={() => scrollToSection("ai-section")}
          >
            Get AI Recommendation
          </AiButton>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

/* =========================
   STYLES
========================= */

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "hide",
})(({ theme, hide }) => ({
  background: "linear-gradient(135deg, #141E30, #243B55)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  transition: "top 0.4s ease",
  top: hide ? "-80px" : "0",
}));

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const NavLinks = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(2),

  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const StyledIconButton = styled(IconButton)({
  color: "#fff",
  transition: "0.3s",

  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.15)",
    transform: "scale(1.1)",
  },
});

const AiButton = styled(Button)({
  fontWeight: 600,
  borderRadius: "30px",
  padding: "10px 24px",
  background: "linear-gradient(to right, #00c6ff, #0072ff)",
  color: "#fff",
  textTransform: "none",
});

export default Header;