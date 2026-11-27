import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Snackbar } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import StaffBreadcrumbs from "../../components/staff/common/StaffBreadcrumbs";
import SectionCard from "../../components/staff/common/SectionCard";
import ProductFilterBar from "../../components/staff/product/ProductFilterBar";
import ProductsTable from "../../components/staff/product/ProductsTable";
import { useProducts } from "../../hooks/useProducts";
import { useBrands } from "../../hooks/useBrands";
import { useCategories } from "../../hooks/useCategories";

const ProductsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts();
  const {
    brands,
    loading: brandsLoading,
    error: brandsError,
    refetch: refetchBrands,
  } = useBrands();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(
    (location.state as { toast?: string } | null)?.toast || null
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productName = product.productName || "";
      const brandName = product.brand?.brandName || "";
      const categoryName = product.category?.categoryName || "";

      const matchSearch =
        productName.toLowerCase().includes(search.toLowerCase()) ||
        brandName.toLowerCase().includes(search.toLowerCase());

      const matchBrand = brand === "" || brandName === brand;
      const matchCategory = category === "" || categoryName === category;
      const matchStatus =
        status === "" ||
        (status === "active" && product.isActive) ||
        (status === "inactive" && !product.isActive);

      return matchSearch && matchBrand && matchCategory && matchStatus;
    });
  }, [products, search, brand, category, status]);

  const loading = productsLoading || brandsLoading || categoriesLoading;
  const error = productsError || brandsError || categoriesError;

  const handleRetry = () => {
    void Promise.all([refetchProducts(), refetchBrands(), refetchCategories()]);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleBrandChange = (val: string) => {
    setBrand(val);
    setPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setBrand("");
    setCategory("");
    setStatus("");
    setPage(1);
  };

  if (loading) {
    return (
      <Box>
        <StaffBreadcrumbs items={[{ label: "Staff", to: "/staff/dashboard" }, { label: "Products" }]} />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 360 }}>
          <CircularProgress sx={{ color: "#FF6700" }} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <StaffBreadcrumbs items={[{ label: "Staff", to: "/staff/dashboard" }, { label: "Products" }]} />
        <Alert
          severity="error"
          sx={{
            borderRadius: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.10)",
            color: "#FCA5A5",
            border: "1px solid rgba(239, 68, 68, 0.28)",
            alignItems: "center",
          }}
          action={
            <Button
              size="small"
              variant="contained"
              startIcon={<RefreshIcon fontSize="small" />}
              onClick={handleRetry}
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
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <StaffBreadcrumbs items={[{ label: "Staff", to: "/staff/dashboard" }, { label: "Products" }]} />
      <ProductFilterBar
        search={search}
        onSearchChange={handleSearchChange}
        brand={brand}
        onBrandChange={handleBrandChange}
        category={category}
        onCategoryChange={handleCategoryChange}
        status={status}
        onStatusChange={handleStatusChange}
        brands={brands}
        categories={categories}
        onReset={handleClearFilters}
        onAddClick={() => navigate("/staff/products/add")}
      />

      <SectionCard>
        <ProductsTable
          products={filteredProducts}
          page={page}
          onPageChange={setPage}
          hasActiveFilters={Boolean(search || brand || category || status)}
          onClearFilters={handleClearFilters}
        />
      </SectionCard>

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          onClose={() => setToastMessage(null)}
          sx={{ borderRadius: "10px", fontWeight: 600 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductsPage;
