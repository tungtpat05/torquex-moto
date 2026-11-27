import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import factoryCrateImg from '@/assets/images/handover/ktm_factory_crate.jpg';

gsap.registerPlugin(ScrollTrigger);

interface LogisticsPhase {
  step: string;
  tag: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const LOGISTICS_PHASES: LogisticsPhase[] = [
  {
    step: '01',
    tag: 'PHASE 01 // MATTIGHOFEN SEAL',
    title: 'FACTORY CRATING & VAPOR LOCK',
    description:
      'Anchored onto a reinforced steel skid frame inside kiln-dried ISPM-15 timber slats, sealed inside an anti-corrosion VCI barrier straight off the Austrian line.',
    icon: <Inventory2OutlinedIcon sx={{ color: '#FF6700', fontSize: '1.35rem' }} />,
  },
  {
    step: '02',
    tag: 'PHASE 02 // GLOBAL CORRIDOR',
    title: 'SHOCK-MONITORED TRANSIT',
    description:
      'Routed via climate-controlled air and ocean freight with tamper-evident customs seals and tri-axial 3G shock-watch telemetry guarding every handling leg.',
    icon: <LocalShippingOutlinedIcon sx={{ color: '#FF6700', fontSize: '1.35rem' }} />,
  },
  {
    step: '03',
    tag: 'PHASE 03 // PADDOCK ARRIVAL',
    title: 'UNCRATING & TRACKSIDE PDI',
    description:
      'Timber housing unbolted upon arrival for electrolyte battery activation, race-grade fluid fill, suspension baseline setup, and final fastener torque inspection.',
    icon: <BuildOutlinedIcon sx={{ color: '#FF6700', fontSize: '1.35rem' }} />,
  },
];

const CRATE_SPECS = [
  { label: 'CRATE STRUCTURE', value: 'ISPM-15', unit: 'TIMBER' },
  { label: 'BARRIER SEAL', value: 'VCI', unit: 'VAPOR' },
  { label: 'TRANSIT SENSOR', value: '3G', unit: 'SHOCK-WATCH' },
];

export const CrateHandover: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number>(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const activePhaseRef = useRef<number>(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.innerWidth < 1024 || prefersReducedMotion || !sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // Opening shutter reveal for headline as section enters
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 76%',
          once: true,
        },
      });

      introTl
        .fromTo(
          '.crate-eyebrow-rule',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.55, ease: 'power3.out' },
          0
        )
        .fromTo(
          '.crate-eyebrow-text',
          { opacity: 0, letterSpacing: '0.32em' },
          { opacity: 1, letterSpacing: '0.16em', duration: 0.7, ease: 'power3.out' },
          0.05
        )
        .fromTo(
          '.crate-title-line-1',
          { yPercent: 108, skewY: 2.2 },
          { yPercent: 0, skewY: 0, duration: 0.85, ease: 'power4.out' },
          0.08
        )
        .fromTo(
          '.crate-title-line-2',
          { yPercent: 108, skewY: 2.2, textShadow: '0 0 0px rgba(255, 103, 0, 0)' },
          {
            yPercent: 0,
            skewY: 0,
            textShadow: '0 0 42px rgba(255, 103, 0, 0.58)',
            duration: 0.95,
            ease: 'power4.out',
          },
          0.18
        );

      // Pinned Sticky Crate Vault Master Timeline (0% -> 100%)
      const masterTl = gsap.timeline({
        scrollTrigger: {
          id: 'crate-vault-master',
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=270%',
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const nextPhase = p < 0.34 ? 0 : p < 0.68 ? 1 : 2;
            if (nextPhase !== activePhaseRef.current) {
              activePhaseRef.current = nextPhase;
              setActivePhase(nextPhase);
            }
          },
        },
      });

      // Initial camera & reading dock setup
      masterTl.set('.crate-bg-image', { scale: 1.2, xPercent: 5, yPercent: 2 }, 0);
      masterTl.set('.crate-vci-flare', { opacity: 0.25, scale: 0.9 }, 0);
      masterTl.set('.crate-telemetry-svg', { opacity: 0 }, 0);
      masterTl.set('.crate-telemetry-line', { strokeDashoffset: 240 }, 0);

      masterTl.set('.crate-phase-card-0', { opacity: 1, y: 0 }, 0);
      masterTl.set('.crate-phase-card-1', { opacity: 0, y: 36 }, 0);
      masterTl.set('.crate-phase-card-2', { opacity: 0, y: 36 }, 0);
      masterTl.set('.crate-specs-dock', { opacity: 0, y: 24 }, 0);

      // Phase 0 -> Phase 1 Camera pullback + Dim-to-Crisp transition (28% -> 42%)
      masterTl
        .to(
          '.crate-bg-image',
          { scale: 1.07, xPercent: -1.5, yPercent: 0, duration: 14, ease: 'power2.inOut' },
          28
        )
        .to(
          '.crate-phase-card-0',
          { opacity: 0, y: -28, duration: 8, ease: 'power2.in' },
          28
        )
        .to(
          '.crate-phase-card-1',
          { opacity: 1, y: 0, duration: 9, ease: 'power3.out' },
          35
        )
        .to('.crate-telemetry-svg', { opacity: 1, duration: 6, ease: 'power2.out' }, 36)
        .to('.crate-telemetry-line', { strokeDashoffset: 0, duration: 12, ease: 'power2.out' }, 36);

      // Phase 1 -> Phase 2 Hero Reveal + VCI Orange Flare + Specs Matrix (64% -> 80%)
      masterTl
        .to(
          '.crate-bg-image',
          { scale: 1.0, xPercent: 0, yPercent: 0, duration: 16, ease: 'power2.out' },
          64
        )
        .to('.crate-vci-flare', { opacity: 0.9, scale: 1.15, duration: 14, ease: 'power2.out' }, 66)
        .to('.crate-telemetry-svg', { opacity: 0.35, duration: 8, ease: 'power2.inOut' }, 64)
        .to(
          '.crate-phase-card-1',
          { opacity: 0, y: -28, duration: 8, ease: 'power2.in' },
          64
        )
        .to(
          '.crate-phase-card-2',
          { opacity: 1, y: 0, duration: 9, ease: 'power3.out' },
          71
        )
        .to('.crate-specs-dock', { opacity: 1, y: 0, duration: 10, ease: 'power3.out' }, 73);

      // Hold Phase 2 cleanly until release (80% -> 100%)
      masterTl.to({}, { duration: 20 }, 80);
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
        height: { xs: 'auto', lg: '100vh' },
        backgroundColor: '#070709',
        marginTop: { xs: 0, lg: '-5vh' },
        zIndex: 5,
        overflow: 'hidden',
        boxShadow: '0 -30px 90px rgba(0, 0, 0, 0.95)',
        '@media (prefers-reduced-motion: reduce)': {
          height: 'auto',
          marginTop: 0,
        },
      }}
    >
      {/* Top Paddock Shutter Rim Line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255, 103, 0, 0.55) 50%, transparent 100%)',
          zIndex: 30,
          pointerEvents: 'none',
        }}
      />

      {/* ================================================================= */}
      {/* DESKTOP STICKY ARTIFACT VAULT (>= 1024PX)                         */}
      {/* ================================================================= */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'block' },
          position: 'relative',
          width: '100%',
          height: '100%',
          '@media (prefers-reduced-motion: reduce)': {
            display: 'none',
          },
        }}
      >
        {/* 1. Full-Bleed Scrubbed Wooden Export Crate Canvas */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          <Box
            className="crate-bg-image"
            component="img"
            src={factoryCrateImg}
            alt="KTM Mattighofen ISPM-15 Wooden Export Shipping Crate"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 54%',
              filter: 'contrast(1.06) brightness(0.84)',
              willChange: 'transform',
            }}
          />

          {/* Subtle Backlit VCI Orange Flare */}
          <Box
            className="crate-vci-flare"
            sx={{
              position: 'absolute',
              top: '48%',
              left: '58%',
              transform: 'translate(-50%, -50%)',
              width: '480px',
              height: '320px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255, 103, 0, 0.28) 0%, rgba(255, 103, 0, 0.05) 55%, transparent 75%)',
              filter: 'blur(55px)',
              mixBlendMode: 'screen',
              pointerEvents: 'none',
            }}
          />

          {/* Cinematic Edge Vignette Scrims */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, rgba(7, 7, 9, 0.90) 0%, rgba(7, 7, 9, 0.35) 38%, rgba(7, 7, 9, 0.35) 68%, rgba(7, 7, 9, 0.88) 100%)',
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(7, 7, 9, 0.88) 0%, transparent 28%, transparent 66%, rgba(7, 7, 9, 0.96) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* SVG Vector Telemetry Reticle Overlay (Phase 2 Shock-Watch Highlight) */}
          <Box
            className="crate-telemetry-svg"
            component="svg"
            viewBox="0 0 1200 700"
            preserveAspectRatio="xMidYMid slice"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 4,
            }}
          >
            <polyline
              className="crate-telemetry-line"
              points="440,145 505,145 545,105 660,105"
              fill="none"
              stroke="#FF6700"
              strokeWidth="1.5"
              strokeDasharray="240"
            />
            <circle cx="440" cy="145" r="4" fill="#FF6700" />
            <text
              x="672"
              y="109"
              fill="#FF6700"
              fontSize="12"
              fontFamily="Space Mono, monospace"
              fontWeight="700"
              letterSpacing="2"
            >
              STEEL CORNER BRACKET // 3G SHOCK-WATCH
            </text>

            <polyline
              className="crate-telemetry-line"
              points="760,520 820,520 855,480 960,480"
              fill="none"
              stroke="#FF6700"
              strokeWidth="1.5"
              strokeDasharray="240"
            />
            <circle cx="760" cy="520" r="4" fill="#FF6700" />
            <text
              x="970"
              y="484"
              fill="#F4F4F5"
              fontSize="12"
              fontFamily="Space Mono, monospace"
              fontWeight="700"
              letterSpacing="2"
            >
              VCI VAPOR SEAL
            </text>
          </Box>
        </Box>

        {/* 2. Foreground Editorial HUD Grid */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '1440px',
            height: '100%',
            mx: 'auto',
            px: 8,
            pt: '7vh',
            pb: '6vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            pointerEvents: 'none',
          }}
        >
          {/* Top-Left Kinetic Title */}
          <Box sx={{ maxWidth: '720px' }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.4, mb: 1.5 }}>
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: '#FF6700',
                  boxShadow: '0 0 10px #FF6700',
                }}
              />
              <Box
                className="crate-eyebrow-rule"
                sx={{
                  width: 24,
                  height: '2px',
                  backgroundColor: '#FF6700',
                  transformOrigin: 'left center',
                }}
              />
              <Typography
                className="crate-eyebrow-text"
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
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
                fontSize: { lg: '3.6rem', xl: '4.3rem' },
                letterSpacing: '-0.035em',
                lineHeight: 0.98,
                textTransform: 'uppercase',
              }}
            >
              <Box component="span" sx={{ display: 'block', overflow: 'hidden' }}>
                <Box
                  component="span"
                  className="crate-title-line-1"
                  sx={{ display: 'inline-block', color: '#FFFFFF' }}
                >
                  SEALED IN AUSTRIA.
                </Box>
              </Box>
              <Box component="span" sx={{ display: 'block', overflow: 'hidden' }}>
                <Box
                  component="span"
                  className="crate-title-line-2"
                  sx={{
                    display: 'inline-block',
                    color: '#FF6700',
                    textShadow: '0 0 42px rgba(255, 103, 0, 0.58)',
                  }}
                >
                  SHIPPED TO YOUR PADDOCK.
                </Box>
              </Box>
            </Typography>
          </Box>

          {/* Bottom Split: Left Single Reading Dock (3 Swapping Phases) + Right Specs Matrix */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1.15fr 0.85fr',
              gap: 6,
              alignItems: 'end',
            }}
          >
            {/* Co-located Reading Dock (Grid 1/1 keeps crate unobstructed) */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                maxWidth: '560px',
              }}
            >
              {LOGISTICS_PHASES.map((phase, idx) => (
                <Box
                  key={phase.step}
                  className={`crate-phase-card-${idx}`}
                  aria-hidden={activePhase !== idx}
                  sx={{
                    gridArea: '1 / 1',
                    p: 3.5,
                    borderRadius: '16px',
                    backgroundColor: 'rgba(12, 12, 18, 0.84)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.28)',
                    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.85)',
                    willChange: 'transform, opacity',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 103, 0, 0.14)',
                        border: '1px solid rgba(255, 103, 0, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {phase.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: '#FF6700',
                        letterSpacing: '0.14em',
                      }}
                    >
                      {phase.tag}
                    </Typography>
                  </Box>

                  <Typography
                    component="h3"
                    sx={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 900,
                      fontSize: { lg: '1.45rem', xl: '1.65rem' },
                      color: '#FFFFFF',
                      letterSpacing: '-0.02em',
                      textTransform: 'uppercase',
                      mb: 1,
                    }}
                  >
                    {phase.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.94rem',
                      color: '#D4D4D8',
                      lineHeight: 1.65,
                    }}
                  >
                    {phase.description}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Right: 3-Cell Crate Engineering Matrix (Unlocks in Phase 3) */}
            <Box
              className="crate-specs-dock"
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 1.5,
                p: 2.5,
                borderRadius: '14px',
                backgroundColor: 'rgba(12, 12, 18, 0.84)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderTop: '1px solid rgba(255, 255, 255, 0.28)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
                willChange: 'transform, opacity',
              }}
            >
              {CRATE_SPECS.map((spec) => (
                <Box key={spec.label}>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.58rem',
                      fontWeight: 700,
                      color: '#A1A1AA',
                      letterSpacing: '0.1em',
                      mb: 0.5,
                    }}
                  >
                    {spec.label}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.6 }}>
                    <Typography
                      className="tabular-nums"
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.18rem',
                        fontWeight: 900,
                        color: '#FFFFFF',
                      }}
                    >
                      {spec.value}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.64rem',
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

      {/* ================================================================= */}
      {/* MOBILE / REDUCED MOTION FLUID STACK (< 1024PX)                    */}
      {/* ================================================================= */}
      <Box
        sx={{
          display: { xs: 'flex', lg: 'none' },
          flexDirection: 'column',
          gap: 4,
          px: { xs: 3, sm: 5 },
          py: 10,
          '@media (prefers-reduced-motion: reduce)': {
            display: 'flex',
          },
        }}
      >
        <Box sx={{ textAlign: 'left' }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.2, mb: 1.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#FF6700' }} />
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.64rem',
                fontWeight: 800,
                color: '#FF6700',
                letterSpacing: '0.16em',
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
              fontSize: { xs: '2.2rem', sm: '3rem' },
              lineHeight: 0.98,
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              textTransform: 'uppercase',
            }}
          >
            SEALED IN AUSTRIA.{' '}
            <Box component="span" sx={{ color: '#FF6700' }}>
              SHIPPED TO YOUR PADDOCK.
            </Box>
          </Typography>
        </Box>

        {/* Mobile Crate Photo */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            height: { xs: '280px', sm: '360px' },
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <Box
            component="img"
            src={factoryCrateImg}
            alt="KTM Mattighofen ISPM-15 Wooden Export Shipping Crate"
            loading="lazy"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(7, 7, 9, 0.88) 0%, transparent 55%)',
              p: 2.5,
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                fontWeight: 800,
                color: '#FF6700',
                letterSpacing: '0.12em',
              }}
            >
              ISPM-15 TIMBER • VCI VAPOR LOCK • 3G SHOCK-WATCH
            </Typography>
          </Box>
        </Box>

        {/* Mobile 3-Phase Vertical Timeline */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {LOGISTICS_PHASES.map((phase) => (
            <Box
              key={`mobile-${phase.step}`}
              sx={{
                p: 3,
                borderRadius: '16px',
                backgroundColor: 'rgba(15, 15, 20, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderTop: '1px solid rgba(255, 255, 255, 0.22)',
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  flexShrink: 0,
                  backgroundColor: 'rgba(255, 103, 0, 0.12)',
                  border: '1px solid rgba(255, 103, 0, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {phase.icon}
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.60rem',
                    fontWeight: 800,
                    color: '#FF6700',
                    letterSpacing: '0.12em',
                    mb: 0.4,
                  }}
                >
                  {phase.tag}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: '1.1rem',
                    color: '#FFFFFF',
                    mb: 0.6,
                  }}
                >
                  {phase.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.86rem',
                    color: '#A1A1AA',
                    lineHeight: 1.6,
                  }}
                >
                  {phase.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CrateHandover;
