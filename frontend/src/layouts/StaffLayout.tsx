import { useEffect, useRef, useState } from "react";
import { Box, Drawer, IconButton, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/staff/common/Sidebar";
import { TorqueXKtmLockup } from "../components/common/BrandMark";

const StaffLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement | null>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const sidebarWidth = collapsed ? 80 : 260;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100dvh",
        height: { md: "100dvh" },
        overflowX: "clip",
        overflowY: { md: "hidden" },
        backgroundColor: "#070709",
      }}
    >
      {!isMobile && (
        <Sidebar collapsed={collapsed} onToggleCollapse={handleToggleCollapse} />
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 260,
              backgroundColor: "#0F0F14",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          <Sidebar isMobile={true} onCloseMobile={handleDrawerToggle} />
        </Drawer>
      )}

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          width: isMobile ? "100%" : `calc(100% - ${sidebarWidth}px)`,
          minHeight: "100dvh",
          height: { md: "100%" },
          transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          backgroundColor: "#070709",
        }}
      >
        {/* Minimal Mobile Top Bar (< md only) */}
        <Box
          component="header"
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 1.5,
            height: 56,
            px: 2,
            position: "sticky",
            top: 0,
            zIndex: 1100,
            backgroundColor: "rgba(7, 7, 9, 0.88)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            flexShrink: 0,
          }}
        >
          <IconButton
            onClick={handleDrawerToggle}
            edge="start"
            aria-label="Open staff menu"
            sx={{
              color: "#F4F4F5",
              minWidth: 40,
              minHeight: 40,
              "&:focus-visible": {
                outline: "2px solid #FF6700",
                outlineOffset: "2px",
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            component={Link}
            to="/staff/dashboard"
            aria-label="TorqueX Staff Dashboard"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              textDecoration: "none",
              "&:focus-visible": {
                outline: "2px solid #FF6700",
                outlineOffset: "2px",
                borderRadius: "4px",
              },
            }}
          >
            <TorqueXKtmLockup
              markSize={26}
              textSize="1rem"
              badgeText="STAFF"
              badgeTextColor="#070709"
            />
          </Box>
        </Box>

        <Box
          ref={mainRef}
          component="main"
          tabIndex={-1}
          sx={{
            flexGrow: 1,
            overflowY: { md: "auto" },
            overflowX: "hidden",
            p: { xs: 2, md: 3 },
            backgroundColor: "#070709",
            "&:focus": {
              outline: "none",
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default StaffLayout;
