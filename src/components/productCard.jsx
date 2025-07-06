"use client"

import { Box, Typography, IconButton, Skeleton, Rating, Chip, Tooltip, CircularProgress, Badge } from "@mui/material"
import {
  AddShoppingCart as AddShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useAddToWishlistMutation, useFavouritesQuery } from "../redux/api/productApi"
import { useSelector } from 'react-redux';
import toast from "react-hot-toast"
import { useErrors } from "../Hooks/Hook"
import { useNavigate } from "react-router-dom"


const ProductCard = ({
  cart,
  isLoading = false,
  isAddingToCart = false,
  addToCartHandler,
  refetch1,
}) => {

  const {user} = useSelector((state) => state.userReducer)
    const [wish, setWish] = useState()
    
    const navigate  = useNavigate();



  const {
    data,
    isError,
    error, refetch} = useFavouritesQuery({id: cart._id} , {
    refetchOnMountOrArgChange: true
  }
)

    useErrors([{ isError, error }]);



   useEffect(() => {
  if (data?.wish) {
    setWish(!!data.wish.wishlist);
  }
}, [data]);

    


  const [hover, setHover] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(cart?.colors && cart.colors.length > 0 ? 0 : null)
  const [isWishlisted, setIsWishlisted] = useState(wish)
  const [addedToCart, setAddedToCart] = useState(false)


useEffect(() => {
  setIsWishlisted(wish); 
}, [wish]);

 if (typeof refetch1 !== "function") {
            refetch1 = () => {};  
           }

  const [addToWishlist] = useAddToWishlistMutation();




  const handleAddToCart = () => {
  const cartItem = { ...cart, quantity: 1 , photo: cart.photo.url };

  addToCartHandler(cartItem);
  setAddedToCart(true);
  setTimeout(() => setAddedToCart(false), 1500);
};


  const handleAddToWishlist = async () => {
  const newWishlistStatus = !isWishlisted

  const formData = new FormData()
  formData.append("userId", user._id)
  formData.append("productId", cart._id)
  formData.append("wishlist", newWishlistStatus) // send correct toggled value

  try {
    const res = await addToWishlist({ userId: user._id, wishlist: newWishlistStatus, productId: cart._id })


    if (res.data?.success) {
      toast.success(res.data.message)
      setIsWishlisted(newWishlistStatus) // update local state only after success
          refetch1() 
          refetch() 

    } else {
      toast.error(res.data?.error || "Something Went Wrong")
    }
  } catch (error) {
    toast.error(error.message || "Something Went Wrong")
  }
}


  // Calculate disnt percentage if original price exists
  const discountPercentage = cart?.originalPrice
    ? Math.round(
        ((Number.parseFloat(cart.originalPrice.replace(/[^0-9.]/g, "")) -
          Number.parseFloat(cart.price.replace(/[^0-9.]/g, ""))) /
          Number.parseFloat(cart.originalPrice.replace(/[^0-9.]/g, ""))) *
          100,
      )
    : cart?.discount

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "90%" },
        p: 2,
        boxShadow: hover ? 6 : 3,
        borderRadius: 2,
        textAlign: "center",
        position: "relative",
        transition: "all 0.3s ease",
        transform: hover ? "translateY(-5px)" : "translateY(0)",
        bgcolor: "background.paper",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}

    >
      {/* Wishlist button */}
      <IconButton
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          bgcolor: "background.paper",
          boxShadow: 1,
          "&:hover": {
            bgcolor: "background.paper",
            transform: "scale(1.1)",
          },
          transition: "transform 0.2s ease",
        }}
        onClick={handleAddToWishlist}
        size="small"
      >
        { user._id === data?.wish?.userId && isWishlisted ? (
          <FavoriteIcon fontSize="small" color="error" />
        ) : (
          <FavoriteBorderIcon fontSize="small" color="action" />
        )}
      </IconButton>

      {/* Sale badge */}
      {!isLoading && (cart?.isOnSale || discountPercentage) && (
        <Chip
          label={`-${discountPercentage}%`}
          color="error"
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            left: 8,
            zIndex: 2,
            fontWeight: "bold",
          }}
        />
      )}

      {/* Product Image with loading state */}
      <Box sx={{ position: "relative", mb: 2, flexGrow: 0 }}>
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
        ) : (
          <Box
            component="img"
            src={cart?.photo?.url}
            alt={cart.name}
            sx={{
              width: "100%",
              height: 200,
              objectFit: "cover",
              borderRadius: 2,
              transition: "transform 0.5s ease",
              transform: hover ? "scale(1.05)" : "scale(1)",
            }}
            onClick={ ()=> navigate(`product/${cart._id}`)}

          />
        )}

        {/* Floating "Add to Cart" Button with loading state
        
        <Box
          className="cart-overlay"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 1,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            opacity: hover ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
    <Tooltip title={addedToCart ? "Added to cart" : "Add to cart"}>
  <span>
    <IconButton
      sx={{
        color: "white",
        bgcolor: addedToCart ? "success.main" : "primary.main",
        "&:hover": {
          bgcolor: addedToCart ? "success.dark" : "primary.dark",
          transform: "scale(1.1)",
        },
        transition: "all 0.2s ease",
        mr: 1,
      }}
      onClick={handleAddToCart}
      disabled={isAddingToCart || addedToCart}
    >
       {isAddingToCart ? (
                <CircularProgress size={24} color="inherit" />
              ) : addedToCart ? (
                <CheckCircleIcon />
              ) : (
                <AddShoppingCartIcon />
              )}
    </IconButton>
  </span>
</Tooltip>

             
           
        </Box> */}
      </Box>

      {/* Product Details */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}    onClick={ ()=> navigate(`/product/${cart._id}`)}
>
        {/* Product Name */}
        {isLoading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 1 }}>
            <Skeleton width="70%" height={24} />
            <Skeleton width="50%" height={24} />
          </Box>
        ) : (
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              fontSize: "1rem",
              height: 48,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              mb: 1,
            }}
          >
            {cart.name}
          </Typography>
        )}

        {/* Rating */}
        {isLoading ? (
          <Skeleton width="60%" height={24} sx={{ mx: "auto", mb: 1 }} />
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
            <Rating value={cart.rating || 4.5} precision={0.5} size="small" readOnly />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              ({cart.reviewCount || 2000})
            </Typography>
          </Box>
        )}

        {!isLoading && cart?.details?.colors && cart?.details?.colors?.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1, mt: 1 }}>
            {cart?.details?.colors?.map((color, index) => (
              <Tooltip key={index} title={color}>
                <Badge variant="dot" invisible={color} color="error" overlap="circular" badgeContent=" ">
                  <Box
                    onClick={() => setSelectedVariant(index)}
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: color,
                      borderRadius: "50%",
                      mx: 0.5,
                      cursor: "pointer",
                      border: selectedVariant === index ? "2px solid #000" : "1px solid #ddd",
                      opacity: 1 ,
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.2)",
                      },
                    }}
                  />
                </Badge>
              </Tooltip>
            ))}
          </Box>
        )}

        {/* Price */}
        {isLoading ? (
          <Skeleton width="40%" height={30} sx={{ mx: "auto", mt: "auto" }} />
        ) : (
          <Box sx={{ mt: "auto", display: "flex", justifyContent: "center", alignItems: "baseline" }}>
            <Typography variant="h6" fontWeight="bold" color={ "primary.text" }>
              {cart.price}/.Rs only
       
            </Typography>
              </Box>
        )}

        {/* Stock status */}
        {!isLoading && (
          <Typography variant="caption" color={cart.stock > 0 ? "success.main" : "error.main"} sx={{ mt: 0.5 }}>
            {cart.stock > 0 ? "In Stock" : "Out of Stock"}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default ProductCard
