import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Box,
  Typography,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  FormHelperText,
  Avatar,
  Button,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import SectionCard from "../common/SectionCard";
import { Brand } from "../../../types/brand";
import { Category } from "../../../types/category";
import { SpecDefinition, ProductSpecification } from "../../../types/specDefinition";
import { getSpecDefinitionsByCategory } from "../../../services/specDefinitionService";
import { getProductSpecifications, uploadProductImage } from "../../../services/productService";
import { ProductFormValues } from "../../../schemas/productSchema";
import { slugifyText } from "../../../schemas/common";

export interface SpecValueState {
  value: string;
  valueNumber: string;
  optionId: string;
  specId?: number;
}

interface BasicInfoSectionProps {
  control: Control<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  isSubmitted: boolean;
  mode: "add" | "edit";
  brands: Brand[];
  categories: Category[];
  onSpecDefsLoaded?: (defs: SpecDefinition[]) => void;
  productId?: number;
  disabled?: boolean;
}

const BasicInfoSection = ({
  control,
  watch,
  setValue,
  errors,
  isSubmitted,
  mode,
  brands,
  categories,
  onSpecDefsLoaded,
  productId,
  disabled,
}: BasicInfoSectionProps) => {
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(mode === "edit");

  const [specDefs, setSpecDefs] = useState<SpecDefinition[]>([]);
  const [loadingSpecs, setLoadingSpecs] = useState(false);
  const [specsError, setSpecsError] = useState<string | null>(null);
  const isSubmittedRef = useRef(isSubmitted);
  isSubmittedRef.current = isSubmitted;

  const selectedCategoryId = watch("categoryId");
  const thumbnailVal = watch("thumbnail") || "";
  const productNameVal = watch("productName") || "";
  const specsMap = watch("specs") || {};

  const categoryId = selectedCategoryId ? Number(selectedCategoryId) : undefined;

  useEffect(() => {
    setIsSlugManuallyEdited(mode === "edit");
  }, [mode, productId]);

  useEffect(() => {
    const loadData = async () => {
      if (!categoryId) {
        setSpecDefs([]);
        onSpecDefsLoaded?.([]);
        setValue("specs", {});
        return;
      }
      setLoadingSpecs(true);
      setSpecsError(null);
      try {
        const defs = await getSpecDefinitionsByCategory(categoryId, true);
        setSpecDefs(defs);
        onSpecDefsLoaded?.(defs);

        let currentSpecs: ProductSpecification[] = [];
        if (productId) {
          currentSpecs = await getProductSpecifications(productId);
        }

        const initialMap: Record<string, SpecValueState> = {};
        defs.forEach((def) => {
          const found = currentSpecs.find((s) => s.specDefinitionId === def.id);
          initialMap[String(def.id)] = {
            value: found?.value || "",
            valueNumber:
              found?.valueNumber !== undefined && found?.valueNumber !== null
                ? String(found.valueNumber)
                : "",
            optionId: found?.optionId ? String(found.optionId) : "",
            specId: found?.id,
          };
        });

        setValue("specs", initialMap, { shouldValidate: isSubmittedRef.current });
      } catch {
        setSpecsError("Failed to load category specification fields.");
      } finally {
        setLoadingSpecs(false);
      }
    };

    void loadData();
  }, [categoryId, productId, onSpecDefsLoaded, setValue]);

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    setThumbnailError(null);

    try {
      const response = await uploadProductImage(file);
      setValue("thumbnail", response.url, { shouldValidate: true, shouldDirty: true });
      setValue("thumbnailPublicId", response.publicId || "");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setThumbnailError(
        axiosErr?.response?.data?.message || axiosErr?.message || "Failed to upload thumbnail."
      );
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleSpecFieldChange = (
    specDefId: number,
    field: "value" | "valueNumber" | "optionId",
    val: string
  ) => {
    const key = String(specDefId);
    const existing = specsMap[key] || { value: "", valueNumber: "", optionId: "" };
    setValue(
      "specs",
      {
        ...specsMap,
        [key]: {
          ...existing,
          [field]: val,
        },
      },
      { shouldValidate: isSubmitted, shouldDirty: true }
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
      {/* 1. PRODUCT THUMBNAIL CARD */}
      <SectionCard title="Product Thumbnail">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "center", sm: "flex-start" },
            gap: 3,
            py: 1,
          }}
        >
          <Avatar
            variant="rounded"
            src={thumbnailVal.trim() || undefined}
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
            {!thumbnailVal.trim() && (productNameVal ? productNameVal.charAt(0).toUpperCase() : "?")}
          </Avatar>
          <Box sx={{ flex: 1, width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
            <Controller
              name="thumbnail"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="THUMBNAIL IMAGE URL"
                  placeholder="https://... or /images/models/ktm-1390-super-duke-r-evo.png"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  disabled={disabled}
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
                disabled={disabled || uploadingThumbnail}
                startIcon={uploadingThumbnail ? <CircularProgress size={18} color="inherit" /> : <CloudUpload />}
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
                {uploadingThumbnail ? "Uploading..." : "Upload Thumbnail"}
                <input type="file" hidden accept="image/*" onChange={handleThumbnailUpload} />
              </Button>
              {thumbnailError && (
                <Typography color="error" variant="caption" sx={{ fontWeight: 550 }}>
                  {thumbnailError}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </SectionCard>

      {/* 2. PRODUCT IDENTITY CARD */}
      <SectionCard title="Product Identity">
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="productName"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="PRODUCT NAME"
                  placeholder="e.g. KTM 1390 Super Duke R Evo"
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                    if (!isSlugManuallyEdited) {
                      setValue("slug", slugifyText(val), { shouldValidate: isSubmitted });
                    }
                  }}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  disabled={disabled}
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
              name="slug"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="SLUG"
                  placeholder="e.g. ktm-1390-super-duke-r-evo"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setIsSlugManuallyEdited(true);
                  }}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  disabled={disabled}
                  sx={{
                    "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="brandId"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  required
                  fullWidth
                  label="BRAND"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  disabled={disabled}
                  sx={{
                    "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
                  }}
                >
                  {brands.map((b) => (
                    <MenuItem key={b.id} value={String(b.id)}>
                      {b.brandName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  required
                  fullWidth
                  label="CATEGORY"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  disabled={disabled}
                  sx={{
                    "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
                  }}
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={String(c.id)}>
                      {c.categoryName}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Controller
              name="summary"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  multiline
                  rows={2}
                  fullWidth
                  label="PRODUCT SUMMARY"
                  placeholder="Provide a brief summary of the motorcycle (10–500 characters)..."
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  disabled={disabled}
                  sx={{
                    "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* 3. PRICING DETAILS CARD */}
      <SectionCard title="Pricing Details">
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="basePrice"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  type="number"
                  label="BASE PRICE"
                  placeholder="e.g. 21499"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  disabled={disabled}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    },
                  }}
                  sx={{
                    "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="discountPrice"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="DISCOUNT PRICE"
                  placeholder="e.g. 20499 (optional)"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  disabled={disabled}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    },
                  }}
                  sx={{
                    "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* 4. DESCRIPTION CARD */}
      <SectionCard title="Description">
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              required
              multiline
              rows={5}
              fullWidth
              label="PRODUCT DESCRIPTION"
              placeholder="Describe key engineering features, chassis, suspension, and electronics (20–2000 characters)..."
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
              disabled={disabled}
              sx={{
                "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
                "& .MuiInputBase-root": { fontSize: "0.95rem" },
              }}
            />
          )}
        />
      </SectionCard>

      {/* 5. CATEGORY SPECIFICATIONS CARD */}
      <SectionCard title="Category Specifications">
        {!categoryId ? (
          <Alert severity="warning" sx={{ backgroundColor: "rgba(234, 179, 8, 0.1)", color: "#facc15" }}>
            Please select a category in <strong>Product Identity</strong> above to load specification fields.
          </Alert>
        ) : loadingSpecs ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress color="warning" />
          </Box>
        ) : specsError ? (
          <Alert severity="error">{specsError}</Alert>
        ) : specDefs.length === 0 ? (
          <Typography variant="body2" sx={{ color: "#71717a", fontStyle: "italic", py: 1 }}>
            No custom specification fields configured for this category yet. You can configure them in Category Management.
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Grid container spacing={2.5}>
              {specDefs.map((def) => {
                const curVal = specsMap[String(def.id)] || { value: "", valueNumber: "", optionId: "" };
                const specErr = errors.specs?.[String(def.id)]?.message;

                return (
                  <Grid key={def.id} size={{ xs: 12, sm: 6 }}>
                    {def.dataType === "select" ? (
                      <FormControl fullWidth size="small" error={Boolean(specErr)}>
                        <InputLabel sx={{ color: "#71717a", fontWeight: 600, fontSize: "0.85rem" }}>
                          {def.displayName.toUpperCase()}{def.isRequired ? " *" : ""}
                        </InputLabel>
                        <Select
                          value={curVal.optionId}
                          label={`${def.displayName.toUpperCase()}${def.isRequired ? " *" : ""}`}
                          onChange={(e) => handleSpecFieldChange(def.id, "optionId", e.target.value)}
                          disabled={disabled}
                          sx={{ color: "#ffffff", fontSize: "0.95rem" }}
                        >
                          <MenuItem value="">
                            <em>-- Select {def.displayName} --</em>
                          </MenuItem>
                          {def.options?.map((opt) => (
                            <MenuItem key={opt.id} value={String(opt.id)}>
                              {opt.optionValue}
                            </MenuItem>
                          ))}
                        </Select>
                        {specErr && <FormHelperText error>{specErr}</FormHelperText>}
                      </FormControl>
                    ) : def.dataType === "number" ? (
                      <TextField
                        fullWidth
                        type="number"
                        label={`${def.displayName.toUpperCase()}${def.isRequired ? " *" : ""}`}
                        placeholder="e.g. 1350"
                        value={curVal.valueNumber}
                        onChange={(e) => handleSpecFieldChange(def.id, "valueNumber", e.target.value)}
                        error={Boolean(specErr)}
                        helperText={specErr}
                        disabled={disabled}
                        InputProps={{
                          endAdornment: def.unit ? (
                            <InputAdornment position="end" sx={{ "& p": { color: "#a1a1aa", fontWeight: 600 } }}>
                              {def.unit}
                            </InputAdornment>
                          ) : undefined,
                        }}
                        sx={{
                          "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
                        }}
                      />
                    ) : (
                      <TextField
                        fullWidth
                        label={`${def.displayName.toUpperCase()}${def.isRequired ? " *" : ""}`}
                        placeholder="Enter specification value"
                        value={curVal.value}
                        onChange={(e) => handleSpecFieldChange(def.id, "value", e.target.value)}
                        error={Boolean(specErr)}
                        helperText={specErr}
                        disabled={disabled}
                        sx={{
                          "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
                        }}
                      />
                    )}
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </SectionCard>

      {/* 6. SHIPPING DIMENSIONS & WEIGHT CARD */}
      <SectionCard title="Shipping Dimensions & Weight">
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="weightGram"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="WEIGHT (GRAMS)"
                  placeholder="e.g. 200000"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  disabled={disabled}
                  sx={{
                    "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="lengthCm"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="LENGTH (CM)"
                  placeholder="e.g. 210"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  disabled={disabled}
                  sx={{
                    "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="widthCm"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="WIDTH (CM)"
                  placeholder="e.g. 82"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  disabled={disabled}
                  sx={{
                    "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="heightCm"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="HEIGHT (CM)"
                  placeholder="e.g. 115"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  disabled={disabled}
                  sx={{
                    "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </SectionCard>
    </Box>
  );
};

export default BasicInfoSection;
