import React, { useEffect, useState } from 'react';
import { Avatar, Box, Dialog, IconButton, Stack, Typography } from '@mui/material';
import AdminLayout from '../../layout/AdminLayout';
import { Table } from '../../components/ShortTable';
import { customers } from '../../constants/data';
import {Delete as DeleteIcon, Menu, Add as PlusIcon} from '@mui/icons-material'
import { useAllUsersQuery, useDeleteUserMutation } from '../../redux/api/userApi';
import { useErrors } from '../../Hooks/Hook';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

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
        } = useAllUsersQuery(user._id, {
          refetchOnMountOrArgChange: true
        }); 
        
        useEffect(()=>{
          refetch();
        },[data])
       console.log(data)
  
         useErrors([{ isError, error }]);

         const [deleteUser] = useDeleteUserMutation();
  

         const deleteUserHandler = async(id)=>{

          try {
                    const res = await deleteUser({customerId: id, id: user._id})
                    toast.success(res?.data?.message)
                    refetch();         
          } catch (error) {
                    toast.error(error?.data?.message)
            
          }

         

         }

  const columns = [
    {
      field: 'avatar',
      headerName: 'Avatar',
      headerClassName: "table-header",
      width: 150,
      renderCell: (params) => (
        <Box padding={1} >
                   <Avatar  src={params.row.photo} alt='avatar' 
                   onClick={() => handleImageClick(params.row.photo)}  
                   sx={{ width: 50, height: 50 }}
                   />

        </Box>
      ),
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "table-header",
      width: 250,
    },
    {
      field: "gender",
      headerName: "Gender",
      headerClassName: "table-header",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      headerClassName: "table-header",
      width: 250,
    }, {
      field: "role",
      headerName: "Role",
      headerClassName: "table-header",
      width: 150,
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "table-header",
      width: 125,
      renderCell: (params) => (
        <IconButton
          sx={{
            padding: '0 4px',
          }}
          color='error'
          size='small'
          onClick={()=> deleteUserHandler(params.row._id)}
        >
          <DeleteIcon  />
        </IconButton>
      )
    }
    
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
                CUSTOMERS
        </Typography>
      </Stack>
      <Box>
        <Table columns={columns}  headingStyle={headingStyle}  rowHeight={60} rows={data?.users || []}  />
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
