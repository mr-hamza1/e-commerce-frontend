import { Menu as MenuIcon } from '@mui/icons-material'
import { Box, Drawer, IconButton, Stack, TextField, Grid, Pagination, Skeleton } from '@mui/material'
import React, { useState, useEffect } from 'react'
import ProductCard from '../components/productCard'
import Filter from '../modules/filter'
import { useErrors } from '../Hooks/Hook'
import { useSearchProductsQuery } from '../redux/api/productApi'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/reducer/cartReducer'
import { useSearchParams } from 'react-router-dom'

const Search = () => {

    const [searchParams] = useSearchParams();
     const  searchElement = searchParams.get("q"); 
     const  searchCategory = searchParams.get("category"); 

const searchCategoryForHomePage = searchCategory?.toLowerCase();






  const [search, setSearch] = useState(searchElement || "")
  const [price , setPrice] = useState("600000")
  const [sort , setSort] = useState("")
  const [category , setCategory] = useState(searchCategoryForHomePage || "")
  const [menu, setMenu] = useState(false)
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  

 const itemsPerPage = 8

 const dispatch = useDispatch();

       console.log(category)

  
  const { data, isLoading, isError, error } = useSearchProductsQuery({ search, page, sort, price, category })
  useErrors([{ isError, error }])

  useEffect(() => {
  if (data) {
    setProducts(data.products);
  }
}, [data,search, price, category, sort]);


const addToCartHandler = (cartItem) =>{

  if(cartItem.stock < 1) {
    toast.error("Out of Stock")
    return;
  }else{
    dispatch(addToCart(cartItem));
 
  }
}


  return (
    <>
      {/* Mobile Menu Button */}
      <IconButton sx={{ display: { md: "none" } }} onClick={() => setMenu(true)}>
        <MenuIcon />
      </IconButton>

      <Stack direction={"row"} mt={2} width={"100%"}>
        {/* Drawer Filter (Mobile) */}
        <Drawer
          open={menu}
          onClose={() => setMenu(false)}
          PaperProps={{
            sx: { width: { xs: "60%", sm: "50%" }, p: 2 },
          }}
        >
          <Filter sort={sort} 
          setSort={setSort} 
          maxPrice={price}
           setMaxPrice= {setPrice}
           category={category}
           setCategory={setCategory}
           searchCategory={searchCategory}
           />
        </Drawer>

        {/* Sidebar Filter (Desktop) */}
        <Box
          width={{ md: "20%" }}
          display={{ xs: "none", md: "block" }}
          p={3}
          minWidth="250px"
          boxShadow={3}
          mt={{ xs: 3, md: 2 }}
          sx={{ bgcolor: "white", position: "sticky", top: 80 }}
          height="70vh"
        >
          <Filter sort={sort} 
          setSort={setSort} 
          maxPrice={price}
           setMaxPrice= {setPrice}
           category={category}
           setCategory={setCategory}
           searchCategory={searchCategory}
           />
        </Box>

        {/* Main Content */}
        <Box width={{xs:"100%", md: "80%" }} p={3}>
          {/* Search Input */}
          <TextField 
            label="Search Products By Name..." 
            fullWidth 
            variant="filled"
            value={search}
            onChange={ (e) => {
              setSearch(e.target.value)
               window.history.replaceState({}, document.title, "/search");
               setCategory("")              
}}
          />

          {/* Product Grid */}
          <Grid container spacing={2} mt={2}>
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, i) => (
                <Grid item xs={6} sm={4} md={4} lg={3} key={i}>
              <Skeleton variant="rectangular" width="100%" height={170} />
                    <Box
                    sx={{
                      pt: 0.5,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center", // this centers children horizontally
                    }}
                  >
                    <Skeleton width="50%" />
                    <Skeleton width="50%" />
                  </Box>
                </Grid>
              ))
            ) : products?.length > 0 ? (
              products?.map((product, index) => (
                <Grid item xs={6} sm={4} md={4} lg={3} key={index}>
                  <ProductCard cart={product} addToCartHandler={addToCartHandler}  />
                </Grid>
              ))
            ) : (
              <Box textAlign="center" width="100%" mt={4}>
                <h3>No products found</h3>
              </Box>
            )}
          </Grid>

          {/* Pagination */}
          {!isLoading && data?.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination 
                count={data?.totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </Box>
      </Stack>
    </>
  )
}

export default Search
