import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Modal,
  TextField,
  Rating,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Grid,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
  Paper,
  Chip,
  Divider
} from "@mui/material";
import {
  Close,
  Star,
  StarBorder,
  FormatQuote,
  ArrowDownward,
  Person,
  Work
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/system";
import UniqueHeader from "../components/user/Header";
import Footer from "../components/user/Footer";

// Styled components with custom animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const StyledSection = styled(Paper)(({ theme, background }) => ({
  minHeight: "80vh",
  background: background || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  borderRadius: theme.spacing(3),
  margin: theme.spacing(4, 0),
  padding: theme.spacing(6),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  }
}));

const FloatingAvatar = styled(Avatar)(({ theme }) => ({
  animation: `${floatAnimation} 3s ease-in-out infinite`,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[8],
}));

const SlideContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 400,
  width: "100%",
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  boxShadow: theme.shadows[10],
}));

const FeedbackCard = styled(Card)(({ theme }) => ({
  height: "100%",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: theme.spacing(4),
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[16],
  }
}));

const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
}));

const ModalContent = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 500,
  width: "90vw",
  maxHeight: "90vh",
  overflow: "auto",
  position: "relative",
  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
}));

const ScrollPrompt = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4),
  animation: `${pulseAnimation} 2s ease-in-out infinite`,
}));

const CustomerFeedback = () => {
  const [user, setUser] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [currentWorkerSlide, setCurrentWorkerSlide] = useState(0);
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [workerRating, setWorkerRating] = useState(0);
  const [hover, setHover] = useState(-1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Sample feedback data
  const customerFeedback = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Excellent service and support! The app made finding reliable workers so easy.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      role: "Homeowner"
    },
    {
      name: "Mike Chen",
      rating: 5,
      comment: "Outstanding platform! Found the perfect plumber within minutes.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      role: "Business Owner"
    },
    {
      name: "Emma Davis",
      rating: 4,
      comment: "Great experience overall. Would love to see more categories added.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      role: "Freelancer"
    }
  ];

  const workerFeedback = [
    {
      name: "John Doe",
      rating: 5,
      comment: "This platform has helped me grow my client base significantly. Highly recommended!",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      specialty: "Electrician"
    },
    {
      name: "Maria Garcia",
      rating: 5,
      comment: "Professional platform with great clients. The payment system is very reliable.",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      specialty: "Plumber"
    },
    {
      name: "David Smith",
      rating: 4,
      comment: "Good steady work. The rating system helps build trust with new clients.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      specialty: "Carpenter"
    }
  ];

  // Auto-slide effects
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % customerFeedback.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [customerFeedback.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWorkerSlide((prev) => (prev + 1) % workerFeedback.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [workerFeedback.length]);

  const handleSubmit = (e, isWorkerForm = false) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    console.log(`${isWorkerForm ? 'Worker' : 'Customer'} Feedback:`, { ...data, rating: isWorkerForm ? workerRating : rating });
    
    // Here you would typically send to your backend
    alert(`Thank you for your ${isWorkerForm ? 'worker ' : ''}feedback!`);
    
    if (isWorkerForm) {
      setShowWorkerForm(false);
      setWorkerRating(0);
    } else {
      setShowForm(false);
      setRating(0);
    }
  };

  const labels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  return (
    <Box sx={{ background: theme.palette.background.default, minHeight: "100vh" }}>
      <UniqueHeader user={user} setUser={setUser} />

      <Container maxWidth="xl">
        {/* Customer Feedback Section */}
        <StyledSection elevation={8}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent"
                    }}
                  >
                    Customer Feedback
                  </Typography>
                  <Typography variant="h5" color="text.secondary" paragraph>
                    Share your experience and help us serve you better
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                    ✨ We value your thoughts! Every feedback counts in making our platform better. 
                    Your voice makes a difference in improving services for everyone.
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Person />}
                      onClick={() => setShowForm(true)}
                      sx={{
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderRadius: 2,
                        px: 4,
                        py: 1.5
                      }}
                    >
                      Submit Feedback
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{ borderRadius: 2, px: 4, py: 1.5 }}
                    >
                      View All Reviews
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <SlideContainer>
                {customerFeedback.map((feedback, index) => (
                  <Slide
                    key={index}
                    direction="left"
                    in={index === currentSlide}
                    timeout={500}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                      <FeedbackCard>
                        <FormatQuote sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                        <Typography variant="body1" paragraph sx={{ fontStyle: "italic" }}>
                          "{feedback.comment}"
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Rating value={feedback.rating} readOnly />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({feedback.rating}.0)
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <FloatingAvatar
                            src={feedback.image}
                            sx={{ width: 60, height: 60 }}
                          />
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {feedback.name}
                            </Typography>
                            <Chip label={feedback.role} size="small" variant="outlined" />
                          </Box>
                        </Box>
                      </FeedbackCard>
                    </Box>
                  </Slide>
                ))}
                
                {/* Slide Indicators */}
                <Box sx={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 1 }}>
                  {customerFeedback.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: index === currentSlide ? "primary.main" : "grey.400",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": { bgcolor: "primary.light" }
                      }}
                    />
                  ))}
                </Box>
              </SlideContainer>
            </Grid>
          </Grid>
        </StyledSection>

        {/* Scroll Prompt */}
        <ScrollPrompt>
          <Typography variant="h6" color="primary" gutterBottom>
            👇 Scroll down to see workers' feedback 👇
          </Typography>
          <ArrowDownward sx={{ fontSize: 32, color: "primary.main" }} />
        </ScrollPrompt>

        {/* Workers Feedback Section */}
        <StyledSection background={`linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`}>
          <Grid container spacing={4} alignItems="center" direction={isMobile ? "column-reverse" : "row"}>
            <Grid item xs={12} md={6}>
              <SlideContainer>
                {workerFeedback.map((feedback, index) => (
                  <Slide
                    key={index}
                    direction="right"
                    in={index === currentWorkerSlide}
                    timeout={500}
                    mountOnEnter
                    unmountOnExit
                  >
                    <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                      <FeedbackCard>
                        <FormatQuote sx={{ fontSize: 48, color: theme.palette.secondary.main, mb: 2 }} />
                        <Typography variant="body1" paragraph sx={{ fontStyle: "italic" }}>
                          "{feedback.comment}"
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Rating value={feedback.rating} readOnly />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({feedback.rating}.0)
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <FloatingAvatar
                            src={feedback.image}
                            sx={{ width: 60, height: 60 }}
                          />
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {feedback.name}
                            </Typography>
                            <Chip label={feedback.specialty} size="small" variant="outlined" color="secondary" />
                          </Box>
                        </Box>
                      </FeedbackCard>
                    </Box>
                  </Slide>
                ))}
                
                {/* Slide Indicators */}
                <Box sx={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 1 }}>
                  {workerFeedback.map((_, index) => (
                    <Box
                      key={index}
                      onClick={() => setCurrentWorkerSlide(index)}
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: index === currentWorkerSlide ? "secondary.main" : "grey.400",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": { bgcolor: "secondary.light" }
                      }}
                    />
                  ))}
                </Box>
              </SlideContainer>
            </Grid>

            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box sx={{ position: "relative", zIndex: 1, textAlign: isMobile ? "center" : "right" }}>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent"
                    }}
                  >
                    Workers' Feedback
                  </Typography>
                  <Typography variant="h5" color="text.secondary" paragraph>
                    Share your experience as a professional
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                    🚀 Your insights help us create better opportunities for workers. 
                    Share your journey and help us improve the platform for professionals.
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-end" }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Work />}
                      onClick={() => setShowWorkerForm(true)}
                      sx={{
                        background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                        borderRadius: 2,
                        px: 4,
                        py: 1.5
                      }}
                    >
                      Share Experience
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{ borderRadius: 2, px: 4, py: 1.5, color: "white", borderColor: "white" }}
                    >
                      Worker Stories
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </StyledSection>
      </Container>

      {/* Customer Feedback Modal */}
      <StyledModal open={showForm} onClose={() => setShowForm(false)}>
        <Fade in={showForm}>
          <ModalContent elevation={24}>
            <IconButton
              sx={{ position: "absolute", top: 8, right: 8 }}
              onClick={() => setShowForm(false)}
            >
              <Close />
            </IconButton>
            
            <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 3 }}>
              Share Your Feedback
            </Typography>
            
            <form onSubmit={(e) => handleSubmit(e, false)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Your Name"
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    label="Your Email"
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="feedback"
                    label="Your Feedback"
                    multiline
                    rows={3}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="improvements"
                    label="What can we improve?"
                    multiline
                    rows={2}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography component="legend" gutterBottom>
                    Rate your experience
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Rating
                      name="rating"
                      value={rating}
                      onChange={(_, newValue) => setRating(newValue)}
                      onChangeActive={(_, newHover) => setHover(newHover)}
                      icon={<Star sx={{ fontSize: 32 }} />}
                      emptyIcon={<StarBorder sx={{ fontSize: 32 }} />}
                    />
                    {rating !== null && (
                      <Typography variant="body2">
                        {labels[hover !== -1 ? hover : rating]}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Submit Feedback
                  </Button>
                </Grid>
              </Grid>
            </form>
          </ModalContent>
        </Fade>
      </StyledModal>

      {/* Worker Feedback Modal */}
      <StyledModal open={showWorkerForm} onClose={() => setShowWorkerForm(false)}>
        <Fade in={showWorkerForm}>
          <ModalContent elevation={24}>
            <IconButton
              sx={{ position: "absolute", top: 8, right: 8 }}
              onClick={() => setShowWorkerForm(false)}
            >
              <Close />
            </IconButton>
            
            <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 3 }}>
              Share Worker Feedback
            </Typography>
            
            <form onSubmit={(e) => handleSubmit(e, true)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="workerName"
                    label="Worker Name"
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    label="Your Email"
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="feedback"
                    label="Feedback about the worker"
                    multiline
                    rows={3}
                    variant="outlined"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="improvements"
                    label="What can the worker improve?"
                    multiline
                    rows={2}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography component="legend" gutterBottom>
                    Rate the worker
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Rating
                      name="workerRating"
                      value={workerRating}
                      onChange={(_, newValue) => setWorkerRating(newValue)}
                      onChangeActive={(_, newHover) => setHover(newHover)}
                      icon={<Star sx={{ fontSize: 32 }} />}
                      emptyIcon={<StarBorder sx={{ fontSize: 32 }} />}
                    />
                    {workerRating !== null && (
                      <Typography variant="body2">
                        {labels[hover !== -1 ? hover : workerRating]}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ py: 1.5, borderRadius: 2 }}
                  >
                    Submit Feedback
                  </Button>
                </Grid>
              </Grid>
            </form>
          </ModalContent>
        </Fade>
      </StyledModal>

      <Footer />
    </Box>
  );
};

export default CustomerFeedback;