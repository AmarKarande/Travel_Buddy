import React, { useState, useEffect, createRef } from "react";

import {
  CircularProgress,
  Grid,
  Typography,
  Box,
  IconButton,
  Button,
  MenuItem,
  Menu,
} from "@mui/material";

import { styled } from "@mui/material/styles";

import PlaceDetails from "./PlaceDetails";

import RestaurantIcon from "@mui/icons-material/Restaurant";
import HotelIcon from "@mui/icons-material/Hotel";
import AttractionsIcon from "@mui/icons-material/LocalActivity";
import GridOnIcon from "@mui/icons-material/GridOn";
import ListIcon from "@mui/icons-material/List";
import FilterListIcon from "@mui/icons-material/FilterList";

/* =========================
   Styled Components
========================= */

const ContainerWrapper = styled("div")(({ theme }) => ({
  padding: "24px",

  background: "linear-gradient(135deg, #1e293b, #0f172a)",

  borderRadius: "28px",

  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",

  marginTop: "24px",

  marginBottom: "24px",
}));

const Title = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",

  fontWeight: 700,

  color: "#fff",

  marginBottom: "20px",

  fontSize: "2rem",

  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
  },
}));

const ControlsContainer = styled(Box)(({ theme }) => ({
  display: "flex",

  justifyContent: "space-between",

  alignItems: "center",

  marginBottom: "24px",

  flexWrap: "wrap",

  gap: "16px",
}));

const CategoryButton = styled(Button)(({ selected }) => ({
  borderRadius: "30px",

  padding: "10px 20px",

  textTransform: "none",

  fontWeight: 600,

  transition: "0.3s",

  background: selected
    ? "linear-gradient(to right, #00c6ff, #0072ff)"
    : "rgba(255,255,255,0.08)",

  color: "#fff",

  border: "1px solid rgba(255,255,255,0.1)",

  "&:hover": {
    background: "linear-gradient(to right, #0072ff, #00c6ff)",
    transform: "translateY(-2px)",
  },
}));

const StyledIconButton = styled(IconButton)({
  color: "#fff",

  background: "rgba(255,255,255,0.08)",

  marginLeft: "8px",

  transition: "0.3s",

  "&:hover": {
    background: "rgba(255,255,255,0.15)",
    transform: "scale(1.05)",
  },
});

const ListWrapper = styled(Grid)(({ theme }) => ({
  maxHeight: "75vh",

  minHeight: "200px",

  overflowY: "auto",

  paddingRight: "6px",

  marginTop: "10px",

  "&::-webkit-scrollbar": {
    width: "8px",
  },

  "&::-webkit-scrollbar-thumb": {
    background:
      "linear-gradient(to bottom, #00c6ff, #0072ff)",

    borderRadius: "10px",
  },

  "&::-webkit-scrollbar-track": {
    background: "rgba(255,255,255,0.05)",
    borderRadius: "10px",
  },
}));

/* =========================
   Component
========================= */

const List = ({
  places,
  childClicked,
  isLoading,
  type,
  setType,
  rating,
  setRating,
}) => {
  const [elRefs, setElRefs] = useState([]);

  const [layout, setLayout] = useState("grid");

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const refs = Array(places?.length)
      .fill()
      .map((_, i) => elRefs[i] || createRef());

    setElRefs(refs);
  }, [places]);

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  return (
    <ContainerWrapper>
      <Title variant="h4">
        Discover Restaurants, Hotels & Attractions
      </Title>

      {isLoading ? (
        <Box
          height="600px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress
            size="5rem"
            sx={{ color: "#00c6ff" }}
          />
        </Box>
      ) : (
        <>
          {/* Controls */}
          <ControlsContainer>
            {/* Category Buttons */}
            <Box display="flex" gap={1} flexWrap="wrap">
              <CategoryButton
                selected={type === "restaurants"}
                onClick={() => setType("restaurants")}
                startIcon={<RestaurantIcon />}
              >
                Restaurants
              </CategoryButton>

              <CategoryButton
                selected={type === "hotels"}
                onClick={() => setType("hotels")}
                startIcon={<HotelIcon />}
              >
                Hotels
              </CategoryButton>

              <CategoryButton
                selected={type === "attractions"}
                onClick={() => setType("attractions")}
                startIcon={<AttractionsIcon />}
              >
                Attractions
              </CategoryButton>
            </Box>

            {/* Right Controls */}
            <Box display="flex" alignItems="center">
              {/* Filter */}
              <StyledIconButton onClick={handleFilterClick}>
                <FilterListIcon />
              </StyledIconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleFilterClose}
              >
                <MenuItem
                  onClick={() => {
                    setRating(0);
                    handleFilterClose();
                  }}
                >
                  All Ratings
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setRating(3);
                    handleFilterClose();
                  }}
                >
                  Above 3.0 ★
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setRating(4);
                    handleFilterClose();
                  }}
                >
                  Above 4.0 ★
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    setRating(4.5);
                    handleFilterClose();
                  }}
                >
                  Above 4.5 ★
                </MenuItem>
              </Menu>

              {/* Grid View */}
              <StyledIconButton
                onClick={() => handleLayoutChange("grid")}
              >
                <GridOnIcon
                  sx={{
                    color:
                      layout === "grid"
                        ? "#00c6ff"
                        : "#fff",
                  }}
                />
              </StyledIconButton>

              {/* List View */}
              <StyledIconButton
                onClick={() => handleLayoutChange("list")}
              >
                <ListIcon
                  sx={{
                    color:
                      layout === "list"
                        ? "#00c6ff"
                        : "#fff",
                  }}
                />
              </StyledIconButton>
            </Box>
          </ControlsContainer>

          {/* Places */}
          {places?.length === 0 ? (
            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                textAlign: "center",
                marginTop: "50px",
              }}
            >
              No places found
            </Typography>
          ) : (
            <ListWrapper container spacing={3}>
              {places?.map((place, i) => (
                <Grid
                  ref={elRefs[i]}
                  item
                  key={i}
                  xs={12}
                  sm={layout === "grid" ? 6 : 12}
                  md={layout === "grid" ? 4 : 12}
                >
                  <PlaceDetails
                    place={place}
                    selected={Number(childClicked) === i}
                    refProp={elRefs[i]}
                  />
                </Grid>
              ))}
            </ListWrapper>
          )}
        </>
      )}
    </ContainerWrapper>
  );
};

export default List;