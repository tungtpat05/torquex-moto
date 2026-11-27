import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  ButtonBase,
  CircularProgress,
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

const isLightHexColor = (hexColor: string): boolean => {
  const clean = hexColor.replace("#", "").trim();
  if (!/^[0-9A-Fa-f]{6}$/.test(clean)) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.65;
};

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

  const additionalPrice = Number(selectedVariant?.additionalPrice ?? 0);
  const displayPrice =
    effectiveBase !== undefined && effectiveBase !== null && effectiveBase > 0
      ? Number(effectiveBase) + additionalPrice
      : null;

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
      showToast("This configuration is currently out of stock or unavailable.", "error");
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

  const categoryName = product.category?.categoryName?.toUpperCase();
  const brandName = product.brand?.brandName?.toUpperCase();
  const disciplineLabel = [brandName, categoryName].filter(Boolean).join(" • ");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Discipline & Flagship Telemetry Pills (Monochrome + #FF6700 matching HomePage) */}
      {(disciplineLabel || product.isFeatured) && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flexWrap: "wrap" }}>
          {disciplineLabel && (
            <Box
              sx={{
                px: 1.5,
                py: 0.45,
                borderRadius: "100px",
                backgroundColor: "rgba(15, 15, 20, 0.85)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.64rem",
                  fontWeight: 800,
                  color: "#D4D4D8",
                  letterSpacing: "0.12em",
                }}
              >
                {disciplineLabel}
              </Typography>
            </Box>
          )}
          {product.isFeatured && (
            <Box
              sx={{
                px: 1.4,
                py: 0.45,
                borderRadius: "100px",
                backgroundColor: "#FF6700",
                color: "#070709",
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                fontWeight: 800,
                letterSpacing: "0.1em",
                boxShadow: "0 0 18px rgba(255, 103, 0, 0.40)",
              }}
            >
              FACTORY FLAGSHIP
            </Box>
          )}
        </Box>
      )}

      {/* Eyebrow Summary + Product H1 */}
      <Box>
        {product.summary && (
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.2, mb: 1 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#FF6700",
                boxShadow: "0 0 8px #FF6700",
                flexShrink: 0,
              }}
            />
            <Box sx={{ width: 20, height: "2px", backgroundColor: "#FF6700", flexShrink: 0 }} />
            <Typography
              sx={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "#FF6700",
                textTransform: "uppercase",
              }}
            >
              {product.summary}
            </Typography>
          </Box>
        )}

        <Typography
          component="h1"
          sx={{
            fontFamily: "var(--font-display)",
            fontWeight: 950,
            fontSize: { xs: "2rem", sm: "2.45rem", lg: "2.85rem" },
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            color: "#FFFFFF",
            textTransform: "uppercase",
          }}
        >
          {product.productName}
        </Typography>
      </Box>

      {/* Paddock Glass MSRP Panel */}
      <Box
        sx={{
          backgroundColor: "rgba(15, 15, 20, 0.90)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.10)",
          borderTop: "1px solid rgba(255, 255, 255, 0.25)",
          borderRadius: "16px",
          boxShadow: "0 18px 42px rgba(0, 0, 0, 0.60)",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography
            sx={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.64rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: "#A1A1AA",
            }}
          >
            SHOWROOM MSRP
          </Typography>
          {additionalPrice > 0 && (
            <Typography
              className="tabular-nums"
              sx={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.66rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "#FF6700",
              }}
            >
              +{formatPrice(additionalPrice)} FINISH OPTION
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, flexWrap: "wrap" }}>
          <Typography
            className="tabular-nums"
            sx={{
              fontFamily: "var(--font-mono)",
              fontWeight: 900,
              fontSize: { xs: "1.8rem", md: "2.1rem" },
              lineHeight: 1.1,
              color: displayPrice !== null ? "#FFFFFF" : "#F87171",
            }}
          >
            {displayPrice !== null ? formatPrice(displayPrice) : "Price Unavailable"}
          </Typography>
          {product.discountPrice > 0 &&
            product.discountPrice < product.basePrice &&
            displayPrice !== null && (
              <Typography
                className="tabular-nums"
                sx={{
                  fontFamily: "var(--font-mono)",
                  color: "#71717A",
                  textDecoration: "line-through",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                {formatPrice(Number(product.basePrice) + additionalPrice)}
              </Typography>
            )}
        </Box>
      </Box>

      {/* Colorway Picker */}
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              fontWeight: 800,
              color: "#A1A1AA",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Colorway
          </Typography>
          {selectedVariant?.color?.colorName && (
            <Typography
              sx={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.92rem",
                color: "#F4F4F5",
              }}
            >
              {selectedVariant.color.colorName}
              {additionalPrice > 0 ? ` (+${formatPrice(additionalPrice)})` : ""}
            </Typography>
          )}
        </Box>

        {variants.length > 0 ? (
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              const isBuyable = v.isActive !== false && v.stockQuantity > 0;
              const colorValue = v.color?.colorCode || "#333333";
              const colorLabel = v.color?.colorName || "Factory Finish";
              const checkColor = isLightHexColor(colorValue) ? "#070709" : "#FFFFFF";

              return (
                <ButtonBase
                  key={v.id}
                  onClick={() => {
                    setSelectedVariant(v);
                    onVariantSelect?.(v);
                  }}
                  aria-label={isBuyable ? colorLabel : `${colorLabel} (Out of Stock)`}
                  aria-pressed={isSelected}
                  title={isBuyable ? colorLabel : `${colorLabel} (Out of Stock)`}
                  sx={{
                    position: "relative",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: colorValue,
                    border: "2px solid",
                    borderColor: isSelected ? "#FF6700" : "rgba(255, 255, 255, 0.22)",
                    outline: isSelected ? "2px solid rgba(255, 103, 0, 0.45)" : "none",
                    outlineOffset: "2px",
                    opacity: isBuyable ? 1 : 0.42,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    boxShadow: isSelected
                      ? "0 0 16px rgba(255, 103, 0, 0.45), inset 0 0 4px rgba(0, 0, 0, 0.45)"
                      : "inset 0 0 4px rgba(0, 0, 0, 0.45)",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "scale(1.06)",
                      borderColor: "#FF6700",
                    },
                  }}
                >
                  {!isBuyable && (
                    <Box
                      aria-hidden="true"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, transparent 46%, rgba(255, 255, 255, 0.72) 48%, rgba(255, 255, 255, 0.72) 52%, transparent 54%)",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  {isSelected && (
                    <CheckIcon
                      sx={{
                        position: "relative",
                        zIndex: 1,
                        fontSize: 18,
                        color: checkColor,
                      }}
                    />
                  )}
                </ButtonBase>
              );
            })}
          </Box>
        ) : (
          <Typography sx={{ color: "#A1A1AA", fontSize: "0.86rem", fontStyle: "italic" }}>
            No factory color options configured yet.
          </Typography>
        )}
      </Box>

      {/* Out of Stock Minimalist Telemetry Notice (no green/red pill badges) */}
      {(!isSelectedVariantBuyable || displayPrice === null) && (
        <Box
          role="status"
          sx={{
            backgroundColor: "rgba(15, 15, 20, 0.90)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderLeft: "2px solid #FF6700",
            borderRadius: "8px",
            px: 2,
            py: 1.5,
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: "#D4D4D8",
              lineHeight: 1.5,
            }}
          >
            {variants.length === 0
              ? "NO FACTORY CONFIGURATIONS AVAILABLE FOR THIS MODEL YET."
              : "THIS CONFIGURATION IS CURRENTLY OUT OF STOCK — SELECT ANOTHER COLORWAY."}
          </Typography>
        </Box>
      )}

      {/* Action CTAs matching BloodlineFleet language */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1.15fr" }, gap: 1.5 }}>
        <Button
          variant="outlined"
          fullWidth
          disabled={!isSelectedVariantBuyable || displayPrice === null || submittingCart}
          onClick={handleAddToCart}
          sx={{
            py: 1.65,
            px: 2,
            borderRadius: "8px",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            color: "#F4F4F5",
            fontFamily: "var(--font-mono)",
            fontWeight: 800,
            fontSize: "0.78rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            gap: 1,
            "&:hover": {
              borderColor: "#FF6700",
              backgroundColor: "rgba(255, 103, 0, 0.10)",
              color: "#FFFFFF",
            },
            "&.Mui-disabled": {
              borderColor: "rgba(255, 255, 255, 0.08)",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              color: "#71717A",
            },
          }}
        >
          {submittingCart && <CircularProgress size={16} sx={{ color: "#FF6700" }} />}
          {isSelectedVariantBuyable ? "Add to Cart" : "Out of Stock"}
        </Button>

        <Button
          variant="contained"
          fullWidth
          disabled={!isSelectedVariantBuyable || displayPrice === null || submittingCart}
          onClick={handleBuyNow}
          sx={{
            backgroundColor: "#FF6700",
            color: "#070709",
            py: 1.65,
            px: 2,
            borderRadius: "8px",
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: "0.88rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            gap: 1,
            boxShadow: "0 0 24px rgba(255, 103, 0, 0.35)",
            "&:hover": {
              backgroundColor: "#FF7D24",
              boxShadow: "0 0 32px rgba(255, 103, 0, 0.55)",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              color: "#71717A",
              boxShadow: "none",
            },
          }}
        >
          {submittingCart && <CircularProgress size={16} sx={{ color: "#070709" }} />}
          Buy Now
        </Button>
      </Box>

      {/* Secondary Utility Action */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          pt: 2.5,
        }}
      >
        <Button
          startIcon={<ShareIcon sx={{ fontSize: "1rem" }} />}
          onClick={() => void handleShare()}
          sx={{
            color: "#A1A1AA",
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            backgroundColor: "rgba(15, 15, 20, 0.65)",
            borderRadius: "8px",
            px: 2.5,
            py: 1,
            "&:hover": {
              borderColor: "#FF6700",
              backgroundColor: "rgba(255, 103, 0, 0.08)",
              color: "#FF6700",
            },
          }}
        >
          Share
        </Button>
      </Box>

      {/* Toast Notification matching BloodlineFleet */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: "100%",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: "0.75rem",
            backgroundColor: snackbarSeverity === "success" ? "#FF6700" : "#991B1B",
            color: snackbarSeverity === "success" ? "#070709" : "#F4F4F5",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductInfo;
