import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Container, 
  Grid,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import "./HomeHero.css";

// Styled Components
const ContentWrapper = styled(Container)(({ theme }) => ({
  position: "relative",
  zIndex: 10,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "20px",
  padding: theme.spacing(3),
  textAlign: "center",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    borderColor: "rgba(255, 107, 53, 0.5)",
    background: "rgba(255, 255, 255, 0.08)",
  },
}));

const ModernHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <Box className="hero-background">
      {/* Background Glow Effect */}
      <div className="hero-glow-effect"></div>
      
      {/* Floating Geometric Shapes */}
      <div className="floating-geometry geometry-1"></div>
      <div className="floating-geometry geometry-2"></div>
      <div className="floating-geometry geometry-3"></div>

      <ContentWrapper maxWidth="lg">
        <Grid 
          container 
          spacing={6} 
          alignItems="center" 
          justifyContent="center"
          sx={{ 
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {/* Main Content */}
          <Grid 
            item 
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center"
            }}
          >
            <div 
              className={`hero-content-wrapper ${isVisible ? "visible" : ""}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                width: "100%"
              }}
            >
              
              {/* Badge */}
              <div className={`hero-badge fade-in-up ${isVisible ? "visible stagger-delay-0" : ""}`}>
                🏆 Rated #1 Home Service Platform
              </div>

              {/* Main Title */}
              <Typography
                variant="h1"
                component="h1"
                className={`hero-title fade-in-up ${isVisible ? "visible stagger-delay-1" : ""}`}
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                  lineHeight: 1.2,
                  mb: 3,
                  textAlign: "center",
                  mx: "auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%"
                }}
              >
                Your Trusted Partner for
                <br />
                <span style={{color: '#FF6B35'}}>All Home Services</span>
              </Typography>

              {/* Subtitle */}
              <Typography
                variant="h6"
                component="p"
                className={`hero-subtitle fade-in-up ${isVisible ? "visible stagger-delay-2" : ""}`}
                sx={{
                  fontSize: { xs: "1.1rem", md: "1.25rem" },
                  maxWidth: "600px",
                  textAlign: "center",
                  mx: "auto",
                  mb: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%"
                }}
              >
                Professional, reliable, and affordable services at your doorstep
              </Typography>

              {/* Feature Pills */}
              <div 
                className={`feature-pills fade-in-up ${isVisible ? "visible stagger-delay-2" : ""}`}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  textAlign: "center"
                }}
              >
                <div className="feature-pill">
                  <span className="pill-icon">✓</span>
                  Verified Professionals
                </div>
                <div className="feature-pill">
                  <span className="pill-icon">🕒</span>
                  24/7 Support
                </div>
                <div className="feature-pill">
                  <span className="pill-icon">⭐</span>
                  100% Satisfaction
                </div>
              </div>

              {/* Buttons */}
              <div 
                className={`hero-buttons fade-in-up ${isVisible ? "visible stagger-delay-3" : ""}`}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  textAlign: "center"
                }}
              >
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/services')}
                >
                  Book a Service
                  <span className="btn-icon">→</span>
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => navigate('/worker/register')}
                >
                  Register as a Worker
                  <span className="btn-icon">👷</span>
                </button>
              </div>


            </div>
          </Grid>
        </Grid>
      </ContentWrapper>

      {/* Scroll Indicator */}
      <div 
        className="scroll-indicator"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center"
        }}
      >
        <div className="scroll-line"></div>
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
          Scroll to Explore
        </Typography>
      </div>
    </Box>
  );
};

export default ModernHero;