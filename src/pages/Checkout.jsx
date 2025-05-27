import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import toast from "react-hot-toast";

import { useNewOrderMutation } from "../redux/api/orderApi";
import { resetCart } from "../redux/reducer/cartReducer";

const stripePromise = loadStripe("pk_test_51RSdG3PthkzL7d7808NwajmZu1Hzwz3lq2m8LNG3J9MyekwXdaUa0RUnI4WinpWBTgdvgLiJlbCUVoynq4wpOMm900vhoJYbte");

const CheckOutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.userReducer);
  const {
    shippingInfo,
    cartItems,
    subTotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state) => state.cartReducer);

  const [isProcessing, setIsProcessing] = useState(false);
  const [newOrder] = useNewOrderMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // Attempt to confirm the payment only if required
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Stripe error:", error);
        toast.error(error.message || "Payment failed.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const orderData = {
          shippingInfo,
          orderItems: cartItems,
          subtotal: subTotal,
          tax,
          discount,
          shippingCharges,
          total,
          user: user?._id,
        };

        const res = await newOrder(orderData);
        dispatch(resetCart());

        if (res.error) {
          toast.error(res.error.data.message || "Order creation failed");
        } else {
          toast.success("Order placed successfully!");
          navigate("/orders");
        }
      } else {
        toast.error("Payment was not completed.");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred.");
    }

    setIsProcessing(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Complete Your Payment
        </Typography>
        <form onSubmit={submitHandler}>
          <PaymentElement />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            sx={{ mt: 3 }}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Pay"
            )}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

const Checkout = () => {
  const location = useLocation();
  const clientSecret = location.state;

  if (!clientSecret) return <Navigate to="/shipping" />;

  return (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      <CheckOutForm clientSecret={clientSecret} />
    </Elements>
  );
};

export default Checkout;
