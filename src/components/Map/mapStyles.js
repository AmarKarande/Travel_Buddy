// mapStyles.js

export default [
  {
    elementType: "geometry",
    stylers: [{ color: "#0f172a" }],
  },

  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#0f172a" }],
  },

  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#94a3b8" }],
  },

  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#e2e8f0" }],
  },

  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#38bdf8" }],
  },

  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },

  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#22c55e" }],
  },

  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }],
  },

  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#334155" }],
  },

  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94a3b8" }],
  },

  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#2563eb" }],
  },

  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1d4ed8" }],
  },

  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }],
  },

  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0c4a6e" }],
  },

  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#38bdf8" }],
  },
];