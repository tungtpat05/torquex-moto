import { Box, IconButton, Typography, Avatar, useTheme, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../context";

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

function getInitials(fullName?: string): string {
  if (!fullName?.trim()) return "ST";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const Header = ({ onOpenMobileSidebar }: HeaderProps) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth();

  let title = "Dashboard";
  let subtitle = "Live catalog and inventory status";

  const path = location.pathname;

  if (path.startsWith("/staff/products/add")) {
    title = "Add Product";
    subtitle = "Create a new KTM model and variant inventory";
  } else if (path.startsWith("/staff/products/edit")) {
    title = "Edit Product";
    subtitle = "Modify model specifications, pricing, and variants";
  } else if (path.startsWith("/staff/products")) {
    title = "Products";
    subtitle = "Manage motorcycle catalog and variant stock";
  } else if (path.startsWith("/staff/categories/add")) {
    title = "Add Category";
    subtitle = "Create a new category and specification template";
  } else if (path.startsWith("/staff/categories/edit")) {
    title = "Edit Category";
    subtitle = "Update category metadata and specification fields";
  } else if (path.startsWith("/staff/categories")) {
    title = "Categories";
    subtitle = "Manage motorcycle categories and specs";
  } else if (path.startsWith("/staff/brands/add")) {
    title = "Add Brand";
    subtitle = "Register manufacturer identity";
  } else if (path.startsWith("/staff/brands/edit")) {
    title = "Edit Brand";
    subtitle = "Update brand details and logo";
  } else if (path.startsWith("/staff/brands")) {
    title = "Brands";
    subtitle = "Manage brand profile";
  }

  const displayName = user?.fullName || "Staff Member";
  const displayEmail = user?.email || "";
  const initials = getInitials(user?.fullName);

  return (
    <Box
      sx={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2, md: 3 },
        backgroundColor: "#09090b",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        {isMobile && (
          <IconButton
            onClick={onOpenMobileSidebar}
            edge="start"
            aria-label="open staff menu"
            sx={{ color: "#ffffff", p: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                color: "#ffffff",
              }}
            >
              {title}
            </Typography>
            {!isMobile && subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: "#71717a",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  "&::before": {
                    content: '"—"',
                    marginRight: 1,
                    marginLeft: 1,
                  },
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          {isMobile && subtitle && (
            <Typography
              variant="caption"
              sx={{ color: "#71717a", display: "block", mt: -0.25 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {!isMobile && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            alt={displayName}
            sx={{
              width: 36,
              height: 36,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backgroundColor: "#27272a",
              fontSize: "0.85rem",
              fontWeight: 600,
              color: "#ff6b35",
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#ffffff", fontSize: "0.85rem" }}
            >
              {displayName}
            </Typography>
            {displayEmail && (
              <Typography
                variant="caption"
                sx={{ color: "#71717a", fontSize: "0.75rem", mt: -0.25 }}
              >
                {displayEmail}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Header;
