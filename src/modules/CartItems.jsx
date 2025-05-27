import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
} from "@mui/material";
import React from "react";
import { Add, Remove, Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { addToCart, discountApplied, removeCartItem } from "../redux/reducer/cartReducer";
import toast from "react-hot-toast";

const CartItems = ({ cartItems = [], setCouponCode}) => {
  const dispatch = useDispatch();

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(addToCart({ ...item, quantity: item.quantity - 1 }));
    }
  };

  const handleIncrement = (item) => {
    if(item.quantity >= item.stock) return toast.error(`Only ${item.stock} items in stock`)
    dispatch(addToCart({ ...item, quantity: item.quantity + 1 }));
  };

  const handleDelete = (productId) => {
    dispatch(removeCartItem(productId));
    dispatch(discountApplied(0)) 
    setCouponCode("")
  };

  return (
    <Box
      flex={1}
      p={2}
      minWidth="310px"
      sx={{
        maxHeight: "450px",
        overflowY: "auto",
        border: "1px solid #ddd",
        borderRadius: 3,
        boxShadow: 2,
        width: { xs: "100%", md: "90%" },
      }}
    >
      {cartItems.length === 0 ? (
        <Typography textAlign="center" color="gray">
          No items in the cart
        </Typography>
      ) : (
        cartItems.map((item, index) => (
          <Card
            key={index}
            sx={{ display: "flex", alignItems: "center", mb: 2, p: 2 }}
          >
            <CardMedia
              component="img"
             image={typeof item?.photo === 'string' ? item.photo : item?.photo?.url}
              alt={item?.name}
              sx={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 2,
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography fontWeight="bold">{item.name}</Typography>
              <Typography color="primary">${item.price}</Typography>

              <Box display="flex" alignItems="center" mt={1} gap={1}>
                <IconButton onClick={() => handleDecrement(item)} size="small">
                  <Remove fontSize="small" />
                </IconButton>
                <Typography
                  px={2}
                  sx={{
                    border: "1px solid black",
                    borderRadius: "10px",
                    minWidth: "10px",
                    textAlign: "center",
                  }}
                >
                  {item.quantity}
                </Typography>
                <IconButton onClick={() => handleIncrement(item)} size="small">
                  <Add fontSize="small" />
                </IconButton>
              </Box>
            </CardContent>
            <IconButton
              onClick={() => handleDelete(item._id)}
              color="error"
            >
              <Delete />
            </IconButton>
          </Card>
        ))
      )}
    </Box>
  );
};

export default CartItems;
