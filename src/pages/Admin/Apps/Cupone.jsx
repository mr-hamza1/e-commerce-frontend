import React, { useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, TextField, Typography } from '@mui/material';
import AdminLayout from '../../../layout/AdminLayout';
import { Menu } from '@mui/icons-material';
import axios from 'axios';
import {server} from '../../../constants/config'
import {useSelector} from 'react-redux'
import toast from 'react-hot-toast'

const CouponGenerator = () => {
  const [text, setText] = useState('');
  const [length, setLength] = useState(15);
  const [amount, setAmount] = useState();
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeChars, setIncludeChars] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [generated, setGenerated] = useState('');
  const random =  Math.random()

     const [menu, setMenu] = useState(false)

     const {user} = useSelector((state) => state.userReducer)


  const generateCoupon = () => {
    let chars = '';
    if (includeNumbers) chars += '0123456789';
    if (includeChars) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (includeSymbols) chars += '!@#$%^&*';

    let result = text;
    while (result.length < length) {
      const randIndex = Math.floor(Math.random() * chars.length);

      if(random > 0.5)
      result += chars[randIndex];
    else{
      result = chars[randIndex] + result;
    }
    }

    setGenerated(result);
  };

  const saveCoupon = () => {

            axios
          .post(`${server}/api/v1/payment/coupon/new?id=${user._id}`,  
            {
              code: generated,
              amount,
            },
              {withCredentials: true}
    )
            .then((res) => {
              toast.success(res.data.message)                             
            })
            .catch((error) => {
            console.log(error.response.message)
            });

  }

  return (
     <AdminLayout menu={menu} setMenu={setMenu} >
               <IconButton sx={{ display: { md: "none" } }} onClick={() => setMenu(true)}>
                      <Menu />
                    </IconButton>
      <Box mt={{xs: 15 , sm: 10}} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Coupon
      </Typography>

      <Grid container spacing={2} maxWidth={400}>
        <Grid item xs={8}>
          <TextField
            fullWidth
            label="Text to include"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            type="number"
            label="Length"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" gap={2} border="1px solid #ccc" borderRadius={1} p={2}>
            <FormControlLabel
              control={<Checkbox checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} />}
              label="Numbers"
            />
            <FormControlLabel
              control={<Checkbox checked={includeChars} onChange={(e) => setIncludeChars(e.target.checked)} />}
              label="Characters"
            />
            <FormControlLabel
              control={<Checkbox checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} />}
              label="Symbols"
            />
          </Box>
        </Grid>

          <Grid item xs={12}>
          <TextField
            fullWidth
            required
            type="number"
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, fontWeight: 'bold' }}
            onClick={generateCoupon}
          >
            Generate
          </Button>
        </Grid>

        {generated && (
          <Grid item xs={12}  textAlign="center">
            <Typography variant="h6" mt={2} letterSpacing={1.5}>
              {generated}
            </Typography>
            <br />

            <Button variant="outlined" color='#212121' onClick={saveCoupon}>Save in database</Button>
          </Grid>
        )}


      </Grid>
    </Box>
    </AdminLayout>
  );
};

export default CouponGenerator;
