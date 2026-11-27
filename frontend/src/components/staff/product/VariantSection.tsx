import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Add,
  CloudUpload,
  Edit,
  Inventory,
  Palette,
  Refresh,
  Style,
} from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SectionCard from "../common/SectionCard";
import StatusChip from "../common/StatusChip";
import { getColors, createColor } from "../../../services/colorService";
import {
  createProductVariant,
  getProductVariants,
  updateProductVariant,
} from "../../../services/productService";
import { uploadImage } from "../../../services/imageService";
import { Color } from "../../../types/color";
import { ProductVariant } from "../../../types/product";
import { ApiErrorResponse } from "../../../types/apiError";
import {
  QuickColorFormValues,
  quickColorSchema,
  VariantFormValues,
  variantSchema,
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
      additionalPrice:
        variant.additionalPrice !== undefined ? String(variant.additionalPrice) : "0",
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
    e.target.value = "";
    if (!file) return;

    setUploadingImage(true);
    setVariantSubmitError(null);
    try {
      const res = await uploadImage(file);
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
        setToastMessage("Variant updated.");
      } else {
        await createProductVariant(productId, {
          colorId: Number(values.colorId),
          sku: values.sku.trim().toUpperCase(),
          additionalPrice: Number(values.additionalPrice),
          stockQuantity: Number(values.stockQuantity),
          variantImage: values.variantImage.trim(),
          variantImagePublicId: values.variantImagePublicId?.trim() || "",
        });
        setToastMessage("Variant created.");
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
      setToastMessage(`Color "${newColor.colorName}" added.`);
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
            backgroundColor: "#16161D",
            borderRadius: "12px",
            border: "1px dashed rgba(255, 255, 255, 0.14)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Style sx={{ fontSize: 48, color: "#71717A", mb: 1.5 }} />
          <Typography
            variant="h6"
            sx={{ fontFamily: "var(--font-display)", color: "#F4F4F5", fontWeight: 700, mb: 1 }}
          >
            Save Basic Info First
          </Typography>
          <Typography variant="body2" sx={{ color: "#A1A1AA", maxWidth: 480, mx: "auto", lineHeight: 1.6 }}>
            Please publish or save the product basic information first. After creation, you will be able to manage variants for{" "}
            <strong style={{ color: "#F4F4F5" }}>{productName || "this product"}</strong> here.
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
            <Typography variant="subtitle2" sx={{ color: "#F4F4F5", fontWeight: 700 }}>
              Variants List ({variants.length})
            </Typography>
            <Typography variant="caption" sx={{ color: "#A1A1AA" }}>
              Configure motorcycle colorways, SKU codes, price adjustments, and stock counts.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Tooltip title="Refresh variants list" arrow>
              <span>
                <IconButton
                  aria-label="Refresh variants list"
                  onClick={() => void fetchVariants()}
                  disabled={loadingVariants || disabled}
                  sx={{
                    minWidth: 36,
                    minHeight: 36,
                    borderRadius: "8px",
                    color: "#A1A1AA",
                    backgroundColor: "#16161D",
                    border: "1px solid rgba(255, 255, 255, 0.10)",
                    "&:hover": {
                      borderColor: "#FF6700",
                      color: "#F4F4F5",
                    },
                  }}
                >
                  <Refresh fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenCreateModal}
              disabled={disabled}
              sx={{
                backgroundColor: "#FF6700",
                color: "#070709",
                fontWeight: 800,
                fontSize: "0.85rem",
                borderRadius: "8px",
                px: 2.25,
                "&:hover": { backgroundColor: "#FF7D24" },
              }}
            >
              Add Variant
            </Button>
          </Box>
        </Box>

        {variantError && (
          <Alert severity="error" sx={{ borderRadius: "10px" }}>
            {variantError}
          </Alert>
        )}

        {loadingVariants ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress sx={{ color: "#FF6700" }} size={32} />
          </Box>
        ) : variants.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              py: 5,
              px: 3,
              textAlign: "center",
              backgroundColor: "#16161D",
              borderRadius: "12px",
              border: "1px dashed rgba(255, 255, 255, 0.14)",
            }}
          >
            <Inventory sx={{ fontSize: 44, color: "#71717A", mb: 1 }} />
            <Typography
              variant="subtitle1"
              sx={{ fontFamily: "var(--font-display)", color: "#F4F4F5", fontWeight: 700 }}
            >
              No Variants Created Yet
            </Typography>
            <Typography variant="body2" sx={{ color: "#A1A1AA", mb: 2 }}>
              Add color variations, price adjustments, and stock levels for this motorcycle.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleOpenCreateModal}
              sx={{
                borderColor: "#FF6700",
                color: "#FF6700",
                fontWeight: 700,
                borderRadius: "8px",
                "&:hover": { backgroundColor: "rgba(255, 103, 0, 0.08)" },
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
              backgroundColor: "#0F0F14",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              borderRadius: "12px",
              overflowX: "auto",
            }}
          >
            <Table size="medium" sx={{ minWidth: 720 }}>
              <TableHead sx={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}>
                <TableRow
                  sx={{
                    "& th": {
                      fontFamily: "var(--font-mono)",
                      color: "#A1A1AA",
                      fontWeight: 700,
                      fontSize: "0.72rem",
                      letterSpacing: "0.05em",
                      borderColor: "rgba(255, 255, 255, 0.08)",
                    },
                  }}
                >
                  <TableCell>IMAGE</TableCell>
                  <TableCell>COLOR</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>ADDITIONAL PRICE</TableCell>
                  <TableCell>STOCK</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell align="right">ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {variants.map((v) => (
                  <TableRow
                    key={v.id}
                    sx={{
                      "& td": { borderColor: "rgba(255, 255, 255, 0.06)" },
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.02)" },
                      opacity: v.isActive ? 1 : 0.6,
                    }}
                  >
                    <TableCell>
                      <Avatar
                        variant="rounded"
                        src={v.variantImage}
                        alt={v.sku}
                        sx={{
                          width: 68,
                          height: 44,
                          p: 0.5,
                          borderRadius: "8px",
                          backgroundColor: "#16161D",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          "& img": { objectFit: "contain" },
                        }}
                      >
                        <Style sx={{ color: "#71717A", fontSize: 22 }} />
                      </Avatar>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                        {v.color?.colorCode && (
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              backgroundColor: v.color.colorCode,
                              border: "2px solid rgba(255, 255, 255, 0.35)",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <Typography variant="body2" sx={{ color: "#F4F4F5", fontWeight: 600 }}>
                          {v.color?.colorName || "—"}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={v.sku}
                        size="small"
                        sx={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          borderRadius: "4px",
                          backgroundColor: "rgba(255, 103, 0, 0.12)",
                          color: "#FF6700",
                          border: "1px solid rgba(255, 103, 0, 0.25)",
                        }}
                      />
                    </TableCell>

                    <TableCell
                      className="tabular-nums"
                      sx={{
                        fontFamily: "var(--font-mono)",
                        color: v.additionalPrice > 0 ? "#4ADE80" : "#A1A1AA",
                        fontWeight: 700,
                        fontSize: "0.84rem",
                      }}
                    >
                      {v.additionalPrice > 0 ? `+${formatUSD(v.additionalPrice)}` : "$0"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        className="tabular-nums"
                        label={`${v.stockQuantity} units`}
                        size="small"
                        sx={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          borderRadius: "100px",
                          backgroundColor:
                            v.stockQuantity > 10
                              ? "rgba(34, 197, 94, 0.10)"
                              : v.stockQuantity > 0
                                ? "rgba(245, 158, 11, 0.12)"
                                : "rgba(239, 68, 68, 0.12)",
                          color:
                            v.stockQuantity > 10
                              ? "#4ADE80"
                              : v.stockQuantity > 0
                                ? "#FBBF24"
                                : "#FCA5A5",
                          border: `1px solid ${
                            v.stockQuantity > 10
                              ? "rgba(34, 197, 94, 0.25)"
                              : v.stockQuantity > 0
                                ? "rgba(245, 158, 11, 0.25)"
                                : "rgba(239, 68, 68, 0.25)"
                          }`,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <StatusChip status={v.isActive ? "Active" : "Inactive"} />
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title={`Edit ${v.sku}`} arrow>
                        <IconButton
                          aria-label={`Edit variant ${v.sku}`}
                          onClick={() => handleOpenEditModal(v)}
                          sx={{
                            minWidth: 36,
                            minHeight: 36,
                            borderRadius: "8px",
                            color: "#A1A1AA",
                            "&:hover": {
                              color: "#FF6700",
                              backgroundColor: "rgba(255, 103, 0, 0.10)",
                            },
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

      {/* ADD / EDIT VARIANT DIALOG MODAL */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#0F0F14",
            backgroundImage: "none",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderTop: "1px solid rgba(255, 255, 255, 0.22)",
            borderRadius: "16px",
            color: "#F4F4F5",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.1rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
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
              <Alert severity="error" sx={{ borderRadius: "10px" }}>
                {variantSubmitError}
              </Alert>
            )}

            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Controller
                name="colorId"
                control={variantControl}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={Boolean(fieldState.error)}>
                    <InputLabel id="variant-color-label" sx={{ color: "#A1A1AA", fontWeight: 600 }}>
                      COLOR *
                    </InputLabel>
                    <Select
                      labelId="variant-color-label"
                      value={field.value}
                      label="COLOR *"
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      sx={{ color: "#F4F4F5" }}
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
                                    width: 18,
                                    height: 18,
                                    borderRadius: "50%",
                                    backgroundColor: c.colorCode,
                                    border: "2px solid rgba(255, 255, 255, 0.35)",
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

              <Tooltip title="Add New Color option" arrow>
                <Button
                  aria-label="Add New Color option"
                  variant="outlined"
                  onClick={() => {
                    setColorSubmitError(null);
                    resetColorForm({ colorName: "", colorCode: "#FF6700" });
                    setOpenColorModal(true);
                  }}
                  sx={{
                    minWidth: 48,
                    height: 56,
                    borderRadius: "8px",
                    borderColor: "rgba(255, 255, 255, 0.18)",
                    color: "#FF6700",
                    "&:hover": {
                      borderColor: "#FF6700",
                      backgroundColor: "rgba(255, 103, 0, 0.08)",
                    },
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
                  helperText={
                    fieldState.error?.message || "Uppercase letters, numbers, and hyphens only"
                  }
                  sx={{ "& label": { color: "#A1A1AA", fontWeight: 600 } }}
                />
              )}
            />

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
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
                    slotProps={{
                      input: {
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      },
                    }}
                    sx={{ "& label": { color: "#A1A1AA", fontWeight: 600 } }}
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
                    sx={{ "& label": { color: "#A1A1AA", fontWeight: 600 } }}
                  />
                )}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography variant="body2" sx={{ color: "#F4F4F5", fontWeight: 600 }}>
                Variant Image *
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "flex-start" },
                  gap: 2.5,
                }}
              >
                <Avatar
                  variant="rounded"
                  src={currentVariantImage || undefined}
                  alt="Variant preview"
                  sx={{
                    width: { xs: "100%", sm: 140 },
                    height: 100,
                    p: 0.75,
                    borderRadius: "10px",
                    backgroundColor: "#16161D",
                    border: "1px dashed rgba(255, 255, 255, 0.20)",
                    "& img": { objectFit: "contain" },
                  }}
                >
                  <Style sx={{ color: "#71717A", fontSize: 32 }} />
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
                        aria-label="Variant image URL"
                        placeholder="https://... or /images/models/..."
                        error={Boolean(fieldState.error)}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                    <Button
                      variant="outlined"
                      component="label"
                      size="small"
                      disabled={uploadingImage}
                      startIcon={
                        uploadingImage ? <CircularProgress size={16} color="inherit" /> : <CloudUpload />
                      }
                      sx={{
                        borderRadius: "8px",
                        borderColor: "rgba(255, 255, 255, 0.18)",
                        color: "#F4F4F5",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        "&:hover": { borderColor: "#FF6700", color: "#FF6700" },
                      }}
                    >
                      {uploadingImage ? "Uploading..." : "Upload Image"}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => void handleVariantImageUpload(e)}
                      />
                    </Button>
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: "var(--font-mono)", color: "#71717A" }}
                    >
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
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Typography variant="body2" sx={{ color: "#F4F4F5", fontWeight: 600 }}>
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
                      "& .MuiSwitch-switchBase.Mui-checked": { color: "#FF6700" },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#FF6700",
                      },
                    }}
                  />
                )}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, pt: 1.5, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <Button
              onClick={handleCloseModal}
              disabled={savingVariant}
              sx={{ color: "#A1A1AA", fontWeight: 600, borderRadius: "8px" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={savingVariant || uploadingImage}
              startIcon={savingVariant ? <CircularProgress size={18} color="inherit" /> : null}
              sx={{
                backgroundColor: "#FF6700",
                color: "#070709",
                fontWeight: 800,
                px: 3,
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#FF7D24" },
              }}
            >
              {savingVariant ? "Saving..." : editingVariant ? "Save Changes" : "Create Variant"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* QUICK CREATE COLOR MODAL */}
      <Dialog
        open={openColorModal}
        onClose={() => !savingColor && setOpenColorModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#0F0F14",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderTop: "1px solid rgba(255, 255, 255, 0.22)",
            borderRadius: "16px",
            color: "#F4F4F5",
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem" }}>
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
              <Alert severity="error" sx={{ borderRadius: "10px" }}>
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
                  sx={{ "& label": { color: "#A1A1AA", fontWeight: 600 } }}
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
                    sx={{ "& label": { color: "#A1A1AA", fontWeight: 600 } }}
                  />
                  <input
                    type="color"
                    aria-label="Pick color"
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
              sx={{ color: "#A1A1AA", borderRadius: "8px" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={savingColor}
              sx={{
                backgroundColor: "#FF6700",
                color: "#070709",
                fontWeight: 800,
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#FF7D24" },
              }}
            >
              {savingColor ? "Creating..." : "Save Color"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3500}
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
    </SectionCard>
  );
};

export default VariantSection;
