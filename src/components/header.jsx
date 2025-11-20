import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  Search as SearchIcon,
  ShoppingBag as ShoppingBagIcon,
  ShoppingCart as ShoppingCartIcon,
  FavoriteBorder,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import axios from "axios";
import { userNotExist } from "../redux/reducer/userReducer";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { server } from "../constants/config";

const Header = ({ user }) => {

  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = async() => {
    try {
      const {data} = await axios.post(`${server}/api/v1/user/logout`, { withCredentials: true })
      console.log(data)
      dispatch(userNotExist());
      toast.success(data.message);
    } catch (error) {
      toast.error(error || "Something Went Wrong");
    }
    handleClose();
  };

  return (
    <Box height={"4rem"}>
 <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "white",
        color:"black",
        borderBottom: "3px solid black",
        transition: "background-color 0.3s ease",
      }}
    >        <Toolbar>
          {/* Logo */}
          <Typography
  sx={{
    textDecoration: "none",
    color: "inherit",
    cursor: "pointer",
    fontSize: {
      xs: "1.5rem", // Small devices
      sm: "2rem",   // Medium devices
      md: "2.3rem",
      lg: "2.5rem", // Large devices and up
    },
  }}
            fontWeight={5}
            component={Link}
            to="/"
          >
            Lootlo
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {/* Navigation Icons */}

          <Box display="flex" alignItems="center" gap={{xs:1, md:2}}>
            <Tooltip title="Search">
              <IconButton color="inherit" component={Link} to="/search">
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Favourites">
              <IconButton color="inherit" component={Link} to="/favourites">
                <FavoriteBorder />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cart">
              <IconButton color="inherit" component={Link} to="/cart">
                <ShoppingCartIcon />
              </IconButton>
            </Tooltip>

            {/* Profile Icon with Menu */}
           

            {
              user?._id? (


                <> 
                 <Tooltip title="Profile">
              <IconButton color="inherit" onClick={handleClick}>
                { user.photo? <Avatar src={user.photo}  sx={{border:"3px solid white"}} /> : <AccountCircleIcon /> }
              </IconButton>
            </Tooltip>            
            {/* Profile Dropdown Menu */}
            <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 220,
                borderRadius: 2,
                p: 1,
              },
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Typography p={2}>{user?.email.trim(4,"....")}</Typography>
            {/* Admin Panel Link */}
            {user?.role === "admin" && (
              <MenuItem component={Link} to="/admin/dashboard" onClick={handleClose}>
                <SettingsIcon sx={{ mr: 2 }} />
                Admin Panel
              </MenuItem>
            )}

            {/* Orders */}
            <MenuItem component={Link} to="/orders" onClick={handleClose}>
              <ShoppingBagIcon sx={{ mr: 2 }} />
              Orders
            </MenuItem>

          

            {/* Logout */}
            <MenuItem onClick={logoutHandler}>
              <LogoutIcon sx={{ mr: 2 }} color={"error"} />
              Log Out
            </MenuItem>
          </Menu>
                </>
      
              )
              :
              (
                <Box display="flex" alignItems="center" gap={2}>
                  <Tooltip title="Login">
                    <IconButton color="inherit" component={Link} to="/login">
                      <LoginIcon/>
                    </IconButton>
                  </Tooltip>
                </Box>
              ) 
            }
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
