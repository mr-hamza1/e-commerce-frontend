"use client"
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material"
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

// Import your actual API hook
import { useErrors } from "../Hooks/Hook"
import { useFavouritesQuery } from "../redux/api/productApi"
import ProductCard from "../components/productCard"

const Favourites = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.userReducer)
  const [wishlistItems, setwishlistItems] = useState([])
  const [cart, setCart] = useState([])

  // Fetch wishlist data using your API
  const { data, isLoading, isError, error, refetch} = useFavouritesQuery({userId: user._id, },{
    refetchOnMountOrArgChange: true
  })

  console.log(data)

   useErrors([{ isError, error }]);

     useEffect(() => {
    if (data?.favourites) {
      setwishlistItems(data?.favourites); 
   const productsOnly = data.favourites.map(item => item.productId);
  setCart(productsOnly);
    }
  }, [data]);





  const handleMoveToCart = async (product) => {
    // try {
    //   setIsMovingToCart(product._id)

    //   // Add to cart - adjust this to your actual cart API
    //   const cartResponse = await axios.post(
    //     `${server}/api/v1/cart`,
    //     { productId: product._id, quantity: 1 },
    //     { withCredentials: true },
    //   )

    //   if (cartResponse.data?.success) {
    //     // Remove from favorites
    //     await axios.delete(`${server}/api/v1/fav?productId=${product._id}`, {
    //       withCredentials: true,
    //     })

    //     toast.success("Item added to cart")
    //     refetch() // Refresh the list
    //   } else {
    //     toast.error(cartResponse.data?.message || "Failed to add to cart")
    //   }
    // } catch (error) {
    //   toast.error(error.response?.data?.message || "Something went wrong")
    // } finally {
    //   setIsMovingToCart(null)
    // }
  }

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(4)
      .fill(0)
      .map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={`skeleton-${index}`}>
          <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton width="70%" height={28} />
              <Skeleton width="40%" height={20} sx={{ mt: 1 }} />
              <Skeleton width="60%" height={20} sx={{ mt: 1 }} />
            </CardContent>
            <CardActions sx={{ mt: "auto", px: 2, pb: 2 }}>
              <Skeleton width="100%" height={36} />
            </CardActions>
          </Card>
        </Grid>
      ))
  }

  // Render empty wishlist state
  const renderEmptyWishlist = () => {
    return (
      <Paper
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <FavoriteBorderIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your wishlist is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Items added to your wishlist will appear here
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/search")}
          startIcon={<ShoppingCartIcon />}
        >
          Continue Shopping
        </Button>
      </Paper>
    )
  }

  // Get the wishlist items from your API response structure

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          My Wishlist
        </Typography>
      </Box>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.data?.message || "Failed to load wishlist items"}
        </Alert>
      )}

      {!isLoading && wishlistItems.length === 0 && renderEmptyWishlist()}

      {(isLoading || wishlistItems.length > 0) && (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="body1" color="text.secondary">
              {!isLoading && `${wishlistItems.length} items in your wishlist`}
            </Typography>
            {!isLoading && wishlistItems.length > 0 && (
              <Button variant="outlined" onClick={() => navigate("/cart")}>
                Go to Cart
              </Button>
            )}
          </Box>

          <Divider sx={{ mb: 4 }} />

       <Grid container spacing={2}>
         {cart?.map((item, index) => (
               <Grid item xs={6} sm={4} md={4} lg={3} key={index}>
                 <ProductCard cart={item} isLoading={isLoading}  refetch1={refetch}/>
               </Grid>
             ))
          }
       </Grid>
        </>
      )}
    </Container>
  )
}

export default Favourites
