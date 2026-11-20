import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import frameImg from '@/assets/images/ktm/anatomy/1390_frame.png';
import engineImg from '@/assets/images/ktm/anatomy/1390_engine.png';
import forkImg from '@/assets/images/ktm/anatomy/1390_fork.png';
import brakesImg from '@/assets/images/ktm/anatomy/1390_brakes.png';
import bikeBaseImg from '@/assets/images/ktm/models/1390_sdr_90_right.png';

gsap.registerPlugin(ScrollTrigger);

interface TelemetryMetric {
  label: string;
  targetValue: number;
  unit: string;
  isDecimal?: boolean;
  prefix?: string;
}

interface AnatomyStage {
  id: string;
  badge: string;
  headline: string;
  subhead: string;
  hardwareImage: string;
  telemetry: TelemetryMetric[];
  reticleTarget: {
    x: number; // percentage in bike container
    y: number;
    label: string;
  };
}

const ANATOMY_STAGES: AnatomyStage[] = [
  {
    id: 'chassis',
    badge: 'STAGE 01 // CHROMIUM-MOLYBDENUM TRELLIS CHASSIS',
    headline: 'ULTRA-LIGHT CHROMOLY STIFFNESS.',
    subhead: 'Engine utilized as a stressed member to maximize torsional rigidity (+12%). Laser-cut 25CrMo4 steel tubes hydroformed and powder-coated in Mattighofen racing orange for razor-sharp turn-in feedback.',
    hardwareImage: frameImg,
    telemetry: [
      { label: 'TORSIONAL RIGIDITY', targetValue: 12, unit: '% GAIN', prefix: '+' },
      { label: 'DRY CHASSIS WEIGHT', targetValue: 189, unit: 'KG' },
      { label: 'ALLOY GRADE', targetValue: 25, unit: 'CrMo4' },
      { label: 'SUBFRAME CAST', targetValue: 100, unit: '% COMPOSITE' },
    ],
    reticleTarget: { x: 50, y: 38, label: 'TRELLIS HEADSTOCK NODE' },
  },
  {
    id: 'powertrain',
    badge: 'STAGE 02 // 1,350 CC LC8 V-TWIN CAMSHIFT',
    headline: '190 HP. 145 NM. ZERO COMPROMISE.',
    subhead: 'Enlarged 1,350cc displacement with all-new CamShift technology. Dual intake cam profiles optimize torque spread below 6,000 RPM while unleashing unhinged top-end acceleration to the 10,500 RPM redline.',
    hardwareImage: engineImg,
    telemetry: [
      { label: 'DISPLACEMENT', targetValue: 1350, unit: 'CC' },
      { label: 'MAX PEAK POWER', targetValue: 190, unit: 'HP' },
      { label: 'MAX OUTPUT TORQUE', targetValue: 145, unit: 'NM' },
      { label: 'REDLINE LIMIT', targetValue: 10500, unit: 'RPM' },
    ],
    reticleTarget: { x: 48, y: 55, label: 'VARIABLE CAMSHIFT VALVE' },
  },
  {
    id: 'suspension',
    badge: 'STAGE 03 // 48 MM WP APEX SEMI-ACTIVE SUSPENSION',
    headline: 'TAMED BY CODE. UNLEASHED BY INSTINCT.',
    subhead: 'WP APEX PRO Gen 3 semi-active split-function suspension. High-speed electromagnetic solenoid valves adapt compression and rebound damping dynamically in 0.008 seconds across 6 active riding modes.',
    hardwareImage: forkImg,
    telemetry: [
      { label: 'SOLENOID LATENCY', targetValue: 0.008, unit: 'SEC', isDecimal: true },
      { label: 'FORK INNER TUBE', targetValue: 48, unit: 'MM' },
      { label: 'SENSOR REFRESH', targetValue: 1000, unit: 'Hz' },
      { label: 'ACTIVE MODES', targetValue: 6, unit: 'PROGRAMS' },
    ],
    reticleTarget: { x: 67, y: 38, label: 'MAGNETIC PRO VALVE' },
  },
  {
    id: 'brakes',
    badge: 'STAGE 04 // BREMBO STYLEMA MONOBLOC DECELERATION',
    headline: 'BUILT TO BRAKE LATE. REALLY LATE.',
    subhead: 'Brembo Stylema monobloc 4-piston calipers machined from solid aircraft aluminum billet, matched with twin 320mm floating discs and Brembo MCS radial master cylinder for surgical trail-braking control.',
    hardwareImage: brakesImg,
    telemetry: [
      { label: 'PEAK CLAMP FORCE', targetValue: 18.4, unit: 'kN', isDecimal: true },
      { label: 'ROTOR DIAMETER', targetValue: 320, unit: 'MM' },
      { label: 'MAX THERMAL SPIKE', targetValue: 750, unit: '°C' },
      { label: 'FLUID RATING', targetValue: 5.1, unit: 'DOT RACE', isDecimal: true },
    ],
    reticleTarget: { x: 72, y: 68, label: 'TITANIUM PISTON BORE' },
  },
];

export const KtmAnatomyFury: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  // Animated telemetry numbers state
  const [currentValues, setCurrentValues] = useState<number[]>([0, 0, 0, 0]);

  // Handle Desktop GSAP ScrollTrigger Pinned Dissection
  useEffect(() => {
    // Only apply pinned stage on desktop/tablet landscape (>= 1024px)
    if (window.innerWidth < 1024) return;

    const ctx = gsap.context(() => {
      const stageCount = ANATOMY_STAGES.length;

      // Master Timeline over 320vh scroll travel
      ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: true,
        start: 'top top',
        end: '+=320%',
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress; // 0 to 1
          const stageIndex = Math.min(
            Math.floor(progress * stageCount),
            stageCount - 1
          );
          setActiveStage(stageIndex);

          // Animate rolling numbers based on intra-stage progress
          const intraStageProgress = (progress * stageCount) % 1;
          const stageData = ANATOMY_STAGES[stageIndex];
          const newVals = stageData.telemetry.map((t) => {
            const raw = t.targetValue * Math.min(intraStageProgress * 1.5, 1);
            return t.isDecimal ? parseFloat(raw.toFixed(t.targetValue < 1 ? 3 : 1)) : Math.round(raw);
          });
          setCurrentValues(newVals);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Update telemetry values on mobile or when stage changes manually
  useEffect(() => {
    if (window.innerWidth < 1024) {
      const stageData = ANATOMY_STAGES[activeStage];
      setCurrentValues(stageData.telemetry.map((t) => t.targetValue));
    }
  }, [activeStage]);

  const activeStageData = ANATOMY_STAGES[activeStage];

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
      }}
    >
      {/* 1. AMBIENT ATMOSPHERIC RADIAL GLOWS */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 65% 50%, rgba(255, 103, 0, 0.08) 0%, rgba(7, 7, 9, 0) 65%), radial-gradient(circle at 20% 80%, rgba(255, 103, 0, 0.04) 0%, rgba(7, 7, 9, 0) 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. TOP STATUS BAR: CHAPTER BADGE & STAGE PILLS */}
      <Box
        sx={{
          position: { xs: 'relative', lg: 'absolute' },
          top: { lg: 28 },
          left: 0,
          right: 0,
          px: { xs: 3, md: 8 },
          pt: { xs: 5, lg: 0 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          zIndex: 30,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 14, height: 2, backgroundColor: '#FF6700' }} />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.22em',
              color: '#FF6700',
              textTransform: 'uppercase',
            }}
          >
            ACT II // THE ANATOMY OF FURY
          </Typography>
        </Box>

        {/* Stage Progress Indicators */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {ANATOMY_STAGES.map((stage, idx) => {
            const isActive = idx === activeStage;
            return (
              <Box
                key={stage.id}
                onClick={() => {
                  if (window.innerWidth < 1024) setActiveStage(idx);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.8,
                  py: 0.6,
                  borderRadius: '1px',
                  backgroundColor: isActive ? 'rgba(255, 103, 0, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: isActive ? '1px solid #FF6700' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: { xs: 'pointer', lg: 'default' },
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: isActive ? '#FF6700' : 'rgba(255, 255, 255, 0.4)',
                    letterSpacing: '0.08em',
                  }}
                >
                  0{idx + 1}
                </Typography>
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: isActive ? '#FF6700' : 'transparent',
                    boxShadow: isActive ? '0 0 8px #FF6700' : 'none',
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* 3. MAIN INTERACTIVE DISSECTION STAGE (SPLIT VIEW) */}
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '1800px',
          mx: 'auto',
          px: { xs: 3, md: 8 },
          py: { xs: 6, lg: 0 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '460px 1fr' },
          gap: { xs: 5, lg: 6 },
          alignItems: 'center',
          minHeight: { xs: 'auto', lg: '700px' },
          zIndex: 20,
        }}
      >
        {/* LEFT COLUMN: DYNAMIC TELEMETRY CARD */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            zIndex: 25,
            maxWidth: { xs: '100%', lg: '460px' },
          }}
        >
          {/* Active Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.2,
              px: 1.6,
              py: 0.5,
              borderRadius: '2px',
              backgroundColor: 'rgba(255, 103, 0, 0.08)',
              border: '1px solid rgba(255, 103, 0, 0.35)',
              alignSelf: 'flex-start',
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#FF6700',
                boxShadow: '0 0 10px #FF6700',
              }}
            />
            <Typography
              sx={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#FF6700',
                letterSpacing: '0.14em',
              }}
            >
              {activeStageData.badge}
            </Typography>
          </Box>

          {/* Headline */}
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'var(--font-display, "Outfit", sans-serif)',
              fontSize: { xs: '2rem', sm: '2.5rem', lg: '2.85rem' },
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
            }}
          >
            {activeStageData.headline}
          </Typography>

          {/* Subhead narrative */}
          <Typography
            sx={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: { xs: '0.88rem', lg: '0.94rem' },
              color: '#A1A1AA',
              lineHeight: 1.65,
              fontWeight: 400,
            }}
          >
            {activeStageData.subhead}
          </Typography>

          {/* 4-Cell Telemetry Matrix */}
          <Box
            sx={{
              mt: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1.5,
            }}
          >
            {activeStageData.telemetry.map((item, idx) => {
              const displayVal = currentValues[idx] !== undefined ? currentValues[idx] : item.targetValue;
              return (
                <Box
                  key={item.label}
                  sx={{
                    p: 2,
                    borderRadius: '2px',
                    backgroundColor: 'rgba(15, 15, 20, 0.85)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.20)',
                    transition: 'border-color 0.3s ease',
                    '&:hover': {
                      borderColor: '#FF6700',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.62rem',
                      fontWeight: 600,
                      color: '#A1A1AA',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      mb: 0.6,
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8 }}>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: { xs: '1.4rem', lg: '1.75rem' },
                        fontWeight: 900,
                        color: '#FFFFFF',
                        letterSpacing: '-0.02em',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {item.prefix || ''}{displayVal.toLocaleString()}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#FF6700',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {item.unit}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* RIGHT COLUMN: THE EXPLODED MOTORCYCLE DISSECTION STAGE */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: '380px', sm: '500px', lg: '620px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* BASE LAYER: Blueprint Ghost Bike */}
          <Box
            component="img"
            src={bikeBaseImg}
            alt="KTM 1390 Super Duke R Technical Blueprint"
            sx={{
              position: 'absolute',
              width: '95%',
              maxHeight: '100%',
              objectFit: 'contain',
              opacity: 0.22,
              filter: 'grayscale(0.6) brightness(0.6)',
              userSelect: 'none',
              pointerEvents: 'none',
              transition: 'opacity 0.4s ease',
            }}
          />

          {/* ACTIVE DISSECTION HARDWARE CUTOUT LAYER */}
          {ANATOMY_STAGES.map((stage, idx) => {
            const isActive = idx === activeStage;
            return (
              <Box
                key={stage.id}
                component="img"
                src={stage.hardwareImage}
                alt={stage.headline}
                sx={{
                  position: 'absolute',
                  maxWidth: { xs: '88%', lg: '85%' },
                  maxHeight: { xs: '88%', lg: '85%' },
                  objectFit: 'contain',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'scale(1) translate3d(0, 0, 0)' : 'scale(0.92) translate3d(30px, 0, 0)',
                  filter: isActive
                    ? 'drop-shadow(0 0 28px rgba(255, 103, 0, 0.45)) drop-shadow(0 15px 35px rgba(0,0,0,0.8))'
                    : 'none',
                  transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  zIndex: 22,
                }}
              />
            );
          })}

          {/* RETICLE TARGET CROSSHAIR & LASER RETICLE (DESKTOP) */}
          <Box
            sx={{
              display: { xs: 'none', lg: 'block' },
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 26,
            }}
          >
            {/* SVG Connecting Reticle Laser */}
            <svg
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <circle
                cx={`${activeStageData.reticleTarget.x}%`}
                cy={`${activeStageData.reticleTarget.y}%`}
                r="18"
                fill="none"
                stroke="#FF6700"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                style={{
                  transition: 'cx 0.5s cubic-bezier(0.16, 1, 0.3, 1), cy 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
              <circle
                cx={`${activeStageData.reticleTarget.x}%`}
                cy={`${activeStageData.reticleTarget.y}%`}
                r="4"
                fill="#FF6700"
                style={{
                  transition: 'cx 0.5s cubic-bezier(0.16, 1, 0.3, 1), cy 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </svg>

            {/* Reticle Target Label Pill */}
            <Box
              sx={{
                position: 'absolute',
                left: `${activeStageData.reticleTarget.x}%`,
                top: `${activeStageData.reticleTarget.y}%`,
                transform: 'translate(24px, -50%)',
                px: 1.2,
                py: 0.4,
                borderRadius: '1px',
                backgroundColor: 'rgba(7, 7, 9, 0.85)',
                border: '1px solid #FF6700',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                whiteSpace: 'nowrap',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  color: '#FF6700',
                  letterSpacing: '0.12em',
                }}
              >
                [ TARGET // {activeStageData.reticleTarget.label} ]
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 4. BOTTOM TELEMETRY FOOTER & STAGE NAVIGATION */}
      <Box
        sx={{
          position: { xs: 'relative', lg: 'absolute' },
          bottom: { lg: 24 },
          left: 0,
          right: 0,
          px: { xs: 3, md: 8 },
          pb: { xs: 4, lg: 0 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 30,
        }}
      >
        <Typography
          sx={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.68rem',
            color: '#71717A',
            letterSpacing: '0.1em',
          }}
        >
          CAD CADENCE // DISSECTION RATIO 1:1
        </Typography>

        <Typography
          sx={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.68rem',
            color: '#A1A1AA',
            letterSpacing: '0.1em',
          }}
        >
          SCROLL TO EXPLORE SUBSYSTEMS [ 0{activeStage + 1} / 04 ]
        </Typography>
      </Box>
    </Box>
  );
};

export default KtmAnatomyFury;
