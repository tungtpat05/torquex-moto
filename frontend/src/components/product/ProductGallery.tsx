import { KeyboardEvent, useEffect, useMemo, useState } from "react";
import { Box, ButtonBase, IconButton, Typography } from "@mui/material";
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
          backgroundColor: "#0F0F14",
          border: "1px dashed rgba(255, 255, 255, 0.14)",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Typography
          sx={{
            fontFamily: "var(--font-mono)",
            color: "#D4D4D8",
            fontWeight: 800,
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Media Unavailable
        </Typography>
        <Typography sx={{ color: "#71717A", fontSize: "0.82rem" }}>
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

  const handleStageKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (galleryList.length <= 1) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevImage();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextImage();
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        tabIndex={galleryList.length > 1 ? 0 : undefined}
        onKeyDown={handleStageKeyDown}
        aria-label={`${productName || "Motorcycle"} gallery viewer`}
        sx={{
          position: "relative",
          width: "100%",
          height: { xs: "310px", sm: "420px", md: "520px" },
          backgroundColor: "#0F0F14",
          border: "1px solid rgba(255, 255, 255, 0.10)",
          borderTop: "1px solid rgba(255, 255, 255, 0.25)",
          borderRadius: "16px",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          mb: 2.5,
        }}
      >
        {/* Ambient Studio Orange Floor Glow */}
        <Box
          sx={{
            position: "absolute",
            bottom: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "82%",
            height: "54%",
            background:
              "radial-gradient(ellipse at center, rgba(255, 103, 0, 0.22) 0%, rgba(255, 103, 0, 0.04) 48%, transparent 74%)",
            filter: "blur(26px)",
            pointerEvents: "none",
          }}
        />

        {/* Paddock Horizon Hairline */}
        <Box
          sx={{
            position: "absolute",
            bottom: "12%",
            left: "5%",
            right: "5%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255, 103, 0, 0.45) 50%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        <Box
          component="img"
          src={currentImage}
          alt={productName || "Motorcycle View"}
          decoding="async"
          sx={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            p: { xs: 2, md: 3 },
            filter:
              "drop-shadow(0 22px 35px rgba(0, 0, 0, 0.92)) drop-shadow(0 0 24px rgba(255, 103, 0, 0.15))",
            transition: "opacity 0.25s ease",
          }}
        />

        {galleryList.length > 1 && (
          <Box
            className="tabular-nums"
            sx={{
              position: "absolute",
              bottom: "18px",
              left: "18px",
              backgroundColor: "rgba(7, 7, 9, 0.85)",
              backdropFilter: "blur(12px)",
              borderRadius: "4px",
              px: 1.5,
              py: 0.5,
              color: "#F4F4F5",
              fontFamily: "var(--font-mono)",
              fontSize: "0.74rem",
              fontWeight: 800,
              letterSpacing: "0.1em",
              border: "1px solid rgba(255, 255, 255, 0.14)",
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
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              zIndex: 3,
            }}
          >
            {galleryList.map((_, index) => {
              const isCurrent = index === safeIndex;
              return (
                <ButtonBase
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View image ${index + 1} of ${galleryList.length}`}
                  aria-pressed={isCurrent}
                  sx={{
                    p: 0.5,
                    borderRadius: "100px",
                  }}
                >
                  <Box
                    sx={{
                      width: isCurrent ? "22px" : "7px",
                      height: "6px",
                      borderRadius: "100px",
                      backgroundColor: isCurrent ? "#FF6700" : "rgba(255, 255, 255, 0.35)",
                      boxShadow: isCurrent ? "0 0 10px rgba(255, 103, 0, 0.65)" : "none",
                      transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  />
                </ButtonBase>
              );
            })}
          </Box>
        )}
      </Box>

      {galleryList.length > 1 && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, justifyContent: "center" }}>
          <IconButton
            onClick={prevImage}
            aria-label="Previous image"
            sx={{
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backgroundColor: "#0F0F14",
              color: "#D4D4D8",
              borderRadius: "8px",
              width: "40px",
              height: "40px",
              flexShrink: 0,
              "&:hover": {
                borderColor: "#FF6700",
                color: "#FF6700",
                backgroundColor: "rgba(255, 103, 0, 0.08)",
              },
            }}
          >
            <KeyboardArrowLeftIcon fontSize="small" />
          </IconButton>

          <Box sx={{ display: "flex", gap: 1.25, overflowX: "auto", py: 0.5 }}>
            {galleryList.map((img, idx) => {
              const isSelected = idx === safeIndex;
              return (
                <ButtonBase
                  key={img}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Select thumbnail ${idx + 1}`}
                  aria-pressed={isSelected}
                  sx={{
                    width: { xs: "56px", sm: "76px", md: "88px" },
                    height: { xs: "42px", sm: "56px", md: "64px" },
                    borderRadius: "8px",
                    border: "2px solid",
                    borderColor: isSelected ? "#FF6700" : "rgba(255, 255, 255, 0.08)",
                    overflow: "hidden",
                    backgroundColor: "#16161D",
                    p: 0.5,
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                    opacity: isSelected ? 1 : 0.52,
                    boxShadow: isSelected ? "0 0 16px rgba(255, 103, 0, 0.25)" : "none",
                    "&:hover": {
                      opacity: 1,
                      borderColor: isSelected ? "#FF6700" : "rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={img}
                    alt={`${productName || "Motorcycle"} thumbnail ${idx + 1}`}
                    decoding="async"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </ButtonBase>
              );
            })}
          </Box>

          <IconButton
            onClick={nextImage}
            aria-label="Next image"
            sx={{
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backgroundColor: "#0F0F14",
              color: "#D4D4D8",
              borderRadius: "8px",
              width: "40px",
              height: "40px",
              flexShrink: 0,
              "&:hover": {
                borderColor: "#FF6700",
                color: "#FF6700",
                backgroundColor: "rgba(255, 103, 0, 0.08)",
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
