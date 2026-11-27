import React from "react";
import { Box, Typography } from "@mui/material";

interface TorqueXMarkProps {
  size?: number;
  decorative?: boolean;
  label?: string;
}

/** Vector TX monogram matching /favicon.svg so tab, staff, and auth marks stay identical. */
export const TorqueXMark: React.FC<TorqueXMarkProps> = ({
  size = 32,
  decorative = true,
  label = "TorqueX Emblem",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width={size}
    height={size}
    fill="none"
    aria-hidden={decorative ? "true" : undefined}
    role={decorative ? undefined : "img"}
    aria-label={decorative ? undefined : label}
    style={{ flexShrink: 0, display: "block" }}
  >
    <rect width="64" height="64" rx="14" fill="#070709" />
    <rect
      x="2"
      y="2"
      width="60"
      height="60"
      rx="12"
      stroke="#FF6700"
      strokeOpacity="0.55"
      strokeWidth="2.5"
    />
    <path d="M12 18H36L32 25H25L20 46H12.5L17.5 25H10L12 18Z" fill="#FFFFFF" />
    <path
      d="M35 18H43.5L46 27.5L52.5 18H60L49.5 32L55.5 46H47L44.2 36.2L37.5 46H29.5L40.5 31.8L35 18Z"
      fill="#FF6700"
    />
  </svg>
);

interface TorqueXKtmLockupProps {
  badgeText?: string;
  showMark?: boolean;
  markSize?: number;
  textSize?: string | { xs?: string; sm?: string; md?: string };
  asHeading?: boolean;
  tone?: "dark" | "light";
  badgeTextColor?: string;
}

/** Shared TORQUEX + pill badge lockup (matches Customer Navbar / Footer / Staff DNA). */
export const TorqueXKtmLockup: React.FC<TorqueXKtmLockupProps> = ({
  badgeText = "KTM",
  showMark = true,
  markSize = 36,
  textSize = "1.45rem",
  asHeading = false,
  tone = "dark",
  badgeTextColor = "#FFFFFF",
}) => (
  <Box
    component={asHeading ? "h1" : "div"}
    sx={{ m: 0, display: "inline-flex", alignItems: "center", gap: 1.25 }}
  >
    {showMark && <TorqueXMark size={markSize} />}
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.9 }}>
      <Typography
        component="span"
        sx={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: textSize,
          letterSpacing: "-0.04em",
          color: tone === "light" ? "#0A0A0C" : "#F4F4F5",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        TORQUEX
      </Typography>
      <Box
        component="span"
        sx={{
          backgroundColor: "#FF6700",
          color: badgeTextColor,
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: "0.62rem",
          letterSpacing: "0.08em",
          px: 0.65,
          py: 0.25,
          borderRadius: "2px",
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {badgeText}
      </Box>
    </Box>
  </Box>
);
