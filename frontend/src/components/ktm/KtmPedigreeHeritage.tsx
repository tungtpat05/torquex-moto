import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ktmVintageRacerImg from '@/assets/images/ktm/heritage/ktm_vintage_racer.jpg';
import dakarRallyComaImg from '@/assets/images/ktm/heritage/dakar_rally_coma.jpg';
import motogpRc16ActionImg from '@/assets/images/ktm/heritage/motogp_rc16_action.jpg';

gsap.registerPlugin(ScrollTrigger);

interface HeroMetric {
  value: string;
  label: string;
}

interface HeritagePillar {
  id: string;
  scrubberLabel: string;
  headlineLine1: string;
  headlineLine2: string;
  narrative: string;
  metrics: [HeroMetric, HeroMetric];
  image: string;
  imageAlt: string;
}

const BRAND_PILLARS: HeritagePillar[] = [
  {
    id: 'pillar-forge',
    scrubberLabel: 'READY TO RACE',
    headlineLine1: 'THE "READY TO RACE"',
    headlineLine2: 'MANDATE.',
    narrative:
      'Forged in Hans Trunkenpolz’s Austrian mechanical workshop with one uncompromising doctrine: eliminate every gram of excess mass, build ultra-stiff tubular steel chassis, and build machines engineered to win straight from the crate.',
    metrics: [
      { value: '1953', label: 'FOUNDING ORIGIN' },
      { value: '100%', label: 'HAND-FORGED STEEL CHASSIS' },
    ],
    image: ktmVintageRacerImg,
    imageAlt: 'Early Austrian lightweight racing machine from Mattighofen workshop',
  },
  {
    id: 'pillar-dakar',
    scrubberLabel: 'DAKAR DOMINANCE',
    headlineLine1: '18 YEARS UNDEFEATED IN',
    headlineLine2: 'THE SAHARA.',
    narrative:
      '18 consecutive Dakar titles across 9,000 km of punishing Sahara sand and Atacama rocks. The ultimate endurance torture test proved the indestructible mechanical reliability of the KTM engine to the world.',
    metrics: [
      { value: '18 TITLES', label: 'CONSECUTIVE DAKAR WINS' },
      { value: '162,000+ KM', label: 'FULL-THROTTLE DESERT STAGES' },
    ],
    image: dakarRallyComaImg,
    imageAlt: 'Marc Coma launching KTM factory rally machine through desert dunes',
  },
  {
    id: 'pillar-motogp',
    scrubberLabel: 'MOTOGP DNA',
    headlineLine1: 'WIND TUNNELS &',
    headlineLine2: '366 KM/H TELEMETRY.',
    narrative:
      'Competing at the pinnacle of Grand Prix racing with the RC16 prototype. Aerodynamic carbon downforce winglets, CamShift variable valve timing, and WP Semi-Active suspension flow directly from the GP grid into serial production.',
    metrics: [
      { value: '366.1 KM/H', label: 'PROTOTYPE APEX SPEED' },
      { value: '+3.5 KG', label: 'AERO DOWNFORCE LOAD' },
    ],
    image: motogpRc16ActionImg,
    imageAlt: 'Brad Binder #33 carving corners with carbon aero winglets on Red Bull KTM RC16',
  },
];

export const KtmPedigreeHeritage: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0); // 0 = Bridge, 1 = Pillar 1, 2 = Pillar 2, 3 = Pillar 3

  const sectionRef = useRef<HTMLDivElement>(null);
  const activeStageRef = useRef<number>(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (window.innerWidth < 1024 || prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      // MASTER CHRONICLE TIMELINE: Staggered Phrase-by-Phrase Kinetic Reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'heritage-brand-master',
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%', // 3.0 viewport scrub duration for luxurious cinematic pacing
          pin: true,
          scrub: 0.8, // Inertial smooth scrub
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;

            // Map progress to active stage:
            // 0.00 -> 0.22: Stage 0 (Manifesto Bridge)
            // 0.22 -> 0.48: Stage 1 (Pillar 1 - Ready to Race)
            // 0.48 -> 0.74: Stage 2 (Pillar 2 - Dakar Dominance)
            // 0.74 -> 1.00: Stage 3 (Pillar 3 - MotoGP DNA)
            const nextStage = p < 0.22 ? 0 : p < 0.48 ? 1 : p < 0.74 ? 2 : 3;

            if (nextStage !== activeStageRef.current) {
              activeStageRef.current = nextStage;
              setActiveStage(nextStage);
            }
          },
        },
      });

      // Plates initially hidden
      tl.set('.pillar-plate-0', { opacity: 0, scale: 1.06 }, 0);
      tl.set('.pillar-plate-1', { opacity: 0, scale: 1.06 }, 0);
      tl.set('.pillar-plate-2', { opacity: 0, scale: 1.06 }, 0);

      // Initial hidden states for staggered pillar text
      BRAND_PILLARS.forEach((_, idx) => {
        tl.set(`.pillar-line1-${idx}`, { opacity: 0, y: 40 }, 0);
        tl.set(`.pillar-line2-${idx}`, { opacity: 0, y: 40 }, 0);
        tl.set(`.pillar-narrative-${idx}`, { opacity: 0, y: 30 }, 0);
        tl.set(`.pillar-metrics-${idx}`, { opacity: 0, y: 30 }, 0);
      });

      // =========================================================================
      // BEAT 0: THE MANIFESTO BRIDGE (0% -> 22%) - PHRASE BY PHRASE KINETIC REVEAL
      // =========================================================================
      // Eyebrow appears
      tl.fromTo(
        '.bridge-eyebrow',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 4, ease: 'power2.out' },
        0
      );

      // Line 1: "THE 1390 IS NOT AN EXCEPTION."
      tl.fromTo(
        '.bridge-text-line-1',
        { opacity: 0, y: 55 },
        { opacity: 1, y: 0, duration: 6, ease: 'power3.out' },
        2
      );

      // Line 2: "IT IS THE PHILOSOPHY OF KTM." (Staggered, glowing orange)
      tl.fromTo(
        '.bridge-text-line-2',
        { opacity: 0, y: 55 },
        { opacity: 1, y: 0, duration: 6, ease: 'power3.out' },
        5
      );

      // Subtext narrative appears
      tl.fromTo(
        '.bridge-subtext',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 6, ease: 'power2.out' },
        8
      );

      // Reading hold
      tl.to({}, { duration: 8 }, 11);

      // Staggered exit of bridge phrases
      tl.to('.bridge-eyebrow', { opacity: 0, y: -20, duration: 4, ease: 'power2.in' }, 16);
      tl.to('.bridge-text-line-1', { opacity: 0, y: -45, duration: 5, ease: 'power2.in' }, 17);
      tl.to('.bridge-text-line-2', { opacity: 0, y: -45, duration: 5, ease: 'power2.in' }, 18);
      tl.to('.bridge-subtext', { opacity: 0, y: -30, duration: 5, ease: 'power2.in' }, 19);

      // =========================================================================
      // BEAT 1: READY TO RACE (22% -> 48%) - STAGGERED PHRASE REVEAL
      // =========================================================================
      tl.to('.pillar-plate-0', { opacity: 1, scale: 1, duration: 8, ease: 'power3.out' }, 22);
      tl.to('.pillar-line1-0', { opacity: 1, y: 0, duration: 6, ease: 'power3.out' }, 24);
      tl.to('.pillar-line2-0', { opacity: 1, y: 0, duration: 6, ease: 'power3.out' }, 26);
      tl.to('.pillar-narrative-0', { opacity: 1, y: 0, duration: 6, ease: 'power3.out' }, 28);
      tl.to('.pillar-metrics-0', { opacity: 1, y: 0, duration: 6, ease: 'power3.out' }, 30);

      // Camera drift on 1953 plate
      tl.to('.pillar-plate-0', { scale: 1.03, duration: 18, ease: 'none' }, 24);
      tl.to({}, { duration: 14 }, 30);

      // Staggered exit for Pillar 0
      tl.to('.pillar-line1-0', { opacity: 0, y: -30, duration: 5, ease: 'power2.in' }, 42);
      tl.to('.pillar-line2-0', { opacity: 0, y: -30, duration: 5, ease: 'power2.in' }, 43);
      tl.to('.pillar-narrative-0', { opacity: 0, y: -20, duration: 5, ease: 'power2.in' }, 44);
      tl.to('.pillar-metrics-0', { opacity: 0, y: -20, duration: 5, ease: 'power2.in' }, 45);
      tl.to('.pillar-plate-0', { opacity: 0, duration: 6, ease: 'power2.inOut' }, 44);

      // =========================================================================
      // BEAT 2: DAKAR DOMINANCE (48% -> 74%) - STAGGERED PHRASE REVEAL
      // =========================================================================
      tl.to('.pillar-plate-1', { opacity: 1, scale: 1, duration: 8, ease: 'power3.out' }, 48);
      tl.to('.pillar-line1-1', { opacity: 1, y: 0, duration: 6, ease: 'power3.out' }, 50);
      tl.to('.pillar-line2-1', { opacity: 1, y: 0, duration: 6, ease: 'power3.out' }, 52);
      tl.to('.pillar-narrative-1', { opacity: 1, y: 0, duration: 6, ease: 'power3.out' }, 54);
      tl.to('.pillar-metrics-1', { opacity: 1, y: 0, duration: 6, ease: 'power3.out' }, 56);

      // Camera drift across Sahara dunes
      tl.to('.pillar-plate-1', { scale: 1.03, duration: 18, ease: 'none' }, 50);
      tl.to({}, { duration: 14 }, 56);

      // Staggered exit for Pillar 1
      tl.to('.pillar-line1-1', { opacity: 0, y: -30, duration: 5, ease: 'power2.in' }, 68);
      tl.to('.pillar-line2-1', { opacity: 0, y: -30, duration: 5, ease: 'power2.in' }, 69);
      tl.to('.pillar-narrative-1', { opacity: 0, y: -20, duration: 5, ease: 'power2.in' }, 70);
      tl.to('.pillar-metrics-1', { opacity: 0, y: -20, duration: 5, ease: 'power2.in' }, 71);
      tl.to('.pillar-plate-1', { opacity: 0, duration: 6, ease: 'power2.inOut' }, 70);

      // =========================================================================
      // BEAT 3: MOTOGP DNA (74% -> 100%) - STAGGERED PHRASE REVEAL
      // =========================================================================
      tl.to('.pillar-plate-2', { opacity: 1, scale: 1, duration: 8, ease: 'power3.out' }, 74);
      tl.to('.pillar-line1-2', { opacity: 1, y: 0, duration: 6, ease: 'power3.out' }, 76);
      tl.to('.pillar-line2-2', { opacity: 1, y: 0, duration: 6, ease: 'power3.out' }, 78);
      tl.to('.pillar-narrative-2', { opacity: 1, y: 0, duration: 6, ease: 'power3.out' }, 80);
      tl.to('.pillar-metrics-2', { opacity: 1, y: 0, duration: 6, ease: 'power3.out' }, 82);

      // Camera drift on Brad Binder RC16
      tl.to('.pillar-plate-2', { scale: 1.03, duration: 18, ease: 'none' }, 76);

      tl.to({}, { duration: 12 }, 88);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      id="heritage"
      ref={sectionRef}
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 'auto', lg: '100vh' },
        backgroundColor: '#070709',
        overflow: 'hidden',
        color: '#F4F4F5',
        marginTop: '-4px', // Eliminate any subpixel gap with Apex Surge
        zIndex: 3,
        border: 'none',
        outline: 'none',
      }}
    >
      {/* ===================================================================== */}
      {/* BEAT 0: THE CINEMATIC MANIFESTO BRIDGE (100% ENGLISH, BALANCED LINES) */}
      {/* ===================================================================== */}
      <Box
        className="brand-manifesto-bridge"
        sx={{
          position: { xs: 'relative', lg: 'absolute' },
          inset: 0,
          width: '100%',
          height: '100%',
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: { xs: 3, md: 6, lg: 10 },
          zIndex: 9,
          pointerEvents: 'none',
        }}
      >
        {/* Subtle Eyebrow */}
        <Box className="bridge-eyebrow" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: '#FF6700',
              boxShadow: '0 0 10px #FF6700',
              animation: 'bridgePulseDot 2s infinite',
              '@keyframes bridgePulseDot': {
                '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                '50%': { transform: 'scale(1.5)', opacity: 0.5 },
              },
            }}
          />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: { xs: '0.70rem', md: '0.78rem' },
              fontWeight: 800,
              letterSpacing: '0.22em',
              color: '#FF6700',
              textTransform: 'uppercase',
            }}
          >
            THE SOUL OF THE MACHINE
          </Typography>
        </Box>

        {/* Balanced Typographic Headline in 2 Separate Lines */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, mb: 3 }}>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography
              variant="h2"
              className="bridge-text-line-1"
              sx={{
                fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                fontSize: { xs: '2.4rem', sm: '3.6rem', md: '4.6rem', lg: '5.4rem' },
                fontWeight: 950,
                lineHeight: 1.02,
                letterSpacing: '-0.035em',
                color: '#FFFFFF',
                textTransform: 'uppercase',
                textShadow: '0 4px 40px rgba(0, 0, 0, 0.95)',
              }}
            >
              THE 1390 IS NOT AN EXCEPTION.
            </Typography>
          </Box>

          <Box sx={{ overflow: 'hidden' }}>
            <Typography
              variant="h2"
              className="bridge-text-line-2"
              sx={{
                fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                fontSize: { xs: '2.4rem', sm: '3.6rem', md: '4.6rem', lg: '5.4rem' },
                fontWeight: 950,
                lineHeight: 1.02,
                letterSpacing: '-0.035em',
                color: '#FF6700',
                textTransform: 'uppercase',
                textShadow: '0 0 50px rgba(255, 103, 0, 0.65), 0 0 90px rgba(255, 103, 0, 0.35)',
              }}
            >
              IT IS THE PHILOSOPHY OF KTM.
            </Typography>
          </Box>
        </Box>

        {/* English Narrative Subtext */}
        <Box sx={{ overflow: 'hidden', maxWidth: '740px' }}>
          <Typography
            className="bridge-subtext"
            sx={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: { xs: '0.95rem', md: '1.12rem' },
              color: '#A1A1AA',
              lineHeight: 1.7,
              letterSpacing: '0.02em',
              textShadow: '0 2px 16px rgba(0,0,0,0.9)',
            }}
          >
            For over seven decades in Mattighofen, Austria, we have refused to build compromise machines for ordinary roads. Every chassis, engine, and winglet is engineered for one purpose: total victory.
          </Typography>
        </Box>
      </Box>

      {/* ===================================================================== */}
      {/* 1. FULL-BLEED 100% CINEMATIC BACKDROP PLATES (NO DISTRACTING HUD BARS)*/}
      {/* ===================================================================== */}
      <Box
        sx={{
          position: { xs: 'relative', lg: 'absolute' },
          inset: 0,
          width: '100%',
          height: '100%',
          display: { xs: 'none', lg: 'block' },
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {BRAND_PILLARS.map((pillar, index) => (
          <Box
            key={`plate-${pillar.id}`}
            className={`pillar-plate-${index}`}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              willChange: 'transform, opacity',
            }}
          >
            {/* The Authentic Racing Photograph */}
            <Box
              component="img"
              src={pillar.image}
              alt={pillar.imageAlt}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition:
                  index === 0
                    ? 'center 45%'
                    : index === 1
                    ? 'center 38%'
                    : 'center 48%',
                filter:
                  index === 0
                    ? 'contrast(1.18) brightness(0.80) grayscale(0.2)'
                    : index === 1
                    ? 'contrast(1.12) brightness(0.85)'
                    : 'contrast(1.15) brightness(0.82)',
              }}
            />

            {/* Subtle Gradient Scrims: Grounding for 100% text readability */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(7, 7, 9, 0.95) 0%, rgba(7, 7, 9, 0.6) 30%, transparent 65%)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to right, rgba(7, 7, 9, 0.85) 0%, rgba(7, 7, 9, 0.4) 40%, transparent 80%)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
          </Box>
        ))}
      </Box>

      {/* ===================================================================== */}
      {/* 2. LOWER-THIRD FOCAL NARRATIVE (NO SMALL BADGES, DIRECT IMPACT)      */}
      {/* ===================================================================== */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          px: { xs: 3, md: 6, lg: 8 },
          pt: { xs: 8, lg: '12vh' },
          pb: { xs: 8, lg: '9vh' },
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'flex-end',
          zIndex: 8,
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            width: '100%',
            maxWidth: '1080px',
          }}
        >
          {BRAND_PILLARS.map((pillar, index) => (
            <Box
              key={`story-${pillar.id}`}
              className={`pillar-content-${index}`}
              aria-hidden={activeStage !== index + 1}
              sx={{
                gridArea: '1 / 1', // Perfect co-location, zero layout jumping
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                willChange: 'transform, opacity',
              }}
            >
              {/* Direct Headline Line 1 & Line 2 (No "PILLAR 01" badge) */}
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography
                    variant="h2"
                    className={`pillar-line1-${index}`}
                    sx={{
                      fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                      fontSize: { lg: '3.6rem', xl: '4.4rem' },
                      fontWeight: 950,
                      lineHeight: 1.02,
                      letterSpacing: '-0.04em',
                      color: '#FFFFFF',
                      textTransform: 'uppercase',
                      textShadow: '0 4px 30px rgba(0, 0, 0, 0.9)',
                    }}
                  >
                    {pillar.headlineLine1}
                  </Typography>
                </Box>

                <Box sx={{ overflow: 'hidden' }}>
                  <Typography
                    variant="h2"
                    className={`pillar-line2-${index}`}
                    sx={{
                      fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                      fontSize: { lg: '3.6rem', xl: '4.4rem' },
                      fontWeight: 950,
                      lineHeight: 1.02,
                      letterSpacing: '-0.04em',
                      color: '#FF6700',
                      textTransform: 'uppercase',
                      textShadow: '0 0 35px rgba(255, 103, 0, 0.6)',
                    }}
                  >
                    {pillar.headlineLine2}
                  </Typography>
                </Box>
              </Box>

              {/* Story Narrative */}
              <Box sx={{ overflow: 'hidden' }}>
                <Typography
                  className={`pillar-narrative-${index}`}
                  sx={{
                    fontFamily: 'var(--font-body, "Inter", sans-serif)',
                    fontSize: { lg: '1.05rem', xl: '1.15rem' },
                    color: '#D4D4D8',
                    lineHeight: 1.65,
                    maxWidth: '720px',
                    textShadow: '0 2px 14px rgba(0, 0, 0, 0.95)',
                    my: 0.5,
                  }}
                >
                  {pillar.narrative}
                </Typography>
              </Box>

              {/* Exactly 2 Clean Hero Metrics */}
              <Box
                className={`pillar-metrics-${index}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { lg: 6, xl: 8 },
                  pt: 2.5,
                  mt: 0.5,
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {pillar.metrics.map((m) => (
                  <Box key={m.label}>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: { lg: '1.6rem', xl: '1.9rem' },
                        fontWeight: 950,
                        color: '#FFFFFF',
                        letterSpacing: '0.02em',
                        lineHeight: 1,
                        mb: 0.6,
                      }}
                    >
                      {m.value}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '0.64rem',
                        fontWeight: 700,
                        color: '#71717A',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {m.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ===================================================================== */}
      {/* 4. MOBILE RESPONSIVE FLUID VIEWPORT (< 1024PX SCREEN FALLBACK)        */}
      {/* ===================================================================== */}
      <Box
        sx={{
          display: { xs: 'flex', lg: 'none' },
          flexDirection: 'column',
          gap: 6,
          px: { xs: 3, sm: 5 },
          py: 8,
          position: 'relative',
          zIndex: 5,
        }}
      >
        {/* Mobile Manifesto Bridge Card */}
        <Box
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 103, 0, 0.05)',
            border: '1px solid rgba(255, 103, 0, 0.25)',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#FF6700',
              letterSpacing: '0.16em',
              mb: 1.5,
            }}
          >
            THE SOUL OF THE MACHINE
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-display, "Outfit", sans-serif)',
              fontSize: '2.0rem',
              fontWeight: 950,
              color: '#FFFFFF',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              mb: 2,
            }}
          >
            THE 1390 IS NOT AN EXCEPTION.{' '}
            <Box component="span" sx={{ color: '#FF6700' }}>
              IT IS THE PHILOSOPHY OF KTM.
            </Box>
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: '0.92rem',
              color: '#A1A1AA',
              lineHeight: 1.6,
            }}
          >
            For over seven decades in Mattighofen, Austria, we have refused to build compromise machines for ordinary roads. Every chassis, engine, and winglet is engineered for one purpose: total victory.
          </Typography>
        </Box>

        {/* Mobile 3 Brand Pillars */}
        {BRAND_PILLARS.map((pillar) => (
          <Box
            key={`mobile-${pillar.id}`}
            sx={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#0F0F16',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Full-width Image */}
            <Box sx={{ position: 'relative', width: '100%', height: '260px' }}>
              <Box
                component="img"
                src={pillar.image}
                alt={pillar.imageAlt}
                loading="lazy"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.1) brightness(0.85)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, #0F0F16 0%, rgba(15, 15, 22, 0.3) 50%, transparent 100%)',
                }}
              />
            </Box>

            {/* Mobile Editorial Content */}
            <Box sx={{ p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 1.8 }}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                  fontSize: '1.9rem',
                  fontWeight: 950,
                  color: '#FFFFFF',
                  lineHeight: 1.05,
                  textTransform: 'uppercase',
                }}
              >
                {pillar.headlineLine1} <Box component="span" sx={{ color: '#FF6700' }}>{pillar.headlineLine2}</Box>
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'var(--font-body, "Inter", sans-serif)',
                  fontSize: '0.90rem',
                  color: '#A1A1AA',
                  lineHeight: 1.6,
                }}
              >
                {pillar.narrative}
              </Typography>

              {/* Exactly 2 Clean Hero Metrics */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 2,
                  pt: 2,
                  mt: 0.5,
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {pillar.metrics.map((m) => (
                  <Box key={m.label}>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '1.25rem',
                        fontWeight: 950,
                        color: '#FFFFFF',
                        mb: 0.3,
                      }}
                    >
                      {m.value}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '0.58rem',
                        color: '#71717A',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {m.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default KtmPedigreeHeritage;
