import { useState } from "react";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";
import { useCart } from "@/context";
import CartItemCard from "@/components/cart/CartItemCard";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCart from "@/components/cart/EmptyCart";

const CartPage = () => {
  const { cart, loading, error, fetchCart, increaseCartItem, decreaseCartItem, removeCartItem } = useCart();
  const [pendingVariantId, setPendingVariantId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: "success" | "error" } | null>(null);

  const cartItems = cart?.items || [];
  const totalQuantity = cart?.totalQuantity ?? 0;
  const subtotal = cart?.totalPrice ?? 0;

  const extractErrorMessage = (err: unknown, fallback: string) => {
    const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
    return axiosErr?.response?.data?.message || axiosErr?.message || fallback;
  };

  const handleIncrease = async (variantId: number) => {
    setPendingVariantId(variantId);
    try {
      await increaseCartItem(variantId, 1);
    } catch (err) {
      setToast({
        message: extractErrorMessage(err, "Unable to increase quantity. Stock limit may be reached."),
        severity: "error",
      });
    } finally {
      setPendingVariantId(null);
    }
  };

  const handleDecrease = async (variantId: number) => {
    setPendingVariantId(variantId);
    try {
      await decreaseCartItem(variantId, 1);
    } catch (err) {
      setToast({
        message: extractErrorMessage(err, "Unable to update quantity."),
        severity: "error",
      });
    } finally {
      setPendingVariantId(null);
    }
  };

  const handleRemove = async (variantId: number) => {
    setPendingVariantId(variantId);
    try {
      await removeCartItem(variantId);
      setToast({
        message: "Machine removed from your allocation cart.",
        severity: "success",
      });
    } catch (err) {
      setToast({
        message: extractErrorMessage(err, "Unable to remove item from cart."),
        severity: "error",
      });
    } finally {
      setPendingVariantId(null);
    }
  };

  if (loading && !cart) {
    return (
      <Box
        sx={{
          minHeight: "75vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#070709",
          gap: 2.5,
        }}
      >
        <CircularProgress sx={{ color: "#FF6700" }} />
        <Typography
          sx={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "#A1A1AA",
            textTransform: "uppercase",
          }}
        >
          LOADING ALLOCATION CART...
        </Typography>
      </Box>
    );
  }

  if (error && !cart) {
    return (
      <Box
        sx={{
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#070709",
          px: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: 500,
            width: "100%",
            p: { xs: 3.5, md: 5 },
            borderRadius: "16px",
            backgroundColor: "rgba(15, 15, 20, 0.90)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            borderTop: "1px solid rgba(255, 255, 255, 0.25)",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "1.6rem",
              color: "#EF4444",
              textTransform: "uppercase",
            }}
          >
            UNABLE TO LOAD CART
          </Typography>
          <Typography sx={{ color: "#A1A1AA", fontSize: "0.92rem", mb: 1 }}>{error}</Typography>
          <Button
            variant="contained"
            onClick={() => void fetchCart()}
            sx={{
              backgroundColor: "#FF6700",
              color: "#070709",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              borderRadius: "8px",
              px: 4,
              py: 1.2,
              "&:hover": { backgroundColor: "#FF7D24" },
            }}
          >
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "#070709",
        minHeight: "100vh",
        pt: { xs: 2, md: 3 },
        pb: 12,
        overflowX: "hidden",
      }}
    >
      {/* Overhead Ambient Studio Glow */}
      <Box
        sx={{
          position: "absolute",
          top: "-140px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1000px",
          height: "380px",
          background:
            "radial-gradient(ellipse at center, rgba(255, 103, 0, 0.10) 0%, rgba(255, 103, 0, 0.02) 52%, transparent 76%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1440px",
          mx: "auto",
          px: { xs: 2.5, md: 6, lg: 8 },
        }}
      >
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: "0.95rem", color: "#71717A" }} />}
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <Typography
            component={Link}
            to="/"
            sx={{
              color: "#A1A1AA",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              transition: "color 0.2s ease",
              "&:hover": { color: "#FF6700" },
            }}
          >
            Home
          </Typography>
          <Typography
            sx={{
              color: "#FF6700",
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Allocation Cart
          </Typography>
        </Breadcrumbs>

        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <Typography
              component="h1"
              sx={{
                color: "#FFFFFF",
                fontWeight: 950,
                fontFamily: "var(--font-display)",
                fontSize: { xs: "2rem", md: "2.8rem" },
                letterSpacing: "-0.03em",
                lineHeight: 1.02,
                textTransform: "uppercase",
              }}
            >
              Shopping Cart
            </Typography>
            {cartItems.length > 0 && (
              <Box
                component="span"
                className="tabular-nums"
                sx={{
                  backgroundColor: "rgba(255, 103, 0, 0.14)",
                  color: "#FF6700",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.74rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  px: 1.75,
                  py: 0.5,
                  borderRadius: "100px",
                  border: "1px solid rgba(255, 103, 0, 0.35)",
                }}
              >
                {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
              </Box>
            )}
          </Box>
        </Box>

        {error && cart && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              backgroundColor: "rgba(153, 27, 27, 0.25)",
              color: "#FCA5A5",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              borderRadius: "8px",
            }}
          >
            {error}
          </Alert>
        )}

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <Grid container spacing={{ xs: 3, lg: 5 }}>
            <Grid size={{ xs: 12, lg: 8 }}>
              <Box>
                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.id || item.variantId}
                    item={item}
                    pending={pendingVariantId === item.variantId}
                    onIncrease={(id) => void handleIncrease(id)}
                    onDecrease={(id) => void handleDecrease(id)}
                    onRemove={(id) => void handleRemove(id)}
                  />
                ))}
              </Box>
            </Grid>

            <Grid size={{ xs: 12, lg: 4 }}>
              <CartSummary subtotal={subtotal} total={subtotal} />
            </Grid>
          </Grid>
        )}
      </Box>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast(null)}
          severity={toast?.severity || "info"}
          variant="filled"
          sx={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: "0.75rem",
            backgroundColor: toast?.severity === "success" ? "#FF6700" : "#991B1B",
            color: toast?.severity === "success" ? "#070709" : "#F4F4F5",
          }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CartPage;
