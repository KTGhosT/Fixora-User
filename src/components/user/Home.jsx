import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  IconButton,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowForward, NavigateBefore, NavigateNext } from "@mui/icons-material";
import "./HomeHero.css";

// Styled Components
const HeroContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
}));

const ContentWrapper = styled(Container)(({ theme }) => ({
  position: "relative",
  zIndex: 10,
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #FF6B35 0%, #FF8E53 50%, #FF6B35 100%)",
  backgroundSize: "200% 200%",
  border: 0,
  borderRadius: "50px",
  color: "white",
  fontWeight: "bold",
  padding: "12px 32px",
  textTransform: "none",
  fontSize: "16px",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.4s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 25px rgba(255, 107, 53, 0.4)",
  },
}));

const CarouselButton = styled(IconButton)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  color: "white",
  "&:hover": {
    background: "rgba(255, 107, 53, 0.8)",
    transform: "scale(1.1)",
  },
  transition: "all 0.3s ease",
}));

const StatCard = styled(Box)(({ theme }) => ({
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
  },
}));

const ModernHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const slides = [
    {
      image: "/api/placeholder/1200/800",
      title: "Professional Home Services",
      subtitle: "Expert care for your home"
    },
    {
      image: "/api/placeholder/1200/800",
      title: "Skilled Technicians",
      subtitle: "Certified professionals at your service"
    },
    {
      image: "/api/placeholder/1200/800",
      title: "24/7 Availability",
      subtitle: "Whenever you need us"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    
    <HeroContainer className="modern-hero">
      {/* Background Carousel */}
      <div className="carousel-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slide-overlay"></div>
          </div>
        ))}
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
      </div>

      <ContentWrapper maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} lg={6}>
            <div className={`hero-content ${isVisible ? "visible" : ""}`}>
              <div className="content-inner">
                <Typography
                  variant="h6"
                  component="div"
                  className="hero-badge"
                  sx={{ color: "#FF8E53", mb: 2 }}
                >
                  Premium Service Provider
                </Typography>

                <Typography
                  variant="h1"
                  component="h1"
                  className="hero-title"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                    lineHeight: 1.1,
                    mb: 3,
                  }}
                >
                  Transforming{" "}
                  <span className="gradient-text">Homes</span> with
                  Expert Care
                </Typography>

                <Typography
                  variant="h6"
                  component="p"
                  className="hero-subtitle"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    mb: 4,
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    lineHeight: 1.6,
                  }}
                >
                  Discover premium home services with certified professionals. 
                  Quality workmanship guaranteed for all your home needs.
                </Typography>

                {/* Stats */}
                <Box className="stats-container" sx={{ mb: 4 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <StatCard>
                        <Typography
                          variant="h3"
                          component="div"
                          className="stat-number gradient-text"
                          sx={{ fontWeight: "bold" }}
                        >
                          500+
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                        >
                          Services Completed
                        </Typography>
                      </StatCard>
                    </Grid>
                    <Grid item xs={6}>
                      <StatCard>
                        <Typography
                          variant="h3"
                          component="div"
                          className="stat-number gradient-text"
                          sx={{ fontWeight: "bold" }}
                        >
                          200+
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                        >
                          Happy Customers
                        </Typography>
                      </StatCard>
                    </Grid>
                  </Grid>
                </Box>

                {/* CTA Buttons */}
                <Box className="cta-buttons" sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <GradientButton
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    className="cta-button-primary"
                  >
                    BECOME A WORKER
                  </GradientButton>
                  <Button
                    variant="outlined"
                    size="large"
                    className="cta-button-secondary"
                    sx={{
                      color: "white",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      borderRadius: "50px",
                      textTransform: "none",
                      fontWeight: "bold",
                      padding: "12px 32px",
                      "&:hover": {
                        borderColor: "#FF6B35",
                        background: "rgba(255, 107, 53, 0.1)",
                      },
                    }}
                  >
                    FIND A WORKER
                  </Button>
                </Box>
              </div>
            </div>
          </Grid>

          {/* Right Content - Carousel Controls */}
          <Grid item xs={12} lg={6}>
            <div className="carousel-controls-section">
              <div className="carousel-navigation">
                <CarouselButton onClick={prevSlide} className="nav-button">
                  <NavigateBefore />
                </CarouselButton>
                
                <div className="slide-indicators">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      className={`indicator ${index === currentSlide ? "active" : ""}`}
                      onClick={() => goToSlide(index)}
                    />
                  ))}
                </div>
                
                <CarouselButton onClick={nextSlide} className="nav-button">
                  <NavigateNext />
                </CarouselButton>
              </div>

              {/* Current Slide Preview */}
              <div className="current-slide-info">
                <Typography
                  variant="h5"
                  sx={{ color: "white", fontWeight: "bold", mb: 1 }}
                >
                  {slides[currentSlide].title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  {slides[currentSlide].subtitle}
                </Typography>
              </div>
            </div>
          </Grid>
        </Grid>
      </ContentWrapper>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-line"></div>
        <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
          Scroll to Explore
        </Typography>
      </div>
    </HeroContainer>
  );
};

export default ModernHero;