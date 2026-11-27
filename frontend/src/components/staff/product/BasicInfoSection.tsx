import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import SectionCard from "../common/SectionCard";
import MediaPreviewStudio from "../common/MediaPreviewStudio";
import { Brand } from "../../../types/brand";
import { Category } from "../../../types/category";
import { SpecDefinition, ProductSpecification } from "../../../types/specDefinition";
import { getSpecDefinitionsByCategory } from "../../../services/specDefinitionService";
import { getProductSpecifications } from "../../../services/productService";
import { uploadImage } from "../../../services/imageService";
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

  const handleThumbnailUpload = async (file: File) => {
    setUploadingThumbnail(true);
    setThumbnailError(null);

    try {
      const response = await uploadImage(file);
      setValue("thumbnail", response.url, { shouldValidate: true, shouldDirty: true });
      setValue("thumbnailPublicId", response.publicId || "", { shouldDirty: true });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setThumbnailError(
        axiosErr?.response?.data?.message || axiosErr?.message || "Failed to upload thumbnail."
      );
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleClearThumbnail = () => {
    setValue("thumbnail", "", { shouldValidate: true, shouldDirty: true });
    setValue("thumbnailPublicId", "", { shouldDirty: true });
    setThumbnailError(null);
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
      {/* 1. PRODUCT IDENTITY CARD */}
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
                    "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
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
                    "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
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
                    "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
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
                    "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
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
                    "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* 2. PRODUCT THUMBNAIL STUDIO CARD */}
      <SectionCard title="Product Thumbnail">
        <MediaPreviewStudio
          imageUrl={thumbnailVal}
          alt={productNameVal || "Product thumbnail preview"}
          fallbackText={productNameVal ? productNameVal.charAt(0).toUpperCase() : "?"}
          uploading={uploadingThumbnail}
          uploadError={thumbnailError}
          disabled={disabled}
          uploadLabel="Upload Thumbnail"
          clearLabel="Clear Thumbnail"
          specHint="PNG, JPG, WEBP • Studio side profile (contain)"
          onUploadFile={handleThumbnailUpload}
          onClear={handleClearThumbnail}
          urlInput={
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
                    "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
                    "& input": { fontSize: "0.95rem", color: "#F4F4F5" },
                  }}
                />
              )}
            />
          }
        />
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
                    "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
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
                    "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
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
                "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
                "& .MuiInputBase-root": { fontSize: "0.95rem" },
              }}
            />
          )}
        />
      </SectionCard>

      {/* 5. CATEGORY SPECIFICATIONS CARD */}
      <SectionCard title="Category Specifications">
        {!categoryId ? (
          <Alert
            severity="warning"
            sx={{ backgroundColor: "rgba(234, 179, 8, 0.10)", color: "#FACC15", borderRadius: "10px" }}
          >
            Please select a category in <strong>Product Identity</strong> above to load specification fields.
          </Alert>
        ) : loadingSpecs ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#FF6700" }} />
          </Box>
        ) : specsError ? (
          <Alert severity="error" sx={{ borderRadius: "10px" }}>
            {specsError}
          </Alert>
        ) : specDefs.length === 0 ? (
          <Typography variant="body2" sx={{ color: "#A1A1AA", fontStyle: "italic", py: 1 }}>
            No custom specification fields configured for this category yet. You can configure them in Category Management.
          </Typography>
        ) : (
          <Grid container spacing={2.5}>
            {specDefs.map((def) => {
              const curVal = specsMap[String(def.id)] || { value: "", valueNumber: "", optionId: "" };
              const specErr = errors.specs?.[String(def.id)]?.message;
              const fieldLabel = `${def.displayName.toUpperCase()}${def.isRequired ? " *" : ""}`;

              return (
                <Grid key={def.id} size={{ xs: 12, sm: 6 }}>
                  {def.dataType === "select" ? (
                    <FormControl fullWidth error={Boolean(specErr)}>
                      <InputLabel
                        id={`spec-select-label-${def.id}`}
                        sx={{ color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" }}
                      >
                        {fieldLabel}
                      </InputLabel>
                      <Select
                        labelId={`spec-select-label-${def.id}`}
                        value={curVal.optionId}
                        label={fieldLabel}
                        onChange={(e) => handleSpecFieldChange(def.id, "optionId", e.target.value)}
                        disabled={disabled}
                        sx={{ color: "#F4F4F5", fontSize: "0.95rem" }}
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
                      label={fieldLabel}
                      placeholder="e.g. 1350"
                      value={curVal.valueNumber}
                      onChange={(e) => handleSpecFieldChange(def.id, "valueNumber", e.target.value)}
                      error={Boolean(specErr)}
                      helperText={specErr}
                      disabled={disabled}
                      slotProps={{
                        input: {
                          endAdornment: def.unit ? (
                            <InputAdornment
                              position="end"
                              sx={{ "& p": { color: "#A1A1AA", fontWeight: 600 } }}
                            >
                              {def.unit}
                            </InputAdornment>
                          ) : undefined,
                        },
                      }}
                      sx={{
                        "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
                      }}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      label={fieldLabel}
                      placeholder="Enter specification value"
                      value={curVal.value}
                      onChange={(e) => handleSpecFieldChange(def.id, "value", e.target.value)}
                      error={Boolean(specErr)}
                      helperText={specErr}
                      disabled={disabled}
                      sx={{
                        "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
                      }}
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>
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
                    "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
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
                    "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
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
                    "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
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
                    "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
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
