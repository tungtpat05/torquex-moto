import { useMemo, useState } from "react";
import { Alert, Box, Button, CircularProgress, Snackbar } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useLocation, useNavigate } from "react-router-dom";
import StaffBreadcrumbs from "../../components/staff/common/StaffBreadcrumbs";
import SectionCard from "../../components/staff/common/SectionCard";
import BrandFilterBar from "../../components/staff/brand/BrandFilterBar";
import BrandsTable from "../../components/staff/brand/BrandsTable";
import { useBrands } from "../../hooks/useBrands";

const BrandsPage = () => {
  const { brands, loading, error, refetch } = useBrands();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(
    (location.state as { toast?: string } | null)?.toast || null
  );

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const matchesSearch = (brand.brandName || "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        status === "" ||
        (status === "active" && brand.isActive) ||
        (status === "inactive" && !brand.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [brands, search, status]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
    setPage(1);
  };

  if (loading) {
    return (
      <Box>
        <StaffBreadcrumbs items={[{ label: "Staff", to: "/staff/dashboard" }, { label: "Brands" }]} />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 360 }}>
          <CircularProgress sx={{ color: "#FF6700" }} />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <StaffBreadcrumbs items={[{ label: "Staff", to: "/staff/dashboard" }, { label: "Brands" }]} />
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
              onClick={() => void refetch()}
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
      <StaffBreadcrumbs items={[{ label: "Staff", to: "/staff/dashboard" }, { label: "Brands" }]} />
      <BrandFilterBar
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        onReset={handleClearFilters}
        onAddClick={() => navigate("/staff/brands/add")}
      />
      <SectionCard>
        <BrandsTable
          brands={filteredBrands}
          page={page}
          onPageChange={setPage}
          hasActiveFilters={Boolean(search || status)}
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

export default BrandsPage;
