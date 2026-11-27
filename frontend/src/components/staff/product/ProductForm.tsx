import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Snackbar,
  Switch,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { Controller, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BasicInfoSection from "./BasicInfoSection";
import ImageSection from "./ImageSection";
import VariantSection from "./VariantSection";
import SectionCard from "../common/SectionCard";
import StaffBreadcrumbs from "../common/StaffBreadcrumbs";
import ConfirmDialog from "../common/ConfirmDialog";

import { Brand } from "../../../types/brand";
import { Category } from "../../../types/category";
import { Product } from "../../../types/product";
import { SpecDefinition } from "../../../types/specDefinition";
import { ApiErrorResponse } from "../../../types/apiError";
import { getBrands } from "../../../services/brandService";
import { getCategories } from "../../../services/categoryService";
import {
  createProduct,
  createProductSpecification,
  updateProduct,
  updateProductSpecification,
} from "../../../services/productService";
import { createProductSchema, ProductFormValues } from "../../../schemas/productSchema";
import { applyServerValidationErrors } from "../../../schemas/common";

interface ProductFormProps {
  mode: "add" | "edit";
  productId?: string;
  initialData?: Product | null;
}

const tabsList = ["Basic Information", "Images", "Variants"];

const ProductForm = ({ mode, productId, initialData }: ProductFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  const specDefsRef = useRef<SpecDefinition[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loadingOptions, setLoadingOptions] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(
    (location.state as { toast?: string } | null)?.toast || null
  );

  const dynamicResolver = useCallback<Resolver<ProductFormValues>>(
    (values, context, options) => {
      const schema = createProductSchema(specDefsRef.current);
      return zodResolver(schema)(values, context, options);
    },
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    setError,
    formState: { errors, isSubmitting, isSubmitted, isDirty },
  } = useForm<ProductFormValues>({
    resolver: dynamicResolver,
    mode: "onTouched",
    defaultValues: {
      productName: "",
      slug: "",
      brandId: "",
      categoryId: "",
      summary: "",
      description: "",
      basePrice: "",
      discountPrice: "",
      thumbnail: "",
      thumbnailPublicId: "",
      weightGram: "",
      lengthCm: "",
      widthCm: "",
      heightCm: "",
      isFeatured: false,
      isActive: true,
      specs: {},
    },
  });

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      setOptionsError(null);
      try {
        const [brandsData, categoriesData] = await Promise.all([
          getBrands(),
          getCategories(),
        ]);
        setBrands(brandsData);
        setCategories(categoriesData);

        if (mode === "add" && !getValues("brandId") && brandsData.length === 1) {
          setValue("brandId", String(brandsData[0].id));
        }
      } catch {
        setOptionsError(
          "Failed to load brands or categories options. Make sure Backend is running."
        );
      } finally {
        setLoadingOptions(false);
      }
    };
    void fetchOptions();
  }, [mode, getValues, setValue]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset({
        productName: initialData.productName || "",
        slug: initialData.slug || "",
        brandId: initialData.brand?.id ? String(initialData.brand.id) : "",
        categoryId: initialData.category?.id ? String(initialData.category.id) : "",
        summary: initialData.summary || "",
        description: initialData.description || "",
        basePrice: initialData.basePrice != null ? String(initialData.basePrice) : "",
        discountPrice:
          initialData.discountPrice != null && initialData.discountPrice > 0
            ? String(initialData.discountPrice)
            : "",
        thumbnail: initialData.thumbnail || "",
        thumbnailPublicId: initialData.thumbnailPublicId || "",
        weightGram: initialData.weightGram != null ? String(initialData.weightGram) : "",
        lengthCm: initialData.lengthCm != null ? String(initialData.lengthCm) : "",
        widthCm: initialData.widthCm != null ? String(initialData.widthCm) : "",
        heightCm: initialData.heightCm != null ? String(initialData.heightCm) : "",
        isFeatured: Boolean(initialData.isFeatured),
        isActive: initialData.isActive !== false,
        specs: getValues("specs") || {},
      });
    }
  }, [mode, initialData, reset, getValues]);

  const handleSpecDefsLoaded = useCallback((defs: SpecDefinition[]) => {
    specDefsRef.current = defs;
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAttemptLeave = () => {
    if (isDirty && !isSubmitting) {
      setConfirmLeaveOpen(true);
      return;
    }
    navigate("/staff/products");
  };

  const onSave = async (values: ProductFormValues) => {
    setSubmitError(null);

    const payload = {
      productName: values.productName.trim(),
      slug: values.slug.trim(),
      brandId: Number(values.brandId),
      categoryId: Number(values.categoryId),
      summary: values.summary.trim(),
      description: values.description.trim(),
      basePrice: Number(values.basePrice),
      discountPrice: values.discountPrice.trim() ? Number(values.discountPrice) : null,
      thumbnail: values.thumbnail.trim(),
      thumbnailPublicId: values.thumbnailPublicId?.trim() || "",
      weightGram: values.weightGram.trim() ? Number(values.weightGram) : undefined,
      lengthCm: values.lengthCm.trim() ? Number(values.lengthCm) : undefined,
      widthCm: values.widthCm.trim() ? Number(values.widthCm) : undefined,
      heightCm: values.heightCm.trim() ? Number(values.heightCm) : undefined,
      isFeatured: values.isFeatured,
      isActive: values.isActive,
    };

    try {
      let targetProductId: number;

      if (mode === "add") {
        const created = await createProduct(payload);
        targetProductId = created.id;
      } else {
        targetProductId = Number(productId);
        await updateProduct(targetProductId, payload);
      }

      const loadedDefs = specDefsRef.current;
      if (loadedDefs.length > 0 && values.specs) {
        for (const def of loadedDefs) {
          const valState = values.specs[String(def.id)];
          if (!valState) continue;

          const hasTextValue = valState.value?.trim().length > 0;
          const hasNumberValue = valState.valueNumber?.trim().length > 0;
          const hasOptionValue = valState.optionId !== "";
          const hasAnyValue = hasTextValue || hasNumberValue || hasOptionValue;

          if (valState.specId) {
            if (hasAnyValue) {
              await updateProductSpecification(targetProductId, valState.specId, {
                specDefinitionId: def.id,
                value: hasTextValue ? valState.value.trim() : undefined,
                valueNumber: hasNumberValue ? Number(valState.valueNumber) : undefined,
                optionId: hasOptionValue ? Number(valState.optionId) : undefined,
              });
            }
          } else if (hasAnyValue) {
            await createProductSpecification(targetProductId, {
              specDefinitionId: def.id,
              value: hasTextValue ? valState.value.trim() : undefined,
              valueNumber: hasNumberValue ? Number(valState.valueNumber) : undefined,
              optionId: hasOptionValue ? Number(valState.optionId) : undefined,
            });
          }
        }
      }

      const message =
        mode === "add"
          ? "Product created successfully."
          : "Product changes saved successfully.";

      if (mode === "add") {
        navigate(`/staff/products/edit/${targetProductId}`, { state: { toast: message } });
      } else {
        reset(values);
        setToastMessage(message);
      }
      setActiveTab(0);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: ApiErrorResponse }; message?: string };
      const apiData = axiosErr?.response?.data;
      if (apiData && typeof apiData === "object") {
        applyServerValidationErrors(apiData.details, setError);
        setSubmitError(apiData.message || "Failed to commit product changes. Please try again.");
      } else {
        setSubmitError(axiosErr?.message || "Failed to commit product changes. Please try again.");
      }
    }
  };

  const onInvalid = () => {
    setActiveTab(0);
  };

  const currentSlug = watch("slug");
  const currentProductName = watch("productName");

  if (loadingOptions) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#FF6700" }} />
        <Typography variant="body2" sx={{ color: "#A1A1AA", fontWeight: 600 }}>
          Loading form options...
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSave, onInvalid)} sx={{ width: "100%" }}>
      <StaffBreadcrumbs
        items={[
          { label: "Products", onClick: handleAttemptLeave },
          {
            label:
              mode === "add"
                ? "Add New Product"
                : `Edit Product : ${currentSlug || initialData?.slug || ""}`,
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

      {optionsError && (
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
          {optionsError}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          mb: 3.5,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Product form sections"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: "#FF6700",
            },
            "& .MuiTab-root": {
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#A1A1AA",
              "&.Mui-selected": {
                color: "#FF6700",
              },
            },
          }}
        >
          {tabsList.map((tabLabel, idx) => (
            <Tab
              key={tabLabel}
              label={tabLabel}
              id={`product-form-tab-${idx}`}
              aria-controls={`product-form-tabpanel-${idx}`}
            />
          ))}
        </Tabs>

        {isDirty && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: { xs: 1, sm: 0 } }}>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "var(--font-mono)",
                color: "#FBBF24",
                fontWeight: 700,
                fontSize: "0.72rem",
              }}
            >
              UNSAVED CHANGES
            </Typography>
            {activeTab !== 0 && (
              <Button
                type="submit"
                size="small"
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  backgroundColor: "#FF6700",
                  color: "#070709",
                  fontWeight: 800,
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#FF7D24" },
                }}
              >
                {isSubmitting ? "Saving..." : mode === "add" ? "Publish Product" : "Save Changes"}
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* Tab 0 stays mounted via hidden + display:none so unsaved specs are never lost on tab switch */}
      <Box
        role="tabpanel"
        id="product-form-tabpanel-0"
        aria-labelledby="product-form-tab-0"
        hidden={activeTab !== 0}
        sx={{ display: activeTab === 0 ? "block" : "none" }}
      >
        <Grid container spacing={3.5}>
          <Grid size={{ xs: 12, lg: 8.5 }} sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
            <BasicInfoSection
              control={control}
              watch={watch}
              setValue={setValue}
              errors={errors}
              isSubmitted={isSubmitted}
              mode={mode}
              brands={brands}
              categories={categories}
              onSpecDefsLoaded={handleSpecDefsLoaded}
              productId={productId ? Number(productId) : undefined}
              disabled={isSubmitting}
            />
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

                <Controller
                  name="isFeatured"
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
                      label="Featured Product"
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
                fullWidth
                type="submit"
                variant="contained"
                disabled={isSubmitting}
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
                {isSubmitting ? "Saving..." : mode === "add" ? "Publish Product" : "Save Changes"}
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
      </Box>

      <Box
        role="tabpanel"
        id="product-form-tabpanel-1"
        aria-labelledby="product-form-tab-1"
        hidden={activeTab !== 1}
        sx={{ display: activeTab === 1 ? "block" : "none" }}
      >
        <ImageSection
          productId={productId ? Number(productId) : undefined}
          disabled={isSubmitting}
          productName={currentProductName}
        />
      </Box>

      <Box
        role="tabpanel"
        id="product-form-tabpanel-2"
        aria-labelledby="product-form-tab-2"
        hidden={activeTab !== 2}
        sx={{ display: activeTab === 2 ? "block" : "none" }}
      >
        <VariantSection
          productId={productId ? Number(productId) : undefined}
          productName={currentProductName}
          disabled={isSubmitting}
        />
      </Box>

      <ConfirmDialog
        open={confirmLeaveOpen}
        title="Discard unsaved changes?"
        description="You have modified basic product fields or specifications. Leaving now will discard unsaved edits."
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
        tone="warning"
        onConfirm={() => {
          setConfirmLeaveOpen(false);
          navigate("/staff/products");
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

export default ProductForm;
