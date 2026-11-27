import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import CategoryIcon from "@mui/icons-material/Category";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AddIcon from "@mui/icons-material/Add";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import MetricCard from "../../components/staff/dashboard/MetricCard";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";

const LOW_STOCK_THRESHOLD = 3;

const DashboardPage = () => {
  const navigate = useNavigate();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { brands, loading: brandsLoading, error: brandsError } = useBrands();

  const summary = useMemo(() => {
    const activeProducts = products.filter((p) => p.isActive !== false);
    const activeCategories = categories.filter((c) => c.isActive !== false);
    const activeBrands = brands.filter((b) => b.isActive !== false);

    const allVariants = products.flatMap((product) =>
      (product.variants || []).map((variant) => ({
        ...variant,
        productId: product.id,
        productName: product.productName,
      }))
    );

    const totalStock = allVariants.reduce((sum, v) => sum + (v.stockQuantity ?? 0), 0);
    const lowStockVariants = allVariants
      .filter((v) => v.isActive !== false && (v.stockQuantity ?? 0) <= LOW_STOCK_THRESHOLD)
      .sort((a, b) => (a.stockQuantity ?? 0) - (b.stockQuantity ?? 0));
    const outOfStockCount = lowStockVariants.filter((v) => (v.stockQuantity ?? 0) === 0).length;

    return {
      activeProductsCount: activeProducts.length,
      totalProductsCount: products.length,
      activeCategoriesCount: activeCategories.length,
      totalCategoriesCount: categories.length,
      activeBrandsCount: activeBrands.length,
      totalVariantsCount: allVariants.length,
      totalStock,
      lowStockVariants,
      outOfStockCount,
    };
  }, [products, categories, brands]);

  const loading = productsLoading || categoriesLoading || brandsLoading;
  const error = productsError || categoriesError || brandsError;

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 320 }}>
        <CircularProgress sx={{ color: "#ff6b35" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Live Catalog & Inventory Metrics */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Active KTM Models"
            value={String(summary.activeProductsCount)}
            diff={`${summary.totalProductsCount} catalogued`}
            isPositive={summary.activeProductsCount > 0}
            icon={<TwoWheelerIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Categories"
            value={String(summary.activeCategoriesCount)}
            diff={`${summary.totalCategoriesCount} total · ${summary.activeBrandsCount} brand`}
            isPositive={summary.activeCategoriesCount > 0}
            icon={<CategoryIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Total Unit Stock"
            value={summary.totalStock.toLocaleString()}
            diff={`Across ${summary.totalVariantsCount} SKU variants`}
            isPositive={summary.totalStock > 0}
            icon={<Inventory2Icon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Low / Out of Stock"
            value={String(summary.lowStockVariants.length)}
            diff={`${summary.outOfStockCount} out of stock`}
            isPositive={summary.lowStockVariants.length === 0}
            icon={<WarningAmberIcon />}
          />
        </Grid>
      </Grid>

      {/* Catalog Inventory Table & Low-Stock Watchlist */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: "#141418",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#ffffff" }}>
                  Fleet Stock Summary
                </Typography>
                <Typography variant="caption" sx={{ color: "#a1a1aa" }}>
                  Live unit counts aggregated from active motorcycle variants
                </Typography>
              </Box>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/staff/products/add")}
                sx={{
                  backgroundColor: "#ff6b35",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#e05a2b" },
                }}
              >
                Add Model
              </Button>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& th": { color: "#71717a", borderColor: "rgba(255,255,255,0.06)", fontWeight: 700 } }}>
                    <TableCell>Model</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Variants</TableCell>
                    <TableCell align="right">Stock</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => {
                    const variants = product.variants || [];
                    const stockSum = variants.reduce((sum, v) => sum + (v.stockQuantity ?? 0), 0);
                    return (
                      <TableRow
                        key={product.id}
                        hover
                        sx={{ "& td": { borderColor: "rgba(255,255,255,0.05)", color: "#e4e4e7" } }}
                      >
                        <TableCell sx={{ fontWeight: 600 }}>{product.productName}</TableCell>
                        <TableCell sx={{ color: "#a1a1aa" }}>{product.category?.categoryName || "—"}</TableCell>
                        <TableCell align="right">{variants.length}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: stockSum > 0 ? "#ffffff" : "#ef4444" }}>
                          {stockSum}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            size="small"
                            label={product.isActive ? "Active" : "Inactive"}
                            sx={{
                              height: 22,
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              backgroundColor: product.isActive ? "rgba(16, 185, 129, 0.14)" : "rgba(239, 68, 68, 0.14)",
                              color: product.isActive ? "#10b981" : "#ef4444",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                            onClick={() => navigate(`/staff/products/edit/${product.id}`)}
                            sx={{ color: "#ff6b35", textTransform: "none", fontWeight: 600 }}
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: "#141418",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#ffffff", mb: 0.5 }}>
                Low-Stock Watchlist
              </Typography>
              <Typography variant="caption" sx={{ color: "#a1a1aa", display: "block", mb: 2 }}>
                Variants with {LOW_STOCK_THRESHOLD} or fewer units remaining
              </Typography>

              {summary.lowStockVariants.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#10b981", fontWeight: 600 }}>
                  All active variants are stocked above {LOW_STOCK_THRESHOLD} units.
                </Typography>
              ) : (
                <Stack spacing={1.25}>
                  {summary.lowStockVariants.map((variant) => (
                    <Box
                      key={variant.id}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1.5,
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#ffffff" }} noWrap>
                          {variant.productName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#a1a1aa", fontFamily: "monospace" }}>
                          {variant.sku} · {variant.color?.colorName}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        label={`${variant.stockQuantity} left`}
                        sx={{
                          fontWeight: 700,
                          backgroundColor:
                            variant.stockQuantity === 0
                              ? "rgba(239, 68, 68, 0.16)"
                              : "rgba(245, 158, 11, 0.16)",
                          color: variant.stockQuantity === 0 ? "#ef4444" : "#f59e0b",
                        }}
                      />
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>

            <Alert
              severity="info"
              sx={{
                borderRadius: 3,
                backgroundColor: "rgba(59, 130, 246, 0.08)",
                color: "#bfdbfe",
                border: "1px solid rgba(59, 130, 246, 0.25)",
              }}
            >
              Order metrics and sales telemetry will populate here once checkout and order fulfillment are enabled.
            </Alert>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
