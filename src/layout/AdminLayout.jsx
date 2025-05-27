import React from 'react'
import {Box, Drawer, Grid, Stack, Typography ,styled} from '@mui/material'
import {useLocation, Link as LinkComponent} from 'react-router-dom'
import {Dashboard as DashboardIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Inventory as InventoryIcon, 
  Groups  as GroupsIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon, 
  ShowChart as ShowChartIcon,
  Timer as TimerIcon,
  QrCode as QrCodeIcon,
  MonetizationOn as MonetizationOnIcon,
} from '@mui/icons-material'



const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 1rem;
  padding: 0.5rem 2rem ;
  color: black;
  &:hover {
    color: rgba(0, 0, 0, 0.7);
  }
`;


const adminTabs = [{
  name: 'Dashboard',
  icon: <DashboardIcon fontSize="small" />,
  path: '/admin/dashboard',
},
{
  name: 'Product',
  icon: <InventoryIcon fontSize="small"  />,
  path: '/admin/product',
},
{
  name: 'Customer',
  icon: <GroupsIcon fontSize="small" />,
  path: '/admin/customer',
},
{
  name: 'Transaction',
  icon: <AccountBalanceWalletIcon fontSize="small" />,
  path: '/admin/transaction',
},
]

const adminApps = [{
  name: 'Stop Watch',
  icon: <TimerIcon fontSize="small" />,
  path: '/admin/app/stopwatch',
},
{
  name: 'Cupone',
  icon: <QrCodeIcon fontSize="small"  />,
  path: '/admin/app/cupon',
},
{
  name: 'Toss',
  icon: <MonetizationOnIcon fontSize="small" />,
  path: '/admin/app/toss',
},
]

const adminCharts = [{
  name: 'Bar',
  icon: <BarChartIcon fontSize="small" />,
  path: '/admin/chart/bar',
},
{
  name: 'Pie',
  icon: <PieChartIcon fontSize="small"  />,
  path: '/admin/chart/pie',
},
{
  name: 'Line',
  icon: <ShowChartIcon 
    sx={{ 
      borderLeft: "2px solid black", 
      borderBottom: "2px solid black" 
    }} 
    fontSize="small" 
  />,
  path: '/admin/chart/line',
}

]


const Items =({items}) => {
  
  const location = useLocation();

  return  (
    <Stack marginBottom={2} spacing={0.5} marginLeft={2} >

  {
    items.map((tab, index) => (
      <Link
         key={`${tab.path}-${index}`} 
               
         to={tab.path}
         sx={
          location.pathname == tab.path && {
            bgcolor: "#E4F3FF",
            color: "#0171FF",
            padding: "0.5rem  1rem 0.5rem 2rem",
            width: "100%",
            borderRadius: "0.5rem",
            cursor: "pointer",
            "&:hover": {
              color: "#0171FF",
            }
          }
        }
      >
        <Stack direction={"row"}  alignItems={"flex-start"} spacing={"1rem"}>
          {tab.icon}
          <Typography variant="caption" paddingRight={{md :  9 , lg: 13 , xl: 14}} sx={location.pathname == tab.path && {
            bgcolor: "#E4F3FF",
            color: "#0171FF",}}  >{tab.name}</Typography>

        </Stack>

      </Link>
    ))
  }

</Stack>)
}


const SideBar = ({w="100%"}) => {
    

    return (
      <Stack position={"fixed"}>
       
       <br />

        <Typography p={1}  paddingLeft={4} color='#8e8d8d' variant='body2'>
             DASHBOARD
          </Typography>

          <Items items={adminTabs}  />

          <Typography p={1}  paddingLeft={4} color='#8e8d8d' variant='body2'>
          CHARTS
          </Typography>

          <Items items={adminCharts}/>

          <Typography p={1}  paddingLeft={4} color='#8e8d8d' variant='body2'>
          APPS
          </Typography>

          <Items items={adminApps}/>

      </Stack>
    )
}

const AdminLayout = ({children ,menu, setMenu}) => {
  return (
    <Grid container minHeight="100vh" sx={{padding: 0, margin: 0 }}>

        <Box></Box>


        <Grid item  
          md={3}
          lg={2.5}
          sx={{ display: { xs: 'none', md: 'block' }}}
        >
            <SideBar />
             <Drawer
                      open={menu}
                      onClose={() => setMenu(false)}
                      PaperProps={{
                        sx: { width: { xs: "60%", sm: "50%" }, p: 2 },
                      }}
                    >
                    <SideBar />
                    </Drawer>
            
        </Grid>

        <Grid item 
          xs={12}
          md={9}
          lg={9.5}
          sx={{ bgcolor: "#f5f5f5" }}
        >
            {children}
        </Grid>

     </Grid>
  )
}

export default AdminLayout