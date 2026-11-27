import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Breadcrumbs,
  Grid,
  CircularProgress,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useProductDetail } from "@/hooks/useProductDetail";
import ProductGallery, { GalleryFocusTrigger } from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import SpecStrip from "@/components/product/SpecStrip";
import TabbedDetails from "@/components/product/TabbedDetails";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProductDetail(id);
  const [variantFocus, setVariantFocus] = useState<GalleryFocusTrigger | null>(null);

  useEffect(() => {
    setVariantFocus(null);
  }, [id]);

  if (loading) {
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
          LOADING KTM MACHINE TELEMETRY...
        </Typography>
      </Box>
    );
  }

  if (error || !product) {
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
            maxWidth: 520,
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
              fontSize: { xs: "1.6rem", md: "2rem" },
              color: "#EF4444",
              textTransform: "uppercase",
            }}
          >
            MACHINE NOT FOUND
          </Typography>
          <Typography sx={{ color: "#A1A1AA", fontSize: "0.92rem", mb: 1 }}>
            {error || "Motorcycle model detail could not be located in the factory catalog."}
          </Typography>
          <Button
            component={Link}
            to="/#fleet"
            variant="contained"
            sx={{
              backgroundColor: "#FF6700",
              color: "#070709",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              borderRadius: "8px",
              px: 4,
              py: 1.3,
              boxShadow: "0 0 24px rgba(255, 103, 0, 0.35)",
              "&:hover": {
                backgroundColor: "#FF7D24",
                boxShadow: "0 0 32px rgba(255, 103, 0, 0.55)",
              },
            }}
          >
            Back to Fleet
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
        pb: 12,
        overflowX: "hidden",
      }}
    >
      {/* Overhead Showroom Studio Glow */}
      <Box
        sx={{
          position: "absolute",
          top: "-120px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1100px",
          height: "420px",
          background:
            "radial-gradient(ellipse at center, rgba(255, 103, 0, 0.11) 0%, rgba(255, 103, 0, 0.02) 52%, transparent 76%)",
          filter: "blur(55px)",
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
        {/* Top Navigation & Telemetry Breadcrumbs */}
        <Box sx={{ pt: { xs: 2, md: 3 }, pb: 3 }}>
          <Breadcrumbs
            separator={<NavigateNextIcon sx={{ fontSize: "0.95rem", color: "#71717A" }} />}
            aria-label="breadcrumb"
            sx={{ mb: 2 }}
          >
            <Link to="/" style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#A1A1AA",
                  transition: "color 0.2s ease",
                  "&:hover": { color: "#FF6700" },
                }}
              >
                Home
              </Typography>
            </Link>
            <Link to="/#fleet" style={{ textDecoration: "none" }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#A1A1AA",
                  transition: "color 0.2s ease",
                  "&:hover": { color: "#FF6700" },
                }}
              >
                Lineup
              </Typography>
            </Link>
            {product.brand?.brandName && (
              <Typography
                sx={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#71717A",
                }}
              >
                {product.brand.brandName}
              </Typography>
            )}
            <Typography
              sx={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#FF6700",
              }}
            >
              {product.productName}
            </Typography>
          </Breadcrumbs>

          <Link to="/#fleet" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                color: "#A1A1AA",
                transition: "color 0.2s ease",
                "&:hover": { color: "#FF6700" },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: "0.95rem" }} />
              <Typography
                sx={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Back to Fleet
              </Typography>
            </Box>
          </Link>
        </Box>

        {/* Main Showroom Section */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="flex-start">
            <Grid size={{ xs: 12, md: 6.5 }}>
              <ProductGallery
                productId={product.id}
                thumbnailUrl={product.thumbnail}
                productName={product.productName}
                images={product.images}
                variants={product.variants}
                focusImageTrigger={variantFocus}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 5.5 }}>
              <ProductInfo
                product={product}
                onVariantSelect={(variant) => {
                  if (variant.variantImage) {
                    setVariantFocus((prev) => ({
                      imageUrl: variant.variantImage,
                      seq: (prev?.seq || 0) + 1,
                    }));
                  }
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Key Telemetry Strip (4 core metrics) */}
        <Box sx={{ mb: 6 }}>
          <SpecStrip product={product} />
        </Box>

        {/* Full Specifications & Editorial Description */}
        <TabbedDetails product={product} />
      </Box>
    </Box>
  );
};

export default ProductDetailPage;
