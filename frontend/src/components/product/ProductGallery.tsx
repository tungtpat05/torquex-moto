import { useEffect, useMemo, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { ProductImage, ProductVariant } from "@/types/product";

export interface GalleryFocusTrigger {
  imageUrl?: string;
  seq: number;
}

interface ProductGalleryProps {
  productId?: number;
  thumbnailUrl?: string;
  productName?: string;
  images?: ProductImage[];
  variants?: ProductVariant[];
  focusImageTrigger?: GalleryFocusTrigger | null;
}

const ProductGallery = ({
  productId,
  thumbnailUrl,
  productName,
  images: apiImages,
  variants: apiVariants,
  focusImageTrigger,
}: ProductGalleryProps) => {
  const galleryList = useMemo(() => {
    const list: string[] = [];

    if (thumbnailUrl && thumbnailUrl.trim()) {
      list.push(thumbnailUrl.trim());
    }

    if (apiImages && apiImages.length > 0) {
      apiImages.forEach((img) => {
        const trimmed = img.imageUrl?.trim();
        if (trimmed && !list.includes(trimmed)) {
          list.push(trimmed);
        }
      });
    }

    if (apiVariants && apiVariants.length > 0) {
      apiVariants.forEach((v) => {
        const trimmed = v.variantImage?.trim();
        if (trimmed && !list.includes(trimmed)) {
          list.push(trimmed);
        }
      });
    }

    return list;
  }, [thumbnailUrl, apiImages, apiVariants]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [productId, thumbnailUrl]);

  useEffect(() => {
    const targetUrl = focusImageTrigger?.imageUrl?.trim();
    if (!targetUrl) return;
    const matchIndex = galleryList.indexOf(targetUrl);
    if (matchIndex !== -1) {
      setActiveIndex(matchIndex);
    }
  }, [focusImageTrigger, galleryList]);

  if (galleryList.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          height: { xs: "300px", md: "520px" },
          backgroundColor: "#0d0d0f",
          border: "1px dashed rgba(255, 255, 255, 0.15)",
          borderRadius: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Typography variant="h6" sx={{ color: "rgba(255, 255, 255, 0.55)", fontWeight: 700 }}>
          Media Unavailable
        </Typography>
        <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.35)" }}>
          No image available for this motorcycle yet.
        </Typography>
      </Box>
    );
  }

  const prevImage = () => {
    setActiveIndex((prev) => (prev === 0 ? galleryList.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev === galleryList.length - 1 ? 0 : prev + 1));
  };

  const safeIndex = activeIndex < galleryList.length ? activeIndex : 0;
  const currentImage = galleryList[safeIndex];

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "300px", md: "520px" },
          backgroundColor: "#0d0d0f",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          borderRadius: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          mb: 3,
        }}
      >
        <Box
          component="img"
          src={currentImage}
          alt={productName || "Motorcycle View"}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            p: 2,
            transition: "all 0.3s ease-in-out",
          }}
        />

        {galleryList.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: "20px",
              left: "20px",
              backgroundColor: "rgba(0, 0, 0, 0.65)",
              backdropFilter: "blur(4px)",
              borderRadius: "20px",
              px: 2,
              py: 0.6,
              color: "white",
              fontSize: "0.8rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              zIndex: 3,
            }}
          >
            {safeIndex + 1} / {galleryList.length}
          </Box>
        )}

        {galleryList.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: "24px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1,
              zIndex: 3,
            }}
          >
            {galleryList.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: index === safeIndex ? "20px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  backgroundColor: index === safeIndex ? "#e28a3a" : "rgba(255,255,255,0.4)",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {galleryList.length > 1 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "center" }}>
          <IconButton
            onClick={prevImage}
            aria-label="Previous image"
            sx={{
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "rgba(255, 255, 255, 0.6)",
              width: "36px",
              height: "36px",
              "&:hover": {
                borderColor: "#e28a3a",
                color: "#e28a3a",
                backgroundColor: "rgba(226, 138, 58, 0.05)",
              },
            }}
          >
            <KeyboardArrowLeftIcon fontSize="small" />
          </IconButton>

          <Box sx={{ display: "flex", gap: 1.5, overflowX: "auto", py: 0.5 }}>
            {galleryList.map((img, idx) => (
              <Box
                key={img}
                onClick={() => setActiveIndex(idx)}
                sx={{
                  width: { xs: "50px", sm: "75px", md: "85px" },
                  height: { xs: "38px", sm: "56px", md: "64px" },
                  borderRadius: "12px",
                  border: "2px solid",
                  borderColor: idx === safeIndex ? "#e28a3a" : "transparent",
                  overflow: "hidden",
                  cursor: "pointer",
                  backgroundColor: "#18181b",
                  transition: "all 0.2s",
                  opacity: idx === safeIndex ? 1 : 0.45,
                  "&:hover": {
                    opacity: 0.95,
                    borderColor: idx === safeIndex ? "#e28a3a" : "rgba(255, 255, 255, 0.25)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ))}
          </Box>

          <IconButton
            onClick={nextImage}
            aria-label="Next image"
            sx={{
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "rgba(255, 255, 255, 0.6)",
              width: "36px",
              height: "36px",
              "&:hover": {
                borderColor: "#e28a3a",
                color: "#e28a3a",
                backgroundColor: "rgba(226, 138, 58, 0.05)",
              },
            }}
          >
            <KeyboardArrowRightIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ProductGallery;
