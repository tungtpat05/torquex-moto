import { Paper, Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  sx?: object;
}

const SectionCard = ({ title, subtitle, children, sx = {} }: SectionCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "rgba(15, 15, 20, 0.92)",
        border: "1px solid rgba(255, 255, 255, 0.10)",
        borderTop: "1px solid rgba(255, 255, 255, 0.22)",
        borderRadius: "16px",
        p: { xs: 2, md: 3 },
        overflow: "hidden",
        position: "relative",
        ...sx,
      }}
    >
      {title && (
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.05rem",
              letterSpacing: "-0.01em",
              color: "#F4F4F5",
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                fontFamily: "var(--font-body)",
                color: "#A1A1AA",
                fontSize: "0.85rem",
                mt: 0.25,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      <Box sx={{ width: "100%" }}>{children}</Box>
    </Paper>
  );
};

export default SectionCard;
