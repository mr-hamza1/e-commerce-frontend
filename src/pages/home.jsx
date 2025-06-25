"use client"

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Rating,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { useState } from "react"
import { Link } from "react-router-dom"
import ProductCard from "../components/productCard"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { useInputValidation } from "6pp"
import {
  CreditCard,
  LocalShipping,
  Security,
  SupportAgent,
  Visibility,
  VisibilityOff,
  ArrowForward,
  CheckCircle,
  FlashOn,
} from "@mui/icons-material"
import { useLatestProductsQuery } from "../redux/api/productApi"
import { useErrors } from "../Hooks/Hook"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { addToCart } from "../redux/reducer/cartReducer"
import { useSetProfileMutation } from "../redux/api/userApi"
import { userExist } from "../redux/reducer/userReducer"
import ProductImageSwiper from "../components/swiper"

const Home = ({ user }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [open, setOpen] = useState(true)
  const [dob, setDob] = useState(null)
  const [email, setEmail] = useState("")
  const password = useInputValidation("")
  const [gender, setGender] = useState("")

  const handleGenderChange = (event) => {
    setGender(event.target.value)
  }

  const [showPassword, setShowPassword] = useState(false)
  const toggleVisibility = () => setShowPassword((prev) => !prev)

  const { data, isLoading, isError, error } = useLatestProductsQuery()
  useErrors([{ isError, error }])

  const dispatch = useDispatch()
  const [profileSetup] = useSetProfileMutation()

  const handleSubmit = async () => {
    if (!password || !dob || !gender) {
      setOpen(true)
      return
    }

    const userData = {
      password: password.value,
      dob,
      gender,
    }

    try {
      const res = await profileSetup(userData).unwrap()

      if (res) {
        dispatch(userExist(res.user))
        toast.success(res?.message)
      } else {
        const error = res.error
        const message = error?.message || "Something Went Wrong"
        toast.error(message)
      }
    } catch (error) {
      toast.error("Failed to setup profile")
      console.log(error)
    }

    setOpen(false)
  }

  const addToCartHandler = (cartItem) => {
    if (cartItem.stock < 1) {
      toast.error("Out of Stock")
      return
    } else {
      dispatch(addToCart(cartItem))
    }
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email) {
      toast.success("Successfully subscribed to newsletter!")
      setEmail("")
    }
  }

const images = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=600&fit=crop",
  "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1920&h=600&fit=crop",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=600&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=600&fit=crop",
]
  

  const categories = [
    {
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300",
      count: "120+ Products",
    },
    {
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300",
      count: "85+ Products",
    },
    {
      name: "Beauty",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300",
      count: "65+ Products",
    },
    {
      name: "Sports",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
      count: "45+ Products",
    },
  ]

  const testimonials = [
    { name: "Sarah Johnson", rating: 5, comment: "Amazing quality products and fast delivery!", avatar: "SJ" },
    { name: "Mike Chen", rating: 5, comment: "Best shopping experience I've had online.", avatar: "MC" },
    { name: "Emma Davis", rating: 4, comment: "Great customer service and easy returns.", avatar: "ED" },
  ]

  return (

    <Box sx={{ overflowX: "hidden" }}>
<>
      {/* Profile Completion Dialog */}
      {user?.gender === "not" && (
        <Dialog
          open={open}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3, p: 2 },
          }}
        >
          <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              Complete Your Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Help us personalize your shopping experience
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={3}>
              <TextField
                label="Password"
                required
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                value={password.value}
                onChange={password.changeHandler}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={toggleVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select value={gender} label="Gender" onChange={handleGenderChange}>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth"
                  value={dob}
                  onChange={(newValue) => setDob(newValue)}
                  renderInput={(params) => <TextField {...params} required fullWidth />}
                />
              </LocalizationProvider>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button onClick={handleSubmit} variant="contained" fullWidth size="large" sx={{ borderRadius: 2 }}>
              Complete Profile
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Full Width Banner - No margins, no padding, no overlay */}
      <Box 
        sx={{
          width: "100vw",
          borderRadius: "1rem",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          overflow: "hidden",
            overflowX: "hidden",
      
        }}
      >
        <ProductImageSwiper images={images} />
      </Box>

      {/* Main Content Container */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 }, mt: 8 }}>
        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={6} color="text.primary">
            Why Choose Us
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <LocalShipping fontSize="large" />,
                title: "Free Shipping",
                desc: "Free delivery on orders over $50 worldwide",
                color: "#4CAF50",
              },
              {
                icon: <Security fontSize="large" />,
                title: "Secure Payment",
                desc: "100% secure payment with SSL encryption",
                color: "#2196F3",
              },
              {
                icon: <SupportAgent fontSize="large" />,
                title: "24/7 Support",
                desc: "Round-the-clock customer support",
                color: "#FF9800",
              },
              {
                icon: <CreditCard fontSize="large" />,
                title: "Easy Returns",
                desc: "30-day hassle-free return policy",
                color: "#9C27B0",
              },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    textAlign: "center",
                    borderRadius: 3,
                    border: "1px solid #f0f0f0",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      borderColor: feature.color,
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: feature.color,
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Shop by Category */}
        <Box sx={{ mb: 8 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h4" fontWeight="bold">
              Shop by Category
            </Typography>
            <Button endIcon={<ArrowForward />} sx={{ textTransform: "none" }}>
              View All Categories
            </Button>
          </Box>

          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card
                  sx={{
                    position: "relative",
                    borderRadius: 3,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={category.image}
                    alt={category.name}
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                      color: "white",
                      p: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {category.name}
                    </Typography>
                    <Typography variant="body2" opacity={0.9}>
                      {category.count}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Latest Products Section */}
        <Box sx={{ mb: 8 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Box>
              <Typography variant="h4" fontWeight="bold" mb={1}>
                Latest Products
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Discover our newest arrivals and trending items
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/products"
              endIcon={<ArrowForward />}
              variant="outlined"
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 3,
              }}
            >
              View All
            </Button>
          </Box>

          <Grid container spacing={3}>
            {data?.products?.map((product, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <ProductCard cart={product} isLoading={isLoading} addToCartHandler={addToCartHandler} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Promotional Banner */}
        <Box sx={{ mb: 8 }}>
          <Card
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 4,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <CardContent sx={{ p: { xs: 4, md: 6 }, textAlign: "center" }}>
              <Chip
                label="Limited Time Offer"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                  mb: 2,
                  fontWeight: "bold",
                }}
              />
              <Typography variant="h3" fontWeight="bold" mb={2}>
                Summer Sale
              </Typography>
              <Typography variant="h6" mb={4} sx={{ opacity: 0.9 }}>
                Up to 50% off on selected items. Don't miss out!
              </Typography>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: "white",
                  color: "primary.main",
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: "bold",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.9)",
                  },
                }}
                startIcon={<FlashOn />}
              >
                Shop Sale Now
              </Button>
            </CardContent>
          </Card>
        </Box>

         {/* Customer Testimonials */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={6}>
            What Our Customers Say
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    border: "1px solid #f0f0f0",
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" mb={3}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>{testimonial.avatar}</Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Rating value={testimonial.rating} size="small" readOnly />
                    </Box>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    "{testimonial.comment}"
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Newsletter Section - Full Width */}
      <Box
        sx={{
          bgcolor: "#f8f9fa",
          py: 8,
          backgroundImage: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="bold" mb={2}>
              Stay Updated
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4} sx={{ maxWidth: 600, mx: "auto" }}>
              Subscribe to our newsletter and get 10% off your first purchase plus updates on new arrivals and special
              offers.
            </Typography>

            <Box
              component="form"
              onSubmit={handleNewsletterSubmit}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                maxWidth: 500,
                mx: "auto",
              }}
            >
              <TextField
                fullWidth
                placeholder="Enter your email address"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  bgcolor: "white",
                  borderRadius: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: { xs: 1.5, sm: 2 },
                  borderRadius: 2,
                  whiteSpace: "nowrap",
                  minWidth: 140,
                }}
              >
                Subscribe
              </Button>
            </Box>

            <Box display="flex" justifyContent="center" alignItems="center" mt={3} gap={1}>
              <CheckCircle fontSize="small" color="success" />
              <Typography variant="body2" color="text.secondary">
                Join 50,000+ subscribers
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
    </Box>
    
  )
}

export default Home
