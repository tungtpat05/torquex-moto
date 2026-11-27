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
import { Brand } from "../../../types/brand";
import { ApiErrorResponse } from "../../../types/apiError";
import { createBrand, updateBrand } from "../../../services/brandService";
import { uploadImage } from "../../../services/imageService";
import { brandSchema, BrandFormValues } from "../../../schemas/brandSchema";
import { applyServerValidationErrors } from "../../../schemas/common";

interface BrandFormProps {
  mode: "add" | "edit";
  brandId?: string;
  initialData?: Brand | null;
}

const BrandForm = ({ mode, brandId, initialData }: BrandFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();

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
    formState: { isSubmitting, isDirty },
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

  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      const response = await uploadImage(file);
      setValue("logoUrl", response.url, { shouldValidate: true, shouldDirty: true });
      setValue("logoPublicId", response.publicId || "", { shouldDirty: true });
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

  const handleClearLogo = () => {
    setValue("logoUrl", "", { shouldValidate: true, shouldDirty: true });
    setValue("logoPublicId", "", { shouldDirty: true });
    setUploadError(null);
  };

  const handleAttemptLeave = () => {
    if (isDirty && !isSubmitting) {
      setConfirmLeaveOpen(true);
      return;
    }
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
      const message =
        mode === "add" ? "Brand created successfully." : "Brand changes saved successfully.";

      if (mode === "add") {
        const created = await createBrand(payload);
        navigate(`/staff/brands/edit/${created.id}`, { state: { toast: message } });
      } else {
        const targetBrandId = Number(brandId);
        await updateBrand(targetBrandId, payload);
        reset(values);
        setToastMessage(message);
      }
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
      <StaffBreadcrumbs
        items={[
          { label: "Brands", onClick: handleAttemptLeave },
          {
            label:
              mode === "add" ? "Add New Brand" : `Edit Brand : ${initialData?.brandName || ""}`,
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
                      label="BRAND DESCRIPTION"
                      placeholder="Provide a brief summary of the brand engineering DNA and specialization..."
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

          <SectionCard title="Logo Preview">
            <MediaPreviewStudio
              imageUrl={logoUrl}
              alt={brandName || "Brand logo preview"}
              fallbackText={brandName ? brandName.charAt(0).toUpperCase() : "?"}
              uploading={uploading}
              uploadError={uploadError}
              disabled={isSubmitting}
              uploadLabel="Upload Logo Image"
              clearLabel="Clear Logo"
              specHint="PNG, SVG, WEBP • Transparent background"
              onUploadFile={handleLogoUpload}
              onClear={handleClearLogo}
              urlInput={
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
                        "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
                        "& input": { fontSize: "0.95rem", color: "#F4F4F5" },
                      }}
                    />
                  )}
                />
              }
            />
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
              {isSubmitting ? "Saving..." : mode === "add" ? "Publish Brand" : "Save Changes"}
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
        description="You have modified fields on this brand. Leaving now will discard your unsaved edits."
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
        tone="warning"
        onConfirm={() => {
          setConfirmLeaveOpen(false);
          navigate("/staff/brands");
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

export default BrandForm;
