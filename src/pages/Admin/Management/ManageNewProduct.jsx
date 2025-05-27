"use client"
import {
  Box,
  Button,
  Container,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
} from "@mui/material"
import { useEffect, useState } from "react"
import AdminLayout from "../../../layout/AdminLayout"
import { useParams } from "react-router-dom"
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../redux/api/productApi"
import { useErrors } from "../../../Hooks/Hook"
import { Close as CloseIcon, ZoomIn as ZoomInIcon, Delete as DeleteIcon, Menu } from "@mui/icons-material"
import { toast } from "react-hot-toast"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"; 


const ManageNewProduct = () => {
  const { user } = useSelector((state) => state.userReducer)
        const [menu, setMenu] = useState(false)
  

  const navigate = useNavigate(); 

  const [updateProduct, setUpdateProduct] = useState("")
  const [updatePrice, setUpdatePrice] = useState("")
  const [updateCategory, setUpdateCategory] = useState("")
  const [updateStocks, setUpdateStocks] = useState("")
  const [updateImage, setImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [originalProduct, setOriginalProduct] = useState(null)

  const params = useParams()
  const { data, isLoading, isError, error } = useProductDetailsQuery(params.id)
  const [updateProductData] = useUpdateProductMutation()
  const [deleteProductData] = useDeleteProductMutation()

  useErrors([{ isError, error }])

  useEffect(() => {
    if (data?.product) {
      setUpdateProduct(data.product.name)
      setUpdatePrice(data.product.price)
      setUpdateCategory(data.product.category)
      setUpdateStocks(data.product.stock)
      setImage(data.product.photo?.url)
      setPreviewImage(data.product.photo?.url)
      setOriginalProduct(data.product)
    }
  }, [data])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setPreviewImage(fileReader.result)
      }
      fileReader.readAsDataURL(file)
      setImage(file)
    }
  }

  const handleOpenImageDialog = () => {
    setImageDialogOpen(true)
  }

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false)
  }


const handleDeleteProduct = async () => {
  try {
    const res = await deleteProductData({
      id: data.product._id,
      userId: user._id,
    });



    if (res.data?.success) {
      toast.success(res.data.message);
      navigate("/admin/product");
    } else {
      toast.error(res.data?.error || "Something Went Wrong");
    }
  } catch (error) {
    toast.error(error.message || "Something Went Wrong");
  }
};


  const hasChanges = () => {
    if (!originalProduct) return false
    return (
      updateProduct !== originalProduct.name ||
      updatePrice !== originalProduct.price ||
      updateCategory !== originalProduct.category ||
      updateStocks !== originalProduct.stock ||
      (updateImage && updateImage !== originalProduct.photo?.url)
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!hasChanges()) {
      toast("No Change Detected!", {
        icon: "👏",
      })
      return
    }

    if (!updateImage) {
      toast.error("Please select an image")
      return
    }

    const formData = new FormData()
    formData.append("name", updateProduct)
    formData.append("price", updatePrice)
    formData.append("category", updateCategory)
    formData.append("stock", updateStocks)
    formData.append("photo", updateImage)

    try {
      const res = await updateProductData({
        formData,
        id: data.product._id,
        userId: user._id,
      })

      if (res.data?.success) {
        toast.success(res.data.message)
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
            
                  <Stack
        direction={{ xs: "column", md: "row" }}
        mt={2}
        spacing={1}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        overflow={"hidden"}
      >
        {isLoading ? (
          <Stack width={{ xs: "80%", md: "40%" }}>
            <Paper elevation={3} sx={{ display: "flex", padding: 4, flexDirection: "column" }}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                <Skeleton width="120px" height={24} />
              </Box>
              <Skeleton width="150px" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={220} sx={{ borderRadius: 2, mb: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                <Skeleton width="70%" height={30} />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Skeleton width="40%" height={30} />
              </Box>
            </Paper>
          </Stack>
        ) : (
          <Stack width={{ xs: "80%", md: "40%" }}>
            <Paper elevation={3} sx={{ display: "flex", padding: 4, flexDirection: "column" }}>
              <Typography color="#83ef87" align="right">
                {updateStocks > 0 ? `${updateStocks} Avialabels` : `0 Out of stock`}
              </Typography>
              <Typography>ID - {data?.product?._id}</Typography>

              <Box sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={previewImage || null}
                  alt="Preview"
                  sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 2 }}
                />
                <IconButton
                  onClick={handleOpenImageDialog}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "rgba(255,255,255,0.7)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                  }}
                  size="small"
                >
                  <ZoomInIcon fontSize="small" />
                </IconButton>
              </Box>

              <Typography textAlign={"center"} padding={1.5} color="#665f5f">
                {updateProduct}
              </Typography>
              <Typography textAlign={"center"} fontWeight={1000}>
                {updatePrice}.Rs only
              </Typography>
            </Paper>
          </Stack>
        )}

        <Container component={"main"} maxWidth="xs">
          <Box sx={{ position: "relative" }}>
            {/* Delete button positioned half in, half out of the box */}
            <Tooltip title="Delete Product">
              <IconButton
                onClick={handleDeleteProduct}
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
                <DeleteIcon />
              </IconButton>
            </Tooltip>

            <Paper elevation={3} sx={{ padding: 4 }}>
              <Box padding={1}>
                <Typography textAlign={"center"} variant="h5">
                  Manage Product
                </Typography>
                <form style={{ marginTop: "1rem", width: "100%" }} onSubmit={handleSubmit}>
                  <TextField
                    label="Product Name"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={updateProduct}
                    onChange={(e) => setUpdateProduct(e.target.value)}
                  />
                  <TextField
                    label="Price"
                    type="text"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={updatePrice}
                    onChange={(e) => setUpdatePrice(e.target.value)}
                  />
                  <TextField
                    label="Category"
                    type="text"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={updateCategory}
                    onChange={(e) => setUpdateCategory(e.target.value)}
                  />
                  <TextField
                    label="Stock"
                    type="number"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={updateStocks}
                    onChange={(e) => setUpdateStocks(e.target.value)}
                  />
                  <TextField
                    type="file"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    onChange={handleImageChange}
                    inputProps={{ accept: "image/*" }}
                  />
                  <Button sx={{ marginTop: "1rem" }} variant="contained" type="submit" color="primary" fullWidth>
                    UPDATE
                  </Button>
                </form>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Stack>

      <Dialog open={imageDialogOpen} onClose={handleCloseImageDialog} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 1, position: "relative" }}>
          <IconButton
            onClick={handleCloseImageDialog}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={previewImage || ""}
            alt={updateProduct}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

export default ManageNewProduct
