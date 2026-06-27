import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Button,
  InputBase,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import MenuIcon from "@mui/icons-material/Menu";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { styled, useTheme } from "@mui/material/styles";

// Single source of truth for nav destinations — used by both the
// desktop icon row and the mobile drawer so they can never drift apart.
const NAV_ITEMS = [
  { id: "hero", label: "Home", icon: <HomeIcon /> },
  { id: "main-content", label: "Map", icon: <MapIcon /> },
  { id: "list-content", label: "Restaurants", icon: <RestaurantIcon /> },
];

const Header = ({ searchTerm, setSearchTerm, onSearchSubmit }) => {
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const theme = useTheme();
  // Below "md" (900px) there isn't reliably enough room for logo + 3 nav
  // icons + search + a text button all on one line, so that whole range
  // collapses into a hamburger menu instead of silently overflowing.
  const isCompact = useMediaQuery(theme.breakpoints.down("md"));
  const isTiny = useMediaQuery(theme.breakpoints.down(380));

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

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNavClick = (id) => {
    setDrawerOpen(false);
    // Let the drawer's close transition finish before the page scrolls,
    // otherwise the jump happens behind the closing panel.
    setTimeout(() => scrollToSection(id), 200);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Shared trigger: geocode + scroll to list
  const triggerSearch = () => {
    if (!searchTerm?.trim()) return;
    onSearchSubmit(searchTerm);
    setDrawerOpen(false);
    // Small delay so map re-renders before we scroll
    setTimeout(() => scrollToSection("list-content"), 300);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") triggerSearch();
  };

  return (
    <>
      <StyledAppBar hide={scrollDirection === "down"}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 1, sm: 1.5, md: 2 },
            px: { xs: 1.5, sm: 2 },
            minHeight: { xs: 64, sm: 70 },
          }}
        >
          {/* LOGO */}
          <LogoContainer>
            <Avatar
              src="/logo.png"
              sx={{
                width: { xs: 36, sm: 40, md: 45 },
                height: { xs: 36, sm: 40, md: 45 },
                mr: { xs: 1, md: 1.5 },
                border: "2px solid white",
                flexShrink: 0,
              }}
            />
            {/* Hide the wordmark only on the very narrowest phones, where
                logo + hamburger + a usable search box can't all fit otherwise. */}
            {!isTiny && (
              <Typography
                variant="h5"
                noWrap
                sx={{
                  fontFamily: "Poppins",
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: { xs: "1.05rem", sm: "1.3rem", md: "1.5rem" },
                  lineHeight: 1.1,
                }}
              >
                Travel Buddy
              </Typography>
            )}
          </LogoContainer>

          {/* DESKTOP NAVIGATION — icons only, shown md and up */}
          {!isCompact && (
            <NavLinks>
              {NAV_ITEMS.map((item) => (
                <StyledIconButton
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  aria-label={item.label}
                >
                  {item.icon}
                </StyledIconButton>
              ))}
            </NavLinks>
          )}

          {/* SEARCH BAR — always visible, flexes to fill remaining space */}
          <SearchBarWrapper>
            <IconButton
              size="small"
              onClick={triggerSearch}
              sx={{ color: "rgba(255,255,255,0.7)", p: 0.5, flexShrink: 0 }}
              aria-label="search"
            >
              <SearchIcon fontSize="small" />
            </IconButton>

            <SearchInput
              placeholder={isTiny ? "Search city..." : "Search a city ..."}
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              inputProps={{ "aria-label": "search for a city" }}
            />

            {searchTerm && (
              <IconButton
                size="small"
                onClick={() => setSearchTerm("")}
                sx={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </SearchBarWrapper>

          {/* AI BUTTON — desktop only; mobile gets it inside the drawer instead
              of losing it entirely */}
          {!isCompact && (
            <AiButton onClick={() => scrollToSection("ai-section")}>
              Get AI Recommendation
            </AiButton>
          )}

          {/* HAMBURGER — replaces nav icons + AI button below md */}
          {isCompact && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ color: "#fff", flexShrink: 0 }}
              aria-label="open menu"
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </StyledAppBar>

      {/* MOBILE / TABLET DRAWER */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 260,
            background: "linear-gradient(160deg, #141E30, #243B55)",
            color: "#fff",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}>
          <Avatar src="/logo.png" sx={{ width: 36, height: 36, border: "2px solid white" }} />
          <Typography variant="h6" sx={{ fontFamily: "Poppins", fontWeight: 700 }}>
            Travel Buddy
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />
        <List sx={{ py: 1 }}>
          {NAV_ITEMS.map((item) => (
            <ListItemButton
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              sx={{
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
              }}
            >
              <ListItemIcon sx={{ color: "#fff", minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.15)" }} />
        <Box sx={{ p: 2 }}>
          <AiButton
            fullWidth
            startIcon={<AutoAwesomeIcon />}
            onClick={() => {
              setDrawerOpen(false);
              setTimeout(() => scrollToSection("ai-section"), 200);
            }}
          >
            Get AI Recommendation
          </AiButton>
        </Box>
      </Drawer>
    </>
  );
};

/* =========================
   STYLES
========================= */

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "hide",
})(({ hide }) => ({
  background: "linear-gradient(135deg, #141E30, #243B55)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  transition: "top 0.4s ease",
  top: hide ? "-80px" : "0",
}));

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
  // Lets the search bar take the squeeze first instead of the logo
  // overflowing or wrapping awkwardly.
  minWidth: 0,
});

const NavLinks = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  flexShrink: 0,
}));

const SearchBarWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  background: "rgba(255,255,255,0.1)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: "30px",
  padding: "4px 14px",
  flexGrow: 1,
  // No fixed maxWidth on small screens — this is what was clipping the
  // placeholder text to "Search a ci...". Cap it only once there's
  // genuinely spare room (md+).
  maxWidth: "100%",
  minWidth: 0,
  [theme.breakpoints.up("md")]: {
    maxWidth: "320px",
  },
  transition: "border-color 0.25s",
  "&:focus-within": {
    borderColor: "#00c6ff",
    background: "rgba(255,255,255,0.14)",
  },
}));

const SearchInput = styled(InputBase)({
  color: "#fff",
  flexGrow: 1,
  minWidth: 0,
  fontFamily: "'Poppins', sans-serif",
  fontSize: "0.9rem",
  marginLeft: "6px",
  "& input": {
    textOverflow: "ellipsis",
  },
  "& input::placeholder": {
    color: "rgba(255,255,255,0.45)",
    opacity: 1,
  },
});

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
  whiteSpace: "nowrap",
  flexShrink: 0,
});

export default Header;