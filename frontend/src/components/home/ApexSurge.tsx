import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import wheelieActionImg from '@/assets/images/models/1390_wheelie_action.jpg';
import apexLean4kImg from '@/assets/images/models/1390_apex_lean_4k.jpg';
import forkImg from '@/assets/images/anatomy/1390_fork.png';
import tankImg from '@/assets/images/anatomy/1390_tank.png';
import headlightImg from '@/assets/images/anatomy/1390_headlight.png';
import engineImg from '@/assets/images/anatomy/1390_engine.png';
import brakesImg from '@/assets/images/anatomy/1390_brakes.png';

gsap.registerPlugin(ScrollTrigger);

interface CardItem {
  id: string;
  tag: string;
  title: string;
  metric: string;
  description: string;
  image: string;
  isTransparent?: boolean;
}

// 1. Hero Large Cards (3:4 Portrait)
const HERO_CARDS: CardItem[] = [
  {
    id: 'wheelie',
    tag: 'DYNAMIC TORQUE',
    title: 'POWER WHEELIE',
    metric: '0-100 KM/H • 3.0 SEC',
    description:
      '145 Nm hits the rear tire instantly. With anti-wheelie disengaged, the front Michelin Power GP claws skyward in second gear under savage LC8 acceleration.',
    image: wheelieActionImg,
  },
  {
    id: 'apex',
    tag: 'CHASSIS DYNAMICS',
    title: '52° APEX LEAN ANGLE',
    metric: 'MAX LATERAL GRIP • 1.52 G',
    description:
      'Ultra-rigid ChroMo steel trellis architecture enables extreme 52-degree apex lean angles with total front-end feedback, locking into the asphalt at high speed.',
    image: apexLean4kImg,
  },
  {
    id: 'wp-sat',
    tag: 'SUSPENSION TECH',
    title: 'WP APEX SEMI-ACTIVE (SAT)',
    metric: 'GEN 3 MAGNETIC VALVES',
    description:
      'Next-generation WP Semi-Active Technology with variable electromagnetic valves adjusts damping in milliseconds based on 6-axis lean angle sensors and stroke telemetry.',
    image: forkImg,
    isTransparent: true,
  },
];

// 2. Stacked Dual Cards (Square & Landscape)
const STACK_PAIR_1: [CardItem, CardItem] = [
  {
    id: 'brakes',
    tag: 'DECELERATION',
    title: 'BREMBO STYLEMA',
    metric: '100-0 KM/H • 31.2 M',
    description: '320 mm floating discs clamped by monobloc 4-piston calipers for race-grade initial bite.',
    image: brakesImg,
    isTransparent: true,
  },
  {
    id: 'tank',
    tag: 'AERODYNAMICS',
    title: 'AERO WINGLETS',
    metric: '+3.5 KG DOWNFORCE',
    description: 'Integrated aerodynamic winglets provide front-wheel stability at triple-digit velocities.',
    image: tankImg,
    isTransparent: true,
  },
];

const STACK_PAIR_2: [CardItem, CardItem] = [
  {
    id: 'engine',
    tag: 'POWERTRAIN',
    title: '1,350 CC CAMSHIFT',
    metric: '190 HP @ 10,500 RPM',
    description: 'Dual intake cam profiles unleash explosive torque across the entire rev spectrum.',
    image: engineImg,
    isTransparent: true,
  },
  {
    id: 'headlight',
    tag: 'RAM-AIR INDUCTION',
    title: 'PREDATOR INTAKE',
    metric: '+3.2 PSI PRESSURE',
    description: 'Split-face LED tunnel funnels pressurized oxygen straight into the combustion chambers.',
    image: headlightImg,
    isTransparent: true,
  },
];

export const ApexSurge: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const compressionRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineBoxRef = useRef<HTMLDivElement>(null);
  const marqueeBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Enforce muted property on native video element for rock-solid browser autoplay policy compliance
    if (videoRef.current) {
      videoRef.current.muted = true;
    }

    const ctx = gsap.context(() => {
      // VIDEO PLAYBACK CHOREOGRAPHY (All Screen Sizes)
      // 1. Starts playing when section enters from bottom of viewport (start: 'top bottom')
      // 2. Holds on last frame when finished (no loop)
      // 3. Rewinds to first frame (currentTime = 0) when user scrolls up and section exits below viewport
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => {
          const vid = videoRef.current;
          if (vid && !vid.ended) {
            vid.play().catch(() => { });
          }
        },
        onLeaveBack: () => {
          const vid = videoRef.current;
          if (vid) {
            vid.pause();
            try {
              vid.currentTime = 0;
            } catch {
              // Ignore if metadata is pending
            }
          }
        },
      });

      // PORSCHE MOTORSPORT CINEMATIC SCROLL CHOREOGRAPHY (Desktop only)
      if (window.innerWidth >= 1024 && !prefersReducedMotion) {
        // ELASTIC ACCORDION COMPRESSION TWEEN (Between Part 2 and Part 3)
        // Part 2 scrolls naturally upwards. Part 3 enters from bottom with an expanded
        // +270px offset (+50% increase from 180px for rich breathing room, gap = 10).
        // As user scrolls, y smoothly scrubs from 270px -> 0px, causing Part 3 to catch up
        // and compress the distance (10 -> 9 -> 8 -> 7 -> 6 -> 5 -> 4), maintaining refined
        // visual separation without ever freezing Part 2 or overlapping!
        gsap.fromTo(
          compressionRef.current,
          { y: 270 },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'top top',
              scrub: 0.5,
            },
          }
        );

        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=200%', // 2.0 viewport heights scrub distance for responsive control
            pin: true,
            scrub: 1.0, // Buttery soft inertia damping
            anticipatePin: 1,
          },
        });

        // Initial setup at scroll position 0
        masterTl.set(
          headlineBoxRef.current,
          { opacity: 0, y: 36, filter: 'blur(8px)' },
          0
        );
        masterTl.set(
          marqueeBoxRef.current,
          { opacity: 0, y: 120, pointerEvents: 'none' },
          0
        );

        // BEAT 1: KINETIC TELEMETRY & HEADLINE AWAKENING (0% -> 24%)
        masterTl.to(
          headlineBoxRef.current,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 20,
            ease: 'power3.out',
          },
          4
        );

        masterTl.fromTo(
          '.apex-telemetry-strip',
          { opacity: 0, scale: 0.92, y: -10 },
          { opacity: 1, scale: 1, y: 0, duration: 16, ease: 'back.out(1.4)' },
          5
        );

        masterTl.fromTo(
          '.apex-headline-word-1',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 16, ease: 'power2.out' },
          8
        );

        masterTl.fromTo(
          '.apex-headline-word-2',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 16, ease: 'power2.out' },
          12
        );

        masterTl.fromTo(
          '.apex-subhead-narrative',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 16, ease: 'power2.out' },
          16
        );

        // BEAT 2: READING WINDOW & WHEELIE APEX (24% -> 44%)
        // High visibility reading hold while video wheelie crests
        masterTl.to({}, { duration: 20 }, 24);

        // BEAT 3: SMOOTH DOCK ASCENT & HEADLINE TOP-HUD GLIDE (44% -> 84%)
        // Headline ascends into top HUD position
        masterTl.to(
          headlineBoxRef.current,
          {
            y: -36,
            scale: 0.94,
            opacity: 0.92,
            duration: 38,
            ease: 'power2.inOut',
          },
          44
        );

        // Marquee cards slide smoothly up into lower third dock with springy ease
        masterTl.fromTo(
          marqueeBoxRef.current,
          {
            opacity: 0,
            y: 120,
            pointerEvents: 'none',
          },
          {
            opacity: 1,
            y: 0,
            pointerEvents: 'auto',
            duration: 38,
            ease: 'power3.out',
          },
          46
        );

        // BEAT 4: Smooth settling cushion & dissolve into Act IV Pedigree (84% -> 100%)
        masterTl.to(
          marqueeBoxRef.current,
          { opacity: 0, y: 40, duration: 14, ease: 'power2.inOut' },
          86
        );
        masterTl.to(
          headlineBoxRef.current,
          { opacity: 0, y: -50, duration: 14, ease: 'power2.inOut' },
          86
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Render a 3:4 Hero Card
  const renderHeroCard = (card: CardItem, keyPrefix: string) => (
    <Box
      key={`${keyPrefix}-${card.id}`}
      onClick={() => setSelectedCard(card)}
      sx={{
        flexShrink: 0,
        width: { xs: '260px', sm: '300px', lg: '340px' },
        height: { xs: '360px', sm: '390px', lg: '430px' },
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor: 'rgba(14, 14, 20, 0.82)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 16px 45px rgba(0, 0, 0, 0.80)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          borderColor: '#FF6700',
          transform: 'translateY(-6px)',
          boxShadow: '0 24px 50px rgba(0, 0, 0, 0.95), 0 0 30px rgba(255, 103, 0, 0.35)',
          '& .card-arrow': {
            backgroundColor: '#FF6700',
            color: '#FFFFFF',
            transform: 'rotate(45deg)',
          },
          '& .card-bg-img': {
            transform: 'scale(1.06)',
          },
        },
      }}
    >
      {/* Background Image with Zoom on Hover */}
      <Box
        className="card-bg-img"
        component="img"
        src={card.image}
        alt={card.title}
        loading="lazy"
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: card.isTransparent ? 'contain' : 'cover',
          p: card.isTransparent ? { xs: 3, lg: 4 } : 0,
          filter: card.isTransparent
            ? 'drop-shadow(0 0 25px rgba(255, 103, 0, 0.50))'
            : 'none',
          transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Dark Vignette Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(7, 7, 9, 0.95) 0%, rgba(7, 7, 9, 0.45) 50%, rgba(7, 7, 9, 0.15) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Pill & Arrow Button */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 5,
        }}
      >
        <Box
          sx={{
            px: 1.4,
            py: 0.5,
            borderRadius: '100px',
            backgroundColor: 'rgba(7, 7, 9, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
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
            {card.tag}
          </Typography>
        </Box>

        <Box
          className="card-arrow"
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: 'rgba(7, 7, 9, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            color: '#E4E4E7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <ArrowOutwardIcon sx={{ fontSize: '0.95rem' }} />
        </Box>
      </Box>

      {/* Bottom Content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          zIndex: 5,
        }}
      >
        <Typography
          sx={{
            fontFamily: 'var(--font-display, "Outfit", sans-serif)',
            fontSize: { xs: '1.3rem', sm: '1.5rem', lg: '1.65rem' },
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            textTransform: 'uppercase',
            mb: 1,
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}
        >
          {card.title}
        </Typography>

        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 1.2,
            py: 0.4,
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 103, 0, 0.15)',
            border: '1px solid rgba(255, 103, 0, 0.45)',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.65rem',
              fontWeight: 800,
              color: '#FF6700',
              letterSpacing: '0.1em',
            }}
          >
            {card.metric}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  // Render a Dual Stack Cluster (2 stacked horizontal cards)
  const renderDualStack = (pair: [CardItem, CardItem], keyPrefix: string) => (
    <Box
      key={`${keyPrefix}-${pair[0].id}-${pair[1].id}-cluster`}
      sx={{
        flexShrink: 0,
        width: { xs: '260px', sm: '300px', lg: '340px' },
        height: { xs: '360px', sm: '390px', lg: '430px' },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1.5, lg: 2 },
      }}
    >
      {pair.map((card) => (
        <Box
          key={`${keyPrefix}-${card.id}`}
          onClick={() => setSelectedCard(card)}
          sx={{
            flex: 1,
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
            backgroundColor: 'rgba(12, 12, 18, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.10)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.70)',
            display: 'flex',
            alignItems: 'center',
            p: 2.2,
            gap: 2,
            transition: 'all 0.35s ease',
            '&:hover': {
              borderColor: '#FF6700',
              transform: 'translateY(-4px)',
              boxShadow: '0 18px 40px rgba(0, 0, 0, 0.90), 0 0 25px rgba(255, 103, 0, 0.30)',
              '& .stack-img': {
                transform: 'scale(1.1) rotate(2deg)',
              },
              '& .stack-arrow': {
                backgroundColor: '#FF6700',
                color: '#FFFFFF',
              },
            },
          }}
        >
          {/* Hardware Visual Thumbnail */}
          <Box
            sx={{
              width: { xs: '75px', sm: '90px' },
              height: { xs: '75px', sm: '90px' },
              flexShrink: 0,
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
            }}
          >
            <Box
              className="stack-img"
              component="img"
              src={card.image}
              alt={card.title}
              sx={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 14px rgba(255, 103, 0, 0.45))',
                transition: 'transform 0.5s ease',
              }}
            />
          </Box>

          {/* Details */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.60rem',
                fontWeight: 800,
                color: '#FF6700',
                letterSpacing: '0.14em',
                mb: 0.4,
              }}
            >
              {card.tag}
            </Typography>

            <Typography
              sx={{
                fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.15,
                textTransform: 'uppercase',
                mb: 0.6,
              }}
            >
              {card.title}
            </Typography>

            <Typography
              sx={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.64rem',
                color: '#A1A1AA',
                fontWeight: 700,
              }}
            >
              {card.metric}
            </Typography>
          </Box>

          <Box
            className="stack-arrow"
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#A1A1AA',
              transition: 'all 0.25s ease',
            }}
          >
            <ArrowOutwardIcon sx={{ fontSize: '0.85rem' }} />
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      id="action"
      ref={sectionRef}
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 'auto', lg: '100vh' },
        backgroundColor: '#070709',
        overflow: 'hidden',
        py: { xs: 8, lg: 0 },
        marginTop: '-4px', // Physical 4px overlap to eliminate any subpixel gap
        zIndex: 2,
        border: 'none',
        outline: 'none',
      }}
    >
      {/* Elastic compression stage: pulls up by 180px during entrance to shrink gap from 10 -> 4 */}
      <Box
        ref={compressionRef}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          willChange: 'transform',
        }}
      >
        {/* 1. CINEMATIC AMBIENT BACKGROUND RACETRACK VIDEO (PORSCHE "RACEBORN" 100% FULL WIDTH WITH ALPHA FEATHERING) */}
        <Box
          ref={videoWrapperRef}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            overflow: 'hidden',
            pointerEvents: 'none',
            // Minimal Alpha Feathering: dissolves only the top 6% edge, leaving 94% of the video crisp and bright
            maskImage:
              'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.45) 2%, black 6%, black 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.45) 2%, black 6%, black 100%)',
          }}
        >
          <Box
            component="video"
            ref={videoRef as any}
            src="/videos/1390-wheelie.mp4"
            muted
            playsInline
            preload="auto"
            onEnded={() => {
              if (videoRef.current) {
                videoRef.current.pause();
              }
            }}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: { xs: 'center 40%', md: 'center 46%' },
              opacity: 0.94, // Vivid & luminous
              filter: 'contrast(1.08) brightness(1.02)',
            }}
          />

          {/* Minimal Top Feather (Only top 10%, softly blending into #070709 without darkening the wheelie) */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '10%',
              background:
                'linear-gradient(to bottom, #070709 0%, rgba(7, 7, 9, 0.45) 40%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Bottom edge gradient for hardware dock grounding */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: { xs: '28%', md: '36%' },
              background:
                'linear-gradient(to top, #070709 0%, rgba(7, 7, 9, 0.65) 50%, transparent 100%)',
            }}
          />
        </Box>

        {/* 2. PORSCHE-STYLE MONUMENTAL HEADLINE (CHOREOGRAPHED KINETIC REVEAL) */}
        <Box
          ref={headlineBoxRef}
          sx={{
            position: 'absolute',
            top: { xs: 32, sm: 48, lg: '11%' },
            left: 0,
            right: 0,
            zIndex: 10,
            textAlign: 'center',
            maxWidth: '1200px',
            mx: 'auto',
            px: { xs: 3, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: 1.2, md: 1.6 },
            pointerEvents: 'none',
          }}
        >
          {/* Telemetry Status Strip (1390 Super Duke R EVO Telemetry Focus) */}
          <Box
            className="apex-telemetry-strip"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: { xs: 1, md: 1.5 },
              px: { xs: 1.8, md: 2.4 },
              py: 0.6,
              borderRadius: '100px',
              backgroundColor: 'rgba(7, 7, 9, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 103, 0, 0.45)',
              boxShadow: '0 0 25px rgba(255, 103, 0, 0.25)',
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                backgroundColor: '#FF6700',
                boxShadow: '0 0 10px #FF6700',
                animation: 'apexPulseDot 2s ease-in-out infinite',
                '@keyframes apexPulseDot': {
                  '0%, 100%': { transform: 'scale(1)', opacity: 1 },
                  '50%': { transform: 'scale(1.4)', opacity: 0.6 },
                },
              }}
            />
            <Typography
              sx={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: { xs: '0.62rem', md: '0.72rem' },
                fontWeight: 800,
                color: '#FF6700',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              1,350 CC • 190 HP • 145 NM
            </Typography>
          </Box>

          {/* Colossal Statement Headline (Scaled for balanced hierarchy, leaving center wheelie clear) */}
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'var(--font-display, "Outfit", sans-serif)',
              fontSize: { xs: '2.0rem', sm: '2.8rem', md: '3.6rem', lg: '4.4rem' },
              fontWeight: 950,
              lineHeight: 1.02,
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              textShadow: '0 4px 30px rgba(0,0,0,0.95), 0 0 45px rgba(255, 255, 255, 0.15)',
            }}
          >
            <Box component="span" className="apex-headline-word-1" sx={{ display: 'inline-block' }}>
              THE BEAST EVOLVED.{' '}
            </Box>
            <Box
              component="span"
              className="apex-headline-word-2"
              sx={{
                display: 'inline-block',
                color: '#FF6700',
                textShadow:
                  '0 4px 40px rgba(0,0,0,0.95), 0 0 45px rgba(255, 103, 0, 0.80), 0 0 80px rgba(255, 103, 0, 0.40)',
              }}
            >
              UNCOMPROMISING APEX POWER.
            </Box>
          </Typography>

          {/* Subhead Narrative */}
          <Typography
            className="apex-subhead-narrative"
            sx={{
              fontFamily: 'var(--font-body, "Inter", sans-serif)',
              fontSize: { xs: '0.84rem', md: '0.98rem' },
              color: '#D4D4D8',
              letterSpacing: '0.03em',
              maxWidth: '720px',
              lineHeight: 1.6,
              textShadow: '0 2px 14px rgba(0,0,0,0.9)',
            }}
          >
            Re-engineered from crank to winglet. Featuring next-generation CamShift variable valve timing,
            integrated aerodynamic winglets producing +3.5 kg downforce, and Gen 3 WP Semi-Active electronic suspension.
          </Typography>
        </Box>

        {/* 3. HARDWARE-ACCELERATED DOCKED TELEMETRY MARQUEE (PORSCHE STYLE BOTTOM TIER) */}
        <Box
          ref={marqueeBoxRef}
          sx={{
            position: { xs: 'relative', lg: 'absolute' },
            bottom: { lg: 32, xl: 40 },
            left: 0,
            right: 0,
            zIndex: 15,
            width: '100%',
            mt: { xs: 6, lg: 0 },
            overflow: 'hidden',
            willChange: 'transform, opacity',
            maskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            '&:hover .marquee-track': {
              animationPlayState: 'paused',
            },
          }}
        >
          <Box
            className="marquee-track"
            sx={{
              display: 'flex',
              gap: { xs: 2, lg: 2.8 },
              width: 'max-content',
              animation: 'apexMarqueeScroll 50s linear infinite',
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              perspective: 1000,
              py: 1,
              '@keyframes apexMarqueeScroll': {
                '0%': { transform: 'translate3d(0, 0, 0)' },
                '100%': { transform: 'translate3d(-50%, 0, 0)' },
              },
              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none',
              },
            }}
          >
            {/* TRACK SET 1 */}
            {renderHeroCard(HERO_CARDS[0], 'set1')}
            {renderDualStack(STACK_PAIR_1, 'set1')}
            {renderHeroCard(HERO_CARDS[1], 'set1')}
            {renderDualStack(STACK_PAIR_2, 'set1')}
            {renderHeroCard(HERO_CARDS[2], 'set1')}

            {/* TRACK SET 2 (IDENTICAL DUPLICATE FOR SEAMLESS INFINITE LOOP) */}
            {renderHeroCard(HERO_CARDS[0], 'set2')}
            {renderDualStack(STACK_PAIR_1, 'set2')}
            {renderHeroCard(HERO_CARDS[1], 'set2')}
            {renderDualStack(STACK_PAIR_2, 'set2')}
            {renderHeroCard(HERO_CARDS[2], 'set2')}
          </Box>
        </Box>

        {/* 4. MODAL DETAIL PREVIEW LIGHTBOX */}
        <Modal
          open={Boolean(selectedCard)}
          onClose={() => setSelectedCard(null)}
          closeAfterTransition
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(7, 7, 9, 0.88)',
            p: { xs: 2, md: 4 },
          }}
        >
          <Box sx={{ outline: 'none', width: '100%', maxWidth: '850px' }}>
            {selectedCard ? (
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  backgroundColor: '#0F0F16',
                  border: '1px solid #FF6700',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.95), 0 0 60px rgba(255, 103, 0, 0.35)',
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
                }}
              >
                {/* Close Button */}
                <IconButton
                  onClick={() => setSelectedCard(null)}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: '#A1A1AA',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    zIndex: 20,
                    '&:hover': {
                      color: '#FFFFFF',
                      backgroundColor: '#FF6700',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>

                {/* Media side */}
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: '260px', md: '100%' },
                    backgroundColor: selectedCard.isTransparent ? '#070709' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: selectedCard.isTransparent ? 4 : 0,
                  }}
                >
                  <Box
                    component="img"
                    src={selectedCard.image}
                    alt={selectedCard.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: selectedCard.isTransparent ? 'contain' : 'cover',
                      filter: selectedCard.isTransparent
                        ? 'drop-shadow(0 0 30px rgba(255, 103, 0, 0.5))'
                        : 'none',
                    }}
                  />
                </Box>

                {/* Content side */}
                <Box sx={{ p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.4,
                      py: 0.4,
                      borderRadius: '100px',
                      backgroundColor: 'rgba(255, 103, 0, 0.12)',
                      border: '1px solid #FF6700',
                      alignSelf: 'flex-start',
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
                      {selectedCard.tag}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                      fontSize: { xs: '1.8rem', md: '2.4rem' },
                      fontWeight: 900,
                      color: '#FFFFFF',
                      lineHeight: 1.05,
                      textTransform: 'uppercase',
                    }}
                  >
                    {selectedCard.title}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: 'var(--font-body, "Inter", sans-serif)',
                      fontSize: '0.94rem',
                      lineHeight: 1.7,
                      color: '#A1A1AA',
                    }}
                  >
                    {selectedCard.description}
                  </Typography>

                  <Box
                    sx={{
                      mt: 'auto',
                      p: 2,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '0.62rem',
                        color: '#71717A',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        mb: 0.4,
                      }}
                    >
                      TELEMETRY BENCHMARK
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono, monospace)',
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        color: '#FF6700',
                      }}
                    >
                      {selectedCard.metric}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : null}
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default ApexSurge;
