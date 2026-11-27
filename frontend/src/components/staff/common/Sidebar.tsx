import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import CategoryIcon from "@mui/icons-material/Category";
import LabelIcon from "@mui/icons-material/Label";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import StorefrontIcon from "@mui/icons-material/Storefront";
import logo from "@/assets/images/common/logo.png";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const menuItems = [
  { text: "Dashboard", path: "/staff/dashboard", icon: <DashboardIcon /> },
  { text: "Products", path: "/staff/products", icon: <TwoWheelerIcon /> },
  { text: "Brands", path: "/staff/brands", icon: <LabelIcon /> },
  { text: "Categories", path: "/staff/categories", icon: <CategoryIcon /> },
];

const Sidebar = ({
  collapsed = false,
  onToggleCollapse,
  isMobile = false,
  onCloseMobile,
}: SidebarProps) => {
  const location = useLocation();

  const handleLinkClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <Box
      sx={{
        width: collapsed ? 80 : 260,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#111115",
        borderRight: "1px solid rgba(255, 255, 255, 0.05)",
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        zIndex: 1201,
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          px: collapsed ? 0 : 2.5,
          justifyContent: collapsed ? "center" : "flex-start",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          gap: 1.5,
        }}
      >
        <img
          src={logo}
          alt="TorqueX Logo"
          style={{ width: 32, height: 32 }}
        />
        {!collapsed && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: "0.15em",
              fontFamily: "monospace",
              color: "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            TORQUE<span style={{ color: "#ff6b35" }}>X</span>
            <Typography
              component="span"
              sx={{
                fontSize: 10,
                color: "#a1a1aa",
                letterSpacing: 2,
                ml: 1,
                verticalAlign: "super",
                fontWeight: 600,
              }}
            >
              STAFF
            </Typography>
          </Typography>
        )}
      </Box>

      {/* Navigation List */}
      <Box sx={{ flexGrow: 1, pt: 2, px: collapsed ? 1 : 1.5 }}>
        <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                onClick={handleLinkClick}
                sx={{
                  py: 1.25,
                  px: collapsed ? 0 : 2,
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius: 2,
                  backgroundColor: isActive ? "rgba(226, 138, 58, 0.08)" : "transparent",
                  color: isActive ? "#e28a3a" : "#a1a1aa",
                  borderLeft: isActive ? "3px solid #e28a3a" : "3px solid transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: isActive ? "rgba(226, 138, 58, 0.12)" : "rgba(255, 255, 255, 0.03)",
                    color: isActive ? "#e28a3a" : "#ffffff",
                    "& .MuiListItemIcon-root": {
                      color: isActive ? "#e28a3a" : "#ffffff",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : 36,
                    color: isActive ? "#e28a3a" : "#71717a",
                    justifyContent: "center",
                    transition: "color 0.2s ease",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "0.925rem",
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Sidebar Footer */}
      <Box sx={{ p: collapsed ? 1 : 1.5, display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)", my: 1 }} />

        <ListItemButton
          component={Link}
          to="/"
          onClick={handleLinkClick}
          sx={{
            py: 1.25,
            px: collapsed ? 0 : 2,
            justifyContent: collapsed ? "center" : "flex-start",
            borderRadius: 2,
            color: "#a1a1aa",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              color: "#ffffff",
              "& .MuiListItemIcon-root": { color: "#ffffff" },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: "#71717a", justifyContent: "center" }}>
            <StorefrontIcon />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText primary="View Storefront" primaryTypographyProps={{ fontSize: "0.925rem" }} />
          )}
        </ListItemButton>

        {!isMobile && onToggleCollapse && (
          <ListItemButton
            onClick={onToggleCollapse}
            sx={{
              py: 1.25,
              px: collapsed ? 0 : 2,
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 2,
              color: "#a1a1aa",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                color: "#ffffff",
                "& .MuiListItemIcon-root": { color: "#ffffff" },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 36,
                color: "#71717a",
                justifyContent: "center",
                transform: collapsed ? "rotate(180deg)" : "none",
                transition: "transform 0.25s ease",
              }}
            >
              <MenuOpenIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Collapse"
                primaryTypographyProps={{ fontSize: "0.925rem" }}
              />
            )}
          </ListItemButton>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
