import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Tabs, Tab, Grid, Button, Switch, FormControlLabel, CircularProgress, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Controller, Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BasicInfoSection from "./BasicInfoSection";
import ImageSection from "./ImageSection";
import VariantSection from "./VariantSection";
import SectionCard from "../common/SectionCard";

import { Brand } from "../../../types/brand";
import { Category } from "../../../types/category";
import { Product } from "../../../types/product";
import { SpecDefinition } from "../../../types/specDefinition";
import { ApiErrorResponse } from "../../../types/apiError";
import { getBrands } from "../../../services/brandService";
import { getCategories } from "../../../services/categoryService";
import {
  createProduct,
  updateProduct,
  createProductSpecification,
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
  const [activeTab, setActiveTab] = useState(0);

  const specDefsRef = useRef<SpecDefinition[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loadingOptions, setLoadingOptions] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

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
    formState: { errors, isSubmitting, isSubmitted },
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

  // Fetch Brands & Categories
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
        setOptionsError("Failed to load brands or categories options. Make sure Backend is running.");
      } finally {
        setLoadingOptions(false);
      }
    };
    void fetchOptions();
  }, [mode, getValues, setValue]);

  // Sync initialData if editing
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

  const handleCancel = () => {
    navigate("/staff/products");
  };

  const onSave = async (values: ProductFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

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

      setSubmitSuccess(mode === "add" ? "Product created successfully." : "Product changes saved successfully.");
      navigate(`/staff/products/edit/${targetProductId}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: ApiErrorResponse }; message?: string };
      const apiData = axiosErr?.response?.data;
      if (apiData && typeof apiData === "object") {
        applyServerValidationErrors(apiData.details, setError);
        setSubmitError(apiData.message || "Failed to commit product changes. Please try again.");
      } else {
        setSubmitError(axiosErr?.message || "Failed to commit product changes. Please try again.");
      }
      setActiveTab(0);
    }
  };

  const onInvalid = () => {
    setActiveTab(0);
  };

  const currentSlug = watch("slug");
  const currentProductName = watch("productName");

  if (loadingOptions) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200, gap: 2 }}>
        <CircularProgress color="warning" />
        <Typography variant="body2" sx={{ color: "#71717a", fontWeight: 550 }}>
          Loading form options...
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onSave, onInvalid)} sx={{ width: "100%" }}>
      {/* Breadcrumbs */}
      <Box sx={{ color: "#71717a", fontSize: "0.85rem", fontWeight: 550, mb: 3 }}>
        <span style={{ cursor: "pointer" }} onClick={handleCancel}>Products</span>
        {" > "}
        <span style={{ color: "#ffffff" }}>
          {mode === "add" ? "Add New Product" : `Edit Product : ${currentSlug || ""}`}
        </span>
      </Box>

      {submitSuccess && (
        <Alert severity="success" onClose={() => setSubmitSuccess(null)} sx={{ mb: 3, borderRadius: 2 }}>
          {submitSuccess}
        </Alert>
      )}

      {submitError && (
        <Box sx={{ mb: 3, p: 2, borderRadius: 2, backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
            {submitError}
          </Typography>
        </Box>
      )}

      {optionsError && (
        <Box sx={{ mb: 3, p: 2, borderRadius: 2, backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
          <Typography color="error" variant="body2" sx={{ fontWeight: 600 }}>
            {optionsError}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          mb: 3.5,
          "& .MuiTabs-indicator": {
            backgroundColor: "#ff6b35",
          },
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 650,
              fontSize: "0.9rem",
              color: "#71717a",
              "&.Mui-selected": {
                color: "#ff6b35",
              },
            },
          }}
        >
          {tabsList.map((tabLabel, idx) => (
            <Tab key={tabLabel} label={tabLabel} id={`product-form-tab-${idx}`} />
          ))}
        </Tabs>
      </Box>

      {activeTab === 0 && (
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
                              color: "#ff6b35",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#ff6b35",
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
                fullWidth
                type="submit"
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
                {isSubmitting ? "Saving..." : mode === "add" ? "Publish Product" : "Save Changes"}
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
      )}

      {activeTab === 1 && (
        <Grid container spacing={3.5}>
          <Grid size={{ xs: 12 }}>
            <ImageSection
              productId={productId ? Number(productId) : undefined}
              disabled={isSubmitting}
              productName={currentProductName}
            />
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3.5}>
          <Grid size={{ xs: 12 }}>
            <VariantSection
              productId={productId ? Number(productId) : undefined}
              productName={currentProductName}
              disabled={isSubmitting}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ProductForm;
