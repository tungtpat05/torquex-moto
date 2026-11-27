import { useEffect } from "react";
import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const MainLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    if (location.hash) return;
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#070709", color: "#F4F4F5" }}>
      <Navbar />
      <Box component="main" sx={{ pt: isHomePage ? 0 : { xs: "82px", md: "96px" } }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
