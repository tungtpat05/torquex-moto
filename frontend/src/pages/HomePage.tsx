import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { initSmoothScroll, destroySmoothScroll } from '@/lib/smoothScroll';
import KtmHeroAwakening from '@/components/ktm/KtmHeroAwakening';
import KtmAnatomyFury from '@/components/ktm/KtmAnatomyFury';
import KtmApexSurge from '@/components/ktm/KtmApexSurge';
import KtmPedigreeHeritage from '@/components/ktm/KtmPedigreeHeritage';
import KtmBloodlineFleet from '@/components/ktm/KtmBloodlineFleet';
import KtmCrateHandover from '@/components/ktm/KtmCrateHandover';

const HomePage: React.FC = () => {
  useEffect(() => {
    initSmoothScroll();

    return () => {
      destroySmoothScroll();
    };
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#070709',
        color: '#F4F4F5',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      {/* Act I: The Awakening (100svh Natural Parallax Flow — No Pinning) */}
      <KtmHeroAwakening />

      {/* Act II: The Anatomy of Fury (250vh Pinned Stage — The ONLY Pin) */}
      <KtmAnatomyFury />

      {/* Act III: The Apex Surge (High-Velocity Editorial Action Cascade) */}
      <KtmApexSurge />

      {/* Act IV Part A: The Pedigree (18 Dakar Titles & MotoGP Heritage) */}
      <KtmPedigreeHeritage />

      {/* Act IV Part B: The Bloodline Fleet (Curated 6 KTM Weapons Showroom) */}
      <KtmBloodlineFleet />

      {/* Act V: The Crate Handover Ceremony & VIN Allocation Lock */}
      <KtmCrateHandover />
    </Box>
  );
};

export default HomePage;
