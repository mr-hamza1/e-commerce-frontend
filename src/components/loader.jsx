import { Box, CircularProgress, Typography, Avatar, LinearProgress } from "@mui/material"
import { Home, Search, ShoppingCart, Inventory, Store } from "@mui/icons-material"

const Loader = ({ type = "default", message = "", showLogo = true }) => {
  // Get appropriate icon based on page type
  const getIcon = () => {
    const iconProps = {
      sx: { fontSize: 48, color: "primary.main", mb: 2 },
    }

    switch (type) {
      case "home":
        return <Home {...iconProps} />
      case "search":
        return <Search {...iconProps} />
      case "cart":
        return <ShoppingCart {...iconProps} />
      case "product":
        return <Inventory {...iconProps} />
      default:
        return <Store {...iconProps} />
    }
  }

  // Get appropriate message based on page type
  const getMessage = () => {
    if (message) return message

    switch (type) {
      case "home":
        return "Loading homepage..."
      case "search":
        return "Searching products..."
      case "cart":
        return "Loading your cart..."
      case "product":
        return "Loading products..."
      default:
        return "Loading..."
    }
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 4,
      }}
    >
      {/* Logo/Brand Section */}
      {showLogo && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 64,
                height: 64,
                mr: 2,
              }}
            >
              <Store sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
              }}
            >
              Looto
            </Typography>
          </Box>
        </Box>
      )}

      {/* Page Type Icon */}
      <Box
        sx={{
          mb: 3,
          animation: "bounce 2s infinite",
          "@keyframes bounce": {
            "0%, 20%, 50%, 80%, 100%": {
              transform: "translateY(0)",
            },
            "40%": {
              transform: "translateY(-10px)",
            },
            "60%": {
              transform: "translateY(-5px)",
            },
          },
        }}
      >
        {getIcon()}
      </Box>

      {/* Main Spinner */}
      <Box sx={{ position: "relative", mb: 4 }}>
        <CircularProgress
          size={80}
          thickness={4}
          sx={{
            color: "primary.main",
          }}
        />
        <CircularProgress
          size={80}
          thickness={4}
          variant="determinate"
          value={25}
          sx={{
            color: "primary.light",
            position: "absolute",
            top: 0,
            left: 0,
            transform: "rotate(90deg)",
          }}
        />
      </Box>

      {/* Loading Message */}
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography
          variant="h6"
          component="p"
          sx={{
            color: "text.primary",
            fontWeight: 600,
            mb: 1,
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": { opacity: 1 },
              "50%": { opacity: 0.5 },
              "100%": { opacity: 1 },
            },
          }}
        >
          {getMessage()}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            maxWidth: 300,
          }}
        >
          Please wait while we prepare everything for you
        </Typography>
      </Box>

      {/* Loading Dots */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 4,
        }}
      >
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: "primary.main",
              animation: "bounce 1.4s infinite ease-in-out",
              animationDelay: `${index * 0.16}s`,
              "@keyframes bounce": {
                "0%, 80%, 100%": {
                  transform: "scale(0)",
                },
                "40%": {
                  transform: "scale(1)",
                },
              },
            }}
          />
        ))}
      </Box>

      {/* Progress Bar */}
      <Box sx={{ width: 300, maxWidth: "100%" }}>
        <LinearProgress
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: "grey.200",
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
              backgroundColor: "primary.main",
            },
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            mt: 1,
            display: "block",
            textAlign: "center",
          }}
        >
          Loading resources...
        </Typography>
      </Box>
    </Box>
  )
}

export default Loader
