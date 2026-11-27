import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import CheckIcon from "@mui/icons-material/Check";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, useCart } from "@/context";
import { Product, ProductVariant } from "@/types/product";

interface ProductInfoProps {
  product: Product;
  onVariantSelect?: (variant: ProductVariant) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

const pickDefaultVariant = (variants: ProductVariant[]): ProductVariant | null =>
  variants.find((v) => v.isActive && v.stockQuantity > 0) || variants[0] || null;

const ProductInfo = ({ product, onVariantSelect }: ProductInfoProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLogin, user } = useAuth();
  const { addItemToCart } = useCart();

  const variants = useMemo(() => product.variants || [], [product.variants]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() =>
    pickDefaultVariant(variants)
  );
  const [submittingCart, setSubmittingCart] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  useEffect(() => {
    setSelectedVariant(pickDefaultVariant(variants));
  }, [product.id, variants]);

  const isSelectedVariantBuyable = Boolean(
    selectedVariant && selectedVariant.isActive !== false && selectedVariant.stockQuantity > 0
  );

  const effectiveBase =
    product.discountPrice &&
    product.basePrice &&
    product.discountPrice > 0 &&
    product.discountPrice < product.basePrice
      ? product.discountPrice
      : product.basePrice;

  const additionalPrice = selectedVariant?.additionalPrice ?? 0;
  const displayPrice =
    effectiveBase !== undefined && effectiveBase !== null && effectiveBase > 0
      ? Number(effectiveBase) + Number(additionalPrice)
      : null;

  const totalStock = useMemo(() => {
    if (variants.length === 0) return null;
    return variants.reduce((acc, v) => acc + (v.isActive ? v.stockQuantity || 0 : 0), 0);
  }, [variants]);

  const showToast = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAddToCart = async () => {
    if (!isLogin || !user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (!selectedVariant?.id || !isSelectedVariantBuyable || displayPrice === null) {
      showToast("This variant is currently out of stock or unavailable.", "error");
      return;
    }

    setSubmittingCart(true);
    try {
      await addItemToCart(selectedVariant.id, 1);
      showToast(`Added "${product.productName}" to your shopping cart!`, "success");
    } catch (err: any) {
      console.error("Failed to add product variant to cart:", err);
      const errMsg = err?.response?.data?.message || "Failed to add item to cart. Please try again.";
      showToast(errMsg, "error");
    } finally {
      setSubmittingCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isLogin || !user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (!selectedVariant?.id || !isSelectedVariantBuyable || displayPrice === null) {
      showToast("Cannot proceed: selected configuration is unavailable.", "error");
      return;
    }

    setSubmittingCart(true);
    try {
      await addItemToCart(selectedVariant.id, 1);
      navigate("/cart");
    } catch (err: any) {
      console.error("Failed to buy now:", err);
      const errMsg = err?.response?.data?.message || "Failed to add item to cart. Please try again.";
      showToast(errMsg, "error");
    } finally {
      setSubmittingCart(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Model link copied to clipboard!", "success");
    } catch {
      showToast("Copy URL from your browser address bar to share.", "error");
    }
  };

  const categoryName = product.category?.categoryName;
  const brandName = product.brand?.brandName;
  const yearText = product.createdAt ? String(new Date(product.createdAt).getFullYear()) : null;

  const getTagColor = (catName: string) => {
    const name = catName.toLowerCase();
    if (name.includes("naked")) return "rgba(168, 85, 247, 0.25)";
    if (name.includes("sport")) return "rgba(239, 68, 68, 0.25)";
    if (name.includes("adventure")) return "rgba(234, 179, 8, 0.25)";
    if (name.includes("supermoto")) return "rgba(59, 130, 246, 0.25)";
    return "rgba(226, 138, 58, 0.25)";
  };

  const getTagTextColor = (catName: string) => {
    const name = catName.toLowerCase();
    if (name.includes("naked")) return "#c084fc";
    if (name.includes("sport")) return "#f87171";
    if (name.includes("adventure")) return "#facc15";
    if (name.includes("supermoto")) return "#60a5fa";
    return "#e28a3a";
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
      {/* Brand & Category Tag */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {brandName ? (
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 800,
              color: "rgba(255, 255, 255, 0.55)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            {brandName}
          </Typography>
        ) : (
          <Box />
        )}
        {categoryName && (
          <Box
            sx={{
              backgroundColor: getTagColor(categoryName),
              color: getTagTextColor(categoryName),
              px: 2,
              py: 0.5,
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {categoryName}
          </Box>
        )}
      </Box>

      {/* Product Title */}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          color: "white",
          fontFamily: "'Outfit', 'Inter', sans-serif",
          fontSize: { xs: "2rem", md: "2.5rem" },
          lineHeight: 1.15,
        }}
      >
        {product.productName}
      </Typography>

      {/* Stock State Row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        {totalStock !== null ? (
          totalStock > 0 ? (
            <Chip
              label={`• In Stock (${totalStock} available)`}
              size="small"
              sx={{
                backgroundColor: "rgba(46, 125, 50, 0.15)",
                color: "#4caf50",
                fontWeight: 700,
                fontSize: "0.75rem",
                px: 0.5,
              }}
            />
          ) : (
            <Chip
              label="• Out of Stock"
              size="small"
              sx={{
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                color: "#ef4444",
                fontWeight: 700,
                fontSize: "0.75rem",
                px: 0.5,
              }}
            />
          )
        ) : (
          <Chip
            label="• No Variants Configured"
            size="small"
            sx={{
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              color: "#f87171",
              fontWeight: 700,
              fontSize: "0.75rem",
              px: 0.5,
            }}
          />
        )}
        {selectedVariant?.sku && (
          <Typography
            variant="caption"
            sx={{ fontFamily: "monospace", color: "rgba(255,255,255,0.45)", fontWeight: 700 }}
          >
            SKU: {selectedVariant.sku}
          </Typography>
        )}
      </Box>

      {/* Pricing Information Panel */}
      <Box
        sx={{
          backgroundColor: "#121214",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "16px",
          p: 3,
          display: "flex",
          alignItems: "baseline",
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, color: displayPrice !== null ? "white" : "#f87171" }}>
          {displayPrice !== null ? formatPrice(displayPrice) : "Price Unavailable"}
        </Typography>
        {product.discountPrice > 0 &&
          product.discountPrice < product.basePrice &&
          displayPrice !== null && (
            <Typography
              variant="body1"
              sx={{ color: "rgba(255,255,255,0.35)", textDecoration: "line-through", fontWeight: 600 }}
            >
              {formatPrice(product.basePrice + additionalPrice)}
            </Typography>
          )}
      </Box>

      {/* Color Selection Picker */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: "rgba(255, 255, 255, 0.5)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Color
          </Typography>
          {selectedVariant?.color?.colorName && (
            <Typography variant="body2" sx={{ fontWeight: 700, color: "rgba(255, 255, 255, 0.75)" }}>
              {selectedVariant.color.colorName}
            </Typography>
          )}
        </Box>

        {variants.length > 0 ? (
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              const colorValue = v.color?.colorCode || "#333333";
              return (
                <Box
                  key={v.id}
                  onClick={() => {
                    setSelectedVariant(v);
                    onVariantSelect?.(v);
                  }}
                  title={`${v.color?.colorName || v.sku} (${v.stockQuantity} in stock)`}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: colorValue,
                    border: "2px solid",
                    borderColor: isSelected ? "#e28a3a" : "rgba(255,255,255,0.2)",
                    cursor: "pointer",
                    opacity: v.stockQuantity > 0 && v.isActive ? 1 : 0.45,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                    boxShadow: "inset 0px 0px 4px rgba(0,0,0,0.5)",
                    "&:hover": {
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  {isSelected && <CheckIcon sx={{ fontSize: 16, color: "white" }} />}
                </Box>
              );
            })}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.4)", fontStyle: "italic" }}>
            No factory color options configured yet.
          </Typography>
        )}
      </Box>

      {/* Model Year Display */}
      {yearText && (
        <Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 800,
              color: "rgba(255, 255, 255, 0.5)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "block",
              mb: 1,
            }}
          >
            Model Year
          </Typography>
          <Typography variant="body2" sx={{ color: "white", fontWeight: 700 }}>
            {yearText}
          </Typography>
        </Box>
      )}

      {/* Short Summary Section */}
      {product.summary && (
        <Box
          sx={{
            borderLeft: "2px solid #e28a3a",
            pl: 2.5,
            py: 0.5,
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            {product.summary}
          </Typography>
        </Box>
      )}

      {/* Call to action purchase buttons */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Button
          variant="contained"
          fullWidth
          disabled={!isSelectedVariantBuyable || displayPrice === null || submittingCart}
          onClick={handleAddToCart}
          sx={{
            backgroundColor: "#e28a3a",
            color: "#000000",
            py: 2,
            borderRadius: "8px",
            fontWeight: 800,
            textTransform: "none",
            fontSize: "0.95rem",
            "&:hover": {
              backgroundColor: "#f0a256",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.35)",
            },
          }}
        >
          {isSelectedVariantBuyable ? "Add to Cart" : "Out of Stock"}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          disabled={!isSelectedVariantBuyable || displayPrice === null || submittingCart}
          onClick={handleBuyNow}
          sx={{
            borderColor: "#e28a3a",
            color: "#e28a3a",
            py: 2,
            borderRadius: "8px",
            fontWeight: 800,
            textTransform: "none",
            fontSize: "0.95rem",
            "&:hover": {
              borderColor: "#f0a256",
              backgroundColor: "rgba(226, 138, 58, 0.05)",
            },
            "&.Mui-disabled": {
              borderColor: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.25)",
            },
          }}
        >
          Buy Now
        </Button>
      </Box>

      {/* Sub-action: Share */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          pb: 3.5,
        }}
      >
        <Button
          startIcon={<ShareIcon />}
          onClick={() => void handleShare()}
          sx={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.85rem",
            fontWeight: 700,
            textTransform: "none",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            px: 3,
            py: 1,
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "white",
            },
          }}
        >
          Share
        </Button>
      </Box>

      {/* Toast Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: "100%",
            fontWeight: 700,
            backgroundColor: snackbarSeverity === "success" ? "#e28a3a" : undefined,
            color: snackbarSeverity === "success" ? "#000000" : undefined,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductInfo;
