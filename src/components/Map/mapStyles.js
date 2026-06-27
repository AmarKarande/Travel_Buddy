// mapStyles.js
// mapTypeId is set to "terrain" in Map.jsx, which gives real
// elevation/hillshading from Google's own raster tiles.
// Color stylers on natural geometry (land, water, parks) don't
// apply to that raster base, so this file only touches the
// vector overlays that still render on top of it: labels and
// roads. Keeping it slim and just dialing down visual noise.

const mapStyles = [
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },

  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#5b6b7c" }],
  },

  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#ffffff" }, { weight: 2 }],
  },

  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#2b3a4a" }],
  },

  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },

  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b7c8c" }],
  },

  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }],
  },

  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#e2e9ef" }],
  },

  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#b9c5d1" }],
  },

  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#5b6b7c" }],
  },

  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#d7e0e8" }],
  },

  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#aab9c8" }],
  },

  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#8c9fb3" }],
  },

  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3d4f61" }],
  },

  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
];

export default mapStyles;