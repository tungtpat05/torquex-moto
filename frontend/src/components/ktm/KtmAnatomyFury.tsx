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
    subhead:
      'Engine utilized as a stressed member to maximize torsional rigidity (+12%). Laser-cut 25CrMo4 steel tubes hydroformed and powder-coated in Mattighofen racing orange for razor-sharp turn-in feedback.',
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
    subhead:
      'Enlarged 1,350cc displacement with all-new CamShift technology. Dual intake cam profiles optimize torque spread below 6,000 RPM while unleashing unhinged top-end acceleration to the 10,500 RPM redline.',
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
    subhead:
      'WP APEX PRO Gen 3 semi-active split-function suspension. High-speed electromagnetic solenoid valves adapt compression and rebound damping dynamically in 0.008 seconds across 6 active riding modes.',
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
    subhead:
      'Brembo Stylema monobloc 4-piston calipers machined from solid aircraft aluminum billet, matched with twin 320mm floating discs and Brembo MCS radial master cylinder for surgical trail-braking control.',
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
  const portalCardRef = useRef<HTMLDivElement>(null);
  const centerHookRef = useRef<HTMLDivElement>(null);
  const splitStageRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  // Animated telemetry numbers state (initialized with stage 0 targets for zero flash)
  const [currentValues, setCurrentValues] = useState<number[]>([12, 189, 25, 100]);

  // Handle Desktop GSAP ScrollTrigger Pinned Dissection
  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const ctx = gsap.context(() => {
      // MASTER SCRUBBED TIMELINE:
      // 0 -> 18: Porsche-style Portal Card Expansion (Width 60% -> 100%, Height 62% -> 100%, Radius 32px -> 0px)
      // 18 -> 26: Center hook text crossfades into the 2-column Dissection Stage
      // 26 -> 44: Stage 01 (Chassis) fully active
      // 44 -> 54: Smooth Crossfade Stage 01 -> Stage 02 (Powertrain)
      // 54 -> 72: Stage 02 (Powertrain) fully active
      // 72 -> 82: Smooth Crossfade Stage 02 -> Stage 03 (Suspension)
      // 82 -> 92: Stage 03 (Suspension) fully active
      // 92 -> 98: Smooth Crossfade Stage 03 -> Stage 04 (Brakes)
      // 98 -> 100: Stage 04 (Brakes) fully active & clamped to 100% permanently into Act III
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: 'top top',
          end: '+=380%',
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const progress = self.progress; // 0 to 1

            // Determine active stage & intra-stage counter progress
            let stageIndex = 0;
            let counterRatio = 0;

            if (progress < 0.44) {
              stageIndex = 0;
              // counts up smoothly in first part of stage, then locks at 1.0
              counterRatio = Math.min(1, Math.max(0, (progress - 0.18) / 0.16));
            } else if (progress < 0.72) {
              stageIndex = 1;
              counterRatio = Math.min(1, Math.max(0, (progress - 0.44) / 0.15));
            } else if (progress < 0.92) {
              stageIndex = 2;
              counterRatio = Math.min(1, Math.max(0, (progress - 0.72) / 0.12));
            } else {
              stageIndex = 3;
              // Stage 04 reaches 100% by progress 0.96 and stays clamped at 1.0
              // permanently, even when user scrolls past 1.0 into Act III!
              counterRatio = Math.min(1, Math.max(0, (progress - 0.92) / 0.05));
            }

            setActiveStage(stageIndex);

            // Compute precision rolling numbers
            const stageData = ANATOMY_STAGES[stageIndex];
            const newVals = stageData.telemetry.map((t) => {
              const raw = t.targetValue * counterRatio;
              return t.isDecimal
                ? parseFloat(raw.toFixed(t.targetValue < 1 ? 3 : 1))
                : Math.round(raw);
            });
            setCurrentValues(newVals);
          },
        },
      });

      // 1. PORSCHE-STYLE VIEWPORT ZOOM PORTAL ENTRANCE (0% -> 18%)
      // Starts as a compact centered 60% card and expands to 100% full screen
      masterTl.fromTo(
        portalCardRef.current,
        {
          width: '60%',
          height: '62%',
          borderRadius: 32,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'rgba(255, 103, 0, 0.55)',
          boxShadow: '0 30px 100px rgba(0, 0, 0, 0.95), 0 0 60px rgba(255, 103, 0, 0.35)',
        },
        {
          width: '100%',
          height: '100%',
          borderRadius: 0,
          borderColor: 'rgba(255, 255, 255, 0.04)',
          boxShadow: 'none',
          ease: 'power2.out',
          duration: 18,
        },
        0
      );

      // Center Hook Statement behavior during zoom (0% -> 18% -> 26%)
      masterTl.fromTo(
        centerHookRef.current,
        { opacity: 0.6, scale: 0.95, filter: 'blur(6px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 12, ease: 'power2.out' },
        0
      );

      masterTl.to(
        centerHookRef.current,
        { opacity: 0, scale: 1.05, filter: 'blur(10px)', duration: 8, ease: 'power2.inOut', pointerEvents: 'none' },
        18
      );

      // Split Dissection Stage reveals as center hook fades out (18% -> 26%)
      masterTl.fromTo(
        splitStageRef.current,
        { opacity: 0, scale: 0.96, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 8, ease: 'power2.out' },
        18
      );

      // Hardware images initial state setup
      gsap.set('.hardware-stage-0', { opacity: 1, scale: 1, filter: 'blur(0px)' });
      gsap.set('.hardware-stage-1', { opacity: 0, scale: 0.92, filter: 'blur(10px)' });
      gsap.set('.hardware-stage-2', { opacity: 0, scale: 0.92, filter: 'blur(10px)' });
      gsap.set('.hardware-stage-3', { opacity: 0, scale: 0.92, filter: 'blur(10px)' });

      // Kinetic text panels initial state
      gsap.set('.kinetic-panel-0', { opacity: 1, y: 0, filter: 'blur(0px)' });
      gsap.set('.kinetic-panel-1', { opacity: 0, y: 35, filter: 'blur(10px)' });
      gsap.set('.kinetic-panel-2', { opacity: 0, y: 35, filter: 'blur(10px)' });
      gsap.set('.kinetic-panel-3', { opacity: 0, y: 35, filter: 'blur(10px)' });

      // 2. CROSSFADE STAGE 0 -> STAGE 1 (Powertrain) at 44% -> 54%
      masterTl
        // Stage 0 exits
        .to(
          '.hardware-stage-0',
          { opacity: 0, scale: 0.94, filter: 'blur(8px)', duration: 10, ease: 'power2.inOut' },
          44
        )
        .to(
          '.kinetic-panel-0',
          { opacity: 0, y: -30, filter: 'blur(8px)', duration: 10, ease: 'power2.inOut' },
          44
        )
        // Stage 1 enters
        .to(
          '.hardware-stage-1',
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 10, ease: 'power2.inOut' },
          45
        )
        .to(
          '.kinetic-panel-1',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 10, ease: 'power2.inOut' },
          45
        );

      // 3. CROSSFADE STAGE 1 -> STAGE 2 (Suspension) at 72% -> 82%
      masterTl
        // Stage 1 exits
        .to(
          '.hardware-stage-1',
          { opacity: 0, scale: 0.94, filter: 'blur(8px)', duration: 10, ease: 'power2.inOut' },
          72
        )
        .to(
          '.kinetic-panel-1',
          { opacity: 0, y: -30, filter: 'blur(8px)', duration: 10, ease: 'power2.inOut' },
          72
        )
        // Stage 2 enters
        .to(
          '.hardware-stage-2',
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 10, ease: 'power2.inOut' },
          73
        )
        .to(
          '.kinetic-panel-2',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 10, ease: 'power2.inOut' },
          73
        );

      // 4. CROSSFADE STAGE 2 -> STAGE 3 (Brakes) at 92% -> 98%
      masterTl
        // Stage 2 exits
        .to(
          '.hardware-stage-2',
          { opacity: 0, scale: 0.94, filter: 'blur(8px)', duration: 6, ease: 'power2.inOut' },
          92
        )
        .to(
          '.kinetic-panel-2',
          { opacity: 0, y: -30, filter: 'blur(8px)', duration: 6, ease: 'power2.inOut' },
          92
        )
        // Stage 3 enters and STAYS locked through 100% and unpin
        .to(
          '.hardware-stage-3',
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 6, ease: 'power2.inOut' },
          93
        )
        .to(
          '.kinetic-panel-3',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 6, ease: 'power2.inOut' },
          93
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mobile fallback
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
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* PORSCHE-STYLE VIEWPORT ZOOM EXPANSION CARD (Starts at 60% and expands to 100%) */}
      <Box
        ref={portalCardRef}
        sx={{
          position: 'relative',
          width: { xs: '100%', lg: '60%' },
          height: { xs: 'auto', lg: '62%' },
          minHeight: { xs: 'auto', lg: 'auto' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0c0c12',
          overflow: 'hidden',
          willChange: 'width, height, transform, border-radius, box-shadow',
        }}
      >
        {/* 1. ATMOSPHERIC AMBIENT GLOW & TECHNICAL BLUEPRINT GRID */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 35% 50%, rgba(255, 103, 0, 0.12) 0%, rgba(7, 7, 9, 0) 65%), radial-gradient(circle at 75% 65%, rgba(255, 103, 0, 0.05) 0%, rgba(7, 7, 9, 0) 55%)',
            pointerEvents: 'none',
          }}
        />

        {/* Technical Sub-micron Grid Texture */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.035,
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        {/* 2. PORSCHE-STYLE OPENING CENTER HOOK (Visible during initial zoom, fades out as dissection reveals) */}
        <Box
          ref={centerHookRef}
          sx={{
            position: 'absolute',
            inset: 0,
            display: { xs: 'none', lg: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            zIndex: 15,
            px: 4,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.2,
              px: 2,
              py: 0.6,
              borderRadius: '2px',
              backgroundColor: 'rgba(255, 103, 0, 0.12)',
              border: '1px solid #FF6700',
              boxShadow: '0 0 20px rgba(255, 103, 0, 0.3)',
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
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#FF6700',
                letterSpacing: '0.18em',
              }}
            >
              DISSECTION PROTOCOL // 1,350 CC BEAST
            </Typography>
          </Box>

          <Typography
            sx={{
              fontFamily: 'var(--font-display, "Outfit", sans-serif)',
              fontSize: { lg: '3.6rem', xl: '4.4rem' },
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 0 50px rgba(255, 103, 0, 0.3)',
              maxWidth: '900px',
            }}
          >
            THE BEAST STRIPPED BARE.
          </Typography>

          <Typography
            sx={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.85rem',
              color: '#A1A1AA',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            SURGICAL PRECISION // RAW UNCOMPROMISING MECHANICS
          </Typography>
        </Box>

        {/* 3. MAIN SPLIT DISSECTION STAGE (SWAPPED: LEFT = MOTORCYCLE, RIGHT = INFORMATION) */}
        <Box
          ref={splitStageRef}
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '1920px',
            mx: 'auto',
            px: { xs: 3, md: 5, xl: 8 },
            py: { xs: 6, lg: 0 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 480px', xl: '1fr 520px' },
            gap: { xs: 5, lg: 4, xl: 8 },
            alignItems: 'center',
            minHeight: { xs: 'auto', lg: '740px', xl: '820px' },
            zIndex: 20,
            opacity: { xs: 1, lg: 0 }, // Driven by GSAP reveal
          }}
        >
          {/* COLUMN 1 (LEFT): THE EXPANDED HIGH-IMPACT MOTORCYCLE DISSECTION STAGE */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: '380px', sm: '500px', md: '620px', lg: '720px', xl: '800px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              // Gentle left mask to eliminate any visible flat boundary from transparent crop
              maskImage: 'linear-gradient(to right, transparent 0%, black 28px, black 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 28px, black 100%)',
            }}
          >
            {/* BASE LAYER: High-Resolution Blueprint Ghost Bike (Facing Right) */}
            <Box
              component="img"
              src={bikeBaseImg}
              alt="KTM 1390 Super Duke R Technical Blueprint"
              sx={{
                position: 'absolute',
                width: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                opacity: 0.38,
                filter: 'grayscale(0.35) brightness(0.85) contrast(1.15) drop-shadow(0 0 35px rgba(255, 103, 0, 0.15))',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />

            {/* ACTIVE DISSECTION HARDWARE CUTOUT LAYERS (Scrubbed Smoothly with GSAP) */}
            {ANATOMY_STAGES.map((stage, idx) => (
              <Box
                key={stage.id}
                component="img"
                src={stage.hardwareImage}
                alt={stage.headline}
                className={`hardware-stage-${idx}`}
                sx={{
                  position: 'absolute',
                  maxWidth: { xs: '94%', lg: '92%' },
                  maxHeight: { xs: '94%', lg: '92%' },
                  objectFit: 'contain',
                  filter:
                    'drop-shadow(0 0 35px rgba(255, 103, 0, 0.65)) drop-shadow(0 20px 50px rgba(0, 0, 0, 0.95))',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  zIndex: 22,
                  willChange: 'transform, opacity, filter',
                }}
              />
            ))}

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
                  r="20"
                  fill="none"
                  stroke="#FF6700"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                  style={{
                    transition: 'cx 0.6s cubic-bezier(0.16, 1, 0.3, 1), cy 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
                <circle
                  cx={`${activeStageData.reticleTarget.x}%`}
                  cy={`${activeStageData.reticleTarget.y}%`}
                  r="4"
                  fill="#FF6700"
                  style={{
                    transition: 'cx 0.6s cubic-bezier(0.16, 1, 0.3, 1), cy 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </svg>

              {/* Reticle Target Label Pill (Pointing naturally to the right toward data) */}
              <Box
                sx={{
                  position: 'absolute',
                  left: `${activeStageData.reticleTarget.x}%`,
                  top: `${activeStageData.reticleTarget.y}%`,
                  transform: 'translate(26px, -50%)',
                  px: 1.4,
                  py: 0.5,
                  borderRadius: '2px',
                  backgroundColor: 'rgba(7, 7, 9, 0.92)',
                  border: '1px solid #FF6700',
                  boxShadow: '0 0 20px rgba(255, 103, 0, 0.35)',
                  backdropFilter: 'blur(12px)',
                  transition: 'left 0.6s cubic-bezier(0.16, 1, 0.3, 1), top 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.64rem',
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

          {/* COLUMN 2 (RIGHT): KINETIC TELEMETRY STAGES & SPECIFICATIONS */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 25,
              width: '100%',
              minHeight: { xs: 'auto', lg: '500px' },
            }}
          >
            {ANATOMY_STAGES.map((stage, idx) => {
              const isCurrent = idx === activeStage;
              return (
                <Box
                  key={stage.id}
                  className={`kinetic-panel-${idx}`}
                  sx={{
                    position: { xs: isCurrent ? 'relative' : 'none', lg: idx === 0 ? 'relative' : 'absolute' },
                    display: { xs: isCurrent ? 'flex' : 'none', lg: 'flex' },
                    top: 0,
                    left: 0,
                    width: '100%',
                    flexDirection: 'column',
                    gap: 2.2,
                    pointerEvents: isCurrent ? 'auto' : 'none',
                    willChange: 'transform, opacity, filter',
                  }}
                >
                  {/* Active Hardware Badge */}
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1.2,
                      px: 1.8,
                      py: 0.6,
                      borderRadius: '2px',
                      backgroundColor: 'rgba(255, 103, 0, 0.08)',
                      border: '1px solid rgba(255, 103, 0, 0.45)',
                      boxShadow: '0 0 16px rgba(255, 103, 0, 0.18)',
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
                        fontSize: { xs: '0.66rem', lg: '0.72rem' },
                        fontWeight: 800,
                        color: '#FF6700',
                        letterSpacing: '0.14em',
                      }}
                    >
                      {stage.badge}
                    </Typography>
                  </Box>

                  {/* High-Impact Kinetic Headline */}
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                      fontSize: { xs: '2.1rem', sm: '2.6rem', lg: '2.9rem', xl: '3.2rem' },
                      fontWeight: 900,
                      color: '#FFFFFF',
                      lineHeight: 1.02,
                      letterSpacing: '-0.035em',
                      textTransform: 'uppercase',
                      textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 0 35px rgba(255, 103, 0, 0.25)',
                    }}
                  >
                    {stage.headline}
                  </Typography>

                  {/* Subhead narrative */}
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-body, "Inter", sans-serif)',
                      fontSize: { xs: '0.88rem', lg: '0.94rem' },
                      color: '#A1A1AA',
                      lineHeight: 1.65,
                      fontWeight: 400,
                      maxWidth: '520px',
                    }}
                  >
                    {stage.subhead}
                  </Typography>

                  {/* 4-Cell Telemetry Matrix */}
                  <Box
                    sx={{
                      mt: 1,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 1.5,
                      width: '100%',
                    }}
                  >
                    {stage.telemetry.map((item, mIdx) => {
                      // On desktop, use live scrubbed rolling value for active stage
                      const displayVal =
                        isCurrent && currentValues[mIdx] !== undefined
                          ? currentValues[mIdx]
                          : item.targetValue;
                      return (
                        <Box
                          key={item.label}
                          sx={{
                            p: { xs: 1.8, lg: 2.2 },
                            borderRadius: '2px',
                            backgroundColor: 'rgba(15, 15, 20, 0.88)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.10)',
                            borderTop: '1px solid rgba(255, 255, 255, 0.32)',
                            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.65)',
                            transition: 'border-color 0.3s ease, transform 0.2s ease',
                            '&:hover': {
                              borderColor: '#FF6700',
                              transform: 'translateY(-1px)',
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-mono, monospace)',
                              fontSize: '0.62rem',
                              fontWeight: 700,
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
                                fontSize: { xs: '1.45rem', lg: '1.85rem' },
                                fontWeight: 900,
                                color: '#FFFFFF',
                                letterSpacing: '-0.02em',
                                fontVariantNumeric: 'tabular-nums',
                                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                              }}
                            >
                              {item.prefix || ''}
                              {displayVal.toLocaleString()}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: 'var(--font-mono, monospace)',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                color: '#FF6700',
                                letterSpacing: '0.06em',
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
              );
            })}

            {/* Mobile Fallback Navigation Tabs (Hidden on Desktop) */}
            <Box
              sx={{
                display: { xs: 'flex', lg: 'none' },
                flexWrap: 'wrap',
                gap: 1,
                mt: 3,
              }}
            >
              {ANATOMY_STAGES.map((st, idx) => (
                <Box
                  key={st.id}
                  onClick={() => setActiveStage(idx)}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono, monospace)',
                    color: idx === activeStage ? '#FF6700' : '#A1A1AA',
                    border: idx === activeStage ? '1px solid #FF6700' : '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: idx === activeStage ? 'rgba(255,103,0,0.12)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  0{idx + 1} // {st.id.toUpperCase()}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* 4. DISCREET CAD CADENCE FOOTER */}
        <Box
          sx={{
            position: { xs: 'relative', lg: 'absolute' },
            bottom: { lg: 20 },
            left: 0,
            right: 0,
            px: { xs: 3, md: 8, xl: 10 },
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
              color: '#52525B',
              letterSpacing: '0.12em',
            }}
          >
            CAD CADENCE // DISSECTION RATIO 1:1 // MATTIGHOFEN DYNAMICS
          </Typography>

          <Typography
            sx={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.68rem',
              color: '#A1A1AA',
              letterSpacing: '0.12em',
            }}
          >
            EXPLORE SUBSYSTEMS [ 0{activeStage + 1} / 04 ]
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default KtmAnatomyFury;
