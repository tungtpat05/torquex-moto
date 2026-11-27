import React from "react";
import { Box, Typography } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import SettingsIcon from "@mui/icons-material/Settings";
import ConstructionIcon from "@mui/icons-material/Construction";
import ScaleIcon from "@mui/icons-material/Scale";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import BoltIcon from "@mui/icons-material/Bolt";
import { Product } from "@/types/product.ts";
import { ProductSpecification } from "@/types/specDefinition.ts";

interface SpecStripProps {
  product: Product;
}

const CORE_TELEMETRY_KEYS = ["displacement", "max_power", "max_torque", "dry_weight"];

const getSpecIcon = (keyCode: string) => {
  const code = keyCode.toLowerCase();
  if (code.includes("displacement") || code.includes("cc") || code.includes("engine")) {
    return <SpeedIcon sx={{ color: "#FF6700", fontSize: "1.35rem" }} />;
  }
  if (code.includes("power") || code.includes("hp")) {
    return <FlashOnIcon sx={{ color: "#FF6700", fontSize: "1.35rem" }} />;
  }
  if (code.includes("torque") || code.includes("nm")) {
    return <SettingsIcon sx={{ color: "#FF6700", fontSize: "1.35rem" }} />;
  }
  if (code.includes("transmission") || code.includes("gear") || code.includes("box")) {
    return <ConstructionIcon sx={{ color: "#FF6700", fontSize: "1.35rem" }} />;
  }
  if (code.includes("weight") || code.includes("kg")) {
    return <ScaleIcon sx={{ color: "#FF6700", fontSize: "1.35rem" }} />;
  }
  if (code.includes("fuel") || code.includes("gas") || code.includes("tank")) {
    return <LocalGasStationIcon sx={{ color: "#FF6700", fontSize: "1.35rem" }} />;
  }
  if (code.includes("height") || code.includes("seat") || code.includes("mm")) {
    return <SwapCallsIcon sx={{ color: "#FF6700", fontSize: "1.35rem" }} />;
  }
  return <BoltIcon sx={{ color: "#FF6700", fontSize: "1.35rem" }} />;
};

const formatSpecNumberOrText = (spec: ProductSpecification): { main: string; unit?: string } => {
  if (spec.dataType === "select" && spec.optionValue) {
    return { main: spec.optionValue };
  }
  if (spec.dataType === "number" && spec.valueNumber !== undefined && spec.valueNumber !== null) {
    const num = Number(spec.valueNumber);
    const formattedNum = Number.isInteger(num) ? num.toLocaleString() : String(num);
    return { main: formattedNum, unit: spec.unit?.toUpperCase() || undefined };
  }
  if (spec.value) {
    return { main: spec.value };
  }
  return { main: "—" };
};

const SpecStrip: React.FC<SpecStripProps> = ({ product }) => {
  const specifications = product.specifications || [];

  if (specifications.length === 0) {
    return null;
  }

  // Pick 4 core telemetry specs matching BloodlineFleet / HeroAwakening, then backfill up to 4 if absent
  const prioritized = CORE_TELEMETRY_KEYS
    .map((key) => specifications.find((s) => s.keyCode?.toLowerCase() === key))
    .filter((s): s is ProductSpecification => Boolean(s));

  const remaining = specifications.filter((s) => !prioritized.includes(s));
  const displaySpecs = [...prioritized, ...remaining].slice(0, 4);

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          md: `repeat(${displaySpecs.length}, 1fr)`,
        },
        gap: 2,
      }}
    >
      {displaySpecs.map((spec, index) => {
        const { main, unit } = formatSpecNumberOrText(spec);
        return (
          <Box
            key={spec.id || index}
            sx={{
              p: { xs: 2.25, md: 2.75 },
              borderRadius: "16px",
              backgroundColor: "rgba(15, 15, 20, 0.90)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              borderTop: "1px solid rgba(255, 255, 255, 0.25)",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.65)",
              display: "flex",
              flexDirection: "column",
              gap: 1.25,
              transition: "border-color 0.25s ease, transform 0.2s ease",
              "&:hover": {
                borderColor: "#FF6700",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.64rem",
                  fontWeight: 700,
                  color: "#A1A1AA",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {spec.displayName}
              </Typography>
              {getSpecIcon(spec.keyCode || "")}
            </Box>

            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.8, flexWrap: "wrap" }}>
              <Typography
                className="tabular-nums"
                sx={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  fontSize: { xs: "1.25rem", md: "1.55rem" },
                  lineHeight: 1.1,
                }}
              >
                {main}
              </Typography>
              {unit && (
                <Typography
                  sx={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.74rem",
                    fontWeight: 800,
                    color: "#FF6700",
                    letterSpacing: "0.08em",
                  }}
                >
                  {unit}
                </Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default SpecStrip;
