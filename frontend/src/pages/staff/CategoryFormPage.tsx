import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryForm from "../../components/staff/category/CategoryForm";
import StaffBreadcrumbs from "../../components/staff/common/StaffBreadcrumbs";
import { getCategoryById } from "../../services/categoryService";
import { Category } from "../../types/category";

interface CategoryFormPageProps {
  mode?: "add" | "edit";
}

const CategoryFormPage = ({ mode: propMode }: CategoryFormPageProps) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const isEditPath = location.pathname.includes("/edit") || id !== undefined;
  const mode = propMode || (isEditPath ? "edit" : "add");

  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    if (mode !== "edit" || !id) return;
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getCategoryById(Number(id));
      setCategoryData(data);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      console.error("Failed to load category data:", err);
      setLoadError(errorObj?.message || "Failed to load category data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [mode, id]);

  useEffect(() => {
    void fetchCategory();
  }, [fetchCategory]);

  if (loading) {
    return (
      <Box>
        <StaffBreadcrumbs
          items={[
            { label: "Categories", to: "/staff/categories" },
            { label: "Edit Category" },
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
            Loading category specifications...
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
            { label: "Categories", to: "/staff/categories" },
            { label: "Edit Category" },
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
          {loadError} — Please verify the Backend API is running and category ID {id} exists.
        </Alert>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => void fetchCategory()}
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
            onClick={() => navigate("/staff/categories")}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.16)",
              color: "#F4F4F5",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            Back to Categories
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <CategoryForm mode={mode} categoryId={id} initialData={categoryData} />
    </Box>
  );
};

export default CategoryFormPage;
