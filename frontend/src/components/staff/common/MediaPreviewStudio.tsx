import React, { ReactNode, useEffect, useState } from "react";
import { Box, Button, CircularProgress, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

interface MediaPreviewStudioProps {
  imageUrl?: string;
  alt: string;
  fallbackText?: string;
  urlInput: ReactNode;
  uploading: boolean;
  uploadError?: string | null;
  disabled?: boolean;
  uploadLabel?: string;
  clearLabel?: string;
  specHint?: string;
  onUploadFile: (file: File) => void | Promise<void>;
  onClear?: () => void;
}

/** Studio-stage media preview with Dark/Light backdrop contrast switch, drag-and-drop upload, and clear action. */
const MediaPreviewStudio = ({
  imageUrl,
  alt,
  fallbackText = "?",
  urlInput,
  uploading,
  uploadError,
  disabled = false,
  uploadLabel = "Upload Image",
  clearLabel = "Clear",
  specHint = "PNG, SVG, WEBP, JPG • Aspect preserved (contain)",
  onUploadFile,
  onClear,
}: MediaPreviewStudioProps) => {
  const [surface, setSurface] = useState<"dark" | "light">("dark");
  const [isDragging, setIsDragging] = useState(false);
  const [imgError, setImgError] = useState(false);

  const trimmedUrl = imageUrl?.trim() || "";

  useEffect(() => {
    setImgError(false);
  }, [trimmedUrl]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    void onUploadFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      void onUploadFile(file);
    }
  };

  const showImage = Boolean(trimmedUrl) && !imgError;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "flex-start" },
        gap: 3,
      }}
    >
      {/* Left Studio Stage */}
      <Box sx={{ width: { xs: "100%", md: 280 }, flexShrink: 0, display: "flex", flexDirection: "column", gap: 1.25 }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: 196,
            borderRadius: "12px",
            border: "1px solid",
            borderColor: surface === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(7, 7, 9, 0.18)",
            backgroundColor: surface === "dark" ? "#16161D" : "#F4F4F5",
            backgroundImage:
              surface === "dark"
                ? "radial-gradient(circle at 50% 45%, rgba(255, 103, 0, 0.12), transparent 68%)"
                : "radial-gradient(circle at 50% 45%, rgba(0, 0, 0, 0.04), transparent 70%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            overflow: "hidden",
            transition: "background-color 0.2s ease, border-color 0.2s ease",
          }}
        >
          {showImage ? (
            <Box
              component="img"
              src={trimmedUrl}
              alt={alt}
              onError={() => setImgError(true)}
              sx={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
              }}
            />
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "2.25rem",
                  color: "#FF6700",
                  lineHeight: 1,
                }}
              >
                {fallbackText}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.75,
                  fontFamily: "var(--font-mono)",
                  color: surface === "dark" ? "#71717A" : "#52525B",
                  fontSize: "0.7rem",
                }}
              >
                {imgError ? "IMAGE LOAD FAILED" : "NO ASSET PREVIEW"}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              color: "#71717A",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Contrast Surface
          </Typography>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={surface}
            onChange={(_e, next) => {
              if (next) setSurface(next);
            }}
            aria-label="Preview backdrop contrast"
            sx={{
              "& .MuiToggleButton-root": {
                px: 1,
                py: 0.4,
                fontSize: "0.7rem",
                fontFamily: "var(--font-mono)",
                textTransform: "none",
                color: "#A1A1AA",
                borderColor: "rgba(255, 255, 255, 0.12)",
                gap: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "rgba(255, 103, 0, 0.16)",
                  color: "#FF6700",
                  borderColor: "rgba(255, 103, 0, 0.45)",
                },
              },
            }}
          >
            <ToggleButton value="dark" aria-label="Dark surface">
              <DarkModeIcon sx={{ fontSize: 13 }} />
              Dark
            </ToggleButton>
            <ToggleButton value="light" aria-label="Light surface">
              <LightModeIcon sx={{ fontSize: 13 }} />
              Light
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {/* Right URL + Dropzone Controls */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        {urlInput}

        <Box
          component="label"
          onDragOver={(e: React.DragEvent<HTMLLabelElement>) => {
            e.preventDefault();
            if (!disabled && !uploading) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
            py: 2.25,
            px: 2,
            borderRadius: "12px",
            border: "1px dashed",
            borderColor: isDragging ? "#FF6700" : "rgba(255, 255, 255, 0.16)",
            backgroundColor: isDragging ? "rgba(255, 103, 0, 0.08)" : "#16161D",
            cursor: disabled || uploading ? "not-allowed" : "pointer",
            transition: "border-color 0.2s ease, background-color 0.2s ease",
            "&:hover": disabled || uploading
              ? undefined
              : {
                  borderColor: "#FF6700",
                  backgroundColor: "rgba(255, 103, 0, 0.05)",
                },
            "&:focus-within": {
              outline: "2px solid #FF6700",
              outlineOffset: "2px",
            },
          }}
        >
          {uploading ? (
            <CircularProgress size={22} sx={{ color: "#FF6700" }} />
          ) : (
            <CloudUploadIcon sx={{ color: "#FF6700", fontSize: 26 }} />
          )}
          <Typography
            variant="body2"
            sx={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              color: "#F4F4F5",
              fontSize: "0.875rem",
              textAlign: "center",
            }}
          >
            {uploading ? "Uploading media..." : `${uploadLabel} or drag & drop`}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "#71717A",
              textAlign: "center",
            }}
          >
            {specHint}
          </Typography>
          <input
            type="file"
            hidden
            accept="image/*"
            disabled={disabled || uploading}
            onChange={handleFileInput}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          {uploadError ? (
            <Typography color="error" variant="caption" sx={{ fontWeight: 600 }}>
              {uploadError}
            </Typography>
          ) : (
            <span />
          )}

          {onClear && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<DeleteOutlineIcon fontSize="small" />}
              onClick={onClear}
              disabled={disabled || uploading || !trimmedUrl}
              sx={{
                borderRadius: "8px",
                borderColor: "rgba(255, 255, 255, 0.16)",
                color: "#A1A1AA",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#EF4444",
                  color: "#EF4444",
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                },
              }}
            >
              {clearLabel}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MediaPreviewStudio;
