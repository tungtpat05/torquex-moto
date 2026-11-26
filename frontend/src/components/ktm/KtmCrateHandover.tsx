import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import factoryCrateImg from '@/assets/images/ktm/handover/ktm_factory_crate.jpg';

gsap.registerPlugin(ScrollTrigger);

interface ShippingStage {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SHIPPING_STAGES: ShippingStage[] = [
  {
    step: 'STAGE 01',
    title: 'FACTORY CRATING & VAPOR SEAL',
    description:
      'Anchored onto a reinforced steel skid frame inside kiln-dried ISPM-15 timber slats, sealed in anti-corrosion VCI vapor barrier straight off the Mattighofen line.',
    icon: <Inventory2OutlinedIcon sx={{ color: '#FF6700', fontSize: '1.35rem' }} />,
  },
  {
    step: 'STAGE 02',
    title: 'SHOCK-MONITORED GLOBAL TRANSIT',
    description:
      'Dispatched via climate-controlled air and sea freight corridors with tamper-evident customs locks and tri-axial 3G shock-watch indicators on every corner post.',
    icon: <LocalShippingOutlinedIcon sx={{ color: '#FF6700', fontSize: '1.35rem' }} />,
  },
  {
    step: 'STAGE 03',
    title: 'PADDOCK UNCRATING & TRACKSIDE PDI',
    description:
      'Timber housing unbolted upon paddock arrival for dry-shipped battery activation, factory fluid fill, suspension baseline setup, and final fastener torque inspection.',
    icon: <BuildOutlinedIcon sx={{ color: '#FF6700', fontSize: '1.35rem' }} />,
  },
];

const CRATE_SPECS = [
  { label: 'CRATE STRUCTURE', value: 'ISPM-15', unit: 'TIMBER' },
  { label: 'BARRIER SEAL', value: 'VCI', unit: 'VAPOR' },
  { label: 'TRANSIT TELEMETRY', value: '3G', unit: 'SHOCK-WATCH' },
];

export const KtmCrateHandover: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.crate-header-reveal',
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
        '.crate-visual-frame',
        { y: 40, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.95,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.crate-visual-frame',
            start: 'top 84%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.crate-visual-img',
        { scale: 1.07 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.crate-visual-frame',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        '.crate-stage-card',
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.14,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: '.crate-stages-stack',
            start: 'top 84%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      id="handover"
      ref={sectionRef}
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#070709',
        py: { xs: 12, md: 18 },
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
            'linear-gradient(90deg, transparent 0%, rgba(255, 103, 0, 0.28) 30%, rgba(255, 255, 255, 0.14) 50%, rgba(255, 103, 0, 0.28) 70%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Dramatic Overhead Spotlight Background */}
      <Box
        sx={{
          position: 'absolute',
          top: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '920px',
          height: '560px',
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(255, 103, 0, 0.14) 0%, rgba(255, 103, 0, 0.03) 45%, transparent 72%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ maxWidth: '1320px', mx: 'auto', position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <Box className="crate-header-reveal" sx={{ textAlign: 'center', mb: { xs: 8, md: 11 } }}>
          {/* Pulse-Dot Telemetry Eyebrow (Synced with Parts 1-4) */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.4,
              px: 2.2,
              py: 0.65,
              borderRadius: '100px',
              backgroundColor: 'rgba(15, 15, 20, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 103, 0, 0.45)',
              boxShadow: '0 0 24px rgba(255, 103, 0, 0.22)',
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#FF6700',
                boxShadow: '0 0 10px #FF6700',
                animation: 'cratePulseDot 2s ease-in-out infinite',
                '@keyframes cratePulseDot': {
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
              MATTIGHOFEN LOGISTICS • EXPORT CRATE PROTOCOL
            </Typography>
          </Box>

          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-display)',
              fontWeight: 950,
              fontSize: { xs: '2.35rem', sm: '3.6rem', md: '4.6rem' },
              letterSpacing: '-0.035em',
              lineHeight: 0.98,
              color: '#FFFFFF',
              textTransform: 'uppercase',
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.9)',
              mb: 2.5,
            }}
          >
            SEALED IN AUSTRIA.
            <Box
              component="span"
              sx={{
                display: 'block',
                color: '#FF6700',
                textShadow: '0 0 42px rgba(255, 103, 0, 0.55)',
              }}
            >
              SHIPPED TO YOUR PADDOCK.
            </Box>
          </Typography>

          <Typography
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: { xs: '0.95rem', sm: '1.08rem' },
              color: '#A1A1AA',
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            Every machine leaves Mattighofen bolted inside a custom ISPM-15 timber and steel-skid export crate—vapor-sealed against moisture, shock-monitored across freight corridors, and uncrated exclusively for pre-delivery inspection.
          </Typography>
        </Box>

        {/* 2-Column Split: Wooden Crate Visual + 3-Stage Crating & Shipping Pipeline */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.05fr 1fr' },
            gap: { xs: 5, lg: 7 },
            alignItems: 'stretch',
          }}
        >
          {/* Left: Authentic Wooden Export Crate Showcase */}
          <Box
            className="crate-visual-frame"
            sx={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#0F0F16',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderTop: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9)',
              minHeight: { xs: '380px', sm: '460px', lg: '560px' },
            }}
          >
            <Box
              className="crate-visual-img"
              component="img"
              src={factoryCrateImg}
              alt="KTM Mattighofen ISPM-15 Wooden Export Shipping Crate"
              loading="lazy"
              decoding="async"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                filter: 'contrast(1.06) brightness(0.92)',
              }}
            />

            {/* Crate Telemetry Gradient Overlay */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(7, 7, 9, 0.94) 0%, rgba(7, 7, 9, 0.25) 45%, rgba(7, 7, 9, 0.72) 100%)',
                p: { xs: 3, sm: 4 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                pointerEvents: 'none',
              }}
            >
              {/* Top Stamps */}
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    px: 1.6,
                    py: 0.55,
                    borderRadius: '100px',
                    border: '1px solid rgba(255, 103, 0, 0.55)',
                    backgroundColor: 'rgba(7, 7, 9, 0.8)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.64rem',
                      fontWeight: 800,
                      color: '#FF6700',
                      letterSpacing: '0.1em',
                    }}
                  >
                    ISPM-15 KILN-DRIED TIMBER
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    color: '#D4D4D8',
                    letterSpacing: '0.12em',
                  }}
                >
                  ORIGIN: MATTIGHOFEN, AUT
                </Typography>
              </Box>

              {/* Bottom Crate Specification Caption */}
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    color: '#FF6700',
                    mb: 0.6,
                  }}
                >
                  FACTORY PACKAGING // EXPORT SEAL VBKM-AUT
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: { xs: '1.35rem', sm: '1.75rem' },
                    color: '#FFFFFF',
                    letterSpacing: '-0.02em',
                    textTransform: 'uppercase',
                  }}
                >
                  VCI VAPOR BARRIER & STEEL SKID FRAME
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: '#A1A1AA',
                    mt: 0.6,
                    letterSpacing: '0.06em',
                  }}
                >
                  TRI-AXIAL 3G SHOCK-WATCH • HUMIDITY GUARDED TRANSIT
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right: 3-Stage Crating & Shipping Pipeline + Crate Engineering Telemetry */}
          <Box
            className="crate-stages-stack"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 2.5,
            }}
          >
            {SHIPPING_STAGES.map((item) => (
              <Box
                key={item.step}
                className="crate-stage-card"
                sx={{
                  p: { xs: 2.8, sm: 3.2 },
                  borderRadius: '16px',
                  backgroundColor: 'rgba(15, 15, 20, 0.85)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.24)',
                  boxShadow: '0 14px 36px rgba(0, 0, 0, 0.6)',
                  display: 'flex',
                  gap: 2.2,
                  alignItems: 'flex-start',
                  transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
                  '&:hover': {
                    borderColor: 'rgba(255, 103, 0, 0.6)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 18px 44px rgba(0, 0, 0, 0.8), 0 0 24px rgba(255, 103, 0, 0.18)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '10px',
                    flexShrink: 0,
                    backgroundColor: 'rgba(255, 103, 0, 0.12)',
                    border: '1px solid rgba(255, 103, 0, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      color: '#FF6700',
                      letterSpacing: '0.14em',
                      mb: 0.4,
                    }}
                  >
                    {item.step}
                  </Typography>
                  <Typography
                    component="h3"
                    sx={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 900,
                      fontSize: { xs: '1.05rem', sm: '1.15rem' },
                      color: '#FFFFFF',
                      letterSpacing: '-0.015em',
                      textTransform: 'uppercase',
                      mb: 0.6,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.86rem',
                      color: '#A1A1AA',
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            ))}

            {/* 3-Cell Crate Engineering Matrix (Synced with Parts 1-2 Telemetry Cells) */}
            <Box
              className="crate-stage-card"
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                gap: 1.5,
                p: 2.5,
                borderRadius: '14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderTop: '1px solid rgba(255, 255, 255, 0.24)',
                boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
              }}
            >
              {CRATE_SPECS.map((spec) => (
                <Box key={spec.label}>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.60rem',
                      fontWeight: 700,
                      color: '#A1A1AA',
                      letterSpacing: '0.1em',
                      mb: 0.5,
                    }}
                  >
                    {spec.label}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.7 }}>
                    <Typography
                      className="tabular-nums"
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.2rem',
                        fontWeight: 900,
                        color: '#FFFFFF',
                      }}
                    >
                      {spec.value}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: '#FF6700',
                      }}
                    >
                      {spec.unit}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default KtmCrateHandover;
