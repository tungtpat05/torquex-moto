import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AddPhotoAlternate,
  ArrowDownward,
  ArrowUpward,
  Delete,
  DragIndicator,
  PhotoLibrary,
  Refresh,
} from "@mui/icons-material";
import SectionCard from "../common/SectionCard";
import ConfirmDialog from "../common/ConfirmDialog";
import {
  addProductImage,
  deleteProductImage,
  getProductImages,
  reorderProductImages,
  updateProductImage,
} from "../../../services/productService";
import { uploadImage } from "../../../services/imageService";
import { ProductImage } from "../../../types/product";

interface ImageSectionProps {
  productId?: number;
  disabled?: boolean;
  productName?: string;
}

const ImageSection = ({ productId, disabled, productName }: ImageSectionProps) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [addingImage, setAddingImage] = useState(false);
  const [replacingImageId, setReplacingImageId] = useState<number | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
  const [pendingDeleteImageId, setPendingDeleteImageId] = useState<number | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!productId) return;
    const fetchImages = async () => {
      setLoadingImages(true);
      setGalleryError(null);
      try {
        const data = await getProductImages(productId);
        setImages(data.sort((a, b) => a.displayOrder - b.displayOrder));
      } catch (err: unknown) {
        console.error("Failed to fetch product images:", err);
        setGalleryError("Failed to load product gallery images.");
      } finally {
        setLoadingImages(false);
      }
    };
    void fetchImages();
  }, [productId]);

  const handleAddGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !productId) return;

    setAddingImage(true);
    setGalleryError(null);

    try {
      const uploadRes = await uploadImage(file);
      const newImage = await addProductImage(productId, uploadRes.url, uploadRes.publicId);
      setImages((prev) => [...prev, newImage].sort((a, b) => a.displayOrder - b.displayOrder));
      setToastMessage("Gallery image added.");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      console.error("Failed to add image:", err);
      setGalleryError(
        axiosErr?.response?.data?.message || axiosErr?.message || "Failed to add image. Please try again."
      );
    } finally {
      setAddingImage(false);
    }
  };

  const handleReplaceGalleryImage = async (
    imageId: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !productId) return;

    setReplacingImageId(imageId);
    setGalleryError(null);

    try {
      const uploadRes = await uploadImage(file);
      const updated = await updateProductImage(productId, imageId, {
        imageUrl: uploadRes.url,
        imagePublicId: uploadRes.publicId,
      });
      setImages((prev) => prev.map((img) => (img.id === imageId ? updated : img)));
      setToastMessage("Gallery image replaced.");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      console.error("Failed to replace image:", err);
      setGalleryError(
        axiosErr?.response?.data?.message || axiosErr?.message || "Failed to replace image."
      );
    } finally {
      setReplacingImageId(null);
    }
  };

  const handleConfirmDeleteImage = async () => {
    if (!productId || !pendingDeleteImageId) return;
    const imageId = pendingDeleteImageId;

    setDeletingImageId(imageId);
    setGalleryError(null);

    try {
      await deleteProductImage(productId, imageId);
      const updatedList = images.filter((img) => img.id !== imageId);
      setImages(updatedList);
      if (updatedList.length > 0) {
        const reordered = await reorderProductImages(
          productId,
          updatedList.map((img) => img.id)
        );
        setImages(reordered.sort((a, b) => a.displayOrder - b.displayOrder));
      }
      setPendingDeleteImageId(null);
      setToastMessage("Gallery image deleted.");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      console.error("Failed to delete image:", err);
      setGalleryError(
        axiosErr?.response?.data?.message || axiosErr?.message || "Failed to delete image."
      );
      setPendingDeleteImageId(null);
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleMoveImage = async (index: number, direction: "up" | "down") => {
    if (!productId) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newImages = [...images];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    setImages(newImages);

    try {
      const reordered = await reorderProductImages(
        productId,
        newImages.map((img) => img.id)
      );
      setImages(reordered.sort((a, b) => a.displayOrder - b.displayOrder));
      setToastMessage("Gallery order updated.");
    } catch (err: unknown) {
      console.error("Failed to reorder images:", err);
      setGalleryError("Failed to update image display order.");
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex || !productId) return;

    const newImages = [...images];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);

    setImages(newImages);
    setDraggedIndex(null);
    setDragOverIndex(null);

    try {
      const reordered = await reorderProductImages(
        productId,
        newImages.map((img) => img.id)
      );
      setImages(reordered.sort((a, b) => a.displayOrder - b.displayOrder));
      setToastMessage("Gallery order updated.");
    } catch (err: unknown) {
      console.error("Failed to reorder images on drop:", err);
      setGalleryError("Failed to update image display order.");
    }
  };

  if (!productId) {
    return (
      <SectionCard title="Product Gallery Images & Display Order">
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
          <PhotoLibrary sx={{ fontSize: 48, color: "#71717A", mb: 1.5 }} />
          <Typography
            variant="h6"
            sx={{ fontFamily: "var(--font-display)", color: "#F4F4F5", fontWeight: 700, mb: 1 }}
          >
            Save Basic Info First
          </Typography>
          <Typography variant="body2" sx={{ color: "#A1A1AA", maxWidth: 480, mx: "auto", lineHeight: 1.6 }}>
            Please publish or save the product basic information first. After creation, you will be able to manage gallery images for{" "}
            <strong style={{ color: "#F4F4F5" }}>{productName || "this product"}</strong> here.
          </Typography>
        </Box>
      </SectionCard>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
      <SectionCard title="Product Gallery Images & Display Order">
        <Typography variant="body2" sx={{ color: "#A1A1AA", mb: 2.5, fontWeight: 500 }}>
          Manage additional product gallery images below for {productName || "this product"}. Drag and drop cards or use the Up/Down buttons to adjust display order.
        </Typography>

        {galleryError && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px" }}>
            {galleryError}
          </Alert>
        )}

        {loadingImages ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#FF6700" }} size={32} />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {images.map((img, index) => {
              const isDragging = draggedIndex === index;
              const isDragOver = dragOverIndex === index;

              return (
                <Paper
                  key={img.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => void handleDrop(e, index)}
                  elevation={0}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    p: 2,
                    borderRadius: "12px",
                    backgroundColor: isDragging ? "rgba(255, 103, 0, 0.08)" : "#16161D",
                    border: isDragOver
                      ? "2px dashed #FF6700"
                      : isDragging
                        ? "1px dashed rgba(255, 103, 0, 0.5)"
                        : "1px solid rgba(255, 255, 255, 0.10)",
                    opacity: isDragging ? 0.6 : 1,
                    transition: "border-color 0.2s ease, background-color 0.2s ease",
                    cursor: "grab",
                    "&:hover": {
                      borderColor: "rgba(255, 103, 0, 0.45)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DragIndicator sx={{ color: "#71717A", cursor: "grab" }} />
                    <Chip
                      label={`#${index + 1}`}
                      size="small"
                      className="tabular-nums"
                      sx={{
                        fontFamily: "var(--font-mono)",
                        backgroundColor: "rgba(255, 103, 0, 0.14)",
                        color: "#FF6700",
                        fontWeight: 700,
                        fontSize: "0.74rem",
                        borderRadius: "4px",
                        height: 24,
                      }}
                    />
                  </Box>

                  <Box
                    component="img"
                    src={img.imageUrl}
                    alt={`Product gallery image ${index + 1}`}
                    sx={{
                      width: 112,
                      height: 74,
                      p: 0.5,
                      objectFit: "contain",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      backgroundColor: "#0F0F14",
                      flexShrink: 0,
                    }}
                  />

                  <Box sx={{ flex: 1, minWidth: 160 }}>
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ color: "#F4F4F5", fontWeight: 500, fontSize: "0.85rem" }}
                    >
                      {img.imageUrl}
                    </Typography>
                    <Typography
                      variant="caption"
                      className="tabular-nums"
                      sx={{ fontFamily: "var(--font-mono)", color: "#71717A" }}
                    >
                      DISPLAY PRIORITY: {index + 1}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Tooltip title="Move Up (Increase Priority)" arrow>
                      <span>
                        <IconButton
                          aria-label={`Move image ${index + 1} up`}
                          disabled={index === 0}
                          onClick={() => void handleMoveImage(index, "up")}
                          sx={{
                            minWidth: { xs: 40, sm: 36 },
                            minHeight: { xs: 40, sm: 36 },
                            borderRadius: "8px",
                            color: index === 0 ? "#3F3F46" : "#A1A1AA",
                            "&:hover": {
                              color: "#FF6700",
                              backgroundColor: "rgba(255, 103, 0, 0.10)",
                            },
                          }}
                        >
                          <ArrowUpward fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Tooltip title="Move Down (Lower Priority)" arrow>
                      <span>
                        <IconButton
                          aria-label={`Move image ${index + 1} down`}
                          disabled={index === images.length - 1}
                          onClick={() => void handleMoveImage(index, "down")}
                          sx={{
                            minWidth: { xs: 40, sm: 36 },
                            minHeight: { xs: 40, sm: 36 },
                            borderRadius: "8px",
                            color: index === images.length - 1 ? "#3F3F46" : "#A1A1AA",
                            "&:hover": {
                              color: "#FF6700",
                              backgroundColor: "rgba(255, 103, 0, 0.10)",
                            },
                          }}
                        >
                          <ArrowDownward fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Tooltip title="Replace this Image" arrow>
                      <Button
                        variant="outlined"
                        component="label"
                        size="small"
                        disabled={replacingImageId === img.id}
                        startIcon={
                          replacingImageId === img.id ? (
                            <CircularProgress size={14} color="inherit" />
                          ) : (
                            <Refresh fontSize="small" />
                          )
                        }
                        sx={{
                          borderRadius: "8px",
                          borderColor: "rgba(255, 255, 255, 0.16)",
                          color: "#F4F4F5",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          px: 1.5,
                          minHeight: 36,
                          "&:hover": {
                            borderColor: "#FF6700",
                            color: "#FF6700",
                            backgroundColor: "rgba(255, 103, 0, 0.06)",
                          },
                        }}
                      >
                        {replacingImageId === img.id ? "Replacing..." : "Replace"}
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => void handleReplaceGalleryImage(img.id, e)}
                        />
                      </Button>
                    </Tooltip>

                    <Tooltip title="Delete Image" arrow>
                      <span>
                        <IconButton
                          aria-label={`Delete image ${index + 1}`}
                          disabled={deletingImageId === img.id}
                          onClick={() => setPendingDeleteImageId(img.id)}
                          sx={{
                            minWidth: { xs: 40, sm: 36 },
                            minHeight: { xs: 40, sm: 36 },
                            borderRadius: "8px",
                            color: "#A1A1AA",
                            "&:hover": {
                              color: "#EF4444",
                              backgroundColor: "rgba(239, 68, 68, 0.12)",
                            },
                          }}
                        >
                          {deletingImageId === img.id ? (
                            <CircularProgress size={16} color="error" />
                          ) : (
                            <Delete fontSize="small" />
                          )}
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </Paper>
              );
            })}

            <Box
              sx={{
                p: 2.5,
                borderRadius: "12px",
                border: "1px dashed rgba(255, 255, 255, 0.18)",
                backgroundColor: "#16161D",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "border-color 0.2s ease, background-color 0.2s ease",
                "&:hover": {
                  borderColor: "#FF6700",
                  backgroundColor: "rgba(255, 103, 0, 0.04)",
                },
              }}
            >
              <Button
                component="label"
                disabled={disabled || addingImage}
                startIcon={
                  addingImage ? (
                    <CircularProgress size={18} sx={{ color: "#FF6700" }} />
                  ) : (
                    <AddPhotoAlternate sx={{ color: "#FF6700" }} />
                  )
                }
                sx={{
                  color: "#F4F4F5",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  borderRadius: "8px",
                }}
              >
                {addingImage ? "Uploading new image..." : "+ Add New Product Image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => void handleAddGalleryImage(e)}
                />
              </Button>
            </Box>
          </Box>
        )}
      </SectionCard>

      <ConfirmDialog
        open={Boolean(pendingDeleteImageId)}
        title="Delete gallery image?"
        description="Are you sure you want to delete this product gallery image? Remaining images will be reordered."
        confirmLabel="Delete Image"
        cancelLabel="Cancel"
        tone="danger"
        loading={Boolean(deletingImageId)}
        onConfirm={() => void handleConfirmDeleteImage()}
        onCancel={() => setPendingDeleteImageId(null)}
      />

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
    </Box>
  );
};

export default ImageSection;
