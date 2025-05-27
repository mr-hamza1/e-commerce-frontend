import React from 'react'
import AdminLayout from '../../../layout/AdminLayout'
import { Box, IconButton, Skeleton, Stack, Typography } from '@mui/material'
import { PieChart, DoughnutChart} from '../../../components/Charts'
import { useErrors } from '../../../Hooks/Hook'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAdminPieChartQuery } from '../../../redux/api/adminStatsApi'
import { useState } from 'react'
import { Menu } from '@mui/icons-material'

const PieCharts = () => {
   
    const {user} = useSelector((state) => state.userReducer)

      const [menu, setMenu] = useState(false)
    
    
      const {
          data,
          isLoading,
          isError,
          error,
          refetch
        } = useAdminPieChartQuery(user._id, {
          refetchOnMountOrArgChange: true
        });
         
         useErrors([{ isError, error }]);
    
        useEffect(() => {
     
          refetch()
    
        }, [data]);
    
        console.log(data)

  const order = data?.charts.orderFullFillMent;
  const categories = data?.charts.ProductCategories;
  const stock = data?.charts.stocksAvailbility;
  const revenue = data?.charts.revenueDistribution;
  const ageGroup = data?.charts.usersAgeGroup;
  const adminCustomer = data?.charts.adminCustomer;


  
  return (
    <AdminLayout menu={menu} setMenu={setMenu} >
       <IconButton sx={{ display: { md: "none" } }} onClick={() => setMenu(true)}>
              <Menu />
            </IconButton>


         <Stack direction={"column"} ml={{lg:6}}   padding={4} bgcolor={"white"}       display="flex"
      flexDirection="column"
      alignItems="center"
 >
       <Typography variant="h5" fontWeight={"bold"}   sx={{ alignSelf: "flex-start" }}
 >PIE AND DOUGHNUT CHARTS</Typography>

         {
          isLoading? <Skeleton /> :
          <>
          <Box width={{sx:"40%", md:"50%", lg: "40%"}}>
             <PieChart 
               labels={["Processing", "Shipped", "Delivered"]}
                  data={[order.processing, order.shipped, order.delivered]}
               bgColor={["#47BA30", "#37E313" ,"#aff4a0" ]}
               offset={[0, 0, 50]}
             />
            <Typography
             color='#8e8e8e'
              variant='h6' 
              padding={5} 
              paddingBottom={0}
                textAlign={"center"} >
                  ORDER FULLFILLMENT RATIO
                  </Typography>
        </Box>

        <Box width={{sx:"40%", md:"50%", lg: "40%"}}>
        <DoughnutChart
                  labels={categories.map((i) => Object.keys(i)[0])}
                  data={categories.map((i) => Object.values(i)[0])}
                  bgColor={categories.map(
                    (i) =>
                      `hsl(${Object.values(i)[0] * 42}, ${
                        Object.values(i)[0]
                      }%, 50%)`
                  )}
                  legend={false}
                  offset={[0, 0, 0, 80]}
                />
            <Typography
             color='#8e8e8e'
              variant='h6' 
              padding={5} 
              paddingBottom={0}
                textAlign={"center"} sx={{ textTransform: 'uppercase' }}  >
                Product Categories Ratio
                  </Typography>
        </Box>
        <Box width={{sx:"40%", md:"50%", lg: "40%"}}>
        <DoughnutChart
                  labels={["In Stock", "Out Of Stock"]}
                  data={[stock.inStock, stock.outStock]}
                bgColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
                  legend={false}
                  offset={[0, 80]}
                  cutout={"70%"}
                />
            <Typography
             color='#8e8e8e'
              variant='h6' 
              padding={5} 
              paddingBottom={0}
                textAlign={"center"} sx={{ textTransform: 'uppercase' }}  >
                Stock Availability
                  </Typography>
        </Box>
        <Box width={{sx:"40%", md:"50%", lg: "40%"}}>
        <DoughnutChart
                  labels={[
                    "Marketing Cost",
                    "Discount",
                    "Burnt",
                    "Production Cost",
                    "Net Margin",
                  ]}
                  data={[
                    revenue.marketingCost,
                    revenue.discount,
                    revenue.burnt,
                    revenue.productionCost,
                    revenue.netMargin,
                  ]}
                  bgColor={[
                    "hsl(110,80%,40%)",
                    "hsl(19,80%,40%)",
                    "hsl(69,80%,40%)",
                    "hsl(300,80%,40%)",
                    "rgb(53, 162, 255)",
                  ]}
                  legend={false}
                  offset={[20, 30, 20, 30, 80]}
                />
            <Typography
             color='#8e8e8e'
              variant='h6' 
              padding={5} 
              paddingBottom={0}
                textAlign={"center"} sx={{ textTransform: 'uppercase' }}  >
                Revenue Distribution
                  </Typography>
        </Box>
        <Box width={{sx:"40%", md:"50%", lg: "40%"}}>
        <PieChart
                  labels={[
                    "Teenager(Below 20)",
                    "Adult (20-40)",
                    "Older (above 40)",
                  ]}
                  data={[ageGroup.teen, ageGroup.adult, ageGroup.old]}
                  bgColor={[
                    `hsl(10, ${80}%, 80%)`,
                    `hsl(10, ${80}%, 50%)`,
                    `hsl(10, ${40}%, 50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
            <Typography
             color='#8e8e8e'
              variant='h6' 
              padding={5} 
              paddingBottom={0}
                textAlign={"center"}  sx={{ textTransform: 'uppercase' }}  >
                Users Age Group
                  </Typography>
        </Box>
        <Box width={{sx:"40%", md:"50%", lg: "40%"}}>
        <DoughnutChart
                  labels={["Admin", "Customers"]}
                  data={[adminCustomer.admin, adminCustomer.customer]}
                  bgColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
                  offset={[0, 50]}
                />
            <Typography
             color='#8e8e8e'
              variant='h6' 
              padding={5} 
              paddingBottom={0}
                textAlign={"center"}  sx={{ textTransform: 'uppercase' }}  >
                Admin & Customer
                  </Typography>
        </Box>
          </>
         }
         </Stack>
    </AdminLayout>  
    )
}


export default PieCharts
