"use client"
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  IconButton,
  FormHelperText,
  Divider,
  Card,
  CardContent,
} from "@mui/material"
import { useState } from "react"
import { useNewProductMutation } from "../../../redux/api/productApi"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Menu,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../../layout/AdminLayout"

const NewProduct = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.userReducer)
          const [menu, setMenu] = useState(false)
  

  // Product information
  const [product, setProduct] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [searchCategory, setSearchCategory] = useState("")
  const [stock, setStock] = useState("")
  const [image, setImage] = useState(null)
  const [description, setDescription] = useState("")

  // Additional fields
  const [sizes, setSizes] = useState([])
  const [newSize, setNewSize] = useState("")
  const [colors, setColors] = useState([])
  const [newColor, setNewColor] = useState("")
  const [model, setModel] = useState("")

  // Form validation
  const [errors, setErrors] = useState({})

  const [addProduct, { isLoading }] = useNewProductMutation()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
  }

  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize])
      setNewSize("")
    }
  }

  const handleRemoveSize = (sizeToRemove) => {
    setSizes(sizes.filter((size) => size !== sizeToRemove))
  }

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor])
      setNewColor("")
    }
  }

  const handleRemoveColor = (colorToRemove) => {
    setColors(colors.filter((color) => color !== colorToRemove))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!product.trim()) newErrors.product = "Product name is required"
    if (!price.trim()) newErrors.price = "Price is required"
    if (!category) newErrors.category = "Category is required"
    if (!stock || stock < 0) newErrors.stock = "Valid stock quantity is required"
    if (!image) newErrors.image = "Product image is required"
    if (category === "technology" && !model.trim()) newErrors.model = "Model is required for technology products"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fill all required fields")
      return
    }

    const details ={
      info: description,
      colors: colors,
      category,
    }
    
       if (category === "technology") {
      details.model = model;
    }
       if (sizes.length > 0) {
      details.size = sizes;
    }

    console.log(details)

    const formData = new FormData()
    formData.append("name", product)
    formData.append("price", price)
    formData.append("category", searchCategory)
    formData.append("stock", stock)
    formData.append("photo", image)
    formData.append("details", JSON.stringify(details))


    try {
      const res = await addProduct({ formData, id: user._id })

      if (res.data?.success) {
        toast.success(res.data.message)
        

        // Reset form inputs
        setProduct("")
        setPrice("")
        setCategory("")
        setStock("")
        setImage(null)
        setDescription("")
        setSizes([])
        setColors([])
        setModel("")

        // Navigate back or to products list
        navigate("/admin/product")
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
                  <Menu/>
                </IconButton>         <Box sx={{  backgroundColor: "#f5f5f5" }}>
      <Container maxWidth="lg" sx={{ py: 4, backgroundColor: "#f5f5f5" }} >
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Add New Product
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Left Column - Basic Information */}
            <Grid item xs={12} md={7}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium" }}>
                Product Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Product Name"
                    required
                    fullWidth
                    variant="outlined"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    error={!!errors.product}
                    helperText={errors.product}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price"
                    required
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    error={!!errors.price}
                    helperText={errors.price}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Stock"
                    required
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    error={!!errors.stock}
                    helperText={errors.stock}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required error={!!errors.category}>
                    <InputLabel>Category</InputLabel>
                    <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                      <MenuItem value="clothing">Clothing</MenuItem>
                      <MenuItem value="beauty">Beauty</MenuItem>
                                            <MenuItem value="technology">Technology</MenuItem>

                    </Select>
                    {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                  </FormControl>
                </Grid>

                {category === "technology" && (
                  <Grid item xs={12}>
                    <TextField
                      label="Model"
                      required
                      fullWidth
                      variant="outlined"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      error={!!errors.model}
                      helperText={errors.model}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                    <TextField
                      label="Category for search"
                      required
                      fullWidth
                      variant="outlined"
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      error={!!errors.searchCategory}
                      helperText={errors.searchCategory}
                    />
                  </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: "medium" }}>
                Product Variants
              </Typography>

              {/* Sizes Section */}
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    Available Sizes
                  </Typography>

                  <Box sx={{ display: "flex", mb: 2 }}>
                    <TextField
                      label="Add Size"
                      size="small"
                      value={newSize}
                      onChange={(e) => setNewSize(e.target.value)}
                      sx={{ flexGrow: 1, mr: 1 }}
                    />
                    <Button variant="contained" onClick={handleAddSize} startIcon={<AddIcon />}>
                      Add
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {sizes.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No sizes added yet
                      </Typography>
                    ) : (
                      sizes.map((size, index) => (
                        <Chip
                          key={index}
                          label={size}
                          onDelete={() => handleRemoveSize(size)}
                          color="primary"
                          variant="outlined"
                        />
                      ))
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Colors Section */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    Available Colors
                  </Typography>

                  <Box sx={{ display: "flex", mb: 2 }}>
                    <TextField
                      label="Add Color"
                      size="small"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      sx={{ flexGrow: 1, mr: 1 }}
                    />
                    <Button variant="contained" onClick={handleAddColor} startIcon={<AddIcon />}>
                      Add
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {colors.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        No colors added yet
                      </Typography>
                    ) : (
                      colors.map((color, index) => (
                        <Chip
                          key={index}
                          label={color}
                          onDelete={() => handleRemoveColor(color)}
                          color="primary"
                          variant="outlined"
                        />
                      ))
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Image Upload and Preview */}
            <Grid item xs={12} md={5}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium" }}>
                Product Image
              </Typography>

              <Box
                sx={{
                  border: "2px dashed",
                  borderColor: errors.image ? "error.main" : "divider",
                  borderRadius: 2,
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="product-image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="product-image-upload">
                  <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} sx={{ mb: 2 }}>
                    Upload Image
                  </Button>
                </label>
                {errors.image && <FormHelperText error>{errors.image}</FormHelperText>}
                <Typography variant="caption" color="text.secondary">
                  Supported formats: JPG, PNG, GIF. Max size: 5MB
                </Typography>
              </Box>

              {image && (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Image Preview
                  </Typography>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: 2,
                    }}
                  >
                    <img
                      src={URL.createObjectURL(image) || "/placeholder.svg"}
                      alt="Selected"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "400px",
                        objectFit: "contain",
                      }}
                    />
                    <IconButton
                      onClick={() => setImage(null)}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />} size="large">
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              size="large"
              disabled={isLoading}
              startIcon={<SaveIcon />}
            >
              {isLoading ? "Saving..." : "Save Product"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
    </Box>
    </AdminLayout>
  )
}

export  {NewProduct}
