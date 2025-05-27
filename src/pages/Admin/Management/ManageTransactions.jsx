import { Box, Grid, Paper, Typography, Button, Avatar, Tooltip, IconButton, Dialog } from '@mui/material';
import AdminLayout from '../../../layout/AdminLayout';
import { useDeleteOrderMutation, useOrderDetailsQuery, useUpdateOrderMutation } from '../../../redux/api/orderApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {useErrors} from '../../../Hooks/Hook'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Delete, Menu } from '@mui/icons-material';

const ManageTransactions = () => {
  
  

  const paramsID = useParams()

  const {user} = useSelector((state) => state.userReducer)
        const [menu, setMenu] = useState(false)
  


  const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
  
    const handleImageClick = (image) => {
      setSelectedImage(image);
      setOpen(true);
    };

   const {
        data,
        isLoading,
        isError,
        error,
        refetch
      } = useOrderDetailsQuery (paramsID.id ,{
        refetchOnMountOrArgChange: true
      }); 
      
      useEffect(()=>{
        refetch();
      },[data])


       useErrors([{ isError, error }]);

       if(isError)  navigate("/404");

       const [updateOrder] = useUpdateOrderMutation();

       const processStatusHandler = async(id) =>{

         try {
                 const res = await updateOrder({userId: user._id, orderId: id})
        
              if (res) {
                toast.success(res.data.message)
          
              } else {
                toast.error(res.data?.error || "Something Went Wrong")
              }
            } catch (error) {
              toast.error(error.message || "Something Went Wrong")
            }
          }

          const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'shipped':
      return 'purple';
    case 'delivered':
      return 'green';
    case 'processing':
      return 'red';
    default:
      return 'red'; // fallback color
  }
};
    const [deleteOrder] = useDeleteOrderMutation()

const handleDeleteProduct = async (id) => {

   try {
          const res = await deleteOrder({userId: user._id, orderId: id})
        
              if (res) {
                toast.success(res.data.message)
                navigate("/transaction")
          
              } else {
                toast.error(res.data?.error || "Something Went Wrong")
              }
            } catch (error) {
              toast.error(error.message || "Something Went Wrong")
            }
}



  return (
<AdminLayout menu={menu} setMenu={setMenu} >
       <IconButton sx={{ display: { md: "none" } }} onClick={() => setMenu(true)}>
              <Menu />
            </IconButton>
                  <Grid container spacing={2} p={5}>
      {/* ORDER ITEMS */}
      <Grid item xs={12} md={5} ml={{md:9}}>
        <Paper elevation={3} sx={{ p: 6}}>
          <Typography variant="h6" textAlign="center" mb={2}>
            ORDER ITEMS
          </Typography>

 {
  data?.order?.orderItems?.length > 0 &&
  data.order.orderItems.map((item, index) => (
    <Box key={index} display="flex" alignItems="center" gap={2} padding={1}>
      <Avatar src={item.photo} alt="product"  
      onClick={() => handleImageClick(item.photo)}  
 />
      <Typography>{item.name}</Typography>
      <Typography marginLeft="auto">
        {item.quantity} x {item.price} = {item.quantity * item.price}
      </Typography>
    </Box>
  ))
}          
        </Paper>
      </Grid>
      

      {/* ORDER INFO */}
    <Grid item xs={12} md={5}>
  <Box position="relative">
    <Paper elevation={3} sx={{ p: 6, position: "relative" }}>
      {/* Delete Icon */}
      <Tooltip title="Delete Product">
        <IconButton
          onClick={() => handleDeleteProduct(data?.order?._id)}
          sx={{
            position: "absolute",
            top: -10,
            right: -20,
            zIndex: 1,
            bgcolor: "error.main",
            color: "white",
            boxShadow: 2,
            "&:hover": {
              bgcolor: "error.dark",
            },
          }}
        >
          <Delete />
        </IconButton>
      </Tooltip>

      {/* Content */}
      <Typography variant="h6" textAlign="center" mb={2}>
        ORDER INFO
      </Typography>

      <Box mb={3}>
        <Typography fontWeight="bold">User Info :</Typography>
        <Typography>Name: {data?.order?.user?.name}</Typography>
        <Typography>
          Address: {data?.order?.shippingInfo?.address}{" "}
          {data?.order?.shippingInfo?.city}{" "}
          {data?.order?.shippingInfo?.country}
        </Typography>
      </Box>

      <Box mb={3}>
        <Typography fontWeight="bold">Amount Info :</Typography>
        <Typography>Subtotal: {data?.order?.subtotal}</Typography>
        <Typography>
          Shipping Charges: {data?.order?.shippingCharges}
        </Typography>
        <Typography>Tax: {data?.order?.tax}</Typography>
        <Typography>Discount: {data?.order?.discount || 0}</Typography>
        <Typography>Total: {data?.order?.total}</Typography>
      </Box>

      <Box mb={4}>
        <Typography fontWeight="bold">Status Info :</Typography>
        <Typography style={{ color: getStatusColor(data?.order?.status) }}>
          Status: {data?.order?.status}
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        onClick={() => processStatusHandler(data?.order._id)}
      >
        Process Status
      </Button>
    </Paper>

     <Dialog open={open} onClose={() => setOpen(false)}>
            <img src={selectedImage} alt="Full Product" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </Dialog>
  </Box>
</Grid>

    </Grid>
    </AdminLayout>
  );
};

export default ManageTransactions;
