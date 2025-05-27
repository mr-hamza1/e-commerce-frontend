"use client"
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Grid,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  ArrowCircleLeft as ArrowCircleLeftIcon,
  LocationOn as LocationOnIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
} from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { saveShippingInfo } from "../redux/reducer/cartReducer"
import toast from "react-hot-toast"
import axios from "axios";


const Shipping = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { cartItems, subTotal, tax, shippingCharges, discount, total , coupon} = useSelector((state) => state.cartReducer)
  const { user } = useSelector((state) => state.userReducer)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get saved addresses from localStorage or initialize empty array
  const getSavedAddresses = () => {
    const saved = localStorage.getItem("savedAddresses")
    return saved ? JSON.parse(saved) : []
  }

  const [savedAddresses, setSavedAddresses] = useState(getSavedAddresses)
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1)
  const [showAddressForm, setShowAddressForm] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const ship = {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  }

  const [shippingInfo, setShippingInfo] = useState(ship)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (cartItems.length <= 0) {
      return navigate("/cart")
    }
  }, [cartItems, navigate])

  // Select a saved address
  const handleSelectAddress = (index) => {
    setSelectedAddressIndex(index)
    setShippingInfo(savedAddresses[index])
    setShowAddressForm(false)
  }

  // Add new address form
  const handleAddNewAddress = () => {
    setSelectedAddressIndex(-1)
    setShippingInfo(ship)
    setShowAddressForm(true)
  }

  // Edit selected address
  const handleEditAddress = () => {
    setShowAddressForm(true)
  }

  // Delete selected address
  const handleDeleteAddress = (index) => {
    const updatedAddresses = [...savedAddresses]
    updatedAddresses.splice(index, 1)
    setSavedAddresses(updatedAddresses)
    localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses))
    
    if (index === selectedAddressIndex) {
      setSelectedAddressIndex(-1)
      setShippingInfo(ship)
      setShowAddressForm(true)
    } else if (index < selectedAddressIndex) {
      setSelectedAddressIndex(selectedAddressIndex - 1)
    }
    
    toast.success("Address removed successfully")
  }

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value })
    // Clear error when field is changed
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!shippingInfo.address.trim()) newErrors.address = "Address is required"
    if (!shippingInfo.city.trim()) newErrors.city = "City is required"
    if (!shippingInfo.state.trim()) newErrors.state = "State is required"
    if (!shippingInfo.country) newErrors.country = "Country is required"
    if (!shippingInfo.pinCode) {
      newErrors.pinCode = "Zip code is required"
    } else if (!/^\d+$/.test(shippingInfo.pinCode)) {
      newErrors.pinCode = "Zip code must contain only numbers"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }


  const handleSaveAddress = () => {
    if (!validateForm()) return
    
    // Check if this address already exists
    const addressExists = savedAddresses.some(
      (addr) =>
        addr.address === shippingInfo.address &&
        addr.city === shippingInfo.city &&
        addr.state === shippingInfo.state &&
        addr.country === shippingInfo.country &&
        addr.pinCode === shippingInfo.pinCode
    )
    
    if (!addressExists) {
      const updatedAddresses = [...savedAddresses, shippingInfo]
      setSavedAddresses(updatedAddresses)
      localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses))
      setSelectedAddressIndex(updatedAddresses.length - 1)
      toast.success("Address saved successfully")
    } else {
      toast.error("This address already exists")
    }
    
    setShowAddressForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    dispatch(saveShippingInfo(shippingInfo))
    
    setIsSubmitting(true)

    
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/payment/create?id=${user?._id}`,
        {
          items: cartItems,
          shippingInfo,
          coupon,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data)

      navigate("/pay", {
        state: data.clientSecret,
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    
  }

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 4 }}>
      <Box maxWidth="1200px" mx="auto" px={2}>
        {/* Back button */}
        <IconButton
          component={Link}
          to="/cart"
          sx={{
            mb: 2,
            color: "primary.main",
            "&:hover": { bgcolor: "rgba(25, 118, 210, 0.04)" },
          }}
        >
          <ArrowCircleLeftIcon fontSize="large" />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Back to Cart
          </Typography>
        </IconButton>

        {/* Checkout Steps */}
        <Stepper
          activeStep={1}
          alternativeLabel
          sx={{ mb: 4, display: { xs: "none", sm: "flex" } }}
        >
          <Step completed>
            <StepLabel StepIconComponent={ShoppingCartIcon}>Cart</StepLabel>
          </Step>
          <Step active>
            <StepLabel StepIconComponent={LocalShippingIcon}>Shipping</StepLabel>
          </Step>
          <Step>
            <StepLabel StepIconComponent={PaymentIcon}>Payment</StepLabel>
          </Step>
          <Step>
            <StepLabel StepIconComponent={CheckCircleIcon}>Complete</StepLabel>
          </Step>
        </Stepper>

        <Grid container spacing={3}>
          {/* Left side - Shipping Form */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" mb={3}>
                Shipping Address
              </Typography>

              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
                <Box mb={4}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                    Saved Addresses
                  </Typography>
                  <RadioGroup
                    value={selectedAddressIndex}
                    onChange={(e) => handleSelectAddress(Number(e.target.value))}
                  >
                    <Grid container spacing={2}>
                      {savedAddresses.map((address, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Card
                            variant="outlined"
                            sx={{
                              borderColor: selectedAddressIndex === index ? "primary.main" : "divider",
                              borderWidth: selectedAddressIndex === index ? 2 : 1,
                              position: "relative",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                borderColor: "primary.main",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                              },
                            }}
                          >
                            <CardContent sx={{ pb: 1 }}>
                              <FormControlLabel
                                value={index}
                                control={<Radio />}
                                label={
                                  <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                      {address.address}
                                    </Typography>
                                    <Typography variant="body2">
                                      {address.city}, {address.state}, {address.country}
                                    </Typography>
                                    <Typography variant="body2">ZIP: {address.pinCode}</Typography>
                                  </Box>
                                }
                                sx={{ width: "100%", m: 0 }}
                              />
                              <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    handleDeleteAddress(index)
                                  }}
                                  sx={{ color: "error.main" }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                      <Grid item xs={12} sm={6}>
                        <Card
                          variant="outlined"
                          sx={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            borderStyle: "dashed",
                            "&:hover": {
                              borderColor: "primary.main",
                              bgcolor: "rgba(25, 118, 210, 0.04)",
                            },
                          }}
                          onClick={handleAddNewAddress}
                        >
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                p: 1,
                              }}
                            >
                              <AddIcon color="primary" sx={{ mb: 1 }} />
                              <Typography variant="body2" color="primary">
                                Add New Address
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </RadioGroup>
                </Box>
              )}

              {/* Address Form */}
              <Collapse in={showAddressForm}>
                <Box component="form" onSubmit={handleSubmit}>
                  <Typography variant="subtitle1" fontWeight="medium" mb={2}>
                    {selectedAddressIndex >= 0 ? "Edit Address" : "New Address"}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Address"
                        variant="outlined"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!errors.address}
                        helperText={errors.address}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="City"
                        variant="outlined"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!errors.city}
                        helperText={errors.city}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="State"
                        variant="outlined"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!errors.state}
                        helperText={errors.state}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required error={!!errors.country}>
                        <InputLabel>Country</InputLabel>
                        <Select
                          label="Country"
                          name="country"
                          value={shippingInfo.country}
                          onChange={handleChange}
                        >
                          <MenuItem value={"USA"}>USA</MenuItem>
                          <MenuItem value={"Canada"}>Canada</MenuItem>
                          <MenuItem value={"India"}>India</MenuItem>
                          <MenuItem value={"Pakistan"}>Pakistan</MenuItem>
                          <MenuItem value={"UK"}>United Kingdom</MenuItem>
                          <MenuItem value={"Australia"}>Australia</MenuItem>
                          <MenuItem value={"Germany"}>Germany</MenuItem>
                          <MenuItem value={"France"}>France</MenuItem>
                          <MenuItem value={"Japan"}>Japan</MenuItem>
                          <MenuItem value={"China"}>China</MenuItem>
                        </Select>
                        {errors.country && (
                          <Typography variant="caption" color="error">
                            {errors.country}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Zip Code"
                        variant="outlined"
                        name="pinCode"
                        type="text"
                        value={shippingInfo.pinCode}
                        onChange={handleChange}
                        required
                        fullWidth
                        error={!!errors.pinCode}
                        helperText={errors.pinCode}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 1 }}>
                        {selectedAddressIndex >= 0 && (
                          <Button
                            variant="outlined"
                            onClick={() => setShowAddressForm(false)}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSaveAddress}
                          startIcon={<SaveIcon />}
                        >
                          Save Address
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Collapse>

              {/* Edit button for selected address */}
              {selectedAddressIndex >= 0 && !showAddressForm && (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEditAddress}
                  >
                    Edit Address
                  </Button>
                </Box>
              )}
            </Paper>

            {/* Shipping Methods */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Shipping Method
              </Typography>
              <RadioGroup defaultValue="standard">
                <FormControlLabel
                  value="standard"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle2">Standard Shipping</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Delivery in 3-5 business days
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="express"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle2">Express Shipping</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Delivery in 1-2 business days
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </Paper>
          </Grid>

          {/* Right side - Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                position: { md: "sticky" },
                top: "20px",
              }}
            >
              <Typography variant="h5" fontWeight="bold" mb={3}>
                Order Summary
              </Typography>

              {/* Order Items Summary */}
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary" mb={1}>
                  {cartItems.length} {cartItems.length === 1 ? "ITEM" : "ITEMS"}
                </Typography>
                {cartItems.slice(0, 2).map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      py: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box
                      component="img"
                      src={item.photo}
                      alt={item.name}
                      sx={{
                        width: 40,
                        height: 40,
                        objectFit: "cover",
                        borderRadius: 1,
                        mr: 2,
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" noWrap sx={{ maxWidth: "150px" }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Qty: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                      {item.price}
                    </Typography>
                  </Box>
                ))}
                {cartItems.length > 2 && (
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    +{cartItems.length - 2} more items
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Price Breakdown */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">{subTotal}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">{shippingCharges}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2">{tax}</Typography>
                </Box>
                {discount > 0 && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2">Discount</Typography>
                    <Typography variant="body2" color="success.main">
                      -{discount}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Total */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Total
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {total}
                </Typography>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={isSubmitting || !shippingInfo.address}
                onClick={handleSubmit}
                sx={{ py: 1.5 }}
              >
                {isSubmitting ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Shipping
