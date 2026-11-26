import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Box, ButtonBase, Snackbar, Typography } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import sdr1390RightImg from '@/assets/images/ktm/models/1390_sdr_90_right.png';
import duke990Img from '@/assets/images/ktm/models/990_duke_90_right.png';
import duke390Img from '@/assets/images/ktm/models/390_duke_90_right.png';
import rc8cImg from '@/assets/images/ktm/models/rc_8c_studio.png';
import adv1290Img from '@/assets/images/ktm/models/1290_adv_90_right.png';
import smc690Img from '@/assets/images/ktm/models/690_smc_90_right.png';

gsap.registerPlugin(ScrollTrigger);

export interface KtmVehicle {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  category: 'NAKED' | 'SUPERSPORT' | 'TRAVEL & SMC';
  msrpUsd: number;
  msrpVnd: string;
  powerHp: number;
  torqueNm: number;
  displacementCc: number;
  dryWeightKg: number;
  image: string;
  badge?: string;
  isTransparent?: boolean;
}

const KTM_FLEET: KtmVehicle[] = [
  {
    id: 53,
    slug: '1390-super-duke-r-evo',
    name: 'KTM 1390 Super Duke R Evo',
    tagline: 'THE BEAST // APEX PREDATOR',
    category: 'NAKED',
    msrpUsd: 21499,
    msrpVnd: '~546,000,000 VND',
    powerHp: 190,
    torqueNm: 145,
    displacementCc: 1350,
    dryWeightKg: 189,
    image: sdr1390RightImg,
    badge: 'CENTERPIECE FLAGSHIP',
    isTransparent: true,
  },
  {
    id: 54,
    slug: '890-duke-r',
    name: 'KTM 990 Duke',
    tagline: 'THE SCALPEL // LASER PRECISION',
    category: 'NAKED',
    msrpUsd: 12500,
    msrpVnd: '~317,000,000 VND',
    powerHp: 123,
    torqueNm: 103,
    displacementCc: 947,
    dryWeightKg: 179,
    image: duke990Img,
    isTransparent: true,
  },
  {
    id: 56,
    slug: '390-duke',
    name: 'KTM 390 Duke',
    tagline: 'THE CORNER ROCKET // URBAN WEAPON',
    category: 'NAKED',
    msrpUsd: 5899,
    msrpVnd: '~149,000,000 VND',
    powerHp: 45,
    torqueNm: 39,
    displacementCc: 399,
    dryWeightKg: 165,
    image: duke390Img,
    isTransparent: true,
  },
  {
    id: 49,
    slug: 'rc-8c',
    name: 'KTM RC 8C',
    tagline: 'MOTO2 PROTOTYPE DNA // TRACK-ONLY',
    category: 'SUPERSPORT',
    msrpUsd: 41499,
    msrpVnd: '~1,050,000,000 VND',
    powerHp: 135,
    torqueNm: 98,
    displacementCc: 889,
    dryWeightKg: 142,
    image: rc8cImg,
    badge: 'LIMITED 100 UNITS',
    isTransparent: true,
  },
  {
    id: 57,
    slug: '1290-super-adv',
    name: 'KTM 1290 Super Adventure R',
    tagline: 'THE TRANSCONTINENTAL WEAPON',
    category: 'TRAVEL & SMC',
    msrpUsd: 20299,
    msrpVnd: '~515,000,000 VND',
    powerHp: 160,
    torqueNm: 138,
    displacementCc: 1301,
    dryWeightKg: 221,
    image: adv1290Img,
    isTransparent: true,
  },
  {
    id: 61,
    slug: '500-exc-f',
    name: 'KTM 690 SMC R',
    tagline: 'THE SUPERMOTO KING // PURE AGILITY',
    category: 'TRAVEL & SMC',
    msrpUsd: 12499,
    msrpVnd: '~317,000,000 VND',
    powerHp: 74,
    torqueNm: 73.5,
    displacementCc: 693,
    dryWeightKg: 147,
    image: smc690Img,
    isTransparent: true,
  },
];

type FilterCategory = 'ALL' | 'NAKED' | 'SUPERSPORT' | 'TRAVEL & SMC';

const CATEGORY_TABS: { key: FilterCategory; label: string }[] = [
  { key: 'ALL', label: 'ALL MODELS' },
  { key: 'NAKED', label: 'NAKED' },
  { key: 'SUPERSPORT', label: 'SUPERSPORT' },
  { key: 'TRAVEL & SMC', label: 'TRAVEL & SMC' },
];

export const KtmBloodlineFleet: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [previewNotice, setPreviewNotice] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<FilterCategory, number> = {
      ALL: KTM_FLEET.length,
      NAKED: 0,
      SUPERSPORT: 0,
      'TRAVEL & SMC': 0,
    };
    KTM_FLEET.forEach((bike) => {
      counts[bike.category] += 1;
    });
    return counts;
  }, []);

  const filteredVehicles = useMemo(
    () =>
      activeFilter === 'ALL'
        ? KTM_FLEET
        : KTM_FLEET.filter((v) => v.category === activeFilter),
    [activeFilter]
  );

  // GSAP ScrollTrigger entrance synchronized with Parts 1-3
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.fleet-header-reveal',
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.fleet-grid-reveal',
        { y: 42, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.fleet-grid-reveal',
            start: 'top 86%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      id="fleet"
      ref={sectionRef}
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#070709',
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 6, lg: 10 },
        overflow: 'hidden',
      }}
    >
      {/* Subtle Top Atmospheric Gradient Seam */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1280px',
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255, 103, 0, 0.25) 30%, rgba(255, 255, 255, 0.14) 50%, rgba(255, 103, 0, 0.25) 70%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Ambient Overhead Studio Glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '960px',
          height: '420px',
          background:
            'radial-gradient(ellipse at center, rgba(255, 103, 0, 0.10) 0%, rgba(255, 103, 0, 0.02) 50%, transparent 75%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ maxWidth: '1320px', mx: 'auto', position: 'relative', zIndex: 2 }}>
        {/* Section Header */}
        <Box
          className="fleet-header-reveal"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            mb: { xs: 6, md: 8 },
          }}
        >
          {/* Pulse-Dot Telemetry Eyebrow (Synced with Parts 1-3) */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.4,
              alignSelf: 'flex-start',
              px: 2,
              py: 0.65,
              borderRadius: '100px',
              backgroundColor: 'rgba(15, 15, 20, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 103, 0, 0.45)',
              boxShadow: '0 0 24px rgba(255, 103, 0, 0.22)',
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#FF6700',
                boxShadow: '0 0 10px #FF6700',
                animation: 'fleetPulseDot 2s ease-in-out infinite',
                '@keyframes fleetPulseDot': {
                  '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                  '50%': { transform: 'scale(1.45)', opacity: 0.55 },
                },
              }}
            />
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: { xs: '0.64rem', md: '0.72rem' },
                fontWeight: 800,
                letterSpacing: '0.16em',
                color: '#FF6700',
                textTransform: 'uppercase',
              }}
            >
              MATTIGHOFEN LINEUP • 6 FACTORY MACHINES
            </Typography>
          </Box>

          {/* Two-Tone Monumental Title + Redesigned Segmented HUD Filter Rail */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', lg: 'flex-end' },
              gap: 4,
            }}
          >
            <Box>
              <Typography
                component="h2"
                sx={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 950,
                  fontSize: { xs: '2.3rem', sm: '3.4rem', md: '4.2rem' },
                  letterSpacing: '-0.035em',
                  lineHeight: 0.98,
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  textShadow: '0 4px 30px rgba(0, 0, 0, 0.9)',
                }}
              >
                THE BLOODLINE FLEET.
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    color: '#FF6700',
                    textShadow: '0 0 38px rgba(255, 103, 0, 0.55)',
                  }}
                >
                  CHOOSE YOUR WEAPON.
                </Box>
              </Typography>
            </Box>

            {/* Redesigned Motorsport HUD Filter Dock */}
            <Box
              role="group"
              aria-label="Filter motorcycles by discipline"
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 0.75,
                p: 0.75,
                borderRadius: { xs: '16px', md: '100px' },
                backgroundColor: 'rgba(15, 15, 20, 0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderTop: '1px solid rgba(255, 255, 255, 0.24)',
                boxShadow: '0 14px 36px rgba(0, 0, 0, 0.65)',
                maxWidth: '100%',
              }}
            >
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeFilter === tab.key;
                return (
                  <ButtonBase
                    key={tab.key}
                    aria-pressed={isActive}
                    onClick={() => setActiveFilter(tab.key)}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: { xs: 1.8, sm: 2.2 },
                      py: 0.95,
                      borderRadius: '100px',
                      backgroundColor: isActive ? '#FF6700' : 'transparent',
                      color: isActive ? '#070709' : '#A1A1AA',
                      boxShadow: isActive ? '0 0 24px rgba(255, 103, 0, 0.45)' : 'none',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      '&:hover': {
                        backgroundColor: isActive ? '#FF7D24' : 'rgba(255, 255, 255, 0.06)',
                        color: isActive ? '#070709' : '#FFFFFF',
                      },
                      '&:focus-visible': {
                        outline: '2px solid #FF6700',
                        outlineOffset: '2px',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        letterSpacing: '0.1em',
                        lineHeight: 1,
                      }}
                    >
                      {tab.label}
                    </Typography>
                    <Box
                      component="span"
                      className="tabular-nums"
                      sx={{
                        px: 0.8,
                        py: 0.25,
                        borderRadius: '100px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        lineHeight: 1,
                        backgroundColor: isActive
                          ? 'rgba(7, 7, 9, 0.18)'
                          : 'rgba(255, 255, 255, 0.08)',
                        color: isActive ? '#070709' : '#D4D4D8',
                      }}
                    >
                      {String(categoryCounts[tab.key]).padStart(2, '0')}
                    </Box>
                  </ButtonBase>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* 6 Vehicle Grid */}
        <Box
          className="fleet-grid-reveal"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 4,
          }}
        >
          {filteredVehicles.map((bike) => (
            <Box
              key={bike.id}
              sx={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: 'rgba(15, 15, 20, 0.85)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderTop: '1px solid rgba(255, 255, 255, 0.24)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  borderColor: '#FF6700',
                  transform: 'translateY(-6px)',
                  boxShadow:
                    '0 24px 55px rgba(0, 0, 0, 0.85), 0 0 32px rgba(255, 103, 0, 0.22)',
                  '& .fleet-bike-img': {
                    transform: 'scale(1.05)',
                  },
                  '& .fleet-arrow-badge': {
                    backgroundColor: '#070709',
                    color: '#FF6700',
                  },
                },
              }}
            >
              {/* Vehicle Studio Frame */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '240px',
                  overflow: 'hidden',
                  backgroundColor: '#070709',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Radial Studio Spotlight */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'radial-gradient(circle at 50% 58%, rgba(255, 103, 0, 0.18) 0%, rgba(255, 103, 0, 0.03) 48%, transparent 75%)',
                    pointerEvents: 'none',
                  }}
                />

                <Box
                  className="fleet-bike-img"
                  component="img"
                  src={bike.image}
                  alt={bike.name}
                  loading="lazy"
                  decoding="async"
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    width: bike.isTransparent ? '90%' : '100%',
                    height: bike.isTransparent ? '86%' : '100%',
                    objectFit: bike.isTransparent ? 'contain' : 'cover',
                    objectPosition: 'center',
                    filter: bike.isTransparent
                      ? 'drop-shadow(0 12px 24px rgba(0, 0, 0, 0.85))'
                      : 'contrast(1.06) brightness(0.95)',
                    transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />

                {/* Category Pill (Top-Left, Synced with KtmApexSurge) */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 14,
                    left: 14,
                    zIndex: 2,
                    px: 1.4,
                    py: 0.45,
                    borderRadius: '100px',
                    backgroundColor: 'rgba(7, 7, 9, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.60rem',
                      fontWeight: 800,
                      color: '#D4D4D8',
                      letterSpacing: '0.12em',
                    }}
                  >
                    {bike.category}
                  </Typography>
                </Box>

                {/* Badge Pill (Top-Right) */}
                {bike.badge && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      zIndex: 2,
                      px: 1.3,
                      py: 0.45,
                      borderRadius: '100px',
                      backgroundColor: '#FF6700',
                      color: '#070709',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      boxShadow: '0 0 18px rgba(255, 103, 0, 0.45)',
                    }}
                  >
                    {bike.badge}
                  </Box>
                )}
              </Box>

              {/* Card Body */}
              <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: '#FF6700',
                    mb: 0.8,
                  }}
                >
                  {bike.tagline}
                </Typography>

                <Typography
                  component="h3"
                  sx={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: '1.38rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    mb: 2.5,
                  }}
                >
                  {bike.name}
                </Typography>

                {/* Technical Specifications Matrix */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 1.5,
                    p: 2,
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.22)',
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.60rem',
                        fontWeight: 700,
                        color: '#A1A1AA',
                        letterSpacing: '0.08em',
                        mb: 0.3,
                      }}
                    >
                      POWER
                    </Typography>
                    <Typography
                      className="tabular-nums"
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.96rem',
                        fontWeight: 800,
                        color: '#FFFFFF',
                      }}
                    >
                      {bike.powerHp}{' '}
                      <Box component="span" sx={{ fontSize: '0.66rem', color: '#FF6700', fontWeight: 800 }}>
                        HP
                      </Box>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.60rem',
                        fontWeight: 700,
                        color: '#A1A1AA',
                        letterSpacing: '0.08em',
                        mb: 0.3,
                      }}
                    >
                      TORQUE
                    </Typography>
                    <Typography
                      className="tabular-nums"
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.96rem',
                        fontWeight: 800,
                        color: '#FFFFFF',
                      }}
                    >
                      {bike.torqueNm}{' '}
                      <Box component="span" sx={{ fontSize: '0.66rem', color: '#FF6700', fontWeight: 800 }}>
                        NM
                      </Box>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.60rem',
                        fontWeight: 700,
                        color: '#A1A1AA',
                        letterSpacing: '0.08em',
                        mb: 0.3,
                      }}
                    >
                      DRY WT
                    </Typography>
                    <Typography
                      className="tabular-nums"
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.96rem',
                        fontWeight: 800,
                        color: '#FFFFFF',
                      }}
                    >
                      {bike.dryWeightKg}{' '}
                      <Box component="span" sx={{ fontSize: '0.66rem', color: '#FF6700', fontWeight: 800 }}>
                        KG
                      </Box>
                    </Typography>
                  </Box>
                </Box>

                {/* MSRP & Preview Action Buttons (Mock CTAs) */}
                <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      mb: 2.2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        color: '#A1A1AA',
                        letterSpacing: '0.08em',
                      }}
                    >
                      STARTING MSRP
                    </Typography>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography
                        className="tabular-nums"
                        sx={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1.22rem',
                          fontWeight: 900,
                          color: '#FFFFFF',
                        }}
                      >
                        ${bike.msrpUsd.toLocaleString()}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.66rem',
                          color: '#71717A',
                        }}
                      >
                        {bike.msrpVnd}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 1.5 }}>
                    <ButtonBase
                      onClick={() =>
                        setPreviewNotice(`${bike.name} — cart preview coming soon.`)
                      }
                      sx={{
                        py: 1.2,
                        px: 1.5,
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        color: '#D4D4D8',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#FF6700',
                          color: '#FFFFFF',
                          backgroundColor: 'rgba(255, 103, 0, 0.08)',
                        },
                        '&:focus-visible': {
                          outline: '2px solid #FF6700',
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      ADD TO CART
                    </ButtonBase>

                    <ButtonBase
                      onClick={() =>
                        setPreviewNotice(`${bike.name} — showroom configurator coming soon.`)
                      }
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.8,
                        py: 1.2,
                        px: 1.5,
                        borderRadius: '8px',
                        backgroundColor: '#FF6700',
                        color: '#070709',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.76rem',
                        fontWeight: 900,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        boxShadow: '0 0 24px rgba(255, 103, 0, 0.35)',
                        transition: 'all 0.25s ease',
                        '&:hover': {
                          backgroundColor: '#FF7D24',
                          boxShadow: '0 0 32px rgba(255, 103, 0, 0.55)',
                        },
                        '&:focus-visible': {
                          outline: '2px solid #FFFFFF',
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      <span>ORDER NOW</span>
                      <Box
                        className="fleet-arrow-badge"
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(7, 7, 9, 0.14)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.25s ease',
                        }}
                      >
                        <ArrowOutwardIcon sx={{ fontSize: '0.78rem' }} />
                      </Box>
                    </ButtonBase>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Snackbar
        open={Boolean(previewNotice)}
        autoHideDuration={2600}
        onClose={() => setPreviewNotice(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setPreviewNotice(null)}
          severity="info"
          variant="filled"
          sx={{
            backgroundColor: '#0F0F16',
            color: '#F4F4F5',
            border: '1px solid rgba(255, 103, 0, 0.55)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            '& .MuiAlert-icon': { color: '#FF6700' },
          }}
        >
          {previewNotice}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default KtmBloodlineFleet;
