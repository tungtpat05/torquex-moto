import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BrandForm from "../../components/staff/brand/BrandForm";
import StaffBreadcrumbs from "../../components/staff/common/StaffBreadcrumbs";
import { getBrandById } from "../../services/brandService";
import { Brand } from "../../types/brand";

interface BrandFormPageProps {
  mode?: "add" | "edit";
}

const BrandFormPage = ({ mode: propMode }: BrandFormPageProps) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const isEditPath = location.pathname.includes("/edit") || id !== undefined;
  const mode = propMode || (isEditPath ? "edit" : "add");

  const [loading, setLoading] = useState(false);
  const [brandData, setBrandData] = useState<Brand | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchBrand = useCallback(async () => {
    if (mode !== "edit" || !id) return;
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getBrandById(Number(id));
      setBrandData(data);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      console.error("Failed to load brand data:", err);
      setLoadError(errorObj?.message || "Failed to load brand data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [mode, id]);

  useEffect(() => {
    void fetchBrand();
  }, [fetchBrand]);

  if (loading) {
    return (
      <Box>
        <StaffBreadcrumbs
          items={[
            { label: "Brands", to: "/staff/brands" },
            { label: "Edit Brand" },
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
            Loading brand specifications...
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
            { label: "Brands", to: "/staff/brands" },
            { label: "Edit Brand" },
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
          {loadError} — Please verify the Backend API is running and brand ID {id} exists.
        </Alert>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => void fetchBrand()}
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
            onClick={() => navigate("/staff/brands")}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.16)",
              color: "#F4F4F5",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            Back to Brands
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <BrandForm mode={mode} brandId={id} initialData={brandData} />
    </Box>
  );
};

export default BrandFormPage;
