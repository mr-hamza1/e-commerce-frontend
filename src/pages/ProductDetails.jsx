"use client";

import {
  Container,
  Grid,
  Typography,
  Button ,
  Dialog ,
  Divider,
  IconButton,
  Rating,
  Tabs,
  Tab,
  Chip,
  Paper,
  Skeleton,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Breadcrumbs,
  Link as MuiLink,
  Stack,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useMediaQuery,
  Alert,
  Tooltip,
  Box
} from "@mui/material";

import {
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  ExpandMore as ExpandMoreIcon,
  LocalShipping as LocalShippingIcon,
  Security as SecurityIcon,
  Replay as ReplayIcon,
  CheckCircle as CheckCircleIcon,
  ZoomIn as ZoomInIcon,
} from "@mui/icons-material";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../constants/config";
import { createTheme } from "@mui/material/styles";



// Import your actual API hooks
import { useProductDetailsQuery, useAddToWishlistMutation, useFavouritesQuery } from "../redux/api/productApi"
import { useErrors } from "../Hooks/Hook";
import { addToCart } from "../redux/reducer/cartReducer";

const theme = createTheme()

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { user } = useSelector((state) => state.userReducer)

      const dispatch = useDispatch()


  // State for product interactions
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [activeTab, setActiveTab] = useState(0)
  const [activeImage, setActiveImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [zoomDialogOpen, setZoomDialogOpen] = useState(false)

  // Fetch product data
  const { data, isLoading, isError, error } = useProductDetailsQuery(id)

  // Fetch wishlist status using your API
  const {
    data: wishlistData,
    isError: wishlistError,
    error: wishlistErrorData,
    refetch: refetchWishlist,
  } = useFavouritesQuery(
    { id },
    {
      refetchOnMountOrArgChange: true,
    },
  )

  useErrors([{wishlistError,wishlistErrorData },{isError,error}])

  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addToWishlist] = useAddToWishlistMutation()

  // Check if product is in wishlist
  useEffect(() => {
    if (wishlistData?.wish) {
      setIsWishlisted(!!wishlistData.wish.wishlist)
    }
  }, [wishlistData])

  // Set default size and color when product data loads
  useEffect(() => {
    if (data?.product) {
      // Set default size if available
      if (data.product.sizes && data.product.sizes.length > 0) {
        setSelectedSize(data.product.sizes[0])
      }

      // Set default color if available
      if (data.product.details?.colors && data.product.details.colors.length > 0) {
        setSelectedColor(data.product.details.colors[0])
      }
    }
  }, [data])

  const handleQuantityChange = (newQuantity) => {
    // Ensure quantity is between 1 and available stock
    const maxStock = data?.product?.stock || 10
    const updatedQuantity = Math.max(1, Math.min(newQuantity, maxStock))
    setQuantity(updatedQuantity)  
  }

  const handleAddToCart = async () => {
    if (!user?._id) {
      toast.error("Please login to add items to cart")
      navigate("/login")
      return
    }

    if (data?.product?.category === "clothing" && !selectedSize) {
      toast.error("Please select a size")
      return
    }

    if (data?.product?.details?.colors?.length > 0 && !selectedColor) {
      toast.error("Please select a color")
      return
    }


      setIsAddingToCart(true)
       if(data?.product?.stock < 1) {
          toast.error("Out of Stock")
          return;
        }else{
          const cartItem = data?.product;
          dispatch(addToCart({...cartItem, photo: data?.product.photo.url,  quantity: quantity}));
       
        }
      
         setAddedToCart(true)
        setTimeout(() => setIsAddingToCart(false), 100)     
  }

  const handleAddToWishlist = async () => {
    if (!user?._id) {
      toast.error("Please login to add or remove items to wishlist")
      navigate("/login")
      return
    }

    const newWishlistStatus = !isWishlisted

    try {
      const res = await addToWishlist({
        userId: user._id,
        wishlist: newWishlistStatus,
        productId: id,
      })

      if (res.data?.success) {
        toast.success(res.data.message)
        setIsWishlisted(newWishlistStatus)
        refetchWishlist()
      } else {
        toast.error(res.data?.error || "Something Went Wrong")
      }
    } catch (error) {
      toast.error(error.message || "Something Went Wrong")
    }
  }

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Render loading skeleton
  const renderSkeleton = () => (
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 2 }} />
        <Grid sx={{ display: "flex", gap: 1 }}>
          {[1, 2, 3, 4].map((_, index) => (
            <Skeleton key={index} variant="rectangular" width={80} height={80} sx={{ borderRadius: 1 }} />
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Skeleton variant="text" height={40} width="80%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={30} width="40%" sx={{ mb: 2 }} />
        <Skeleton variant="text" height={24} width="60%" sx={{ mb: 3 }} />
        <Divider sx={{ my: 2 }} />
        <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={50} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={50} sx={{ mb: 2 }} />
        <Grid sx={{ display: "flex", gap: 2 }}>
          <Skeleton variant="rectangular" height={50} width="70%" />
          <Skeleton variant="rectangular" height={50} width="25%" />
        </Grid>
      </Grid>
    </Grid>
  )

  // If loading, show skeleton
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={300} height={30} />
        </Box>
        {renderSkeleton()}
      </Container>
    )
  }

  // If error, show error message
  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.data?.message || "Failed to load product details"}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    )
  }

  const product = data?.product || {}

  // Create image gallery - if no additional images, duplicate the main image
  const productImages = product.additionalImages
    ? [product.photo?.url, ...product.additionalImages]
    : [product.photo?.url, product.photo?.url]

  // Calculate discount percentage if original price exists
  const discountPercentage = product?.originalPrice
    ? Math.round(
        ((Number.parseFloat(product.originalPrice.replace(/[^0-9.]/g, "")) -
          Number.parseFloat(product.price.replace(/[^0-9.]/g, ""))) /
          Number.parseFloat(product.originalPrice.replace(/[^0-9.]/g, ""))) *
          100,
      )
    : product?.discount

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink component={Link} to="/" underline="hover" color="inherit">
          Home
        </MuiLink>
        {product.category && (
          <MuiLink
            component={Link}
            to={`/`}
            underline="hover"
            color="inherit"
            sx={{ textTransform: "capitalize" }}
          >
            {product.category}
          </MuiLink>
        )}
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              mb: 2,
              border: "1px solid",
              borderColor: "divider",
              position: "relative",
            }}
          >
            {/* Sale badge */}
            {(product?.isOnSale || discountPercentage) && (
              <Chip
                label={`-${discountPercentage}%`}
                color="error"
                size="small"
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  zIndex: 2,
                  fontWeight: "bold",
                }}
              />
            )}

            {/* Zoom button */}
            <IconButton
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                bgcolor: "rgba(255,255,255,0.8)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                zIndex: 2,
              }}
              onClick={() => setZoomDialogOpen(true)}
            >
              <ZoomInIcon />
            </IconButton>

            <Box
              component="img"
              src={productImages[activeImage] || "/placeholder.svg"}
              alt={product.name}
              sx={{
                width: "100%",
                height: "400px",
                objectFit: "contain",
                bgcolor: "#f9f9f9",
                transition: "transform 0.5s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          </Paper>

          {/* Thumbnail Images */}
          <Grid sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {productImages.map((image, index) => (
              <Grid
                key={index}
                component="img"
                src={image || "/placeholder.svg"}
                alt={`${product.name} - view ${index + 1}`}
                onClick={() => setActiveImage(index)}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 1,
                  cursor: "pointer",
                  border: activeImage === index ? "2px solid" : "1px solid",
                  borderColor: activeImage === index ? "primary.main" : "divider",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            ))}
          </Grid>

          {/* Product Highlights - Mobile View */}
          {isMobile && (
            <Paper sx={{ mt: 3, p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Product Highlights
              </Typography>
              <Grid component="ul" sx={{ pl: 2, mb: 0 }}>
                <Grid item>
                  <Typography variant="body2">Premium quality materials</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">Fast shipping available</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">30-day money-back guarantee</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">Trusted by {product.reviewCount || 100}+ customers</Typography>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {product.name}
            </Typography>

            <Grid sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Rating value={product.rating || 4.5} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.reviewCount || 42} reviews)
              </Typography>
            </Grid>

            <Grid sx={{ display: "flex", alignItems: "baseline", mb: 2 }}>
              <Typography variant="h5" color="primary.main" fontWeight="bold" sx={{ mr: 2 }}>
                {product.price}/.Rs only
              </Typography>

              {product.originalPrice && (
                <Typography
                  variant="body1"
                  sx={{
                    textDecoration: "line-through",
                    color: "text.secondary",
                  }}
                >
                  {product.originalPrice}
                </Typography>
              )}
            </Grid>

            <Grid sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Chip
                label={product.stock > 0 ? "In Stock" : "Out of Stock"}
                color={product.stock > 0 ? "success" : "error"}
                size="small"
                sx={{ mr: 2 }}
              />
              {product.stock > 0 && (
                <Typography variant="body2" color="text.secondary">
                  {product.stock} items available
                </Typography>
              )}
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Product Description - Short version */}
            <Typography variant="body1" sx={{ mb: 3 }}>
              {product.details.info?.substring(0, 150) || "No description available"}
              {product.details.info?.length > 150 && "..."}
            </Typography>

            {/* Product Highlights - Desktop View */}
            {!isMobile && (
              <Paper sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: "background.subtle" }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  Product Highlights
                </Typography>
                <Grid component="ul" sx={{ pl: 2, mb: 0 }}>
                  <Grid item>
                    <Typography variant="body2">Premium quality materials</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">Fast shipping available</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">30-day money-back guarantee</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">Trusted by {product.reviewCount || 100}+ customers</Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Size Selection - Only for clothing */}
            {product?.details.category === "clothing" && (
              <Grid sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Select Size
                </Typography>
                <RadioGroup
                  row
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  name="size-buttons-group"
                >
                  {(product?.details?.size || ["S", "M", "L", "XL"]).map((size) => (
                    <FormControlLabel
                      key={size}
                      value={size}
                      control={<Radio />}
                      label={
                        <Chip
                          label={size}
                          variant={selectedSize === size ? "filled" : "outlined"}
                          color={selectedSize === size ? "primary" : "default"}
                          sx={{ minWidth: 40 }}
                        />
                      }
                      sx={{ mr: 1 }}
                    />
                  ))}
                </RadioGroup>
              </Grid>
            )}

            {/* Color Selection */}
            {product.details?.colors && product.details.colors.length > 0 && (
              <Grid sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Select Color
                </Typography>
                <Grid sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {product.details.colors.map((color, index) => (
                      <Tooltip title={color} key={index}>
                        <Grid
                          onClick={() => setSelectedColor(color)}
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: color,
                            borderRadius: "50%",
                            cursor: "pointer",
                            border: selectedColor === color ? "3px solid" : "1px solid",
                            borderColor: selectedColor === color ? "primary.main" : "divider",
                            transition: "transform 0.2s ease, border 0.2s ease",
                            "&:hover": {
                              transform: "scale(1.1)",
                            },
                          }}
                        />
                      </Tooltip>
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Quantity Selector */}
            <Grid sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Quantity
              </Typography>
              <Grid sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || product.stock <= 0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "4px 0 0 4px",
                  }}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={quantity}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value)
                    if (!isNaN(value)) {
                      handleQuantityChange(value)
                    }
                  }}
                  inputProps={{
                    min: 1,
                    max: product.stock,
                    style: { textAlign: "center" },
                  }}
                  sx={{
                    width: 60,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                    },
                  }}
                />
                <IconButton
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock || product.stock <= 0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "0 4px 4px 0",
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Grid sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={addedToCart ? <CheckCircleIcon /> : <ShoppingCartIcon />}
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock <= 0}
                sx={{
                  flexGrow: 1,
                  py: 1.5,
                  bgcolor: addedToCart ? "success.main" : "primary.main",
                  "&:hover": {
                    bgcolor: addedToCart ? "success.dark" : "primary.dark",
                  },
                }}
              >
                {isAddingToCart ? (
                  <>
                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                    Adding...
                  </>
                ) : addedToCart ? (
                  "Added to Cart"
                ) : (
                  "Add to Cart"
                )}
              </Button>

              <IconButton
                color={isWishlisted ? "error" : "default"}
                onClick={handleAddToWishlist}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>

              <IconButton
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                  toast.success("Link copied to clipboard")
                }}
              >
                <ShareIcon />
              </IconButton>
            </Grid>

            {/* Shipping & Returns */}
            <Grid sx={{ mb: 3 }}>
              <Stepper alternativeLabel>
                <Step completed>
                  <StepLabel StepIconComponent={LocalShippingIcon}>Free Shipping</StepLabel>
                </Step>
                <Step completed>
                  <StepLabel StepIconComponent={SecurityIcon}>Secure Payment</StepLabel>
                </Step>
                <Step completed>
                  <StepLabel StepIconComponent={ReplayIcon}>Easy Returns</StepLabel>
                </Step>
              </Stepper>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <Grid sx={{ mt: 6 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }} variant={isMobile ? "fullWidth" : "standard"}>
          <Tab label="Description" />
          <Tab label="Specifications" />
          <Tab label="Reviews" />
        </Tabs>

        <Divider />

        {/* Description Tab */}
        <Grid sx={{ py: 3, display: activeTab === 0 ? "block" : "none" }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {product?.details?.info ||
              `${product.name} is a high-quality product designed to meet your needs. 
              
This premium product features excellent craftsmanship and attention to detail. Made with the finest materials, it offers durability and reliability for everyday use.

Key benefits include:
- Superior quality and performance
- Elegant and modern design
- Durable construction for long-lasting use
- Versatile functionality for various situations

Whether you're using it at home, at work, or on the go, this product will exceed your expectations and provide exceptional value.`}
          </Typography>
        </Grid>

        {/* Specifications Tab */}
        <Grid sx={{ py: 3, display: activeTab === 1 ? "block" : "none" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Product Details
              </Typography>
              <Grid component="ul" sx={{ pl: 2 }}>
                <Grid item>
                  <Typography variant="body2">
                    <strong>Brand:</strong> {product.name || "Brand Name"}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">
                    <strong>Category:</strong> {product.category || "Category"}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">
                    <strong>SKU:</strong> {product._id?.substring(0, 8) || "SKU12345"}
                  </Typography>
                </Grid>
                {product.model && (
                  <Grid item>
                    <Typography variant="body2">
                      <strong>Model:</strong> {product.model}
                    </Typography>
                  </Grid>
                )}
                {product.sizes && (
                  <Grid item>
                    <Typography variant="body2">
                      <strong>Available Sizes:</strong> {product.sizes.join(", ")}
                    </Typography>
                  </Grid>
                )}
                {product.details?.colors && (
                  <Grid item>
                    <Typography variant="body2">
                      <strong>Available Colors:</strong> {product.details.colors.join(", ")}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Additional Information
              </Typography>
              <Grid component="ul" sx={{ pl: 2 }}>
                <Grid item>
                  <Typography variant="body2">
                    <strong>Weight:</strong> {product.weight || "0.5 kg"}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">
                    <strong>Dimensions:</strong> {product.dimensions || "10 × 10 × 5 cm"}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">
                    <strong>Material:</strong> {product.material || "Premium Material"}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2">
                    <strong>Warranty:</strong> {product.warranty || "1 Year"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Reviews Tab */}
        <Grid sx={{ py: 3, display: activeTab === 2 ? "block" : "none" }}>
          {/* Reviews summary */}
          <Grid sx={{ mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                <Typography variant="h2" color="primary.main" fontWeight="bold">
                  {product.rating || "4.5"}
                </Typography>
                <Rating value={product.rating || 4.5} precision={0.5} readOnly size="large" sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Based on {product.reviewCount || 42} reviews
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <Grid sx={{ mb: 1 }}>
                  <Grid sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <Typography variant="body2" sx={{ minWidth: 30 }}>
                      5★
                    </Typography>
                    <Grid sx={{ flexGrow: 1, mx: 1 }}>
                      <Grid sx={{ height: 8, bgcolor: "success.light", borderRadius: 1, width: "85%" }} />
                    </Grid>
                    <Typography variant="body2" color="text.secondary">
                      85%
                    </Typography>
                  </Grid>
                  <Grid sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <Typography variant="body2" sx={{ minWidth: 30 }}>
                      4★
                    </Typography>
                    <Grid sx={{ flexGrow: 1, mx: 1 }}>
                      <Grid sx={{ height: 8, bgcolor: "success.light", borderRadius: 1, width: "10%" }} />
                    </Grid>
                    <Typography variant="body2" color="text.secondary">
                      10%
                    </Typography>
                  </Grid>
                  <Grid sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <Typography variant="body2" sx={{ minWidth: 30 }}>
                      3★
                    </Typography>
                    <Grid sx={{ flexGrow: 1, mx: 1 }}>
                      <Grid sx={{ height: 8, bgcolor: "warning.light", borderRadius: 1, width: "3%" }} />
                    </Grid>
                    <Typography variant="body2" color="text.secondary">
                      3%
                    </Typography>
                  </Grid>
                  <Grid sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <Typography variant="body2" sx={{ minWidth: 30 }}>
                      2★
                    </Typography>
                    <Grid sx={{ flexGrow: 1, mx: 1 }}>
                      <Grid sx={{ height: 8, bgcolor: "error.light", borderRadius: 1, width: "1%" }} />
                    </Grid>
                    <Typography variant="body2" color="text.secondary">
                      1%
                    </Typography>
                  </Grid>
                  <Grid sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ minWidth: 30 }}>
                      1★
                    </Typography>
                    <Grid sx={{ flexGrow: 1, mx: 1 }}>
                      <Grid sx={{ height: 8, bgcolor: "error.light", borderRadius: 1, width: "1%" }} />
                    </Grid>
                    <Typography variant="body2" color="text.secondary">
                      1%
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Sample reviews - replace with actual reviews from your API */}
          {(
            product.reviews || [
              {
                name: "John Doe",
                rating: 5,
                comment: "Excellent product! Exactly as described and arrived quickly.",
                date: "2023-05-15",
              },
              {
                name: "Jane Smith",
                rating: 4,
                comment: "Good quality and value for money. Would recommend.",
                date: "2023-04-22",
              },
              {
                name: "Robert Johnson",
                rating: 5,
                comment:
                  "I've been using this for a month now and it's holding up great. The quality is excellent and it looks even better in person than in the photos.",
                date: "2023-03-10",
              },
            ]
          ).map((review, index) => (
            <Paper key={index} sx={{ p: 3, mb: 2, borderRadius: 2 }}>
              <Grid sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {review.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {review.date}
                </Typography>
              </Grid>
              <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
              <Typography variant="body2">{review.comment}</Typography>
            </Paper>
          ))}

          <Grid sx={{ mt: 3, textAlign: "center" }}>
            <Button variant="outlined" onClick={() => toast.success("Review feature coming soon!")}>
              Write a Review
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* FAQ Section */}
      <Grid sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">How long does shipping take?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout
              for faster delivery.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">What is your return policy?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              We offer a 30-day return policy. If you're not satisfied with your purchase, you can return it within 30
              days for a full refund or exchange.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">Is this product available in other colors?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              This product is available in the colors shown on this page. We regularly update our inventory, so check
              back for new color options.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">How do I care for this product?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Care instructions depend on the specific product materials. Generally, we recommend gentle cleaning with
              appropriate products. Detailed care instructions are included with your purchase.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>

      {/* Image Zoom Dialog */}
      <Dialog
        open={zoomDialogOpen}
        onClose={() => setZoomDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <Grid sx={{ position: "relative" }}>
          <IconButton
            onClick={() => setZoomDialogOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
              zIndex: 1,
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Grid
            component="img"
            src={productImages[activeImage] || "/placeholder.svg"}
            alt={product.name}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "80vh",
              objectFit: "contain",
              bgcolor: "#f9f9f9",
            }}
          />
        </Grid>
      </Dialog>
    </Container>
  )
}

export default ProductDetails
