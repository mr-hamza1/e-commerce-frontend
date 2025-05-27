import React, { useEffect } from 'react'
import AdminLayout from '../../../layout/AdminLayout'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { BarChart } from '../../../components/Charts'
import { useAdminBarChartQuery } from '../../../redux/api/adminStatsApi'
import { useSelector } from 'react-redux'
import { useErrors } from '../../../Hooks/Hook.jsx';
import { useState } from 'react'
import { Menu } from '@mui/icons-material'

const BarCharts = () => {
   

   const {user} = useSelector((state) => state.userReducer)
         const [menu, setMenu] = useState(false)
   


  const {
      data,
      isLoading,
      isError,
      error,
      refetch
    } = useAdminBarChartQuery(user._id, {
      refetchOnMountOrArgChange: true
    });
     
     useErrors([{ isError, error }]);




      
    useEffect(() => {
 
      refetch()

    }, [data]);

    console.log(data)


    const getLastNMonthLabels = (n, today = new Date()) => {
  const labels = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    labels.push(date.toLocaleString("default", { month: "short" }));
  }
  return labels;
};

const last12months = getLastNMonthLabels(12, new Date()); // ["Jun", ..., "May"]

const last6months = getLastNMonthLabels(6, new Date()); // ["Jun", ..., "May"]



  return (
    <AdminLayout menu={menu} setMenu={setMenu} >
           <IconButton sx={{ display: { md: "none" } }} onClick={() => setMenu(true)}>
                  <Menu />
                </IconButton>

         <Stack direction={"column"} ml={{lg:6}}   padding={4} bgcolor={"white"}  display="flex"
      flexDirection="column"
      alignItems="center">
         
         <Typography variant="h5" fontWeight={"bold"}   sx={{ alignSelf: "flex-start" }}>BAR CHARTS</Typography>
         
         <Box width={{xs:"100%", sm:"90%", md:"80%", lg: "70%"}}>
        <BarChart 
              data1={data?.charts?.products}
              data2={data?.charts?.users}
              title1={"Products"}
              title2={"Users"}
              bgColor1={"#422773"}
              bgColor2={"#facfd0"}
              labels={last6months}
            />
            <Typography color='#8e8e8e' variant='h6' padding={5} paddingBottom={0}  textAlign={"center"} >TOP SELLING PRODUCTS & TOP CUSTOMERS</Typography>
        </Box>

         <Box  paddingTop={4} paddingBottom={0}  width={{xs:"100%", sm:"90%", md:"80%", lg: "70%"}}>
        <BarChart 
              horizontal={"true"}
              data1={data?.charts?.orders}
              data2={[]}
              title1={"Products"}
              title2={""}
              bgColor1={"#55aeaf"}
              bgColor2={""}
              labels={last12months}
            />
            <Typography color='#8e8e8e' variant='h6' padding={5} textAlign={"center"} >ORDERS THROUGHOUT THE YEAR</Typography>
        </Box>
         </Stack>
    </AdminLayout>  
    )
}


export default BarCharts
