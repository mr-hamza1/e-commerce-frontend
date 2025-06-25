import { useInputValidation } from '6pp';
import React, { useState } from 'react';
import { Google as GoogleIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import * as Mui from '@mui/material';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useLoginMutation, useSignUpMutation } from '../redux/api/userApi';
import toast from 'react-hot-toast';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDispatch } from 'react-redux';
import {userExist} from '../redux/reducer/userReducer'


function Login() {
    const [isLogin, setIsLogin] = useState(true);

    console.log()

    const dispatch = useDispatch();

    const toggleLogin = () => setIsLogin((prev) => !prev);

    const name = useInputValidation("");
    const email = useInputValidation("");
    const password = useInputValidation("");
    const gender = useInputValidation("");
    const [dob, setDob] = useState(null); 

      const [showPassword, setShowPassword] = useState(false);
    
      const toggleVisibility = () => setShowPassword((prev) => !prev);
    

    const [login] = useLoginMutation();
    const [signUp] = useSignUpMutation();

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const { user } = await signInWithPopup(auth, provider);
            
            const res = await signUp({
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                gender: "not",
                role: "user",
                password: "not!!!",
                dob: "Mon Jan 01 1900 00:00:00 GMT+0428 (Pakistan Standard Time)",
            }).unwrap();

            console.log(res)


            if (res) {
                 dispatch(userExist(res.user))
                 toast.success(res.message);
            }else {
                const error = res.error;
                const message = error?.message || "Something Went Wrong";
                toast.error(message);
            }
        } catch (error) {
            toast.error("Sign in Failed");
            console.log(error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            
            const res = await login({
                email: email.value,
                password: password.value,
            });

            console.log(res)

            if (res.data) {
                dispatch(userExist(res.data.user))
                toast.success(res?.data.message);
            } else {
                const error = res.error;
                const message = error?.data?.message || "Something Went Wrong";
                toast.error(message);
            }
        } catch (error) {
            toast.error("Sign in Failed");
            console.log(error);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!gender.value) {
            alert("Please enter your gender.");
            return;
        }

        if (!dob) {
            alert("Please select your Date of Birth.");
            return;
        }

        try{
            const res = await signUp({
                name: name.value,
                email: email.value,
                password: password.value,
                gender: gender.value,
                dob: dob,
                photo:"https://m.media-amazon.com/images/S/aplus-media-library-service-media/d2ed3049-66eb-4dde-903d-0619f6398183.__CR0,0,220,220_PT0_SX220_V1___.png"
            }).unwrap();
       
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
            toast.error("SignUp Failed");
            console.log(error);
        }
    };

    return (
        <Mui.Container
            component="main"
            maxWidth="xs"
            sx={{
                display: "flex",
                alignItems: "center",
                height: "100vh",
                justifyContent: "center"
            }}
        >
            <Mui.Paper
                elevation={3}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: 4,
                    flexDirection: "column"
                }}
            >
                {isLogin ? (
                    <>
                        <Mui.Typography variant="h5">Login</Mui.Typography>

                        <form style={{ marginTop: "1rem", width: "100%" }} onSubmit={handleLogin}>
                            <Mui.TextField
                                label="Email Address"
                                required
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                value={email.value}
                                onChange={email.changeHandler}
                            />

                                                    <Mui.TextField
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
          <Mui.InputAdornment position="end">
            <Mui.IconButton onClick={toggleVisibility} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </Mui.IconButton>
          </Mui.InputAdornment>
        ),
      }}
    />    

                            <Mui.Button
                                sx={{ marginTop: "1rem" }}
                                variant="contained"
                                type="submit"
                                color="primary"
                                fullWidth
                            >
                                Login
                            </Mui.Button>

                            <Mui.Typography textAlign="center" m="1rem">
                                OR
                            </Mui.Typography>

                            <Mui.Button
                                variant="outlined"
                                color="error"
                                fullWidth
                                onClick={handleGoogleSignIn}
                                startIcon={<GoogleIcon />}
                            >
                                Sign in with Google
                            </Mui.Button>

                            <Mui.Button
                                variant="text"
                                onClick={toggleLogin}
                                fullWidth
                            >
                                Sign Up instead
                            </Mui.Button>
                        </form>
                    </>
                ) : (
                    <>
                        <Mui.Typography variant="h5">Sign Up</Mui.Typography>

                        <form style={{ marginTop: "1rem", width: "100%" }} onSubmit={handleSignup}>
                            <Mui.TextField
                                label="Name"
                                required
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                value={name.value}
                                onChange={name.changeHandler}
                            />

                            <Mui.TextField
                                label="Email Address"
                                required
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                value={email.value}
                                onChange={email.changeHandler}
                            />

                            <Mui.TextField
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
          <Mui.InputAdornment position="end">
            <Mui.IconButton onClick={toggleVisibility} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </Mui.IconButton>
          </Mui.InputAdornment>
        ),
      }}
    />    

                           <Mui.FormControl fullWidth margin="normal" required>
                                <Mui.InputLabel>Gender</Mui.InputLabel>
                                <Mui.Select
                                    value={gender.value}
                                    label="Gender"
                                    onChange={gender.changeHandler}
                                >
                                    <Mui.MenuItem value="male">Male</Mui.MenuItem>
                                    <Mui.MenuItem value="female">Female</Mui.MenuItem>
                                </Mui.Select>
                            </Mui.FormControl>

                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Date of Birth"
                                    value={dob}
                                    onChange={(newValue) => setDob(newValue)}
                                    renderInput={(params) => (
                                        <Mui.TextField {...params} fullWidth margin="normal" required />
                                    )}
                                />
                            </LocalizationProvider>

                            <Mui.Button
                                sx={{ marginTop: "1rem" }}
                                variant="contained"
                                type="submit"
                                color="primary"
                                fullWidth
                            >
                                Sign Up
                            </Mui.Button>

                            <Mui.Typography textAlign="center" m="1rem">
                                OR
                            </Mui.Typography>

                            <Mui.Button
                                variant="outlined"
                                color="error"
                                fullWidth
                                onClick={handleGoogleSignIn}
                                startIcon={<GoogleIcon />}
                            >
                                Sign up with Google
                            </Mui.Button>

                            <Mui.Button
                                variant="text"
                                onClick={toggleLogin}
                                fullWidth
                            >
                                Login instead
                            </Mui.Button>
                        </form>
                    </>
                )}
            </Mui.Paper>
        </Mui.Container>
    );
}

export default Login;
