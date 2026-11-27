import { ReactNode } from "react";
import { Box, Card, Typography } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface MetricCardProps {
  title: string;
  value: string;
  diff: string;
  tone?: "neutral" | "positive" | "warning" | "danger";
  trend?: "up" | "down";
  icon: ReactNode;
}

const toneColors: Record<NonNullable<MetricCardProps["tone"]>, string> = {
  neutral: "#A1A1AA",
  positive: "#4ADE80",
  warning: "#FBBF24",
  danger: "#FCA5A5",
};

const MetricCard = ({
  title,
  value,
  diff,
  tone = "neutral",
  trend,
  icon,
}: MetricCardProps) => {
  const diffColor = toneColors[tone];

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: "rgba(15, 15, 20, 0.92)",
        border: "1px solid rgba(255, 255, 255, 0.10)",
        borderTop: "1px solid rgba(255, 255, 255, 0.22)",
        borderRadius: "16px",
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "var(--font-mono)",
            color: "#A1A1AA",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            fontSize: "0.72rem",
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "8px",
            backgroundColor: "#16161D",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FF6700",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          {icon}
        </Box>
      </Box>

      <Box>
        <Typography
          variant="h4"
          className="tabular-nums"
          sx={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            color: "#F4F4F5",
            mb: 0.75,
            fontSize: { xs: "1.75rem", md: "2.15rem" },
            lineHeight: 1.1,
          }}
        >
          {value}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {trend === "up" && <ArrowUpwardIcon sx={{ color: diffColor, fontSize: "0.85rem" }} />}
          {trend === "down" && <ArrowDownwardIcon sx={{ color: diffColor, fontSize: "0.85rem" }} />}
          <Typography
            variant="caption"
            className="tabular-nums"
            sx={{
              fontFamily: "var(--font-mono)",
              color: diffColor,
              fontWeight: 600,
              fontSize: "0.76rem",
            }}
          >
            {diff}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default MetricCard;
