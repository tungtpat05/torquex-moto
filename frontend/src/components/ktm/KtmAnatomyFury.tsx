import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { gsap } from 'gsap';

interface AnatomyStage {
  id: string;
  badge: string;
  headline: string;
  subhead: string;
  image: string;
  telemetry: { label: string; value: string; unit: string }[];
  reticleTarget: { x: string; y: string; label: string };
  svgGraphic: 'clamp' | 'suspension' | 'torque';
}

const STAGES: AnatomyStage[] = [
  {
    id: 'brembo',
    badge: 'STAGE 01 // KINEMATIC DECELERATION',
    headline: 'BUILT TO BRAKE LATE.',
    subhead: 'Brembo Stylema monobloc 4-piston calipers machined from solid aircraft aluminum billet, dissipating extreme thermal spikes under 300 km/h threshold braking.',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1600&q=85',
    telemetry: [
      { label: 'CLAMP FORCE', value: '18.4', unit: 'kN' },
      { label: 'ROTOR DIAMETER', value: '320', unit: 'MM' },
      { label: 'PEAK DISC TEMP', value: '750', unit: '°C' },
      { label: 'FLUID SYSTEM', value: 'DOT 5.1', unit: 'RACE' },
    ],
    reticleTarget: { x: '58%', y: '52%', label: 'TITANIUM PISTON SEAL' },
    svgGraphic: 'clamp',
  },
  {
    id: 'wp-apex',
    badge: 'STAGE 02 // ADAPTIVE DYNAMICS',
    headline: 'TAMED BY CODE. UNLEASHED BY INSTINCT.',
    subhead: 'WP APEX PRO Gen 3 semi-active suspension. Solenoid damping valves adapt damping rates across compression and rebound in 0.008 seconds.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1600&q=85',
    telemetry: [
      { label: 'REBOUND LATENCY', value: '0.008', unit: 'SEC' },
      { label: 'FORK STROKE', value: '125', unit: 'MM' },
      { label: 'ALGORITHM CYCLE', value: '1,000', unit: 'Hz' },
      { label: 'TUNING MODES', value: '6', unit: 'ACTIVE' },
    ],
    reticleTarget: { x: '50%', y: '46%', label: 'ELECTROMAGNETIC VALVE' },
    svgGraphic: 'suspension',
  },
  {
    id: 'lc8-powertrain',
    badge: 'STAGE 03 // LC8 V-TWIN COMBUSTION',
    headline: '140 NM OF PURE DISRESPECT.',
    subhead: '75° 1,301cc LC8 V-Twin engine with titanium intake valves and ultralight forged pistons, delivering violent low-end torque with a laser-cut 10,500 RPM redline.',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1600&q=85',
    telemetry: [
      { label: 'DISPLACEMENT', value: '1,301', unit: 'CC' },
      { label: 'OUTPUT TORQUE', value: '140', unit: 'NM' },
      { label: 'COMPRESSION', value: '13.5:1', unit: 'RATIO' },
      { label: 'REDLINE LIMIT', value: '10,500', unit: 'RPM' },
    ],
    reticleTarget: { x: '52%', y: '58%', label: 'TITANIUM INTAKE CAMS' },
    svgGraphic: 'torque',
  },
];

export const KtmAnatomyFury: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageWrapperRef = useRef<HTMLDivElement>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [activeDesktopIndex, setActiveDesktopIndex] = useState(0);

  useEffect(() => {
    // Only execute pinned scroll trigger on desktop viewports (>= 1024px)
    if (window.innerWidth < 1024) return;

    const ctx = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>('.anatomy-slide');

      // Timeline that controls the 3 staged components over 250vh travel
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: 'top top',
          end: '+=250%',
          scrub: 0.4,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.35) {
              setActiveDesktopIndex(0);
            } else if (p < 0.70) {
              setActiveDesktopIndex(1);
            } else {
              setActiveDesktopIndex(2);
            }
          },
        },
      });

      // Initially show Slide 0
      gsap.set(slides[0], { opacity: 1, x: 0, scale: 1 });
      gsap.set(slides.slice(1), { opacity: 0, x: 60, scale: 0.96 });

      // Stage 1 Hold and Transition 1 -> 2 (around progress 30% - 42%)
      tl.to(slides[0], {
        opacity: 0,
        x: -60,
        scale: 1.05,
        duration: 12,
        ease: 'power1.inOut',
      }, 28)
      .to(slides[1], {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 12,
        ease: 'power1.inOut',
      }, 30);

      // Stage 2 Hold and Transition 2 -> 3 (around progress 62% - 74%)
      tl.to(slides[1], {
        opacity: 0,
        x: -60,
        scale: 1.05,
        duration: 12,
        ease: 'power1.inOut',
      }, 62)
      .to(slides[2], {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 12,
        ease: 'power1.inOut',
      }, 64);

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={sectionRef}
      id="anatomy"
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#070709',
        overflow: 'hidden',
        minHeight: { xs: 'auto', lg: '100vh' },
        height: { xs: 'auto', lg: '100vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Background Ambient Spotlight Gradients */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 65% 50%, rgba(255, 103, 0, 0.07) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Persistent Section Top Bar */}
      <Box
        sx={{
          position: { xs: 'relative', lg: 'absolute' },
          top: { lg: 32 },
          left: 0,
          right: 0,
          px: { xs: 3, md: 8 },
          pt: { xs: 6, lg: 0 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 30,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 12, height: 2, backgroundColor: '#FF6700' }} />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: '#FF6700',
            }}
          >
            ACT II // THE ANATOMY OF FURY
          </Typography>
        </Box>

        {/* Desktop Step Indicators */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 3 }}>
          {STAGES.map((s, idx) => (
            <Box
              key={s.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                opacity: activeDesktopIndex === idx ? 1 : 0.4,
                transition: 'opacity 0.3s ease',
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: activeDesktopIndex === idx ? '#FF6700' : '#A1A1AA',
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  letterSpacing: '0.12em',
                  color: activeDesktopIndex === idx ? '#F4F4F5' : '#A1A1AA',
                }}
              >
                0{idx + 1}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Mobile Tab Switcher (< 1024px) */}
      <Box
        sx={{
          display: { xs: 'flex', lg: 'none' },
          overflowX: 'auto',
          gap: 1.5,
          px: 3,
          py: 2,
          mt: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          '::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {STAGES.map((s, idx) => (
          <Box
            key={s.id}
            onClick={() => setActiveMobileIndex(idx)}
            sx={{
              px: 2,
              py: 0.8,
              borderRadius: '2px',
              backgroundColor: activeMobileIndex === idx ? 'rgba(255, 103, 0, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: activeMobileIndex === idx ? '1px solid #FF6700' : '1px solid rgba(255, 255, 255, 0.08)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: activeMobileIndex === idx ? '#FF6700' : '#A1A1AA',
              }}
            >
              0{idx + 1} {s.id.toUpperCase()}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* STAGE CONTAINER (Pinned on Desktop, Interactive/Tabbed on Mobile) */}
      <Box
        ref={stageWrapperRef}
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 'auto', lg: '100%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 3, md: 6, lg: 10 },
          py: { xs: 4, lg: 0 },
        }}
      >
        {STAGES.map((stage, idx) => {
          const isMobileVisible = activeMobileIndex === idx;

          return (
            <Box
              key={stage.id}
              className="anatomy-slide"
              sx={{
                position: { xs: isMobileVisible ? 'relative' : 'none', lg: 'absolute' },
                display: { xs: isMobileVisible ? 'grid' : 'none', lg: 'grid' },
                inset: { lg: 0 },
                width: '100%',
                height: { xs: 'auto', lg: '100%' },
                gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                gap: { xs: 4, lg: 8 },
                alignItems: 'center',
                px: { lg: 10 },
                py: { lg: 10 },
                zIndex: 10,
              }}
            >
              {/* Left Column: Narrative Copy & Telemetry Matrix */}
              <Box sx={{ display: 'flex', flexDirection: 'column', zIndex: 5 }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.2em',
                    color: '#FF6700',
                    mb: 1.5,
                  }}
                >
                  {stage.badge}
                </Typography>

                <Typography
                  component="h2"
                  sx={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: { xs: '2rem', sm: '2.8rem', md: '3.6rem' },
                    lineHeight: 1.02,
                    letterSpacing: '-0.03em',
                    color: '#F4F4F5',
                    mb: 2.5,
                  }}
                >
                  {stage.headline}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'var(--font-body)',
                    fontSize: { xs: '0.92rem', md: '1.05rem' },
                    lineHeight: 1.7,
                    color: '#A1A1AA',
                    mb: 4.5,
                    maxWidth: '540px',
                  }}
                >
                  {stage.subhead}
                </Typography>

                {/* Telemetry HUD Grid for this Stage */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2,
                    maxWidth: '540px',
                    p: 2.5,
                    borderRadius: '4px',
                    backgroundColor: 'rgba(15, 15, 20, 0.78)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.28)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 20px 45px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {stage.telemetry.map((t) => (
                    <Box key={t.label}>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          color: '#D4D4D8',
                          letterSpacing: '0.12em',
                          mb: 0.3,
                        }}
                      >
                        {t.label}
                      </Typography>
                      <Typography
                        className="tabular-nums"
                        sx={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: '#F4F4F5',
                        }}
                      >
                        {t.value} <span style={{ fontSize: '0.75rem', color: '#FF6700' }}>{t.unit}</span>
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Right Column: Macro Visual with Animated SVG Leader Reticles */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '320px', sm: '420px', lg: '560px' },
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
                }}
              >
                {/* Visual Image */}
                <Box
                  component="img"
                  src={stage.image}
                  alt={stage.headline}
                  loading="lazy"
                  decoding="async"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    filter: 'contrast(1.08) brightness(0.92)',
                  }}
                />

                {/* Subtle Optical Vignette */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, transparent 40%, rgba(7, 7, 9, 0.7) 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Dynamic SVG Leader Line & Reticle Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: stage.reticleTarget.y,
                    left: stage.reticleTarget.x,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 15,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      border: '2px solid #FF6700',
                      backgroundColor: 'rgba(255, 103, 0, 0.3)',
                      boxShadow: '0 0 16px #FF6700',
                      animation: 'pulse-subtle 2s infinite ease-in-out',
                    }}
                  />
                  <Box
                    sx={{
                      px: 1.2,
                      py: 0.4,
                      borderRadius: '2px',
                      backgroundColor: 'rgba(7, 7, 9, 0.85)',
                      border: '1px solid #FF6700',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        color: '#F4F4F5',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {stage.reticleTarget.label}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default KtmAnatomyFury;
