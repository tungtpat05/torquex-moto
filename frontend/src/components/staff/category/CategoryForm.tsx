import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Switch, FormControlLabel, TextField, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SectionCard from "../common/SectionCard";
import SpecDefinitionManager from "./SpecDefinitionManager";
import { Category } from "../../../types/category";
import { ApiErrorResponse } from "../../../types/apiError";
import { createCategory, updateCategory, uploadCategoryImage } from "../../../services/categoryService";
import { categorySchema, CategoryFormValues } from "../../../schemas/categorySchema";
import { applyServerValidationErrors, slugifyText } from "../../../schemas/common";

interface CategoryFormProps {
  mode: "add" | "edit";
  categoryId?: string;
  initialData?: Category | null;
}

const CategoryForm = ({ mode, categoryId, initialData }: CategoryFormProps) => {
  const navigate = useNavigate();

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(mode === "edit");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError,
    formState: { isSubmitting, isSubmitted },
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const response = await uploadCategoryImage(file);
      setValue("categoryImage", response.url, { shouldValidate: true, shouldDirty: true });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setUploadError(
        axiosErr?.response?.data?.message || axiosErr?.message || "Failed to upload image. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
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
      let targetCategoryId: number;
      if (mode === "add") {
        const created = await createCategory(payload);
        targetCategoryId = created.id;
      } else {
        targetCategoryId = Number(categoryId);
        await updateCategory(targetCategoryId, payload);
      }
      navigate(`/staff/categories/edit/${targetCategoryId}`);
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
      {/* Breadcrumbs */}
      <Box sx={{ color: "#71717a", fontSize: "0.85rem", fontWeight: 550, mb: 3 }}>
        <span style={{ cursor: "pointer" }} onClick={handleCancel}>Categories</span>
        {" > "}
        <span style={{ color: "#ffffff" }}>
          {mode === "add" ? "Add New Category" : `Edit Category : ${initialData?.categoryName || ""}`}
        </span>
      </Box>

      {submitError && (
        <Box sx={{ mb: 3, p: 2, borderRadius: 2, backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
            {submitError}
          </Typography>
        </Box>
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
                        "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
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
                        "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
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
                        "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
                        "& .MuiInputBase-root": { fontSize: "0.95rem" },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </SectionCard>

          <SectionCard title="Image Preview">
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "center", sm: "flex-start" }, gap: 3, py: 1 }}>
              <Avatar
                variant="rounded"
                src={categoryImage?.trim() || undefined}
                sx={{
                  width: 180,
                  height: 120,
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  backgroundColor: "#27272a",
                  fontSize: "3rem",
                  fontWeight: 600,
                  color: "#ff6b35",
                }}
              >
                {!categoryImage?.trim() && (categoryName ? categoryName.charAt(0).toUpperCase() : "?")}
              </Avatar>
              <Box sx={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
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
                        "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
                        "& input": { fontSize: "0.95rem", color: "#e4e4e7" },
                      }}
                    />
                  )}
                />
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={isSubmitting || uploading}
                    sx={{
                      borderColor: "#71717a",
                      color: "#ffffff",
                      fontWeight: 600,
                      "&:hover": {
                        borderColor: "#ff6b35",
                        backgroundColor: "rgba(255, 107, 53, 0.05)",
                      },
                    }}
                  >
                    {uploading ? "Uploading..." : "Upload Category Image"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Button>
                  {uploadError && (
                    <Typography color="error" variant="caption" sx={{ fontWeight: 550 }}>
                      {uploadError}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
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
                            color: "#ff6b35",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                            backgroundColor: "#ff6b35",
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
                      color: "#e4e4e7",
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
              disabled={isSubmitting}
              sx={{
                py: 1.25,
                backgroundColor: "#ff6b35",
                color: "#ffffff",
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(255, 107, 53, 0.15)",
                "&:hover": {
                  backgroundColor: "#e05a2b",
                },
              }}
            >
              {isSubmitting ? "Saving..." : mode === "add" ? "Publish Category" : "Save Changes"}
            </Button>

            <Button
              fullWidth
              disabled={isSubmitting}
              onClick={handleCancel}
              sx={{
                py: 1.25,
                color: "#71717a",
                fontWeight: 600,
                borderRadius: 2,
                "&:hover": {
                  color: "#ef4444",
                  backgroundColor: "rgba(239, 68, 68, 0.05)",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoryForm;
