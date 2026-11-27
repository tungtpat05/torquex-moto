import React, { useState, useEffect } from "react";
import { Box, Grid, Button, Switch, FormControlLabel, TextField, Typography, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SectionCard from "../common/SectionCard";
import { Brand } from "../../../types/brand";
import { ApiErrorResponse } from "../../../types/apiError";
import { createBrand, updateBrand, uploadLogoImage } from "../../../services/brandService";
import { brandSchema, BrandFormValues } from "../../../schemas/brandSchema";
import { applyServerValidationErrors } from "../../../schemas/common";

interface BrandFormProps {
  mode: "add" | "edit";
  brandId?: string;
  initialData?: Brand | null;
}

const BrandForm = ({ mode, brandId, initialData }: BrandFormProps) => {
  const navigate = useNavigate();

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
    formState: { isSubmitting },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    mode: "onTouched",
    defaultValues: {
      brandName: "",
      logoUrl: "",
      logoPublicId: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        brandName: initialData.brandName || "",
        logoUrl: initialData.logoUrl || "",
        logoPublicId: initialData.logoPublicId || "",
        description: initialData.description || "",
        isActive: initialData.isActive !== false,
      });
    }
  }, [mode, initialData, reset]);

  const brandName = watch("brandName");
  const logoUrl = watch("logoUrl");

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      const response = await uploadLogoImage(file);
      setValue("logoUrl", response.url, { shouldValidate: true, shouldDirty: true });
      setValue("logoPublicId", response.publicId || "");
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
    navigate("/staff/brands");
  };

  const onSave = async (values: BrandFormValues) => {
    setSubmitError(null);

    const payload = {
      brandName: values.brandName.trim(),
      logoUrl: values.logoUrl.trim(),
      logoPublicId: values.logoPublicId?.trim() || undefined,
      description: values.description?.trim() || "",
      isActive: values.isActive,
    };

    try {
      let targetBrandId: number;
      if (mode === "add") {
        const created = await createBrand(payload);
        targetBrandId = created.id;
      } else {
        targetBrandId = Number(brandId);
        await updateBrand(targetBrandId, payload);
      }
      navigate(`/staff/brands/edit/${targetBrandId}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: ApiErrorResponse }; message?: string };
      const apiData = axiosErr?.response?.data;
      if (apiData && typeof apiData === "object") {
        applyServerValidationErrors(apiData.details, setError);
        setSubmitError(apiData.message || "Failed to commit brand changes. Please try again.");
      } else {
        setSubmitError(axiosErr?.message || "Failed to commit brand changes. Please try again.");
      }
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSave)} sx={{ width: "100%" }}>
      {/* Breadcrumbs */}
      <Box sx={{ color: "#71717a", fontSize: "0.85rem", fontWeight: 550, mb: 3 }}>
        <span style={{ cursor: "pointer" }} onClick={handleCancel}>Brands</span>
        {" > "}
        <span style={{ color: "#ffffff" }}>
          {mode === "add" ? "Add New Brand" : `Edit Brand : ${initialData?.brandName || ""}`}
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
          <SectionCard title="Brand Details">
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <Controller
                  name="brandName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      label="BRAND NAME"
                      placeholder="e.g. KTM"
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
                      label="BRAND DESCRIPTION"
                      placeholder="Provide a brief summary of the brand engineering DNA and specialization..."
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

          <SectionCard title="Logo Preview">
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "center", sm: "flex-start" }, gap: 3, py: 1 }}>
              <Avatar
                variant="rounded"
                src={logoUrl?.trim() || undefined}
                sx={{
                  width: 140,
                  height: 140,
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  backgroundColor: "#27272a",
                  fontSize: "2.5rem",
                  fontWeight: 600,
                  color: "#ff6b35",
                }}
              >
                {!logoUrl?.trim() && (brandName ? brandName.charAt(0).toUpperCase() : "?")}
              </Avatar>
              <Box sx={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
                <Controller
                  name="logoUrl"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      label="LOGO IMAGE URL"
                      placeholder="https://... or /images/common/ktm-logo.png"
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
                    {uploading ? "Uploading..." : "Upload Logo Image"}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleLogoUpload}
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
              {isSubmitting ? "Saving..." : mode === "add" ? "Publish Brand" : "Save Changes"}
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

export default BrandForm;
