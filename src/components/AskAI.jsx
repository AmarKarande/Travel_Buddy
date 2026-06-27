import React, { useCallback, useEffect, useRef, useState } from "react";

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

// Sanitizes the AI's HTML-formatted response before rendering it with
// dangerouslySetInnerHTML, so the model's own <b>/<br> formatting renders
// while anything unexpected (scripts, event handlers, etc.) is stripped.
import DOMPurify from "dompurify";

// Current Google Gen AI SDK. The old `@google/generative-ai` package
// (GoogleGenerativeAI export) is deprecated — all support for it ended
// November 30, 2025. See: https://github.com/google-gemini/deprecated-generative-ai-js
import { GoogleGenAI } from "@google/genai";

import { formatResponseText } from "../utils/formatText";
import { steps } from "../constants/constants";

/* =========================
   CONSTANTS
========================= */

// Wizard step indices, named so the JSX below doesn't rely on magic numbers.
const STEP = {
  CITY: 0,
  DAYS: 1,
  BUDGET: 2,
  MOOD: 3,
  RESULT: 4,
};

const MIN_DAYS = 1;
const MAX_DAYS = 30;

// gemini-2.5-flash-lite is mid-shutdown as of mid-2026; gemini-3.5-flash is
// the current GA model recommended for general agentic/text tasks.
// Re-check https://ai.google.dev/gemini-api/docs/models periodically since
// Google's deprecation cadence has been fast.
const GEMINI_MODEL = "gemini-3.5-flash";

const COLORS = {
  bg1: "#0F172A",
  bg2: "#1E293B",
  primary: "#4F46E5",
  secondary: "#06B6D4",
  accent: "#8B5CF6",
  text: "#E2E8F0",
  muted: "#94A3B8",
};

/* =========================
   STYLES
========================= */

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const Page = styled(Box)({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  padding: "40px 20px",
});

const Container = styled(Paper)({
  position: "relative",
  width: "100%",
  maxWidth: "920px",
  padding: "50px",
  borderRadius: "28px",
  background: "rgba(15, 23, 42, 0.85)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
  color: COLORS.text,
  "&::before": {
    content: '""',
    position: "absolute",
    width: "320px",
    height: "320px",
    top: "-120px",
    right: "-120px",
    background: COLORS.primary,
    filter: "blur(140px)",
    opacity: 0.25,
    zIndex: -1,
  },
});

const Title = styled(Typography)({
  fontSize: "2.8rem",
  fontWeight: 900,
  textAlign: "center",
  background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent}, ${COLORS.secondary})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

const Subtitle = styled(Typography)({
  textAlign: "center",
  color: COLORS.muted,
  marginTop: "6px",
});

const StepBox = styled(Box)({ marginTop: "35px" });

const Card = styled(Paper)({
  padding: "30px",
  borderRadius: "20px",
  background: "rgba(30, 41, 59, 0.75)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(14px)",
  color: COLORS.text,
});

const Counter = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 20px",
  borderRadius: "14px",
  background: "rgba(51, 65, 85, 0.6)",
});

const MoodCard = styled(Paper)({
  padding: "26px",
  borderRadius: "18px",
  textAlign: "center",
  cursor: "pointer",
  background: "linear-gradient(145deg, #1E293B, #334155)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
  animation: `${float} 4.5s ease-in-out infinite`,
  transition: "0.3s ease",
  "&:hover": {
    transform: "translateY(-8px) scale(1.04)",
    background: "linear-gradient(145deg, #4F46E5, #8B5CF6)",
    boxShadow: "0 20px 45px rgba(79,70,229,0.4)",
  },
  "&:focus-visible": {
    outline: `2px solid ${COLORS.secondary}`,
    outlineOffset: "3px",
  },
  "& svg": { fontSize: 42, color: COLORS.secondary },
});

const ResponseBox = styled(Box)({
  marginTop: "30px",
  padding: "25px",
  borderRadius: "18px",
  background: "rgba(30, 41, 59, 0.75)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: COLORS.text,
  whiteSpace: "pre-line",
  lineHeight: 1.8,
});

const ErrorBox = styled(Box)({
  marginTop: "12px",
  padding: "14px 18px",
  borderRadius: "12px",
  background: "rgba(220,38,38,0.15)",
  border: "1px solid rgba(220,38,38,0.3)",
  color: "#fca5a5",
  fontSize: "0.85rem",
  fontFamily: "monospace",
});

const RetryNote = styled(Typography)({
  marginTop: "8px",
  color: COLORS.muted,
  fontSize: "0.8rem",
});

/* =========================
   HELPERS
========================= */

// Pulls a numeric retry delay (ms) out of a Gemini rate-limit error if
// present, otherwise falls back to a sensible default.
const getRetryDelayMs = (err, fallbackMs = 30000) => {
  try {
    const details =
      err?.errorDetails ||
      err?.response?.errorDetails ||
      (typeof err?.message === "string" && err.message.includes("RetryInfo")
        ? JSON.parse(err.message.slice(err.message.indexOf("[")))
        : null);

    if (Array.isArray(details)) {
      const retryInfo = details.find((d) => d["@type"]?.includes("RetryInfo"));
      if (retryInfo?.retryDelay) {
        // retryDelay looks like "29.70s" or "29s"
        const seconds = parseFloat(retryInfo.retryDelay.replace("s", ""));
        if (!Number.isNaN(seconds)) return Math.ceil(seconds * 1000);
      }
    }
  } catch {
    // Ignore parse issues, use fallback.
  }
  return fallbackMs;
};

const isRateLimitError = (err) => {
  const msg = err?.message || "";
  const status = err?.status || err?.response?.status || err?.code;
  return status === 429 || /429|quota|rate limit/i.test(msg);
};

const isMissingKeyError = (msg) => /api[_ ]?key/i.test(msg || "");

/**
 * Calls Gemini with automatic retry on 429 / quota errors, honoring the
 * server-provided retry delay when available. Calls onRetry before each
 * retry so the UI can show progress. Aborts early if `signal` is already
 * aborted (e.g. the user navigated away).
 */
const callGeminiWithRetry = async (
  ai,
  prompt,
  { maxRetries = 2, onRetry, signal } = {}
) => {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

    try {
      return await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
      });
    } catch (e) {
      lastError = e;
      if (isRateLimitError(e) && attempt < maxRetries) {
        const delay = getRetryDelayMs(e);
        onRetry?.(attempt + 1, maxRetries, delay);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw e;
    }
  }
  throw lastError;
};

const getFriendlyErrorMessage = (e) => {
  const rawMsg = e?.message || JSON.stringify(e);

  if (isMissingKeyError(rawMsg) && /missing|REACT_APP/i.test(rawMsg)) {
    return rawMsg; // Already a clear, actionable message from our own check.
  }

  if (isRateLimitError(e)) {
    return "The AI service is temporarily rate-limited (quota exceeded). We tried retrying automatically — please wait a minute and try again.";
  }

  if (/failed to fetch|network|networkerror/i.test(rawMsg)) {
    return (
      "Couldn't reach the AI service. This usually means: (1) your API key wasn't " +
      "loaded — confirm REACT_APP_GEMINI_API_KEY is set in .env and restart `npm start`, " +
      "(2) an ad blocker or browser extension is blocking the request, or " +
      "(3) there's no network path to generativelanguage.googleapis.com. " +
      "Check the browser console and Network tab for more detail."
    );
  }

  return `Error: ${rawMsg}`;
};

const buildPrompt = ({ days, city, budget, mood }) =>
  `Plan a ${days}-day trip to ${city}.
Budget: ${budget}.
Mood: ${mood}.
Include day-by-day itinerary, hotel recommendations, must-try food, travel tips, and hidden gems.`;

// Allow only simple text-formatting tags from the AI response. No links,
// images, scripts, styles, or event-handler attributes — the model's output
// only needs to bold, italicize, line-break, and structure text.
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ["b", "strong", "i", "em", "br", "p", "ul", "ol", "li", "h3", "h4"],
  ALLOWED_ATTR: [],
};

const sanitizeResponseHtml = (html) => DOMPurify.sanitize(html, SANITIZE_CONFIG);

/* =========================
   COMPONENT
========================= */

const AskAI = () => {
  const [activeStep, setActiveStep] = useState(STEP.CITY);
  const [city, setCity] = useState("");
  const [days, setDays] = useState(MIN_DAYS);
  const [budget, setBudget] = useState("");
  const [response, setResponse] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [rawErrorMsg, setRawErrorMsg] = useState(""); // Technical detail, shown collapsed.
  const [loading, setLoading] = useState(false);
  const [retryStatus, setRetryStatus] = useState(""); // Shown while auto-retrying.

  // Tracks the in-flight request so a stale response/error can't overwrite
  // a newer one if the component unmounts or the user restarts the wizard.
  const abortRef = useRef(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const goNext = () => setActiveStep((prev) => prev + 1);

  const decrementDays = () => setDays((prev) => Math.max(MIN_DAYS, prev - 1));
  const incrementDays = () => setDays((prev) => Math.min(MAX_DAYS, prev + 1));

  const resetWizard = () => {
    abortRef.current?.abort();
    setActiveStep(STEP.CITY);
    setResponse("");
    setErrorMsg("");
    setRawErrorMsg("");
    setRetryStatus("");
  };

  const handleSubmit = useCallback(
    async (mood) => {
      // Cancel any previous in-flight request before starting a new one.
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setActiveStep(STEP.RESULT);
      setErrorMsg("");
      setRawErrorMsg("");
      setRetryStatus("");
      setResponse("");

      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) {
        setErrorMsg("REACT_APP_GEMINI_API_KEY is missing from your .env file.");
        setLoading(false);
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = buildPrompt({ days, city, budget, mood });

        const result = await callGeminiWithRetry(ai, prompt, {
          maxRetries: 2,
          signal: controller.signal,
          onRetry: (attempt, maxRetries, delayMs) => {
            if (controller.signal.aborted) return;
            setRetryStatus(
              `Rate limited — retrying (${attempt}/${maxRetries}) in ${Math.round(
                delayMs / 1000
              )}s...`
            );
          },
        });

        if (controller.signal.aborted) return;

        const text = result.text ?? "";
        setResponse(formatResponseText(text));
        setRetryStatus("");
      } catch (e) {
        if (controller.signal.aborted || e?.name === "AbortError") return;

        console.error("Gemini API Error:", e);
        setErrorMsg(getFriendlyErrorMessage(e));
        setRawErrorMsg(e?.message || JSON.stringify(e));
        setRetryStatus("");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    },
    [days, city, budget]
  );

  return (
    <Page>
      <Container>
        <Title>AI Travel Planner</Title>
        <Subtitle>Plan your perfect trip with Gemini AI</Subtitle>

        {/* STEP 1 - CITY */}
        {activeStep === STEP.CITY && (
          <StepBox>
            <Card>
              <Typography sx={{ fontWeight: 600 }} component="label" htmlFor="destination-input">
                Enter Destination
              </Typography>
              <TextField
                id="destination-input"
                fullWidth
                placeholder="e.g. Paris, Tokyo, Goa"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && city.trim() && goNext()}
                sx={{
                  mt: 2,
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    background: "rgba(15,23,42,0.6)",
                    borderRadius: "14px",
                  },
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                }}
              />
              <Button
                variant="contained"
                disabled={!city.trim()}
                onClick={goNext}
                sx={{
                  mt: 3,
                  background: "linear-gradient(90deg,#4F46E5,#8B5CF6)",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "12px",
                  px: 4,
                }}
              >
                Continue
              </Button>
            </Card>
          </StepBox>
        )}

        {/* STEP 2 - DAYS */}
        {activeStep === STEP.DAYS && (
          <StepBox>
            <Card>
              <Typography sx={{ fontWeight: 600 }}>Trip Duration</Typography>
              <Counter sx={{ mt: 2 }}>
                <IconButton
                  onClick={decrementDays}
                  disabled={days <= MIN_DAYS}
                  aria-label="Decrease number of days"
                >
                  <RemoveIcon sx={{ color: "#fff" }} />
                </IconButton>
                <Typography fontSize="18px" fontWeight={600} aria-live="polite">
                  {days} {days === 1 ? "Day" : "Days"}
                </Typography>
                <IconButton
                  onClick={incrementDays}
                  disabled={days >= MAX_DAYS}
                  aria-label="Increase number of days"
                >
                  <AddIcon sx={{ color: "#fff" }} />
                </IconButton>
              </Counter>
              <Button
                variant="contained"
                onClick={goNext}
                sx={{
                  mt: 3,
                  background: "linear-gradient(90deg,#06B6D4,#4F46E5)",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "12px",
                }}
              >
                Continue
              </Button>
            </Card>
          </StepBox>
        )}

        {/* STEP 3 - BUDGET */}
        {activeStep === STEP.BUDGET && (
          <StepBox>
            <Card>
              <Typography sx={{ fontWeight: 600 }} component="label" htmlFor="budget-select">
                Select Budget
              </Typography>
              <TextField
                id="budget-select"
                select
                fullWidth
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                sx={{
                  mt: 2,
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    background: "rgba(15,23,42,0.6)",
                    borderRadius: "14px",
                  },
                  "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                  "& .MuiSvgIcon-root": { color: "#fff" },
                }}
              >
                <MenuItem value="Economic">💰 Economic</MenuItem>
                <MenuItem value="Normal">🏨 Normal</MenuItem>
                <MenuItem value="Luxury">💎 Luxury</MenuItem>
              </TextField>
              <Button
                variant="contained"
                disabled={!budget}
                onClick={goNext}
                sx={{
                  mt: 3,
                  background: "linear-gradient(90deg,#8B5CF6,#4F46E5)",
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "12px",
                }}
              >
                Continue
              </Button>
            </Card>
          </StepBox>
        )}

        {/* STEP 4 - MOOD */}
        {activeStep === STEP.MOOD && (
          <StepBox>
            <Typography textAlign="center" fontWeight={600} sx={{ mb: 2 }}>
              Choose Travel Mood
            </Typography>
            <Grid container spacing={2}>
              {steps[STEP.MOOD].options.map((opt) => (
                <Grid item xs={12} sm={6} md={4} key={opt.label}>
                  <MoodCard
                    onClick={() => handleSubmit(opt.label)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSubmit(opt.label);
                      }
                    }}
                  >
                    <TravelExploreIcon />
                    <Typography mt={1}>{opt.label}</Typography>
                  </MoodCard>
                </Grid>
              ))}
            </Grid>
          </StepBox>
        )}

        {/* STEP 5 - RESULT */}
        {activeStep === STEP.RESULT && (
          <ResponseBox role="status" aria-live="polite">
            {loading ? (
              <Box textAlign="center">
                <CircularProgress sx={{ color: "#4F46E5" }} />
                <Typography mt={2} color={COLORS.muted}>
                  Creating your personalized itinerary for {city}...
                </Typography>
                {retryStatus && <RetryNote>{retryStatus}</RetryNote>}
              </Box>
            ) : (
              <>
                <Typography sx={{ fontWeight: 700, mb: 2, color: "#06B6D4" }}>
                  Your AI Travel Plan ✈️
                </Typography>

                {errorMsg ? (
                  <>
                    <Typography color="#fca5a5" fontWeight={600}>
                      Something went wrong:
                    </Typography>
                    <ErrorBox>{errorMsg}</ErrorBox>
                    {rawErrorMsg && (
                      <details style={{ marginTop: 8 }}>
                        <summary style={{ cursor: "pointer", color: COLORS.muted }}>
                          Technical details
                        </summary>
                        <ErrorBox>{rawErrorMsg}</ErrorBox>
                      </details>
                    )}
                    <Button
                      onClick={resetWizard}
                      sx={{ mt: 2, color: "#06B6D4", textTransform: "none" }}
                    >
                      ← Try again
                    </Button>
                  </>
                ) : (
                  <>
                    <Box
                      dangerouslySetInnerHTML={{
                        __html: sanitizeResponseHtml(response),
                      }}
                    />
                    <Button
                      onClick={resetWizard}
                      sx={{ mt: 3, color: "#06B6D4", textTransform: "none", display: "block" }}
                    >
                      ← Plan another trip
                    </Button>
                  </>
                )}
              </>
            )}
          </ResponseBox>
        )}
      </Container>
    </Page>
  );
};

export default AskAI;