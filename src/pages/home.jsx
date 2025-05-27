import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Paper, Select, Skeleton, TextField, Typography } from "@mui/material";
import  { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/productCard";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useInputValidation } from "6pp";
import { CreditCard, LocalShipping, Security, SupportAgent, Visibility, VisibilityOff } from "@mui/icons-material";
import { useLatestProductsQuery } from "../redux/api/productApi";
import { useErrors } from "../Hooks/Hook";
import Globe from "../3d models/3dmodels";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import { useSetProfileMutation } from "../redux/api/userApi";
import { userExist } from "../redux/reducer/userReducer";
import ProductImageSwiper from "../components/swiper";


const Home = ({user}) => {
 
  const [open, setOpen] = useState(true)
  const [dob, setDob] = useState(null); 
  const password = useInputValidation("");
  const [gender, setGender] = useState('');

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword((prev) => !prev);

  const {data, isLoading, isError , error} = useLatestProductsQuery();

  useErrors([{ isError, error }])

  const dispatch = useDispatch();

  const [profileSetup] = useSetProfileMutation();

 
const handleSubmit = async() => {
  if (!password || !dob || !gender ) {
    setOpen(true);
    return;
  }

  const userData = {
    password: password.value,
    dob,
    gender,
  }

   try{
              const res = await profileSetup(userData).unwrap();
         
              console.log(res)
  
              if (res) {
                  dispatch(userExist(res.user))
                  toast.success(res?.message);
              } else {
                  const error = res.error;
                  const message = error?.message || "Something Went Wrong";
                  toast.error(message);
              }
          } catch (error) {
              toast.error("Failed to stepup profile");
              console.log(error);
          }


  setOpen(false);
};

const addToCartHandler = (cartItem) =>{

  if(cartItem.stock < 1) {
    toast.error("Out of Stock")
    return;
  }else{
    dispatch(addToCart(cartItem));
 
  }
}

const images =[
  "https://static.c.realme.com/IN/wm-thread/1302813238798319616.png",
    "https://t4.ftcdn.net/jpg/07/83/23/49/360_F_783234924_ruKp3iYy45euwn6rsDywJjrNX9gdClxB.jpg",
  "https://helios-i.mashable.com/imagery/articles/00T3NfmmtMXQFabWjXrwGYS/hero-image.fill.size_1248x702.v1667574206.png",
  ,"https://img.freepik.com/free-vector/flat-geometric-fashion-youtube-thumbnail_23-2148918593.jpg?t=st=1741407762~exp=1741411362~hmac=eba0706639a23a3f984b1c72567c1a3d7c12570c8f964eb9eba08453f435d6ae&w=1380"

]


  return (
 <>
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: 2 }}>
      {/* Banner Image */}
      {
        user?.gender === "not" &&  <Dialog open={open}>
      <DialogTitle>Complete Your Profile</DialogTitle>
      <DialogContent>
        <TextField
      label="Password"
      required
      type={showPassword ? "text" : "password"}
      fullWidth
      margin="normal"
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
       <FormControl fullWidth margin="normal">
  <InputLabel id="gender-label">Gender</InputLabel>
  <Select
    labelId="gender-label"
    id="gender"
    value={gender}
    label="Gender"
    onChange={handleGenderChange}
    required
  >
    <MenuItem value="male">Male</MenuItem>
    <MenuItem value="female">Female</MenuItem>
  </Select>
</FormControl>
     <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Date of Birth"
                                    value={dob}
                                    onChange={(newValue) => setDob(newValue)}
                                    renderInput={(params) => (
                                        <TextField {...params} required fullWidth sx={{ mt: 2 }}  />
                                    )}
                                />
         </LocalizationProvider>     
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained">Submit</Button>
      </DialogActions>
    </Dialog>

      }
      {/* <Box
        component="img"
        src="https://img.freepik.com/free-vector/flat-geometric-fashion-youtube-thumbnail_23-2148918593.jpg?t=st=1741407762~exp=1741411362~hmac=eba0706639a23a3f984b1c72567c1a3d7c12570c8f964eb9eba08453f435d6ae&w=1380"
        alt="Ecommerce Banner"
        sx={{
          width: "80%",
          maxWidth: "800px",
          height: "auto",
          minHeight: "150px",
          objectFit: "cover",
          borderRadius: 2,
          boxShadow: 4,
          display: "block",
          mx: "auto",
          textAlign: "center",
        }}
      /> */}

      <ProductImageSwiper images={images} />

        {/* Features Section */}
        <Grid container spacing={3} sx={{ mb: 8 }} mt={7}>
          {[
            { icon: <LocalShipping fontSize="large" />, title: "Free Shipping", desc: "On orders over $50" },
            { icon: <Security fontSize="large" />, title: "Secure Payment", desc: "100% secure payment" },
            { icon: <SupportAgent fontSize="large" />, title: "24/7 Support", desc: "Dedicated support" },
            { icoContainern: <CreditCard fontSize="large" />, title: "Easy Returns", desc: "30 day return policy" },
          ].map((feature, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: 2,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  },
                  border: "1px solid #f0f0f0",
                }}
              >
                <Box sx={{ color: "primary.main", mb: 1 }}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>


      {/* Latest Products Heading */}
      <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  mt={4}
  sx={{ width: "100%",backgroudcolor:"red" }} // Ensure full width
>
  <Typography variant="h5" fontWeight="light" color={"rgba(0, 0, 0, 0.5)"}
 >
    LATEST PRODUCTS 
  </Typography>
  <Typography
    variant="body1"
    
    color={"rgba(0, 0, 0, 0.5)"}
    component={Link}
    to="/"
    sx={{ textDecoration: "none", color: "inherit", cursor: "pointer",  color: "rgba(0, 0, 0, 0.5)",
      fontWeight:"1rem",
 }}
  >
    MORE
  </Typography>
</Box>

<br />
<br />



{/* Products Grid */}
<Grid container spacing={2}>
  {data?.products?.map((product, index) => (
        <Grid item xs={6} sm={4} md={4} lg={3} key={index}>
          <ProductCard cart={product} isLoading={isLoading} addToCartHandler={addToCartHandler}  />
        </Grid>
      ))
   }
</Grid>

     {/* <Globe /> */}

      {/* Newsletter Section */}
    <br />
    <br />
    <br />
    <br />
    <br />

    </Box>
     <Box
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            bgcolor: "#f5f5f5",
            textAlign: "center",
            backgroundImage:
              "linear-gradient(135deg, #f5f5f5 25%, #f0f0f0 25%, #f0f0f0 50%, #f5f5f5 50%, #f5f5f5 75%, #f0f0f0 75%, #f0f0f0 100%)",
            backgroundSize: "20px 20px",
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Join Our Newsletter
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4} sx={{ maxWidth: 600, mx: "auto" }}>
            Subscribe to our newsletter and get 10% off your first purchase plus updates on new arrivals and special
            offers.
          </Typography>

          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            <TextField
              fullWidth
              placeholder="Your email address"
              variant="outlined"
              value=""
              onChange={(e) => console.log()}
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
              sx={{
                px: 4,
                py: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                whiteSpace: "nowrap",
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>
 </>
  );
};

export default Home;
