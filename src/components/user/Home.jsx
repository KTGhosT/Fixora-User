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
import { 
  Star, 
  Security, 
  SupportAgent, 
  Schedule 
} from "@mui/icons-material";
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

  const features = [
    {
      icon: <Star />,
      title: "Premium Quality",
      description: "5-star rated services"
    },
    {
      icon: <Security />,
      title: "Verified Experts",
      description: "Background checked"
    },
    {
      icon: <SupportAgent />,
      title: "24/7 Support",
      description: "Always available"
    },
    {
      icon: <Schedule />,
      title: "Flexible Scheduling",
      description: "At your convenience"
    }
  ];

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
        <Grid container spacing={6} alignItems="center">
          {/* Main Content */}
          <Grid item xs={12}>
            <div className={`hero-content-wrapper ${isVisible ? "visible" : ""}`}>
              
              {/* Badge */}
              

              {/* Main Title */}
              <div className={`fade-in-up ${isVisible ? "visible stagger-delay-1" : ""}`}>
                <Typography
                  variant="h1"
                  component="h1"
                  className="hero-title"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                    lineHeight: 1.1,
                    mb: 3,
                  }}
                >
                  Elevate Your Home
                  <br />
                  with <span style={{color: '#FF6B35'}}>Expert Care</span>
                </Typography>
              </div>

              {/* Subtitle */}
              <div className={`fade-in-up ${isVisible ? "visible stagger-delay-2" : ""}`}>
                <Typography
                  variant="h6"
                  component="p"
                  className="hero-subtitle"
                  sx={{
                    fontSize: { xs: "1.1rem", md: "1.25rem" },
                    maxWidth: "600px",
                  }}
                >
                 
                </Typography>
              </div>
              {/* Buttons */}
<div className={`fade-in-up ${isVisible ? "visible stagger-delay-3" : ""}`}>
  <div className="hero-buttons">
    <button 
      className="btn-primary"
      onClick={() => navigate('/worker/register')}
    >
      Become a Worker
      <span className="btn-icon">→</span>
    </button>
    <button 
      className="btn-secondary"
      onClick={() => navigate('/services')}
    >
      Search for Worker
      <span className="btn-icon">🔍</span>
    </button>
  </div>
</div>

              {/* Features Grid */}
              <div className={`fade-in-up ${isVisible ? "visible stagger-delay-3" : ""}`}>
                <Grid container spacing={3} sx={{ mb: 6 }}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <FeatureCard>
                        <div className="feature-icon">
                          {feature.icon}
                        </div>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ 
                            color: "white", 
                            fontWeight: "bold",
                            mb: 1
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                        >
                          {feature.description}
                        </Typography>
                      </FeatureCard>
                    </Grid>
                  ))}
                </Grid>
              </div>

              {/* Stats Section */}
              <div className={`fade-in-up ${isVisible ? "visible stagger-delay-4" : ""}`}>
                <Box className="cta-section">
                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{ 
                          color: "white", 
                          fontWeight: "bold",
                          mb: 1
                        }}
                      >
                        Trusted by Homeowners Nationwide
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        Join thousands of satisfied customers who trust us with their homes
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Grid container spacing={2} textAlign="center">
                        <Grid item xs={4}>
                          <Typography
                            variant="h4"
                            component="div"
                            sx={{ 
                              color: "#FF6B35", 
                              fontWeight: "bold" 
                            }}
                          >
                            500+
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                          >
                            Projects
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography
                            variant="h4"
                            component="div"
                            sx={{ 
                              color: "#FF6B35", 
                              fontWeight: "bold" 
                            }}
                          >
                            200+
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                          >
                            Clients
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography
                            variant="h4"
                            component="div"
                            sx={{ 
                              color: "#FF6B35", 
                              fontWeight: "bold" 
                            }}
                          >
                            99%
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                          >
                            Satisfaction
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
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
    </Box>
  );
};

export default ModernHero;