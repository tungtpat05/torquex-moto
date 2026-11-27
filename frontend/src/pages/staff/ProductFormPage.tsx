import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProductForm from "../../components/staff/product/ProductForm";
import StaffBreadcrumbs from "../../components/staff/common/StaffBreadcrumbs";
import { getProductById } from "../../services/productService";
import { Product } from "../../types/product";

interface ProductFormPageProps {
  mode?: "add" | "edit";
}

const ProductFormPage = ({ mode: propMode }: ProductFormPageProps) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const isEditPath = location.pathname.includes("/edit") || id !== undefined;
  const mode = propMode || (isEditPath ? "edit" : "add");

  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState<Product | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (mode !== "edit" || !id) return;
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getProductById(Number(id));
      setProductData(data);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      console.error("Failed to load product data:", err);
      setLoadError(errorObj?.message || "Failed to load product data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [mode, id]);

  useEffect(() => {
    void fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return (
      <Box>
        <StaffBreadcrumbs
          items={[
            { label: "Products", to: "/staff/products" },
            { label: "Edit Product" },
          ]}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 280,
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: "#FF6700" }} />
          <Typography variant="body2" sx={{ color: "#A1A1AA", fontWeight: 600 }}>
            Loading product specifications...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box>
        <StaffBreadcrumbs
          items={[
            { label: "Products", to: "/staff/products" },
            { label: "Edit Product" },
          ]}
        />
        <Alert
          severity="error"
          sx={{
            borderRadius: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.10)",
            color: "#FCA5A5",
            border: "1px solid rgba(239, 68, 68, 0.28)",
            mb: 2,
          }}
        >
          {loadError} — Please verify the Backend API is running and product ID {id} exists.
        </Alert>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => void fetchProduct()}
            sx={{
              backgroundColor: "#FF6700",
              color: "#070709",
              fontWeight: 800,
              borderRadius: "8px",
              "&:hover": { backgroundColor: "#FF7D24" },
            }}
          >
            Retry
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/staff/products")}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.16)",
              color: "#F4F4F5",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            Back to Products
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <ProductForm mode={mode} productId={id} initialData={productData} />
    </Box>
  );
};

export default ProductFormPage;
