import { useState } from "react";
import { Box, Typography, Button, Divider, Alert } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Link } from "react-router-dom";

interface CartSummaryProps {
  subtotal: number;
  total: number;
}

const CartSummary = ({ subtotal, total }: CartSummaryProps) => {
  const [checkoutInfoVisible, setCheckoutInfoVisible] = useState(false);

  return (
    <Box
      sx={{
        backgroundColor: "#121214",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "24px",
        p: 3.5,
        position: "sticky",
        top: "100px",
        zIndex: 10,
        transition: "border-color 0.3s",
        "&:hover": {
          borderColor: "rgba(226, 138, 58, 0.15)",
        },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: "#ffffff",
          fontWeight: 800,
          mb: 3.5,
          fontFamily: "'Outfit', sans-serif",
          fontSize: "1.35rem",
        }}
      >
        Order Summary
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "0.9rem" }}>
            Subtotal
          </Typography>
          <Typography sx={{ color: "#ffffff", fontWeight: 700, fontSize: "0.95rem" }}>
            ${subtotal.toLocaleString()}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "0.9rem" }}>
            Shipping &amp; Taxes
          </Typography>
          <Typography sx={{ color: "rgba(255, 255, 255, 0.55)", fontSize: "0.82rem", fontStyle: "italic" }}>
            Calculated at checkout
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)", my: 1.5 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <Typography sx={{ color: "#ffffff", fontWeight: 800, fontSize: "1.1rem" }}>
            Total
          </Typography>
          <Typography
            sx={{
              color: "#e28a3a",
              fontWeight: 900,
              fontSize: "1.45rem",
              lineHeight: 1,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            ${total.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      {checkoutInfoVisible && (
        <Alert
          severity="info"
          onClose={() => setCheckoutInfoVisible(false)}
          sx={{
            mb: 3,
            backgroundColor: "rgba(255, 103, 0, 0.1)",
            color: "#F4F4F5",
            border: "1px solid rgba(255, 103, 0, 0.3)",
            fontSize: "0.82rem",
          }}
        >
          Order allocation &amp; 10% PayOS deposit checkout will unlock in Phase 5.
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => setCheckoutInfoVisible(true)}
          sx={{
            backgroundColor: "#e28a3a",
            color: "#000000",
            fontWeight: 800,
            borderRadius: "100px",
            py: 1.6,
            fontSize: "0.95rem",
            textTransform: "none",
            boxShadow: "0 10px 20px rgba(226, 138, 58, 0.15)",
            "&:hover": {
              backgroundColor: "#f0a256",
            },
          }}
        >
          Proceed to Checkout
        </Button>
        <Button
          component={Link}
          to="/#fleet"
          variant="text"
          startIcon={<KeyboardBackspaceIcon sx={{ fontSize: "1.1rem" }} />}
          sx={{
            color: "rgba(255, 255, 255, 0.6)",
            fontWeight: 700,
            fontSize: "0.9rem",
            textTransform: "none",
            py: 1,
            "&:hover": {
              backgroundColor: "transparent",
              color: "#e28a3a",
            },
          }}
        >
          Continue Shopping
        </Button>
      </Box>
    </Box>
  );
};

export default CartSummary;
