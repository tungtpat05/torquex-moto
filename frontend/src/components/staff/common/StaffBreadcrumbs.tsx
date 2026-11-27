import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export interface StaffBreadcrumbItem {
  label: string;
  to?: string;
  onClick?: () => void;
}

interface StaffBreadcrumbsProps {
  items: StaffBreadcrumbItem[];
}

/** Semantic 1-line staff breadcrumb trail whose active tail serves as the page H1. */
const StaffBreadcrumbs = ({ items }: StaffBreadcrumbsProps) => {
  if (items.length === 0) return null;

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator=">"
      sx={{
        mb: 2.5,
        "& .MuiBreadcrumbs-separator": {
          color: "#71717A",
          mx: 1,
          fontSize: "0.85rem",
        },
        "& .MuiBreadcrumbs-ol": {
          alignItems: "center",
        },
      }}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        if (isLast) {
          return (
            <Typography
              key={item.label}
              component="h1"
              sx={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "#F4F4F5",
                lineHeight: 1.4,
                m: 0,
              }}
            >
              {item.label}
            </Typography>
          );
        }

        if (item.onClick) {
          return (
            <MuiLink
              key={item.label}
              component="button"
              type="button"
              underline="hover"
              onClick={item.onClick}
              sx={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.85rem",
                color: "#71717A",
                cursor: "pointer",
                lineHeight: 1.4,
                "&:hover": { color: "#F4F4F5" },
                "&:focus-visible": {
                  outline: "2px solid #FF6700",
                  outlineOffset: "2px",
                  borderRadius: "4px",
                },
              }}
            >
              {item.label}
            </MuiLink>
          );
        }

        if (item.to) {
          return (
            <MuiLink
              key={item.label}
              component={RouterLink}
              to={item.to}
              underline="hover"
              sx={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.85rem",
                color: "#71717A",
                lineHeight: 1.4,
                "&:hover": { color: "#F4F4F5" },
                "&:focus-visible": {
                  outline: "2px solid #FF6700",
                  outlineOffset: "2px",
                  borderRadius: "4px",
                },
              }}
            >
              {item.label}
            </MuiLink>
          );
        }

        return (
          <Typography
            key={item.label}
            component="span"
            sx={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: "0.85rem",
              color: "#71717A",
              lineHeight: 1.4,
            }}
          >
            {item.label}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
};

export default StaffBreadcrumbs;
