import { Box, Chip } from "@mui/material";

export type StatusType = "Active" | "Inactive" | string;

interface StatusChipProps {
  status: StatusType;
}

const StatusChip = ({ status }: StatusChipProps) => {
  const isActive = status.toLowerCase() === "active";

  const colorSetting = isActive
    ? {
        bg: "rgba(34, 197, 94, 0.10)",
        text: "#4ADE80",
        dot: "#22C55E",
        border: "rgba(34, 197, 94, 0.25)",
      }
    : {
        bg: "rgba(239, 68, 68, 0.10)",
        text: "#FCA5A5",
        dot: "#EF4444",
        border: "rgba(239, 68, 68, 0.25)",
      };

  return (
    <Chip
      variant="outlined"
      size="small"
      label={
        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
          <Box
            component="span"
            aria-hidden="true"
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: colorSetting.dot,
              flexShrink: 0,
            }}
          />
          {status}
        </Box>
      }
      sx={{
        backgroundColor: colorSetting.bg,
        color: colorSetting.text,
        borderColor: colorSetting.border,
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontSize: "0.7rem",
        height: 24,
        borderRadius: "100px",
        "& .MuiChip-label": {
          px: 1.25,
        },
      }}
    />
  );
};

export default StatusChip;
