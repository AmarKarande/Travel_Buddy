import React from "react";

import {
  Container,
  Typography,
  Link,
  Grid,
  Box,
} from "@mui/material";

import {
  Twitter,
  LinkedIn,
  GitHub,
  Language,
} from "@mui/icons-material";

import { styled } from "@mui/material/styles";

/* =========================
   Styled Components
========================= */

const FooterWrapper = styled("footer")(({ theme }) => ({
  position: "relative",

  background: `
    linear-gradient(
      135deg,
      #141E30 0%,
      #243B55 50%,
      #0F2027 100%
    )
  `,

  padding: theme.spacing(8, 0, 5),

  marginTop: "60px",

  borderTop: "1px solid rgba(255,255,255,0.08)",

  overflow: "hidden",
}));

const Overlay = styled(Box)({
  position: "absolute",

  inset: 0,

  background:
    "radial-gradient(circle at top right, rgba(0,114,255,0.15), transparent 30%)",
});

const FooterContent = styled(Container)({
  position: "relative",

  zIndex: 2,

  textAlign: "center",
});

const BrandTitle = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",

  fontWeight: 700,

  color: "#fff",

  marginBottom: "10px",

  letterSpacing: "1px",
});

const BrandSubtitle = styled(Typography)({
  color: "rgba(255,255,255,0.7)",

  maxWidth: "600px",

  margin: "0 auto 30px",

  lineHeight: 1.8,

  fontFamily: "'Poppins', sans-serif",
});

const SocialIcon = styled(Link)({
  width: "55px",

  height: "55px",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  borderRadius: "50%",

  background: "rgba(255,255,255,0.08)",

  backdropFilter: "blur(10px)",

  border: "1px solid rgba(255,255,255,0.1)",

  color: "#fff",

  transition: "0.4s",

  "&:hover": {
    transform: "translateY(-6px)",

    background:
      "linear-gradient(to right, #00c6ff, #0072ff)",

    boxShadow: "0 10px 24px rgba(0,114,255,0.4)",
  },
});

const FooterBottom = styled(Box)({
  marginTop: "40px",

  paddingTop: "24px",

  borderTop: "1px solid rgba(255,255,255,0.08)",
});

const FooterText = styled(Typography)({
  color: "rgba(255,255,255,0.6)",

  fontFamily: "'Poppins', sans-serif",

  letterSpacing: "0.5px",
});

/* =========================
   Component
========================= */

const Footer = () => {
  return (
    <FooterWrapper>
      <Overlay />

      <FooterContent maxWidth="lg">
        {/* Brand */}
        <BrandTitle variant="h4">
          TravelBuddy
        </BrandTitle>

        <BrandSubtitle variant="body1">
          Your intelligent travel companion for discovering exceptional destinations,
           premium stays, local dining, and unforgettable experiences.
        </BrandSubtitle>

        {/* Social Icons */}
        <Grid
          container
          spacing={3}
          justifyContent="center"
        >
          <Grid item>
            <SocialIcon
              href=""
              target="_blank"
            >
              <Language fontSize="medium" />
            </SocialIcon>
          </Grid>

          <Grid item>
            <SocialIcon
              href=""
              target="_blank"
            >
              <Twitter fontSize="medium" />
            </SocialIcon>
          </Grid>

          <Grid item>
            <SocialIcon
              href=""
              target="_blank"
            >
              <LinkedIn fontSize="medium" />
            </SocialIcon>
          </Grid>

          <Grid item>
            <SocialIcon
              href=""
              target="_blank"
            >
              <GitHub fontSize="medium" />
            </SocialIcon>
          </Grid>
        </Grid>

        {/* Bottom */}
        <FooterBottom>
          <FooterText variant="body2">
            © 2026 TravelBuddy. All Rights Reserved.
          </FooterText>
        </FooterBottom>
      </FooterContent>
    </FooterWrapper>
  );
};

export default Footer;