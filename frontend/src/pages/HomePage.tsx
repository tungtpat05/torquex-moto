import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import { initSmoothScroll, destroySmoothScroll, getLenis } from "@/lib/smoothScroll";
import HeroAwakening from "@/components/home/HeroAwakening";
import ApexSurge from "@/components/home/ApexSurge";
import PedigreeHeritage from "@/components/home/PedigreeHeritage";
import BloodlineFleet from "@/components/home/BloodlineFleet";
import CrateHandover from "@/components/home/CrateHandover";

const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    initSmoothScroll();

    return () => {
      destroySmoothScroll();
    };
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const targetHash = location.hash;
    const timer = window.setTimeout(() => {
      const targetEl = document.querySelector(targetHash) as HTMLElement | null;
      if (!targetEl) return;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(targetEl, { duration: 1.0 });
      } else {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 180);

    return () => window.clearTimeout(timer);
  }, [location.hash]);

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#070709",
        color: "#F4F4F5",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <HeroAwakening />
      <ApexSurge />
      <PedigreeHeritage />
      <BloodlineFleet />
      <CrateHandover />
    </Box>
  );
};

export default HomePage;
