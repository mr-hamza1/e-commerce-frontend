import { Stack, FormControl, InputLabel, MenuItem, Select, Slider, Typography, Skeleton } from '@mui/material'
import React, { useState } from 'react'
import { useCategoriesQuery } from '../redux/api/productApi'
import { useErrors } from '../Hooks/Hook'
import { useEffect } from 'react'
import {  useNavigate } from 'react-router-dom'

const Filter = ({sort, setSort, maxPrice, setMaxPrice, category, setCategory, searchCategory}) => {

      const [categories , setCategories] = useState([])


      const { data, isLoading, isError, error } = useCategoriesQuery();
       useErrors([{ isError, error }]);
    
       console.log(data)
         
       useEffect(() => {
         if (data?.categories) {
           setCategories(data?.categories);
         }
       }, [data]);


        if (typeof setSort !== "function") {
            setSort = () => {};  
           }
        if (typeof setMaxPrice !== "function") {
            setMaxPrice = () => {};  
           }
        if (typeof setCategory !== "function") {
            setCategory = () => {};  
           }
      

  return (

    <Stack>
<Typography variant='h6' textAlign={"center"} mb={2}>Filters</Typography>

<FormControl fullWidth required>
       <InputLabel>Sort</InputLabel>
       <Select
         label="Sort"
         name="Sort"
        value={sort || ""}
        onChange={(e) => setSort(e.target.value)}  

       >
         <MenuItem value={"asc"}>Price (Low to High)</MenuItem>
         <MenuItem value={"des"}>Price (High to Low)</MenuItem>
       </Select>
     </FormControl>
     

     <Typography variant="body1" mt={3} mb={2}>Max Price : {maxPrice || ""}</Typography>

 
 <Slider
   value={maxPrice}
   onChange={(e)=>{
     setMaxPrice(e.target.value)
     
   }}
   aria-labelledby="max-price-slider"
   min={0}
   max={600000} // Set the max limit as per your need
   step={100} // Adjust step size
   valueLabelDisplay="auto"
 />

<Typography variant="body1" mt={2} ></Typography>

 <FormControl fullWidth required>
 <InputLabel >Category</InputLabel>
 <Select
   label="Category"
   name="Category"
   value={category}
   onChange={(e)=>{  setCategory(e.target.value)
      window.history.replaceState({}, document.title, "/search");

   }}
 >
   {
    isLoading? <Skeleton /> :
   categories?.map((i) => (
  <MenuItem key={i} value={i}>{i.toUpperCase()}</MenuItem>
))

   }

 </Select>
</FormControl>
</Stack>  )
}

export default Filter