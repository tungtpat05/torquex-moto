import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
  Chip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Edit,
  CloudUpload,
  Refresh,
  Palette,
  Inventory,
  Style,
} from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SectionCard from "../common/SectionCard";
import StatusChip from "../common/StatusChip";
import { getColors, createColor } from "../../../services/colorService";
import {
  getProductVariants,
  createProductVariant,
  updateProductVariant,
  uploadProductImage,
} from "../../../services/productService";
import { Color } from "../../../types/color";
import { ProductVariant } from "../../../types/product";
import { ApiErrorResponse } from "../../../types/apiError";
import {
  variantSchema,
  VariantFormValues,
  quickColorSchema,
  QuickColorFormValues,
} from "../../../schemas/variantSchema";
import { applyServerValidationErrors } from "../../../schemas/common";

interface VariantSectionProps {
  productId?: number;
  productName?: string;
  disabled?: boolean;
}

const VariantSection = ({ productId, productName, disabled }: VariantSectionProps) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [variantError, setVariantError] = useState<string | null>(null);

  const [colors, setColors] = useState<Color[]>([]);
  const [loadingColors, setLoadingColors] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [variantSubmitError, setVariantSubmitError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [openColorModal, setOpenColorModal] = useState(false);
  const [colorSubmitError, setColorSubmitError] = useState<string | null>(null);

  const {
    control: variantControl,
    handleSubmit: handleVariantSubmit,
    reset: resetVariantForm,
    watch: watchVariant,
    setValue: setVariantValue,
    setError: setVariantFieldError,
    formState: { isSubmitting: savingVariant },
  } = useForm<VariantFormValues>({
    resolver: zodResolver(variantSchema),
    mode: "onTouched",
    defaultValues: {
      colorId: "",
      sku: "",
      additionalPrice: "0",
      stockQuantity: "0",
      variantImage: "",
      variantImagePublicId: "",
      isActive: true,
    },
  });

  const {
    control: colorControl,
    handleSubmit: handleColorSubmit,
    reset: resetColorForm,
    setError: setColorFieldError,
    formState: { isSubmitting: savingColor },
  } = useForm<QuickColorFormValues>({
    resolver: zodResolver(quickColorSchema),
    mode: "onTouched",
    defaultValues: {
      colorName: "",
      colorCode: "#FF6700",
    },
  });

  const currentVariantImage = watchVariant("variantImage");

  const fetchColors = useCallback(async () => {
    setLoadingColors(true);
    try {
      const data = await getColors();
      setColors(data);
    } catch {
      // Colors list stays empty cleanly if fetch fails
    } finally {
      setLoadingColors(false);
    }
  }, []);

  const fetchVariants = useCallback(async () => {
    if (!productId) return;
    setLoadingVariants(true);
    setVariantError(null);
    try {
      const data = await getProductVariants(productId);
      setVariants(data);
    } catch {
      setVariantError("Failed to load variants for this product.");
    } finally {
      setLoadingVariants(false);
    }
  }, [productId]);

  useEffect(() => {
    void fetchColors();
    if (productId) {
      void fetchVariants();
    }
  }, [productId, fetchColors, fetchVariants]);

  const handleOpenCreateModal = () => {
    setEditingVariant(null);
    setVariantSubmitError(null);
    resetVariantForm({
      colorId: colors.length > 0 ? String(colors[0].id) : "",
      sku: "",
      additionalPrice: "0",
      stockQuantity: "0",
      variantImage: "",
      variantImagePublicId: "",
      isActive: true,
    });
    setOpenModal(true);
  };

  const handleOpenEditModal = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setVariantSubmitError(null);
    resetVariantForm({
      colorId: variant.color?.id ? String(variant.color.id) : "",
      sku: variant.sku || "",
      additionalPrice: variant.additionalPrice !== undefined ? String(variant.additionalPrice) : "0",
      stockQuantity: variant.stockQuantity !== undefined ? String(variant.stockQuantity) : "0",
      variantImage: variant.variantImage || "",
      variantImagePublicId: variant.variantImagePublicId || "",
      isActive: variant.isActive !== false,
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (savingVariant || uploadingImage) return;
    setOpenModal(false);
  };

  const handleVariantImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setVariantSubmitError(null);
    try {
      const res = await uploadProductImage(file);
      setVariantValue("variantImage", res.url, { shouldValidate: true, shouldDirty: true });
      setVariantValue("variantImagePublicId", res.publicId || "");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      setVariantFieldError("variantImage", {
        type: "server",
        message: axiosErr?.response?.data?.message || axiosErr?.message || "Failed to upload image",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const onSaveVariant = async (values: VariantFormValues) => {
    if (!productId) return;
    setVariantSubmitError(null);

    try {
      if (editingVariant) {
        await updateProductVariant(productId, editingVariant.id, {
          colorId: Number(values.colorId),
          sku: values.sku.trim().toUpperCase(),
          additionalPrice: Number(values.additionalPrice),
          stockQuantity: Number(values.stockQuantity),
          variantImage: values.variantImage.trim(),
          variantImagePublicId: values.variantImagePublicId?.trim() || "",
          isActive: values.isActive,
        });
      } else {
        await createProductVariant(productId, {
          colorId: Number(values.colorId),
          sku: values.sku.trim().toUpperCase(),
          additionalPrice: Number(values.additionalPrice),
          stockQuantity: Number(values.stockQuantity),
          variantImage: values.variantImage.trim(),
          variantImagePublicId: values.variantImagePublicId?.trim() || "",
        });
      }
      setOpenModal(false);
      await fetchVariants();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: ApiErrorResponse }; message?: string };
      const apiData = axiosErr?.response?.data;
      if (apiData && typeof apiData === "object") {
        applyServerValidationErrors(apiData.details, setVariantFieldError);
        setVariantSubmitError(apiData.message || "Failed to save variant. Please try again.");
      } else {
        setVariantSubmitError(axiosErr?.message || "Failed to save variant. Please try again.");
      }
    }
  };

  const onSaveColor = async (values: QuickColorFormValues) => {
    setColorSubmitError(null);
    try {
      const newColor = await createColor({
        colorName: values.colorName.trim(),
        colorCode: values.colorCode.trim().toUpperCase(),
      });
      await fetchColors();
      setVariantValue("colorId", String(newColor.id), { shouldValidate: true });
      setOpenColorModal(false);
      resetColorForm({ colorName: "", colorCode: "#FF6700" });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: ApiErrorResponse }; message?: string };
      const apiData = axiosErr?.response?.data;
      if (apiData && typeof apiData === "object") {
        applyServerValidationErrors(apiData.details, setColorFieldError);
        setColorSubmitError(apiData.message || "Failed to create new color.");
      } else {
        setColorSubmitError(axiosErr?.message || "Failed to create new color.");
      }
    }
  };

  const formatUSD = (amount: number) => `$${amount.toLocaleString()}`;

  if (!productId) {
    return (
      <SectionCard title="Product Variants Management">
        <Box
          sx={{
            py: 6,
            px: 3,
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            borderRadius: 2,
            border: "1px dashed rgba(255, 255, 255, 0.12)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Style sx={{ fontSize: 48, color: "#71717a", mb: 1.5 }} />
          <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 650, mb: 1 }}>
            Save Basic Info First
          </Typography>
          <Typography variant="body2" sx={{ color: "#71717a", maxWidth: 480, mx: "auto", lineHeight: 1.6 }}>
            Please publish or save the product basic information first. After creation, you will be able to manage variants for{" "}
            <strong style={{ color: "#e4e4e7" }}>{productName || "this product"}</strong> here.
          </Typography>
        </Box>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Product Variants Management">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            pb: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ color: "#e4e4e7", fontWeight: 600 }}>
              Variants List ({variants.length})
            </Typography>
            <Typography variant="caption" sx={{ color: "#71717a" }}>
              Configure motorcycle colorways, SKU codes, price adjustments, and stock counts.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Tooltip title="Refresh variants list">
              <IconButton
                onClick={() => void fetchVariants()}
                disabled={loadingVariants || disabled}
                sx={{
                  color: "#71717a",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#ffffff" },
                }}
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenCreateModal}
              disabled={disabled}
              sx={{
                backgroundColor: "#ff6b35",
                color: "#ffffff",
                fontWeight: 650,
                fontSize: "0.85rem",
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(255, 107, 53, 0.15)",
                "&:hover": { backgroundColor: "#e05a2b" },
              }}
            >
              Add Variant
            </Button>
          </Box>
        </Box>

        {variantError && (
          <Alert severity="error" sx={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#fca5a5" }}>
            {variantError}
          </Alert>
        )}

        {loadingVariants ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress color="warning" size={32} />
          </Box>
        ) : variants.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              py: 5,
              px: 3,
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              borderRadius: 2,
              border: "1px dashed rgba(255, 255, 255, 0.1)",
            }}
          >
            <Inventory sx={{ fontSize: 44, color: "#52525b", mb: 1 }} />
            <Typography variant="subtitle1" sx={{ color: "#e4e4e7", fontWeight: 600 }}>
              No Variants Created Yet
            </Typography>
            <Typography variant="body2" sx={{ color: "#71717a", mb: 2 }}>
              Add color variations, price adjustments, and stock levels for this motorcycle.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleOpenCreateModal}
              sx={{
                borderColor: "#ff6b35",
                color: "#ff6b35",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { borderColor: "#e05a2b", backgroundColor: "rgba(255, 107, 53, 0.05)" },
              }}
            >
              Add First Variant
            </Button>
          </Paper>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Table size="medium">
              <TableHead sx={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}>
                <TableRow>
                  <TableCell sx={{ color: "#71717a", fontWeight: 650, fontSize: "0.75rem" }}>IMAGE</TableCell>
                  <TableCell sx={{ color: "#71717a", fontWeight: 650, fontSize: "0.75rem" }}>COLOR</TableCell>
                  <TableCell sx={{ color: "#71717a", fontWeight: 650, fontSize: "0.75rem" }}>SKU</TableCell>
                  <TableCell sx={{ color: "#71717a", fontWeight: 650, fontSize: "0.75rem" }}>ADDITIONAL PRICE</TableCell>
                  <TableCell sx={{ color: "#71717a", fontWeight: 650, fontSize: "0.75rem" }}>STOCK</TableCell>
                  <TableCell sx={{ color: "#71717a", fontWeight: 650, fontSize: "0.75rem" }}>STATUS</TableCell>
                  <TableCell align="right" sx={{ color: "#71717a", fontWeight: 650, fontSize: "0.75rem" }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {variants.map((v) => (
                  <TableRow
                    key={v.id}
                    sx={{
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.03)" },
                      borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                      opacity: v.isActive ? 1 : 0.55,
                    }}
                  >
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={v.variantImage}
                        alt={v.sku}
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          backgroundColor: "#18181b",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                        }}
                      >
                        <Style sx={{ color: "#71717a", fontSize: 24 }} />
                      </Avatar>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                        {v.color?.colorCode && (
                          <Box
                            sx={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              backgroundColor: v.color.colorCode,
                              border: "2px solid rgba(255, 255, 255, 0.4)",
                              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.5), inset 0 0 4px rgba(255, 255, 255, 0.2)",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <Typography variant="body2" sx={{ color: "#ffffff", fontWeight: 600 }}>
                          {v.color?.colorName || "—"}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={v.sku}
                        size="small"
                        sx={{
                          fontFamily: "monospace",
                          fontWeight: 700,
                          fontSize: "0.78rem",
                          backgroundColor: "rgba(255, 107, 53, 0.1)",
                          color: "#ff6b35",
                          border: "1px solid rgba(255, 107, 53, 0.2)",
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ color: v.additionalPrice > 0 ? "#10b981" : "#a1a1aa", fontWeight: 600, fontSize: "0.85rem" }}>
                      {v.additionalPrice > 0 ? `+${formatUSD(v.additionalPrice)}` : "$0"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={`${v.stockQuantity} units`}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          backgroundColor:
                            v.stockQuantity > 10
                              ? "rgba(16, 185, 129, 0.1)"
                              : v.stockQuantity > 0
                              ? "rgba(245, 158, 11, 0.1)"
                              : "rgba(239, 68, 68, 0.1)",
                          color: v.stockQuantity > 10 ? "#10b981" : v.stockQuantity > 0 ? "#f59e0b" : "#ef4444",
                          border: `1px solid ${
                            v.stockQuantity > 10
                              ? "rgba(16, 185, 129, 0.2)"
                              : v.stockQuantity > 0
                              ? "rgba(245, 158, 11, 0.2)"
                              : "rgba(239, 68, 68, 0.2)"
                          }`,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <StatusChip status={v.isActive ? "Active" : "Inactive"} />
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Edit Variant">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditModal(v)}
                          sx={{
                            color: "#a1a1aa",
                            "&:hover": { color: "#ff6b35", backgroundColor: "rgba(255, 107, 53, 0.1)" },
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* --- ADD / EDIT VARIANT DIALOG MODAL --- */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#121214",
            backgroundImage: "none",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
            color: "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.1rem", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          {editingVariant ? `Edit Variant: ${editingVariant.sku}` : "Add New Product Variant"}
        </DialogTitle>

        <Box
          component="form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void handleVariantSubmit(onSaveVariant)(e);
          }}
        >
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 3 }}>
            {variantSubmitError && (
              <Alert severity="error" sx={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#fca5a5" }}>
                {variantSubmitError}
              </Alert>
            )}

            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Controller
                name="colorId"
                control={variantControl}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={Boolean(fieldState.error)}>
                    <InputLabel sx={{ color: "#71717a", fontWeight: 600 }}>COLOR *</InputLabel>
                    <Select
                      value={field.value}
                      label="COLOR *"
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      sx={{
                        color: "#ffffff",
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.1)" },
                      }}
                    >
                      {loadingColors ? (
                        <MenuItem disabled>Loading colors...</MenuItem>
                      ) : colors.length === 0 ? (
                        <MenuItem disabled>No colors available. Click Palette to add one.</MenuItem>
                      ) : (
                        colors.map((c) => (
                          <MenuItem key={c.id} value={String(c.id)}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                              {c.colorCode && (
                                <Box
                                  sx={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    backgroundColor: c.colorCode,
                                    border: "2px solid rgba(255, 255, 255, 0.35)",
                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.4)",
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <span>{c.colorName}</span>
                            </Box>
                          </MenuItem>
                        ))
                      )}
                    </Select>
                    {fieldState.error && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              <Tooltip title="Add New Color option">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setColorSubmitError(null);
                    resetColorForm({ colorName: "", colorCode: "#FF6700" });
                    setOpenColorModal(true);
                  }}
                  sx={{
                    minWidth: 48,
                    height: 56,
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    color: "#ff6b35",
                    "&:hover": { borderColor: "#ff6b35", backgroundColor: "rgba(255, 107, 53, 0.05)" },
                  }}
                >
                  <Palette />
                </Button>
              </Tooltip>
            </Box>

            <Controller
              name="sku"
              control={variantControl}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="SKU (Stock Keeping Unit) *"
                  placeholder="e.g. KTM-1390-ORG"
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message || "Uppercase letters, numbers, and hyphens only"}
                  sx={{ "& label": { color: "#71717a", fontWeight: 600 } }}
                />
              )}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                name="additionalPrice"
                control={variantControl}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="ADDITIONAL PRICE ($)"
                    placeholder="0"
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message || "Extra cost on top of base price"}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{ "& label": { color: "#71717a", fontWeight: 600 } }}
                  />
                )}
              />

              <Controller
                name="stockQuantity"
                control={variantControl}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="STOCK QUANTITY *"
                    placeholder="0"
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    sx={{ "& label": { color: "#71717a", fontWeight: 600 } }}
                  />
                )}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: "#e4e4e7", fontWeight: 600 }}>
                Variant Image *
              </Typography>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5 }}>
                <Avatar
                  variant="rounded"
                  src={currentVariantImage || undefined}
                  sx={{
                    width: 88,
                    height: 88,
                    borderRadius: 2.5,
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    border: "1px dashed rgba(255, 255, 255, 0.2)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <Style sx={{ color: "#71717a", fontSize: 32 }} />
                </Avatar>

                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.25 }}>
                  <Controller
                    name="variantImage"
                    control={variantControl}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        size="small"
                        fullWidth
                        placeholder="https://... or /images/models/..."
                        error={Boolean(fieldState.error)}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      size="small"
                      disabled={uploadingImage}
                      startIcon={uploadingImage ? <CircularProgress size={16} color="inherit" /> : <CloudUpload />}
                      sx={{
                        borderColor: "rgba(255, 255, 255, 0.15)",
                        color: "#e4e4e7",
                        fontSize: "0.82rem",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": { borderColor: "#ff6b35", color: "#ff6b35" },
                      }}
                    >
                      {uploadingImage ? "Uploading..." : "Upload Image"}
                      <input type="file" hidden accept="image/*" onChange={handleVariantImageUpload} />
                    </Button>
                    <Typography variant="caption" sx={{ color: "#71717a" }}>
                      JPG, PNG or WEBP
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pt: 1,
                borderTop: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <Typography variant="body2" sx={{ color: "#e4e4e7", fontWeight: 600 }}>
                Active Status
              </Typography>
              <Controller
                name="isActive"
                control={variantControl}
                render={({ field }) => (
                  <Switch
                    checked={Boolean(field.value)}
                    onChange={(e) => field.onChange(e.target.checked)}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: "#ff6b35" },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#ff6b35" },
                    }}
                  />
                )}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, pt: 1, borderTop: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <Button
              onClick={handleCloseModal}
              disabled={savingVariant}
              sx={{ color: "#71717a", fontWeight: 600, textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={savingVariant || uploadingImage}
              startIcon={savingVariant ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{
                backgroundColor: "#ff6b35",
                color: "#ffffff",
                fontWeight: 650,
                textTransform: "none",
                px: 3,
                borderRadius: 2,
                "&:hover": { backgroundColor: "#e05a2b" },
              }}
            >
              {savingVariant ? "Saving..." : editingVariant ? "Save Changes" : "Create Variant"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* --- QUICK CREATE COLOR MODAL --- */}
      <Dialog
        open={openColorModal}
        onClose={() => !savingColor && setOpenColorModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#18181b",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
            color: "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1rem" }}>
          Add New Color Option
        </DialogTitle>
        <Box
          component="form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void handleColorSubmit(onSaveColor)(e);
          }}
        >
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            {colorSubmitError && (
              <Alert severity="error" sx={{ backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#fca5a5" }}>
                {colorSubmitError}
              </Alert>
            )}

            <Controller
              name="colorName"
              control={colorControl}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Color Name *"
                  placeholder="e.g. KTM Electronic Orange"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  sx={{ "& label": { color: "#71717a", fontWeight: 600 } }}
                />
              )}
            />

            <Controller
              name="colorCode"
              control={colorControl}
              render={({ field, fieldState }) => (
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <TextField
                    {...field}
                    fullWidth
                    label="Color Hex Code"
                    placeholder="#FF6700"
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                    sx={{ "& label": { color: "#71717a", fontWeight: 600 } }}
                  />
                  <input
                    type="color"
                    value={/^#[0-9A-Fa-f]{6}$/.test(field.value) ? field.value : "#FF6700"}
                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    style={{
                      width: 44,
                      height: 44,
                      marginTop: 6,
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      backgroundColor: "transparent",
                    }}
                  />
                </Box>
              )}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1 }}>
            <Button
              onClick={() => setOpenColorModal(false)}
              disabled={savingColor}
              sx={{ color: "#71717a", textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={savingColor}
              sx={{
                backgroundColor: "#ff6b35",
                color: "#ffffff",
                fontWeight: 650,
                textTransform: "none",
                "&:hover": { backgroundColor: "#e05a2b" },
              }}
            >
              {savingColor ? "Creating..." : "Save Color"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </SectionCard>
  );
};

export default VariantSection;
