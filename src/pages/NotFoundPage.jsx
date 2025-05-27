"use client"
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  Home as HomeIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  SentimentDissatisfied as SadIcon,
} from "@mui/icons-material"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const NotFoundPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [animationComplete, setAnimationComplete] = useState(false)

  // Animation variants for the numbers
  const numberVariants = {
    initial: { y: -100, opacity: 0 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        type: "spring",
        stiffness: 100,
      },
    }),
  }

  // Animation variants for the message
  const messageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.8,
      },
    },
  }

  // Animation variants for the buttons
  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8,
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
      },
    },
  }

  // Set animation complete after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          width: "100%",
          maxWidth: 1000,
          position: "relative",
        }}
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage:
              "repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
            zIndex: 0,
          }}
        />

        <Grid container>
          {/* Left side - 404 numbers */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: { xs: 4, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Animated circles in background */}
            {[...Array(5)].map((_, i) => (
              <Box
                component={motion.div}
                key={i}
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1.5, 1],
                  opacity: [0, 0.2, 0],
                  x: Math.random() * 300 - 150,
                  y: Math.random() * 300 - 150,
                }}
                transition={{
                  duration: 4,
                  delay: i * 0.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                sx={{
                  position: "absolute",
                  width: { xs: 100, md: 200 },
                  height: { xs: 100, md: 200 },
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
            ))}

            {/* 404 Text */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              {["4", "0", "4"].map((num, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={numberVariants}
                  initial="initial"
                  animate="animate"
                >
                  <Typography
                    variant="h1"
                    component="span"
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: "5rem", sm: "8rem", md: "10rem" },
                      textShadow: "2px 2px 10px rgba(0,0,0,0.2)",
                      mx: { xs: 1, md: 2 },
                    }}
                  >
                    {num}
                  </Typography>
                </motion.div>
              ))}
            </Box>

            {/* Sad face icon */}
            <Box
              component={motion.div}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              sx={{ mt: 2, mb: 4 }}
            >
              <SadIcon sx={{ fontSize: 60, opacity: 0.8 }} />
            </Box>
          </Grid>

          {/* Right side - Message and actions */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              p: { xs: 4, md: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box component={motion.div} variants={messageVariants} initial="initial" animate="animate">
              <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                Page Not Found
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Oops! The page you are looking for might have been removed, had its name changed, or is temporarily
                unavailable.
              </Typography>
            </Box>

            {/* Search form */}
            {animationComplete && (
              <Box
                component={motion.form}
                onSubmit={handleSearchSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                sx={{
                  display: "flex",
                  mt: 3,
                  mb: 4,
                  position: "relative",
                }}
              >
                <Box
                  component="input"
                  placeholder="Search for something else..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    width: "100%",
                    p: 2,
                    pr: 5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    outline: "none",
                    "&:focus": {
                      borderColor: "primary.main",
                      boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
                    },
                  }}
                />
                <Button
                  type="submit"
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    minWidth: "auto",
                  }}
                >
                  <SearchIcon />
                </Button>
              </Box>
            )}

            {/* Action buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                component={motion.button}
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                variant="contained"
                size="large"
                startIcon={<HomeIcon />}
                fullWidth
                component ={Link}
                to="/"
              >
                Back to Home
              </Button>
              <Button
                component={motion.button}
                variants={buttonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                variant="outlined"
                size="large"
                startIcon={<ArrowBackIcon />}
                fullWidth
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </Box>

            {/* Helpful links
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              sx={{ mt: 4 }}
            >
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                You might want to check:
              </Typography>
              <Grid container spacing={1}>
                {["Products", "Categories", "Account", "Contact Us"].map((link, i) => (
                  <Grid item xs={6} key={i}>
                    <Button
                      component={Link}
                      to={`/${link.toLowerCase().replace(" ", "-")}`}
                      color="primary"
                      sx={{ textTransform: "none" }}
                    >
                      {link}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box> */}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default NotFoundPage
