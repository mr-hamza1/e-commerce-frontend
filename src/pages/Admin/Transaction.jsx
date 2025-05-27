import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, IconButton, Stack, Typography } from '@mui/material';
import AdminLayout from '../../layout/AdminLayout';
import { Table } from '../../components/ShortTable';
import { Link } from 'react-router-dom';
import { useErrors } from '../../Hooks/Hook';
import { useSelector } from 'react-redux';
import { useAllOrdersQuery } from '../../redux/api/orderApi';
import { Menu } from '@mui/icons-material';

const Customer = () => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  

    const {user} = useSelector((state) => state.userReducer)
          const [menu, setMenu] = useState(false)
    

      const {
        data,
        isLoading,
        isError,
        error,
        refetch
      } = useAllOrdersQuery(user._id, {
        refetchOnMountOrArgChange: true
      }); 
    
      

       useErrors([{ isError, error }]);

       const refetchHandler = ()=> {
        refetch()
       }

  

 const columns = [
//  {
//   field: "user",
//   headerName: "User_id",
//   width: 250,
//   valueGetter: (params) =>  params?._id ?? "N/A"
// },
 {
  field: "user",
  headerName: "Name",
  width: 200,
  valueGetter: (params) =>  params?.name ?? "N/A"
},
  {
    field: "total",
    headerName: "Amount",
    headerClassName: "table-header",
    width: 230,
  },
  {
    field: "discount",
    headerName: "Discount",
    headerClassName: "table-header",
    width: 150,
  },
  {
  field: "quantity",
  headerName: "Quantity",
  headerClassName: "table-header",
  width: 200,
  renderCell: (params) => {
    const quantities = params.row.orderItems.map(item => item.quantity).join(", ");
    return <span>{quantities}</span>;
  }
},
  {
    field: "status",
    headerName: "Status",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <span
        style={{
          color:
            params.value === "Shipped"
              ? "purple"
              : params.value === "Delivered"
              ?  "green"
              : "red",
        }}
      >
        {params.value}
      </span>
    ),
  },
  {
    field: "action",
    headerName: "Action",
    headerClassName: "table-header",
    width: 125,
    renderCell: (params) => (
      <IconButton
        sx={{
          border: "2px solid #9cbaff",
          borderRadius: "8px",
          color: "white",
          padding: "0 4px",
          backgroundColor: "#9cbaff",
        }}
        size="small"
        component={Link}
        to={`/admin/transaction/${params.row._id}`} // Use _id from your data
      >
        <Typography variant="body2" color="primary">
          Manage
        </Typography>
      </IconButton>
    ),
  },
];


  const headingStyle = {
    height: true,
    mb: "2rem",
    var: "h4",
    mt: "1rem",
  };

  return (
     <AdminLayout menu={menu} setMenu={setMenu} >
               <IconButton sx={{ display: { md: "none" } }} onClick={() => setMenu(true)}>
                      <Menu />
                    </IconButton>
   <Box padding={2} ml={{lg:4}}  bgcolor={"white"}>
     <Stack direction={"row"} alignItems={"center"}>
      <Typography
                textAlign="center"
                variant= "h4" 
                color='#575059'
                mt={3}
                sx={{
                  marginBottom:  "1.5rem",
                  textTransform: "uppercase",
                }}
              >
                TRANSACTIONS
        </Typography>


      </Stack>
      <Box>
        <Table columns={columns}  headingStyle={headingStyle}  rowHeight={60} rows={data?.orders || []}  />
      </Box>

      {/* Image Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <img src={selectedImage} alt="Full Product" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </Dialog>
     </Box>

    </AdminLayout>
  )
}

export default Customer;
