import React, { useState } from "react";

import {
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";

import {
  Add as AddIcon,
  Remove as RemoveIcon,
  TravelExplore as TravelExploreIcon,
} from "@mui/icons-material";

import { styled, keyframes } from "@mui/material/styles";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { formatResponseText } from "../utils/formatText";

import { steps } from "../constants/constants";

/* =========================
   AI
========================= */

const genAI = new GoogleGenerativeAI(
  process.env.REACT_APP_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});

/* =========================
   ANIMATION
========================= */

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

/* =========================
   BACKGROUND
========================= */

const Page = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px",
  background:
    "radial-gradient(circle at top, #0f172a, #020617, #000000)",
});

/* =========================
   MAIN CARD
========================= */

const Container = styled(Paper)({
  position: "relative",
  width: "100%",
  maxWidth: "900px",
  padding: "50px",
  borderRadius: "30px",
  background:
    "rgba(255,255,255,0.05)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
  color: "#fff",
});

/* =========================
   HEADER
========================= */

const Title = styled(Typography)({
  fontSize: "2.8rem",
  fontWeight: 900,
  textAlign: "center",
  background: "linear-gradient(90deg,#00c6ff,#a855f7,#22d3ee)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

const Subtitle = styled(Typography)({
  textAlign: "center",
  color: "rgba(255,255,255,0.7)",
  marginTop: "8px",
});

/* =========================
   STEP CARDS
========================= */

const StepBox = styled(Box)({
  marginTop: "35px",
});

const Card = styled(Paper)({
  padding: "30px",
  borderRadius: "22px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
});

/* =========================
   COUNTER
========================= */

const Counter = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 20px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.06)",
});

/* =========================
   MOOD CARD
========================= */

const MoodCard = styled(Paper)({
  padding: "25px",
  borderRadius: "20px",
  textAlign: "center",
  cursor: "pointer",
  background:
    "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
  transition: "0.3s",
  animation: `${float} 4s ease-in-out infinite`,

  "&:hover": {
    transform: "scale(1.05)",
    background:
      "linear-gradient(145deg, rgba(0,198,255,0.25), rgba(168,85,247,0.25))",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
  },
});

/* =========================
   RESPONSE
========================= */

const ResponseBox = styled(Box)({
  marginTop: "30px",
  padding: "25px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
  whiteSpace: "pre-line",
  lineHeight: 1.8,
});

/* =========================
   COMPONENT
========================= */

const AskAI = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [city, setCity] = useState("");
  const [days, setDays] = useState(1);
  const [budget, setBudget] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const next = () => setActiveStep((p) => p + 1);
  const back = () => setActiveStep((p) => p - 1);

  const handleSubmit = async (mood) => {
    setLoading(true);
    setActiveStep(4);

    try {
      const prompt = `
Plan a ${days}-day trip to ${city}.
Budget: ${budget}.
Mood: ${mood}.

Include itinerary, hotels, food, travel tips, hidden gems.
`;

      const result = await model.generateContent(prompt);
      const text = await result.response.text();

      setResponse(formatResponseText(text));
    } catch (e) {
      setResponse("Failed to generate itinerary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Container>
        {/* HEADER */}
        <Title>AI Travel Planner</Title>
        <Subtitle>Plan your perfect trip with Gemini AI</Subtitle>

        {/* STEP 1 */}
        {activeStep === 0 && (
          <StepBox>
            <Card>
              <Typography>Enter Destination</Typography>
              <TextField
                fullWidth
                value={city}
                onChange={(e) => setCity(e.target.value)}
                sx={{ mt: 2 }}
              />

              <Button sx={{ mt: 2 }} disabled={!city} onClick={next}>
                Continue
              </Button>
            </Card>
          </StepBox>
        )}

        {/* STEP 2 */}
        {activeStep === 1 && (
          <StepBox>
            <Card>
              <Typography>Trip Duration</Typography>

              <Counter sx={{ mt: 2 }}>
                <IconButton onClick={() => days > 1 && setDays(days - 1)}>
                  <RemoveIcon />
                </IconButton>

                <Typography fontSize="20px">{days} Days</Typography>

                <IconButton onClick={() => setDays(days + 1)}>
                  <AddIcon />
                </IconButton>
              </Counter>

              <Button sx={{ mt: 2 }} onClick={next}>
                Continue
              </Button>
            </Card>
          </StepBox>
        )}

        {/* STEP 3 */}
        {activeStep === 2 && (
          <StepBox>
            <Card>
              <Typography>Budget</Typography>

              <TextField
                select
                fullWidth
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                sx={{ mt: 2 }}
              >
                <MenuItem value="Economic">Economic</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="Luxury">Luxury</MenuItem>
              </TextField>

              <Button sx={{ mt: 2 }} disabled={!budget} onClick={next}>
                Continue
              </Button>
            </Card>
          </StepBox>
        )}

        {/* STEP 4 */}
        {activeStep === 3 && (
          <StepBox>
            <Typography textAlign="center" mb={2}>
              Choose Travel Mood
            </Typography>

            <Grid container spacing={2}>
              {steps[3].options.map((opt) => (
                <Grid item xs={12} sm={6} md={4} key={opt.label}>
                  <MoodCard onClick={() => handleSubmit(opt.label)}>
                    <TravelExploreIcon sx={{ fontSize: 40 }} />
                    <Typography mt={1}>{opt.label}</Typography>
                  </MoodCard>
                </Grid>
              ))}
            </Grid>
          </StepBox>
        )}

        {/* RESPONSE */}
        {activeStep === 4 && (
          <ResponseBox>
            {loading ? (
              <Box textAlign="center">
                <CircularProgress sx={{ color: "#00c6ff" }} />
                <Typography mt={2}>Creating your itinerary...</Typography>
              </Box>
            ) : (
              response
            )}
          </ResponseBox>
        )}
      </Container>
    </Page>
  );
};

export default AskAI;