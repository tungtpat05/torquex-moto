import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import CategoryIcon from "@mui/icons-material/Category";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AddIcon from "@mui/icons-material/Add";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RefreshIcon from "@mui/icons-material/Refresh";

import StaffBreadcrumbs from "../../components/staff/common/StaffBreadcrumbs";
import StatusChip from "../../components/staff/common/StatusChip";
import MetricCard from "../../components/staff/dashboard/MetricCard";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useBrands } from "../../hooks/useBrands";

const LOW_STOCK_THRESHOLD = 3;

const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();
  const {
    brands,
    loading: brandsLoading,
    error: brandsError,
    refetch: refetchBrands,
  } = useBrands();

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

  const handleRetry = () => {
    void Promise.all([refetchProducts(), refetchCategories(), refetchBrands()]);
  };

  if (loading) {
    return (
      <Box>
        <StaffBreadcrumbs items={[{ label: "Staff" }, { label: "Dashboard" }]} />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 320 }}>
          <CircularProgress sx={{ color: "#FF6700" }} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <StaffBreadcrumbs items={[{ label: "Staff" }, { label: "Dashboard" }]} />
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

  const brandWord = summary.activeBrandsCount === 1 ? "brand" : "brands";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <StaffBreadcrumbs items={[{ label: "Staff" }, { label: "Dashboard" }]} />

      {/* Live Catalog & Inventory Metrics */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Active KTM Models"
            value={String(summary.activeProductsCount)}
            diff={`${summary.totalProductsCount} catalogued`}
            tone={summary.activeProductsCount > 0 ? "positive" : "neutral"}
            icon={<TwoWheelerIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Categories"
            value={String(summary.activeCategoriesCount)}
            diff={`${summary.totalCategoriesCount} total · ${summary.activeBrandsCount} ${brandWord}`}
            tone="neutral"
            icon={<CategoryIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Total Unit Stock"
            value={summary.totalStock.toLocaleString()}
            diff={`Across ${summary.totalVariantsCount} SKU variants`}
            tone={summary.totalStock > 0 ? "positive" : "warning"}
            icon={<Inventory2Icon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Low / Out of Stock"
            value={String(summary.lowStockVariants.length)}
            diff={`${summary.outOfStockCount} out of stock`}
            tone={
              summary.outOfStockCount > 0
                ? "danger"
                : summary.lowStockVariants.length > 0
                  ? "warning"
                  : "positive"
            }
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
              p: { xs: 2, md: 3 },
              borderRadius: "16px",
              backgroundColor: "rgba(15, 15, 20, 0.92)",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              borderTop: "1px solid rgba(255, 255, 255, 0.22)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1.5,
                mb: 2.5,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    color: "#F4F4F5",
                    fontSize: "1.05rem",
                  }}
                >
                  Fleet Stock Summary
                </Typography>
                <Typography variant="caption" sx={{ color: "#A1A1AA" }}>
                  Live unit counts aggregated from active motorcycle variants
                </Typography>
              </Box>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/staff/products/add")}
                sx={{
                  backgroundColor: "#FF6700",
                  color: "#070709",
                  fontWeight: 800,
                  borderRadius: "8px",
                  px: 2,
                  py: 0.75,
                  "&:hover": { backgroundColor: "#FF7D24" },
                }}
              >
                Add Model
              </Button>
            </Box>

            {products.length === 0 ? (
              <Box
                sx={{
                  py: 5,
                  px: 2,
                  textAlign: "center",
                  borderRadius: "12px",
                  backgroundColor: "#16161D",
                  border: "1px dashed rgba(255, 255, 255, 0.14)",
                }}
              >
                <Typography variant="body2" sx={{ color: "#A1A1AA", mb: 1.5 }}>
                  No motorcycle models catalogued yet.
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/staff/products/add")}
                  sx={{
                    borderColor: "#FF6700",
                    color: "#FF6700",
                    borderRadius: "8px",
                    fontWeight: 700,
                  }}
                >
                  Add First Model
                </Button>
              </Box>
            ) : (
              <TableContainer sx={{ maxHeight: 420, overflow: "auto" }}>
                <Table size="small" stickyHeader sx={{ minWidth: 540 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        "& th": {
                          backgroundColor: "#0F0F14",
                          color: "#A1A1AA",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.10)",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        },
                      }}
                    >
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
                          sx={{
                            "& td": {
                              borderColor: "rgba(255, 255, 255, 0.06)",
                              color: "#F4F4F5",
                            },
                          }}
                        >
                          <TableCell sx={{ fontWeight: 600 }}>{product.productName}</TableCell>
                          <TableCell sx={{ color: "#A1A1AA" }}>
                            {product.category?.categoryName || "—"}
                          </TableCell>
                          <TableCell
                            align="right"
                            className="tabular-nums"
                            sx={{ fontFamily: "var(--font-mono)" }}
                          >
                            {variants.length}
                          </TableCell>
                          <TableCell
                            align="right"
                            className="tabular-nums"
                            sx={{
                              fontFamily: "var(--font-mono)",
                              fontWeight: 700,
                              color: stockSum > 0 ? "#F4F4F5" : "#FCA5A5",
                            }}
                          >
                            {stockSum}
                          </TableCell>
                          <TableCell align="right">
                            <StatusChip status={product.isActive ? "Active" : "Inactive"} />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              size="small"
                              aria-label={`Edit ${product.productName}`}
                              endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
                              onClick={() => navigate(`/staff/products/edit/${product.id}`)}
                              sx={{
                                color: "#FF6700",
                                fontWeight: 700,
                                borderRadius: "8px",
                                "&:hover": { backgroundColor: "rgba(255, 103, 0, 0.10)" },
                              }}
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
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: "16px",
                backgroundColor: "rgba(15, 15, 20, 0.92)",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                borderTop: "1px solid rgba(255, 255, 255, 0.22)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  color: "#F4F4F5",
                  fontSize: "1.05rem",
                  mb: 0.5,
                }}
              >
                Low-Stock Watchlist
              </Typography>
              <Typography variant="caption" sx={{ color: "#A1A1AA", display: "block", mb: 2 }}>
                Variants with {LOW_STOCK_THRESHOLD} or fewer units remaining (click to update stock)
              </Typography>

              {summary.lowStockVariants.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#4ADE80", fontWeight: 600 }}>
                  All active variants are stocked above {LOW_STOCK_THRESHOLD} units.
                </Typography>
              ) : (
                <Stack spacing={1.25} sx={{ maxHeight: 340, overflowY: "auto", pr: 0.5 }}>
                  {summary.lowStockVariants.map((variant) => (
                    <ButtonBase
                      key={variant.id}
                      onClick={() => navigate(`/staff/products/edit/${variant.productId}`)}
                      aria-label={`Edit ${variant.productName} (${variant.sku})`}
                      sx={{
                        width: "100%",
                        p: 1.5,
                        borderRadius: "10px",
                        backgroundColor: "#16161D",
                        border: "1px solid rgba(255, 255, 255, 0.10)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1.5,
                        textAlign: "left",
                        transition: "border-color 0.15s ease, background-color 0.15s ease",
                        "&:hover": {
                          borderColor: "#FF6700",
                          backgroundColor: "rgba(255, 103, 0, 0.06)",
                        },
                        "&:focus-visible": {
                          outline: "2px solid #FF6700",
                          outlineOffset: "2px",
                        },
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#F4F4F5" }} noWrap>
                          {variant.productName}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#A1A1AA",
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.72rem",
                          }}
                        >
                          {variant.sku} · {variant.color?.colorName}
                        </Typography>
                      </Box>
                      <Chip
                        size="small"
                        className="tabular-nums"
                        label={`${variant.stockQuantity} left`}
                        sx={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          borderRadius: "100px",
                          flexShrink: 0,
                          backgroundColor:
                            variant.stockQuantity === 0
                              ? "rgba(239, 68, 68, 0.14)"
                              : "rgba(245, 158, 11, 0.14)",
                          color: variant.stockQuantity === 0 ? "#FCA5A5" : "#FBBF24",
                          border: `1px solid ${variant.stockQuantity === 0
                            ? "rgba(239, 68, 68, 0.28)"
                            : "rgba(245, 158, 11, 0.28)"
                            }`,
                        }}
                      />
                    </ButtonBase>
                  ))}
                </Stack>
              )}
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: "16px",
                backgroundColor: "rgba(15, 15, 20, 0.92)",
                border: "1px solid rgba(255, 255, 255, 0.10)",
                borderTop: "1px solid rgba(255, 255, 255, 0.22)",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  color: "#FF6700",
                  letterSpacing: "0.08em",
                  mb: 0.5,
                }}
              >
                ORDER TELEMETRY // STANDBY
              </Typography>
              <Typography variant="body2" sx={{ color: "#A1A1AA", fontSize: "0.84rem" }}>
                Order metrics and sales telemetry will populate here once checkout and order fulfillment are enabled.
              </Typography>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
