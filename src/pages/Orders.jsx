import {
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Paper,
  Divider,
  Badge,
  CircularProgress,
  useTheme,
  Card,
  CardContent,
  Grid,
  Container,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { Table } from "../components/Table"
import {
  Visibility as VisibilityIcon,
  LocalShipping as LocalShippingIcon,
  Inventory as InventoryIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as AccessTimeIcon,
  Receipt as ReceiptIcon,
  Pending as PendingIcon,
} from "@mui/icons-material"
import { useSelector } from "react-redux"
import { useErrors } from "../Hooks/Hook"
import { useAllOrdersQuery } from "../redux/api/orderApi"
import { useNavigate } from "react-router-dom"

const Orders = () => {
  const theme = useTheme()
  const { user } = useSelector((state) => state.userReducer)
  const [activeTab, setActiveTab] = useState(0)
  const [filteredRows, setFilteredRows] = useState([])
  const [orderStats, setOrderStats] = useState({
    all: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    total: 0,
  })

  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useAllOrdersQuery(user._id, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    refetch()
  }, [data])

  useErrors([{ isError, error }])


  const columns = [
    {
      field: "id",
      headerName: "Order ID",
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
    const quantities = params.row.orderItems.map(item => item.quantity).join(", ");
    return <span>{quantities}</span>;
  },
},

    {
      field: "discount",
      headerName: "Discount",
      headerClassName: "table-header",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{marginTop: "1rem", color: "success.main", fontWeight: "medium" }}>
          {params.value > 0 ? `-${params.value}%` : "No discount"}
        </Typography>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      headerClassName: "table-header",
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{marginTop: "1rem", fontWeight: "bold" }}>
          ₹{params.value}
        </Typography>
      ),
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
            icon = <AccessTimeIcon fontSize="small" />
            break
          case "shipped":
            color = "info"
            icon = <LocalShippingIcon fontSize="small" />
            break
          case "delivered":
            color = "success"
            icon = <CheckCircleIcon fontSize="small" />
            break
          case "cancelled":
            color = "error"
            icon = <CancelIcon fontSize="small" />
            break
          default:
            color = "default"
            icon = <InventoryIcon fontSize="small" />
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
    {
      field: "date",
      headerName: "Order Date",
      headerClassName: "table-header",
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" mt={"1rem"}>
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "table-header",
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => navigate(`/product/${params.row.orderItems[0]._id}`)}
          sx={{
            border: "2px solid",
            borderColor: "primary.main",
            borderRadius: "8px",
            color: "white",
            padding: "0 10px",
            backgroundColor: "primary.main",
            "&:hover": {
              backgroundColor: "primary.dark",
            },
          }}
          size="small"
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ]

  const [rows, setRows] = useState([])

  useEffect(() => {
    if (data?.orders) {
      const formattedRows = data.orders.map((i) => ({
        ...i,
        key: i._id,
        id: i._id,
        quantity: i.orderItems.quantity,
        action: i.orderItems.productId,
        discount: i.discount,
        amount: i.total,
        status: i.status,
        date: i.createdAt,
      }))

      setRows(formattedRows)

      // Calculate order statistics
      const stats = {
        all: formattedRows.length,
        processing: formattedRows.filter((row) => row.status.toLowerCase() === "processing").length,
        shipped: formattedRows.filter((row) => row.status.toLowerCase() === "shipped").length,
        delivered: formattedRows.filter((row) => row.status.toLowerCase() === "delivered").length,
        cancelled: formattedRows.filter((row) => row.status.toLowerCase() === "cancelled").length,
        total: formattedRows.reduce((sum, row) => sum + row.total, 0),
      }
      setOrderStats(stats)

      // Set filtered rows based on active tab
      filterRowsByTab(activeTab, formattedRows)
    }
  }, [data, activeTab])

  const filterRowsByTab = (tabIndex, rowsData = rows) => {
    switch (tabIndex) {
      case 0: // All orders
        setFilteredRows(rowsData)
        break
      case 1: // Processing
        setFilteredRows(rowsData.filter((row) => row.status.toLowerCase() === "processing"))
        break
      case 2: // Shipped
        setFilteredRows(rowsData.filter((row) => row.status.toLowerCase() === "shipped"))
        break
      case 3: // Delivered
        setFilteredRows(rowsData.filter((row) => row.status.toLowerCase() === "delivered"))
        break
      case 4: // Cancelled
        setFilteredRows(rowsData.filter((row) => row.status.toLowerCase() === "cancelled"))
        break
      default:
        setFilteredRows(rowsData)
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    filterRowsByTab(newValue)
  }

  return (
    <Box sx={{ p: 3, maxWidth: "100%", overflow: "hidden" }}>
     <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            mb: 1,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          My Orders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and manage all your purchases
        </Typography>
      </Box>

      {/* Order Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.25}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              height: "100%",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
              background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Orders
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {orderStats.all}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    borderRadius: "50%",
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ReceiptIcon sx={{ color: "white" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.25}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              height: "100%",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
              background: "linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Processing
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                   {orderStats.processing}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "#FF9800",
                    borderRadius: "50%",
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PendingIcon sx={{ color: "white" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.5}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              height: "100%",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
background: "linear-gradient(135deg,rgb(238, 235, 243) 0%,rgb(214, 157, 219) 100%)"
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Shipped
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                   {orderStats.shipped}
                  </Typography>
                </Box>
                <Box
                  sx={{
bgcolor: "#7E57C2",
                    borderRadius: "50%",
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LocalShippingIcon sx={{ color: "white" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.5}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              height: "100%",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
              background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Delivered
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {orderStats.delivered}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "#4CAF50",
                    borderRadius: "50%",
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckCircleIcon sx={{ color: "white" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.5}>
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              height: "100%",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
              },
              background: "linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Spent
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    ₹ {orderStats.total}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    bgcolor: "#009688",
                    borderRadius: "50%",
                    p: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <InventoryIcon sx={{ color: "white" }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            bgcolor: "background.paper",
            "& .MuiTab-root": {
              minWidth: 120,
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <InventoryIcon sx={{ mr: 1 }} />
                <span>All Orders</span>
                <Badge badgeContent={orderStats.all} color="primary" sx={{ ml: 1 }} />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AccessTimeIcon sx={{ mr: 1 }} />
                <span>Processing</span>
                <Badge badgeContent={orderStats.processing} color="warning" sx={{ ml: 1 }} />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocalShippingIcon sx={{ mr: 1 }} />
                <span>Shipped</span>
                <Badge badgeContent={orderStats.shipped} color="info" sx={{ ml: 1 }} />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CheckCircleIcon sx={{ mr: 1 }} />
                <span>Delivered</span>
                <Badge badgeContent={orderStats.delivered} color="success" sx={{ ml: 1 }} />
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CancelIcon sx={{ mr: 1 }} />
                <span>Cancelled</span>
                <Badge badgeContent={orderStats.cancelled} color="error" sx={{ ml: 1 }} />
              </Box>
            }
          />
        </Tabs>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          width: "100%",
          "& .MuiDataGrid-root": {
            border: "none",
          },
        }}
      >
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table
            columns={columns}
            heading={
              activeTab === 0
                ? "MY ORDERS"
                : activeTab === 1
                ? "PROCESSING ORDERS"
                : activeTab === 2
                ? "SHIPPED ORDERS"
                : activeTab === 3
                ? "DELIVERED ORDERS"
                : "CANCELLED ORDERS"
            }
            rows={filteredRows}
            sx={{ width: "100%", m: 0, p: 0 }}
          />
        )}
      </Paper>
    </Container>
    </Box>
  )
}

export default Orders
