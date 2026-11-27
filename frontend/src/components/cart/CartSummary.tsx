import { Box, Typography, Button, Divider } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Link } from "react-router-dom";

interface CartSummaryProps {
  subtotal: number;
  total: number;
}

const CartSummary = ({ subtotal, total }: CartSummaryProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(15, 15, 20, 0.90)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.10)",
        borderTop: "1px solid rgba(255, 255, 255, 0.25)",
        borderRadius: "16px",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.75)",
        p: { xs: 3, md: 3.5 },
        position: "sticky",
        top: "100px",
        zIndex: 10,
      }}
    >
      <Typography
        component="h2"
        sx={{
          color: "#FFFFFF",
          fontWeight: 900,
          mb: 3,
          fontFamily: "var(--font-display)",
          fontSize: "1.35rem",
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
        }}
      >
        Order Summary
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Typography
            sx={{
              fontFamily: "var(--font-mono)",
              color: "#A1A1AA",
              fontSize: "0.74rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Subtotal
          </Typography>
          <Typography
            className="tabular-nums"
            sx={{
              fontFamily: "var(--font-mono)",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "0.96rem",
            }}
          >
            ${Number(subtotal).toLocaleString()}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 2 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-mono)",
              color: "#A1A1AA",
              fontSize: "0.74rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Crate &amp; Logistics
          </Typography>
          <Typography
            sx={{
              color: "#D4D4D8",
              fontSize: "0.80rem",
              fontStyle: "italic",
              textAlign: "right",
            }}
          >
            Calculated at allocation
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 1 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <Typography
            sx={{
              fontFamily: "var(--font-mono)",
              color: "#FFFFFF",
              fontWeight: 800,
              fontSize: "0.82rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Estimated Total
          </Typography>
          <Typography
            className="tabular-nums"
            sx={{
              color: "#FF6700",
              fontWeight: 900,
              fontSize: "1.5rem",
              lineHeight: 1,
              fontFamily: "var(--font-mono)",
            }}
          >
            ${Number(total).toLocaleString()}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Button
          variant="contained"
          disabled
          fullWidth
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            borderRadius: "8px",
            py: 1.5,
            px: 2.25,
            border: "1px solid rgba(255, 255, 255, 0.12)",
            "&.Mui-disabled": {
              backgroundColor: "#16161D",
              color: "#A1A1AA",
            },
          }}
        >
          <Typography
            component="span"
            sx={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "0.86rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#D4D4D8",
            }}
          >
            Proceed to Checkout
          </Typography>
          <Box
            component="span"
            sx={{
              px: 1,
              py: 0.35,
              borderRadius: "4px",
              backgroundColor: "rgba(255, 103, 0, 0.14)",
              border: "1px solid rgba(255, 103, 0, 0.45)",
              color: "#FF6700",
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            COMING SOON
          </Box>
        </Button>

        <Typography
          sx={{
            fontFamily: "var(--font-body)",
            fontSize: "0.78rem",
            color: "#A1A1AA",
            lineHeight: 1.5,
            textAlign: "center",
            px: 1,
          }}
        >
          Online deposit checkout is launching soon. Contact Mattighofen VIP Concierge for priority VIN allocation.
        </Typography>

        <Button
          component={Link}
          to="/#fleet"
          variant="text"
          startIcon={<KeyboardBackspaceIcon sx={{ fontSize: "1.05rem" }} />}
          sx={{
            color: "#D4D4D8",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: "0.74rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            py: 1,
            mt: 0.5,
            "&:hover": {
              backgroundColor: "rgba(255, 103, 0, 0.08)",
              color: "#FF6700",
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
