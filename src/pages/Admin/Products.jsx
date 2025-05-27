import React, { useEffect, useState } from 'react';
import { Box, Dialog, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import AdminLayout from '../../layout/AdminLayout';
import { Table } from '../../components/ShortTable';
import { Link } from "react-router-dom";

import {Menu, Add as PlusIcon} from '@mui/icons-material'
import { NewProduct } from './Management/NewProduct';
import { useAllProductsQuery } from '../../redux/api/productApi';
import { useErrors } from '../../Hooks/Hook';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"


const Products = () => {
  const [open, setOpen] = useState(false);
    const navigate = useNavigate()
          const [menu, setMenu] = useState(false)
    
  

  const [selectedImage, setSelectedImage] = useState("");

  const {user} = useSelector((state) => state.userReducer)

  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useAllProductsQuery(user._id, {
    refetchOnMountOrArgChange: true
  }); 
   useErrors([{ isError, error }]);
    
 const [products, setProducts] = useState([]);


  useEffect(() => {
    if (data?.products) {
      setProducts(data.products);
    }
    refetch()
  }, [data]);

  const handleProductCreated = () => {
    refetch(); // manual refetch after product creation
  };
  

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const columns = [
    {
      field: 'image',
      headerName: 'Photo',
      headerClassName: "table-header",
      width: 200,
      renderCell: (params) => (
        <img
          src={params?.row?.photo?.url}
          alt="product"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '1rem',
            cursor: 'pointer',
            padding: "10px"
          }}
          onClick={() => handleImageClick(params?.row?.photo?.url)}
        />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      headerClassName: "table-header",
      width: 352,
    },
    {
      field: "price",
      headerName: "Price",
      headerClassName: "table-header",
      width: 200,
    },
    {
      field: "stock",
      headerName: "Stock",
      headerClassName: "table-header",
      width: 200,
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "table-header",
      width: 125,
      renderCell: (params) => (
        <IconButton
          sx={{
            border: '2px solid #9cbaff',
            borderRadius: '8px',
            color: "white",
            padding: '0 4px',
            backgroundColor: "#9cbaff",
          }}
          size='small'
          component={Link} 
          to={`/admin/product/${params.row._id}`}  
        >
          <Typography variant="body2" color='primary'>
            Manage
          </Typography>
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
   <Box padding={2} ml={{lg:4}} bgcolor={"white"}>
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
                PRODUCTS
        </Typography>

        <Box flexGrow={1}></Box>

        <IconButton 
        size="small"
        sx={{ 
        bgcolor: "#5db5ee", 
        color: "white", 
        height: "60%",
        marginRight: "1rem",
        '&:hover': { bgcolor: "#0071ff" }
          }}
          onClick={() => navigate("/admin/product/new")
}
         >
        <PlusIcon sx={{ fontSize: "1.5rem" }}  />
        </IconButton>

      </Stack>
      <Box>
        {isLoading? <Stack>
                 <Skeleton width="100%" height="3rem"/>
                 <Skeleton width="100%" height="7rem"/>
                 <Skeleton width="100%" height="7rem"/>
                 <Skeleton width="100%" height="7rem"/>
                 <Skeleton width="100%" height="7rem"/>
                 <Skeleton width="100%" height="7rem"/>
                 <Skeleton width="100%" height="7rem"/>
                 <Skeleton width="100%" height="7rem"/>
                 <Skeleton width="100%" height="7rem"/>
                 <Skeleton width="100%" height="7rem"/>
        </Stack> :
        <Table columns={columns}  headingStyle={headingStyle} rows={products} rowHeight={90} />}
      </Box>

      {/* Image Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <img src={selectedImage} alt="Full Product" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </Dialog>

     </Box>


    </AdminLayout>
  )
}

export default Products;
