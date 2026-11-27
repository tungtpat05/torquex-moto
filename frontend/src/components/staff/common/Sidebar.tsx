import { useState, MouseEvent } from "react";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import CategoryIcon from "@mui/icons-material/Category";
import LabelIcon from "@mui/icons-material/Label";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { TorqueXMark, TorqueXKtmLockup } from "@/components/common/BrandMark";
import { useAuth } from "@/context";

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

function getInitials(fullName?: string): string {
  if (!fullName?.trim()) return "ST";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

const Sidebar = ({
  collapsed = false,
  onToggleCollapse,
  isMobile = false,
  onCloseMobile,
}: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [accountAnchorEl, setAccountAnchorEl] = useState<HTMLElement | null>(null);

  const isCollapsed = !isMobile && collapsed;
  const accountMenuOpen = Boolean(accountAnchorEl);

  const displayName = user?.fullName || "Staff Member";
  const displayEmail = user?.email || "";
  const initials = getInitials(user?.fullName);

  const handleLinkClick = () => {
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleOpenAccountMenu = (event: MouseEvent<HTMLElement>) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleCloseAccountMenu = () => {
    setAccountAnchorEl(null);
  };

  const handleNavigateFromMenu = (path: string) => {
    handleCloseAccountMenu();
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
    navigate(path);
  };

  const handleSignOut = async () => {
    handleCloseAccountMenu();
    await logout();
    if (isMobile && onCloseMobile) {
      onCloseMobile();
    }
    navigate("/login");
  };

  const collapseLabel = isCollapsed ? "Expand sidebar" : "Collapse";

  const accountTrigger = (
    <ListItemButton
      component="button"
      type="button"
      onClick={handleOpenAccountMenu}
      aria-label="Open account menu"
      aria-haspopup="menu"
      aria-expanded={accountMenuOpen}
      aria-controls={accountMenuOpen ? "staff-account-menu" : undefined}
      sx={{
        width: "100%",
        minHeight: 48,
        touchAction: "manipulation",
        py: 1,
        px: isCollapsed ? 0 : 1.5,
        justifyContent: isCollapsed ? "center" : "flex-start",
        gap: isCollapsed ? 0 : 1.25,
        borderRadius: "8px",
        backgroundColor: accountMenuOpen ? "rgba(255, 255, 255, 0.05)" : "transparent",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        transition: "background-color 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderColor: "rgba(255, 103, 0, 0.35)",
        },
        "&:focus-visible": {
          outline: "2px solid #FF6700",
          outlineOffset: "2px",
        },
      }}
    >
      <Avatar
        alt={displayName}
        sx={{
          width: 36,
          height: 36,
          backgroundColor: "#16161D",
          border: "1px solid rgba(255, 103, 0, 0.45)",
          color: "#FF6700",
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "0.82rem",
          flexShrink: 0,
        }}
      >
        {initials}
      </Avatar>

      {!isCollapsed && (
        <>
          <Box sx={{ minWidth: 0, flexGrow: 1, textAlign: "left" }}>
            <Typography
              variant="body2"
              noWrap
              sx={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "#F4F4F5",
                lineHeight: 1.3,
              }}
            >
              {displayName}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{
                display: "block",
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                color: "#A1A1AA",
                lineHeight: 1.2,
              }}
            >
              {displayEmail || "STAFF"}
            </Typography>
          </Box>
          <UnfoldMoreIcon sx={{ fontSize: 18, color: "#71717A", flexShrink: 0 }} />
        </>
      )}
    </ListItemButton>
  );

  return (
    <Box
      component="nav"
      aria-label="Staff navigation"
      sx={{
        width: isCollapsed ? 80 : 260,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0F0F14",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        flexShrink: 0,
        zIndex: 1201,
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          px: isCollapsed ? 0 : 2.5,
          justifyContent: isCollapsed ? "center" : "flex-start",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          flexShrink: 0,
        }}
      >
        <Tooltip title={isCollapsed ? "TorqueX Staff Dashboard" : ""} placement="right" arrow>
          <Box
            component={Link}
            to="/staff/dashboard"
            onClick={handleLinkClick}
            aria-label="TorqueX Staff Dashboard"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none",
              borderRadius: "8px",
              p: 0.5,
              "&:focus-visible": {
                outline: "2px solid #FF6700",
                outlineOffset: "2px",
              },
            }}
          >
            {isCollapsed ? (
              <TorqueXMark size={32} decorative={false} label="TorqueX Staff" />
            ) : (
              <TorqueXKtmLockup
                markSize={32}
                textSize="1.15rem"
                badgeText="STAFF"
                badgeTextColor="#070709"
              />
            )}
          </Box>
        </Tooltip>
      </Box>

      {/* Navigation List */}
      <Box sx={{ flexGrow: 1, pt: 2, px: isCollapsed ? 1 : 1.5, overflowY: "auto" }}>
        <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          {menuItems.map((item) => {
            const isActive =
              item.path === "/staff/dashboard"
                ? location.pathname === "/staff" || location.pathname === "/staff/" || location.pathname.startsWith("/staff/dashboard")
                : location.pathname.startsWith(item.path);

            const button = (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                onClick={handleLinkClick}
                aria-label={item.text}
                aria-current={isActive ? "page" : undefined}
                sx={{
                  py: 1.25,
                  px: isCollapsed ? 0 : 2,
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  borderRadius: "8px",
                  backgroundColor: isActive ? "rgba(255, 103, 0, 0.12)" : "transparent",
                  color: isActive ? "#FF6700" : "#A1A1AA",
                  borderLeft: isActive ? "3px solid #FF6700" : "3px solid transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: isActive
                      ? "rgba(255, 103, 0, 0.18)"
                      : "rgba(255, 255, 255, 0.04)",
                    color: isActive ? "#FF6700" : "#F4F4F5",
                    "& .MuiListItemIcon-root": {
                      color: isActive ? "#FF6700" : "#F4F4F5",
                    },
                  },
                  "&:focus-visible": {
                    outline: "2px solid #FF6700",
                    outlineOffset: "2px",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isCollapsed ? 0 : 36,
                    color: isActive ? "#FF6700" : "#71717A",
                    justifyContent: "center",
                    transition: "color 0.2s ease",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontFamily: "var(--font-body)",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.925rem",
                    }}
                  />
                )}
              </ListItemButton>
            );

            return isCollapsed ? (
              <Tooltip key={item.text} title={item.text} placement="right" arrow>
                {button}
              </Tooltip>
            ) : (
              button
            );
          })}
        </List>
      </Box>

      {/* Sidebar Footer: Collapse + Account Popover */}
      <Box
        sx={{
          p: isCollapsed ? 1 : 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          flexShrink: 0,
        }}
      >
        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }} />

        {!isMobile && onToggleCollapse && (
          <Tooltip title={isCollapsed ? collapseLabel : ""} placement="right" arrow>
            <ListItemButton
              onClick={onToggleCollapse}
              aria-label={collapseLabel}
              aria-expanded={!isCollapsed}
              sx={{
                py: 1,
                px: isCollapsed ? 0 : 2,
                justifyContent: isCollapsed ? "center" : "flex-start",
                borderRadius: "8px",
                color: "#A1A1AA",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  color: "#F4F4F5",
                  "& .MuiListItemIcon-root": { color: "#F4F4F5" },
                },
                "&:focus-visible": {
                  outline: "2px solid #FF6700",
                  outlineOffset: "2px",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isCollapsed ? 0 : 36,
                  color: "#71717A",
                  justifyContent: "center",
                  transform: isCollapsed ? "rotate(180deg)" : "none",
                  transition: "transform 0.25s ease",
                }}
              >
                <MenuOpenIcon />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary="Collapse"
                  primaryTypographyProps={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        )}

        {isCollapsed ? (
          <Tooltip title={displayName} placement="right" arrow>
            {accountTrigger}
          </Tooltip>
        ) : (
          accountTrigger
        )}

        <Menu
          id="staff-account-menu"
          anchorEl={accountAnchorEl}
          open={accountMenuOpen}
          onClose={handleCloseAccountMenu}
          sx={{ zIndex: 1400 }}
          anchorOrigin={
            isCollapsed
              ? { vertical: "bottom", horizontal: "right" }
              : { vertical: "top", horizontal: "left" }
          }
          transformOrigin={
            isCollapsed
              ? { vertical: "bottom", horizontal: "left" }
              : { vertical: "bottom", horizontal: "left" }
          }
          slotProps={{
            paper: {
              sx: {
                ml: isCollapsed ? 1 : 0,
                mb: isCollapsed ? 0 : 1,
                minWidth: 236,
                backgroundColor: "#0F0F14",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderTop: "1px solid rgba(255, 255, 255, 0.22)",
                borderRadius: "12px",
                boxShadow: "0 16px 40px rgba(0, 0, 0, 0.65)",
                color: "#F4F4F5",
                "& .MuiMenuItem-root": {
                  fontFamily: "var(--font-body)",
                  fontSize: "0.875rem",
                  borderRadius: "6px",
                  mx: 0.75,
                  px: 1.25,
                  py: 1,
                },
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.25, display: "flex", alignItems: "center", gap: 1.25 }}>
            <Avatar
              alt={displayName}
              sx={{
                width: 36,
                height: 36,
                backgroundColor: "#16161D",
                border: "1px solid rgba(255, 103, 0, 0.45)",
                color: "#FF6700",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "0.82rem",
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ fontWeight: 700, color: "#F4F4F5", fontSize: "0.85rem" }}
                >
                  {displayName}
                </Typography>
                <Box
                  component="span"
                  sx={{
                    backgroundColor: "#FF6700",
                    color: "#070709",
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "0.58rem",
                    letterSpacing: "0.08em",
                    px: 0.6,
                    py: 0.2,
                    borderRadius: "2px",
                    lineHeight: 1,
                  }}
                >
                  STAFF
                </Box>
              </Box>
              {displayEmail && (
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    display: "block",
                    fontFamily: "var(--font-mono)",
                    color: "#A1A1AA",
                    fontSize: "0.7rem",
                  }}
                >
                  {displayEmail}
                </Typography>
              )}
            </Box>
          </Box>

          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 0.5 }} />

          <MenuItem
            onClick={() => handleNavigateFromMenu("/profile")}
            sx={{
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.05)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: "#A1A1AA" }}>
              <PersonOutlineIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>

          <MenuItem
            onClick={() => handleNavigateFromMenu("/")}
            sx={{
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.05)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: "#A1A1AA" }}>
              <StorefrontIcon fontSize="small" />
            </ListItemIcon>
            View Storefront
          </MenuItem>

          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 0.5 }} />

          <MenuItem
            onClick={() => void handleSignOut()}
            sx={{
              color: "#FCA5A5",
              "&:hover": {
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                color: "#EF4444",
                "& .MuiListItemIcon-root": { color: "#EF4444" },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: "#EF4444" }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Sign Out
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Sidebar;
