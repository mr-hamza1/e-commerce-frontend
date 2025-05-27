import { Box, Typography, TextField, Button, Card, CardMedia, CardContent, Chip, Collapse, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import CartItems from '../modules/CartItems';
import {Error as ErrorIcon} from  '@mui/icons-material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {  calculatePrice, discountApplied } from '../redux/reducer/cartReducer';
import axios from 'axios';
import { server } from '../constants/config';
import toast from 'react-hot-toast';

const Cart = () => {
  
  const {cartItems, subTotal, tax, total, shippingCharges, discount } = useSelector((state)=> state.cartReducer)

  const {user, loading} = useSelector((state) => state.userReducer)

  

  const [couponCode, setCouponCode] = useState('');
  const [codes, setCodes] = useState([]);
  const [validCoupon, setValidCoupon] = useState(false);
  const [correctCoupon, setCorrectCoupon] = useState("")
   const [showCoupons, setShowCoupons] = useState(false);


      const dispatch = useDispatch()



  useEffect(() => {
     if(couponCode===''){
    setValidCoupon(false)
    setCorrectCoupon('')
  //  dispatch(discountApplied(0)) 

  }
  
   
  dispatch(calculatePrice())

 
  }, [cartItems, couponCode])

  

  const applyCoupon =() =>{
        axios
      .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`,    {withCredentials: true}
)
        .then((res) => {
          setCorrectCoupon(res.data.message)
          if(res?.data?.valid){
           setValidCoupon(true)
          }
          dispatch(discountApplied(res?.data?.discount))
            dispatch(calculatePrice())        
        })
        .catch((error) => {
          setCorrectCoupon(error?.response?.data?.message)
           setValidCoupon(false)

          dispatch(discountApplied(0)) 
        });  
  }

 

  useEffect(() => {

      axios .get(`${server}/api/v1/payment/coupons`,  {withCredentials: true})
        .then((res) => {
          setCodes(res.data.couponCodes) 
        })
        .catch((error) => {
          console.log(error?.response?.data?.message)
        
        });  

  }, [showCoupons])
 



 return (
    <>

       <Typography variant="h6" fontWeight="bold" mb={1} mt={2} ml={2}>
          Your Cart Items
        </Typography>

    
    <Box 
      display="flex" 
      flexDirection={{ xs: "column", md: "row" }} // Column on mobile, row on desktop
      justifyContent="center"
      width={{xs: "100%", sm: "90%"}} 
      gap={9}
      p={2}
    >
      {/* Left Side - Scrollable Cart Items */}


      <CartItems cartItems={cartItems} setCouponCode={setCouponCode}/>

      {/* Right Side - Order Summary (Sticky on Desktop) */}
      <Box 
        width={{ xs: "100%", md: "30%" }}
        p={3}
        minWidth="300px"
        boxShadow={3}
        // borderRadius={2}
        mt={{ xs: 3, md: 4 }}
        sx={{ 
          bgcolor: "white", 
          position: { md: "sticky" }, 
          top: "150px",
          height: "fit-content"
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Order Summary
        </Typography>
        <Typography>Subtotal: {subTotal}</Typography>
        <Typography>Shipping Charges: {shippingCharges}</Typography>
        <Typography>Tax: {tax}</Typography>
        <Typography>Discount: {discount}</Typography>
        <Typography fontWeight="bold">Total: {total}</Typography>

        {/* Coupon Code Input */}
        <TextField
          fullWidth
          label="Enter Coupon Code"
          variant="outlined"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          sx={{ my: 2 }}
        />

       {
        !user?
         (<Button
            variant="contained"
            color="primary"
            fullWidth
             component={Link}
            to="/login"
            onClick={() => toast.error("Login to buy the product")}

         >
            {couponCode? "Apply Coupon": "Shipping"}
          </Button>)
           : 
        
       cartItems.length == 0? 
            <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => toast.error("cart is empty")}
         >
            {couponCode? "Apply Coupon": "Shipping"}
          </Button>

        :
          couponCode? (
        validCoupon? "":
            <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={applyCoupon}
          >
            Apply Coupon
          </Button>
          ):
          (
            <Button
            variant="contained"
            color="primary"
            fullWidth
            component={Link}
            to="/shipping"
          >
            Shipping
          </Button>
          )
        
       
       }

       {
    couponCode?  validCoupon ? (
         <>
          <Typography color="green" mt={2}>
            ✅ {correctCoupon}
          </Typography>
         <Button
            variant="contained"
            color="primary"
            fullWidth
            component={Link}
            to="/shipping"
          >
           Go to Shipping
          </Button>
         </>

        ) :
        (
          <Typography sx={{color: "red"}}  mt={2}>
         { correctCoupon?  <><ErrorIcon  /> {correctCoupon}</> : ""}
          </Typography>
        )
      : ""
       }

       {
        !user? "":
         couponCode? "":
   <Box sx={{ mt: 2 }}>
      <Box
        sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setShowCoupons((prev) => !prev)}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Available Coupons:
        </Typography>
        <IconButton size="small">
          {showCoupons ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={showCoupons}>
        <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
          {
            codes?.map((i) => (
              <Chip
                key={i.code}
                label={i.code}
                color="primary"
                variant="outlined"
                onClick={() => setCouponCode(i.code)}
              />
            ))
          }
        </Box>
      </Collapse>
    </Box>

       }
    
      </Box>
    </Box>
    </>
  );
};

export default Cart;
