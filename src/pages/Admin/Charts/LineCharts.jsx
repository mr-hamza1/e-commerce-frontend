import React, { useEffect } from 'react'
import AdminLayout from '../../../layout/AdminLayout'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { LineChart } from '../../../components/Charts'
import { useErrors } from '../../../Hooks/Hook'
import { useAdminLineChartQuery } from '../../../redux/api/adminStatsApi'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Menu } from '@mui/icons-material'


const LineCharts = () => {
  
     const {user} = useSelector((state) => state.userReducer)

           const [menu, setMenu] = useState(false)
     
  
    const {
        data,
        isLoading,
        isError,
        error,
        refetch
      } = useAdminLineChartQuery(user._id, {
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

  return (
    <AdminLayout menu={menu} setMenu={setMenu} >
       <IconButton sx={{ display: { md: "none" } }} onClick={() => setMenu(true)}>
              <Menu />
            </IconButton>
          <Stack bgcolor={"white"} ml={{lg:4}} display="flex"
      flexDirection="column"
      alignItems="center">

    <Typography variant="h5" p={6}  fontWeight={"bold"}   sx={{ alignSelf: "flex-start" }}
 >LINE CHARTS</Typography>
               
        <Box width={{xs:"90%", sm:"90%", md:"80%", lg: "70%"}}>
            <LineChart
                data={data?.charts?.users}
                label="Users"
                borderColor="rgb(53, 162, 255)"
                labels={last12months}
                bgColor="rgba(0, 0, 0, 0.5)"
              />
     <Typography color='#8e8e8e'
      variant='h6' padding={5}
       paddingBottom={0}  textAlign={"center"} >ACTIVE USERS</Typography>

            </Box>

                    <Box width={{xs:"90%", sm:"90%", md:"80%", lg: "70%"}}>

            <LineChart
                data={data?.charts?.products}
                bgColor={"hsla(269,80%,40%,0.4)"}
                borderColor={"hsl(269,80%,40%)"}
                labels={last12months}
                label="Products"
              />
               <Typography
             color='#8e8e8e'
              variant='h6' 
              padding={5} 
              paddingBottom={0}
                textAlign={"center"} sx={{ textTransform: 'uppercase' }}  >
                Total Products (SKU)
                  </Typography>
            </Box>
                    <Box width={{xs:"90%", sm:"90%", md:"80%", lg: "70%"}}>

            <LineChart
                data={data?.charts?.revenue}
                bgColor={"hsla(129,80%,40%,0.4)"}
                borderColor={"hsl(129,80%,40%)"}
                label="Revenue"
                labels={last12months}
              />
                 <Typography
             color='#8e8e8e'
              variant='h6' 
              padding={5} 
              paddingBottom={0}
                textAlign={"center"} sx={{ textTransform: 'uppercase' }}  >
                Total Revenue 
                  </Typography>
            </Box>
                    <Box width={{xs:"90%", sm:"90%", md:"80%", lg: "70%"}}>

            <LineChart
                data={data?.charts?.discount}
                bgColor={"hsla(29,80%,40%,0.4)"}
                borderColor={"hsl(29,80%,40%)"}
                label="Discount"
                labels={last12months}
              />
                 <Typography
             color='#8e8e8e'
              variant='h6' 
              padding={5} 
              paddingBottom={5}
                textAlign={"center"} sx={{ textTransform: 'uppercase' }}  >
                Discount Allotted
                  </Typography>
            </Box>         

          </Stack>
    </AdminLayout>
  )
}

export default LineCharts