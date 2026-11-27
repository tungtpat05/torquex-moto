import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Grid,
  Snackbar,
  Switch,
  TextField,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SectionCard from "../common/SectionCard";
import StaffBreadcrumbs from "../common/StaffBreadcrumbs";
import ConfirmDialog from "../common/ConfirmDialog";
import MediaPreviewStudio from "../common/MediaPreviewStudio";
import SpecDefinitionManager from "./SpecDefinitionManager";
import { Category } from "../../../types/category";
import { ApiErrorResponse } from "../../../types/apiError";
import { createCategory, updateCategory } from "../../../services/categoryService";
import { uploadImage } from "../../../services/imageService";
import { categorySchema, CategoryFormValues } from "../../../schemas/categorySchema";
import { applyServerValidationErrors, slugifyText } from "../../../schemas/common";

interface CategoryFormProps {
  mode: "add" | "edit";
  categoryId?: string;
  initialData?: Category | null;
}

const CategoryForm = ({ mode, categoryId, initialData }: CategoryFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(mode === "edit");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(
    (location.state as { toast?: string } | null)?.toast || null
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { isSubmitting, isSubmitted, isDirty },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    mode: "onTouched",
    defaultValues: {
      categoryName: "",
      slug: "",
      categoryImage: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        categoryName: initialData.categoryName || "",
        slug: initialData.slug || "",
        categoryImage: initialData.categoryImage || "",
        description: initialData.description || "",
        isActive: initialData.isActive !== false,
      });
      setIsSlugManuallyEdited(true);
    }
  }, [mode, initialData, reset]);

  const categoryName = watch("categoryName");
  const categoryImage = watch("categoryImage");

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      const response = await uploadImage(file);
      setValue("categoryImage", response.url, { shouldValidate: true, shouldDirty: true });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setUploadError(
        axiosErr?.response?.data?.message ||
        axiosErr?.message ||
        "Failed to upload image. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleClearImage = () => {
    setValue("categoryImage", "", { shouldValidate: true, shouldDirty: true });
    setUploadError(null);
  };

  const handleAttemptLeave = () => {
    if (isDirty && !isSubmitting) {
      setConfirmLeaveOpen(true);
      return;
    }
    navigate("/staff/categories");
  };

  const onSave = async (values: CategoryFormValues) => {
    setSubmitError(null);

    const payload = {
      categoryName: values.categoryName.trim(),
      slug: values.slug.trim(),
      categoryImage: values.categoryImage.trim(),
      description: values.description?.trim() || "",
      isActive: values.isActive,
    };

    try {
      const message =
        mode === "add"
          ? "Category created successfully."
          : "Category changes saved successfully.";

      if (mode === "add") {
        const created = await createCategory(payload);
        navigate(`/staff/categories/edit/${created.id}`, { state: { toast: message } });
      } else {
        const targetCategoryId = Number(categoryId);
        await updateCategory(targetCategoryId, payload);
        reset(values);
        setToastMessage(message);
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: ApiErrorResponse }; message?: string };
      const apiData = axiosErr?.response?.data;
      if (apiData && typeof apiData === "object") {
        applyServerValidationErrors(apiData.details, setError);
        setSubmitError(apiData.message || "Failed to commit category changes. Please try again.");
      } else {
        setSubmitError(axiosErr?.message || "Failed to commit category changes. Please try again.");
      }
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSave)} sx={{ width: "100%" }}>
      <StaffBreadcrumbs
        items={[
          { label: "Categories", onClick: handleAttemptLeave },
          {
            label:
              mode === "add"
                ? "Add New Category"
                : `Edit Category : ${initialData?.categoryName || ""}`,
          },
        ]}
      />

      {submitError && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.10)",
            color: "#FCA5A5",
            border: "1px solid rgba(239, 68, 68, 0.28)",
          }}
        >
          {submitError}
        </Alert>
      )}

      <Grid container spacing={3.5}>
        <Grid size={{ xs: 12, lg: 8.5 }} sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
          <SectionCard title="Category Details">
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="categoryName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      label="CATEGORY NAME"
                      placeholder="e.g. Naked, Supersport, Adventure"
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val);
                        if (!isSlugManuallyEdited) {
                          setValue("slug", slugifyText(val), { shouldValidate: isSubmitted });
                        }
                      }}
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                      disabled={isSubmitting}
                      sx={{
                        "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
                        "& input": { fontSize: "0.95rem" },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="slug"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      label="SLUG"
                      placeholder="e.g. naked"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setIsSlugManuallyEdited(true);
                      }}
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message || "Used in URL configuration"}
                      disabled={isSubmitting}
                      sx={{
                        "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
                        "& input": { fontSize: "0.95rem" },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      multiline
                      rows={4}
                      fullWidth
                      label="CATEGORY DESCRIPTION"
                      placeholder="Provide details about the models in this KTM division..."
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                      disabled={isSubmitting}
                      sx={{
                        "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
                        "& .MuiInputBase-root": { fontSize: "0.95rem" },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </SectionCard>

          <SectionCard title="Image Preview">
            <MediaPreviewStudio
              imageUrl={categoryImage}
              alt={categoryName || "Category image preview"}
              fallbackText={categoryName ? categoryName.charAt(0).toUpperCase() : "?"}
              uploading={uploading}
              uploadError={uploadError}
              disabled={isSubmitting}
              uploadLabel="Upload Category Image"
              clearLabel="Clear Image"
              specHint="PNG, JPG, WEBP • Landscape studio shot recommended"
              onUploadFile={handleImageUpload}
              onClear={handleClearImage}
              urlInput={
                <Controller
                  name="categoryImage"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      label="CATEGORY IMAGE URL"
                      placeholder="https://... or /images/models/naked.jpg"
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                      disabled={isSubmitting}
                      sx={{
                        "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
                        "& input": { fontSize: "0.95rem", color: "#F4F4F5" },
                      }}
                    />
                  )}
                />
              }
            />
          </SectionCard>

          <SpecDefinitionManager categoryId={categoryId ? Number(categoryId) : undefined} />
        </Grid>

        <Grid size={{ xs: 12, lg: 3.5 }} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <SectionCard title="Status & Visibility">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(field.value)}
                        onChange={(e) => field.onChange(e.target.checked)}
                        disabled={isSubmitting}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#FF6700",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#FF6700",
                          },
                        }}
                      />
                    }
                    label="Active Status"
                    labelPlacement="start"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mx: 0,
                      color: "#F4F4F5",
                      "& .MuiTypography-root": { fontSize: "0.9rem", fontWeight: 600 },
                    }}
                  />
                )}
              />
            </Box>
          </SectionCard>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting || uploading}
              sx={{
                py: 1.25,
                backgroundColor: "#FF6700",
                color: "#070709",
                fontWeight: 800,
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#FF7D24",
                },
              }}
            >
              {isSubmitting ? "Saving..." : mode === "add" ? "Publish Category" : "Save Changes"}
            </Button>

            <Button
              fullWidth
              disabled={isSubmitting}
              onClick={handleAttemptLeave}
              sx={{
                py: 1.25,
                color: "#A1A1AA",
                fontWeight: 600,
                borderRadius: "8px",
                "&:hover": {
                  color: "#EF4444",
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirmLeaveOpen}
        title="Discard unsaved changes?"
        description="You have modified fields on this category. Leaving now will discard your unsaved edits."
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
        tone="warning"
        onConfirm={() => {
          setConfirmLeaveOpen(false);
          navigate("/staff/categories");
        }}
        onCancel={() => setConfirmLeaveOpen(false)}
      />

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

export default CategoryForm;
