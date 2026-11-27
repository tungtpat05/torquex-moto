import { Box, Typography, IconButton, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Link } from "react-router-dom";
import { CartItemResponse } from "@/types/cart";

interface CartItemCardProps {
  item: CartItemResponse;
  pending?: boolean;
  onIncrease: (variantId: number) => void;
  onDecrease: (variantId: number) => void;
  onRemove: (variantId: number) => void;
}

const CartItemCard = ({
  item,
  pending = false,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemCardProps) => {
  const { productId, variantId, productName, thumbnail, variantImage, color, unitPrice, quantity, lineTotal } = item;

  const displayImage = variantImage || thumbnail;
  const colorName = color?.colorName || "Standard";

  return (
    <Box
      sx={{
        backgroundColor: "rgba(15, 15, 20, 0.90)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.10)",
        borderTop: "1px solid rgba(255, 255, 255, 0.25)",
        borderRadius: "16px",
        boxShadow: "0 18px 42px rgba(0, 0, 0, 0.65)",
        p: { xs: 2.5, md: 3 },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 3,
        mb: 2.5,
        opacity: pending ? 0.72 : 1,
        transition: "border-color 0.25s ease, opacity 0.2s ease",
        "&:hover": {
          borderColor: "rgba(255, 103, 0, 0.45)",
        },
      }}
    >
      <Box sx={{ display: "flex", gap: 2.5, flex: 1, width: "100%", alignItems: "center", minWidth: 0 }}>
        <Box
          component={Link}
          to={`/products/${productId}`}
          aria-label={`View ${productName}`}
          sx={{
            width: { xs: "96px", sm: "136px" },
            height: { xs: "76px", sm: "104px" },
            backgroundColor: "#16161D",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
            p: 1.25,
          }}
        >
          <Box
            component="img"
            src={displayImage}
            alt={productName}
            decoding="async"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              transition: "transform 0.35s ease",
              "&:hover": { transform: "scale(1.06)" },
            }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-mono)",
              color: "#FF6700",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontSize: "0.66rem",
              mb: 0.6,
              display: "block",
            }}
          >
            Colorway: {colorName}
          </Typography>

          <Typography
            component={Link}
            to={`/products/${productId}`}
            sx={{
              color: "#FFFFFF",
              fontWeight: 900,
              fontSize: { xs: "1.05rem", sm: "1.2rem" },
              mb: 0.9,
              lineHeight: 1.15,
              fontFamily: "var(--font-display)",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "inline-block",
              transition: "color 0.2s ease",
              "&:hover": { color: "#FF6700" },
            }}
          >
            {productName}
          </Typography>

          <Box sx={{ display: "flex", gap: 3, mt: 0.5 }}>
            <Button
              variant="text"
              disabled={pending}
              onClick={() => onRemove(variantId)}
              startIcon={<DeleteOutlineIcon sx={{ fontSize: "1rem" }} />}
              sx={{
                color: "#A1A1AA",
                fontFamily: "var(--font-mono)",
                fontSize: "0.70rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                px: 0.75,
                py: 0.4,
                minWidth: 0,
                "&:hover": {
                  backgroundColor: "rgba(239, 68, 68, 0.10)",
                  color: "#EF4444",
                },
              }}
            >
              Remove
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: { xs: "100%", sm: "auto" },
          gap: { xs: 2, sm: 3.5 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "8px",
            backgroundColor: "#16161D",
            p: 0.4,
          }}
        >
          <IconButton
            size="small"
            aria-label={`Decrease quantity of ${productName}`}
            onClick={() => onDecrease(variantId)}
            disabled={pending || quantity <= 1}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "6px",
              color: "#D4D4D8",
              "&:hover": { color: "#FF6700", backgroundColor: "rgba(255, 103, 0, 0.08)" },
              "&.Mui-disabled": { color: "rgba(255, 255, 255, 0.2)" },
            }}
          >
            <RemoveIcon sx={{ fontSize: "0.95rem" }} />
          </IconButton>
          <Typography
            className="tabular-nums"
            sx={{
              color: "#FFFFFF",
              fontFamily: "var(--font-mono)",
              fontWeight: 800,
              fontSize: "0.88rem",
              px: 1.5,
              minWidth: "36px",
              textAlign: "center",
            }}
          >
            {quantity}
          </Typography>
          <IconButton
            size="small"
            aria-label={`Increase quantity of ${productName}`}
            onClick={() => onIncrease(variantId)}
            disabled={pending}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "6px",
              color: "#D4D4D8",
              "&:hover": { color: "#FF6700", backgroundColor: "rgba(255, 103, 0, 0.08)" },
            }}
          >
            <AddIcon sx={{ fontSize: "0.95rem" }} />
          </IconButton>
        </Box>

        <Box sx={{ textAlign: "right", minWidth: { xs: "auto", sm: "120px" } }}>
          <Typography
            className="tabular-nums"
            sx={{
              color: "#FFFFFF",
              fontFamily: "var(--font-mono)",
              fontWeight: 900,
              fontSize: "1.15rem",
            }}
          >
            ${Number(lineTotal).toLocaleString()}
          </Typography>
          {quantity > 1 && (
            <Typography
              className="tabular-nums"
              sx={{
                color: "#A1A1AA",
                fontFamily: "var(--font-mono)",
                fontSize: "0.70rem",
                display: "block",
                mt: 0.3,
              }}
            >
              (${Number(unitPrice).toLocaleString()} each)
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CartItemCard;
