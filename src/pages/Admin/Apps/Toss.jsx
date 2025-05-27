import React, { useState } from 'react';
import AdminLayout from '../../../layout/AdminLayout';
import { Box, IconButton, Typography } from '@mui/material';
import heads from '../../../assets/Toss/heads.png';
import tails from '../../../assets/Toss/tails.png';
import { Menu } from '@mui/icons-material';

const Toss = () => {
  const [angle, setAngle] = useState(0);

           const [menu, setMenu] = useState(false)
  

  const flip = () => {
    if(Math.random() > 0.5)
    setAngle((prev) => prev + 180);
  else
    setAngle((prev) => prev + 360);
   
  };

  return (
     <AdminLayout menu={menu} setMenu={setMenu} >
               <IconButton sx={{ display: { md: "none" } }} onClick={() => setMenu(true)}>
                      <Menu />
                    </IconButton>
     <Box
  bgcolor="white"
  ml={{md:4, lg: 6 }}           // no margin on mobile, margin on desktop
  height="100%"
  p={4}
  width={{ xs: "100%", sm: "100%", md: "96%", lg: "96%" }} // responsive width
  mx="auto"                       // center horizontally
>
  <Typography variant="h4" mb={2}  textAlign="center">
    Toss
  </Typography>

  <Box
    onClick={flip}
    sx={{
      perspective: '1000px',
      width: { xs: 200, sm: 250, md: 300 }, // responsive coin size
      height: { xs: 200, sm: 250, md: 300 },
      mb: 2,
      cursor: 'pointer',
      mx: 'auto',             // center the flip box horizontally
      mt: { xs: 5, sm: 8, md: 15 }, // responsive top margin
    }}
  >
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.8s',
        transform: `rotateY(${angle}deg)`
      }}
    >
      {/* Heads */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url(${heads})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '50%',
          border: '2px solid #ccc',
          backfaceVisibility: 'hidden',
        }}
      />

      {/* Tails */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `url(${tails})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '50%',
          border: '2px solid #ccc',
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
        }}
      />
    </Box>
  </Box>
</Box>

    </AdminLayout>
  );
};

export default Toss;
