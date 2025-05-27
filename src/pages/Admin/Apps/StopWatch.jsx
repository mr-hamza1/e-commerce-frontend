import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../layout/AdminLayout';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { Menu } from '@mui/icons-material';

const StopWatch = () => {
  const formatTime = (timeInSec) => {
    const hour = String(Math.floor(timeInSec / 3600));
    const min = String(Math.floor((timeInSec % 3600) / 60)); // Fixed float issue
    const sec = String(timeInSec % 60);
    

    return `${hour.padStart(2, '0')}:${min.padStart(2, '0')}:${sec.padStart(2, '0')}`;
  };

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
               const [menu, setMenu] = useState(false)


  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
     <AdminLayout menu={menu} setMenu={setMenu} >
               <IconButton sx={{ display: { md: "none" } }} onClick={() => setMenu(true)}>
                      <Menu />
                    </IconButton>
      <Box bgcolor="white" ml={{lg:6}} height="100vh" p={4}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          STOP WATCH
        </Typography>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          mt={25}
          borderRadius={2}
          width="fit-content"
          mx="auto"
        >
          <Typography variant="h4" color="black" mb={5}>
            {formatTime(time)}
          </Typography>

          <Box display="flex" gap={6}>
            <Button
              variant="contained"
              color={isRunning ? 'error' : 'primary'}
              onClick={() => setIsRunning((prev) => !prev)}
            >
              {isRunning ? 'Stop' : 'Start'}
            </Button>
            <Button variant="contained" color="warning" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
};

export default StopWatch;
