import React from 'react';
import AdminLayout from '../../layout/AdminLayout';
import {
  Avatar, Box, IconButton, InputAdornment, Paper, Stack, TextField, Typography, CircularProgress,
  LinearProgress,
  Skeleton,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  NotificationsNone as NotificationsNoneIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Wc as WcIcon,
  AccessTime,
  LocalShipping,
  CheckCircle,
  Inventory,
  Cancel,
  Menu,

} from '@mui/icons-material';
import { yellow } from '@mui/material/colors';
import { BarChart, DoughnutChart} from "../../components/Charts.jsx";
import { Table } from '../../components/ShortTable.jsx'
import { orders } from '../../constants/data.js';
import { useErrors } from '../../Hooks/Hook.jsx';
import { useEffect } from 'react';
import { useDashboardStatsQuery } from '../../redux/api/adminStatsApi.js';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const InventoryItem = ({ name, percentage, color }) => {
  return (
    <Stack sx={{ mb: 2 }}  direction={"row"}  alignItems={"center"} spacing={2} >
        <Typography variant="body1"  >{name}</Typography>
      <LinearProgress 
        variant="determinate" 
        value={percentage} 
                  color={"red"}
        sx={{ 
          height: 8,
          width: "80%",
          borderRadius: 5,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
            backgroundColor: color, 

          }
        }}
      />
              <Typography variant="body1">{percentage}%</Typography>

    </Stack>
  );
};

const CircularProgressWithLabel = ({ color, value }) => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress 
        variant="determinate" 
        value={Math.abs(value)} 
        size={80} 
        thickness={4} 
        sx={{ color }} 
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color={color}>
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

const Widget = ({ title, sale, percentage, color = "blue" }) => {
  const percentageValue = parseFloat(percentage);


  return (
    <Paper
      elevation={4}
      sx={{
        padding: "2rem",
        borderRadius: "1.5rem",
        width: { xs: "80%", sm: "40%", md : "40%", lg: "20%" },
        minWidth: "225px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Stack direction={"row"} justifyContent="space-between" alignItems="center">
        <Stack direction={"column"}>
          <Typography variant="h6" color='#646666'>{title}</Typography>
          <Typography variant="h6" fontWeight="bold">{sale}</Typography>
          <Typography color={percentageValue >= 0 ? "#2bbf9c" : "red"} display={"flex"}>
            {percentageValue >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
            {percentageValue >= 0 ? `+${percentageValue}%` : `-${percentageValue}%`}
           </Typography>
        </Stack>
        <CircularProgressWithLabel color={color} value={percentageValue} />
      </Stack>
    </Paper>
  );
};
const Dashboard = () => {
  
  const {user} = useSelector((state) => state.userReducer)
        const [menu, setMenu] = useState(false)
  

  const {
      data,
      isLoading,
      isError,
      error,
      refetch
    } = useDashboardStatsQuery(user._id, {
      refetchOnMountOrArgChange: true
    });
     
     useErrors([{ isError, error }]);


     const [inventory , setInventory] = useState([])


      
    useEffect(() => {

      if(data?.stats?.categoryCount){
        setInventory(data?.stats?.categoryCount)
      }
  
      refetch()

    }, [data]);


    

    const columns = [
       {
         field: "_id",
         headerName: "id",
         headerClassName: "table-header",
         width: 220,
         renderCell: (params) => (
           <Typography variant="body2" sx={{ marginTop: "1rem", fontWeight: "medium", color: "primary.main" }}>
             {params.value.substring(0, 12)}...
           </Typography>
         ),
       },
    {
  field: "quantity",
  headerName: "Quantity",
  headerClassName: "table-header",
  width: 200,
  renderCell: (params) => {
    const quantities = params.row.quantity.map(item => item.quantity).join(", ");
    return <span>{quantities}</span>;
  },
},
      {
        field: "discount",
        headerName: "Discount",
        headerClassName: "table-header",
        width: 100,
      },
      {
        field: "amount",
        headerName: "Amount",
        headerClassName: "table-header",
        width: 170,
      },
    {
      field: "status",
      headerName: "Status",
      headerClassName: "table-header",
      width: 150,
      renderCell: (params) => {
        let color = "default"
        let icon = null

        switch (params.value.toLowerCase()) {
          case "processing":
            color = "warning"
            icon = <AccessTime fontSize="small" />
            break
          case "shipped":
            color = "info"
            icon = <LocalShipping fontSize="small" />
            break
          case "delivered":
            color = "success"
            icon = <CheckCircle fontSize="small" />
            break
          case "cancelled":
            color = "error"
            icon = <Cancel fontSize="small" />
            break
          default:
            color = "default"
            icon = <Inventory fontSize="small" />
        }

        return (
          <Chip
            icon={icon}
            label={params.value}
            size="small"
            color={color}
            variant="filled"
            sx={{ fontWeight: "medium", textTransform: "capitalize" }}
          />
        )
      },
    },          
  ]
      


const items = [
  {
    name: 'Laptops',
    percentage: inventory.find(item => 'laptop' in item)?.laptop || 0,
    color: "#7ed6c0"
  },
  {
    name: 'Mobiles',
    percentage: inventory.find(item => 'mobile' in item)?.mobile || 0,
    color: "#e2a80e"
  },
  {
    name: 'Shoes',
    percentage: inventory.find(item => 'shoes' in item)?.shoes || 0,
    color: "#d6209f"
  },
  {
    name: 'jackets',
    percentage: inventory.find(item => 'jackets' in item)?.jackets || 0,
    color: "#3632be"
  }
];


  const widgets = <>
  {
    isLoading? <Stack direction={{xs: "column", md:"row"}} spacing={3}>
      <Skeleton  width="1rem" height="80%" variant="circular" />
      <Skeleton  width="1rem" height="80%" variant="circular" />
      <Skeleton  width="1rem" height="80%" variant="circular" />
      <Skeleton  />
    </Stack> : <>

    <Widget title="Revenue" sale={data?.stats?.count?.revenu} 
    percentage={data?.stats?.changePercent?.Revenu} color='#006BF2' 
     />
  <Widget title="Users" sale={data?.stats?.count?.users} 
  percentage={data?.stats?.changePercent?.usersChangePercentage} color="#1acece"
   />
  <Widget title="Transaction" sale={data?.stats?.count?.orders}
   percentage={data?.stats?.changePercent?.OrdersChangePercentage} 
   color={yellow[700]}
   />
  <Widget title="Products" sale={data?.stats?.count?.products} 
  percentage={data?.stats?.changePercent?.productsChangePercentage} color="#4926a2"
   />
    </>
  }
  </>
  


  return (
 <AdminLayout menu={menu} setMenu={setMenu} >
           <IconButton sx={{ display: { md: "none" } }} onClick={() => setMenu(true)}>
                  <Menu />
                </IconButton>
                      {/* ✅ Header Bar */}
      <Box m={2} ml={{lg:4}} sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: 60,
        backgroundColor: "#F4F4F4",
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 4,
        boxShadow: 3,
      }}>
        <TextField
          variant="standard"
          placeholder="Search..."
          sx={{ width: "85%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction={"row"} spacing={2}>
          <IconButton>
            <NotificationsNoneIcon />
          </IconButton>
          <Avatar alt="User" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEcZtshmqEwLdFfEDF_g7FBvSX02-TJ5XZ9g&s" />
        </Stack>
      </Box>

      {/* ✅ Widgets Section */}
      <Stack 
  direction={{ xs: 'column', sm: 'row' }}
  spacing="2rem"
  flexWrap="wrap" 
  justifyContent="center" 
  alignItems="stretch" 
  margin={"1.5rem 0"}
  gap={2}
  alignContent={"center"}
>
  {widgets}
</Stack>

       
       <Stack direction={{xs: "column", lg:"row"}} spacing={3} padding={3} paddingLeft={5} >
          <Box width={{sm:"100%", lg:"70%"}} bgcolor={"white"} borderRadius={2} padding={3} boxShadow={3} >
              <Typography variant='h5' textAlign={"center"} color='#646666' >
                REVENUE & TRANSACTIONS
              </Typography>

                 {
            isLoading? <Skeleton/> :
             <Box>
                <BarChart 
                  data2={data?.stats?.chart?.order}
                  data1={data?.stats?.chart?.revenu}
                  title1={"Revenue"}
                  title2={"Transactions"}
                  bgColor1={"#0071ff"}
                  bgColor2={"#5db5ee"}
                />
              </Box>
          }
       
          </Box >
          
      
           <Stack width={{xs: "100%", sm:"50%", md: "50%",lg:"30%"}} bgcolor={"white"} textAlign={"center"} borderRadius={2} padding={3} spacing={3} boxShadow={3} >
           <Typography variant='h5' color='#646666'>
             INVENTORY
              </Typography>


              {items.map((item, index) => (
        <InventoryItem key={index} name={item.name} percentage={item.percentage} color={item.color} />
      ))}
               
           </Stack>
       </Stack>

       <Stack direction={{sm: "column" , lg: "row"}} spacing={3} padding={3} paddingLeft={5}>

   <Box width={{xs: "100%", sm:"50%", md: "50%",lg:"30%"}} bgcolor={"white"} borderRadius={2} padding={3}
     mb={{xs: 3}}
    position="relative" boxShadow={3}>
    <Typography variant='h5' textAlign={"center"}           color='#575059' padding={2}>
      GENDER RATIO
    </Typography>
   

   {
    isLoading? <Skeleton /> : 
    <Box position="relative" display="flex" justifyContent="center" alignItems="center">
      <DoughnutChart 
        labels={["Female", "Male"]}
        data={[data?.stats?.userRatio?.female, data?.stats?.userRatio?.male]}
        bgColor={["#ec0856", "#57ace5"]}
        cutout={80}
      />

      <Box position="absolute" display="flex"  marginBottom={8} >
        <WcIcon fontSize="large" />
      </Box>
    </Box>
   }
    

    
  </Box>

  <Box width={{sm:"100%",lg:"70%"}} bgcolor={"white"} borderRadius={2} padding={4}  boxShadow={3}>

    {
      isLoading? <Skeleton/> :
       <Table  heading={"Top Transactions"} columns={columns} rows={data?.stats?.latestTransactions || []}  />

    }
      
  </Box>
</Stack>


    </AdminLayout>
  );
};




export default Dashboard;
