import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '../../lib/smoothScroll';
import awakeningBanner from '@/assets/images/home/awakening-banner.jpg';

import engineImg from '@/assets/images/ktm/anatomy/1390_engine.png';
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
    badge: 'STAGE 01 • CHROMIUM-MOLYBDENUM TRELLIS CHASSIS',
    headline: 'ULTRA-LIGHT CHROMOLY STIFFNESS.',
    subhead:
      'Engine utilized as a stressed member to maximize torsional rigidity (+12%). Laser-cut 25CrMo4 steel tubes hydroformed and powder-coated in Mattighofen racing orange for razor-sharp turn-in feedback.',
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
    badge: 'STAGE 02 • 1,350 CC LC8 V-TWIN CAMSHIFT',
    headline: '190 HP. 145 NM. ZERO COMPROMISE.',
    subhead:
      'Enlarged 1,350cc displacement with all-new CamShift technology. Dual intake cam profiles optimize torque spread below 6,000 RPM while unleashing unhinged top-end acceleration to the 10,500 RPM redline.',
    telemetry: [
      { label: 'DISPLACEMENT', targetValue: 1350, unit: 'CC' },
      { label: 'MAX PEAK POWER', targetValue: 190, unit: 'HP' },
      { label: 'MAX OUTPUT TORQUE', targetValue: 145, unit: 'NM' },
      { label: 'REDLINE LIMIT', targetValue: 10500, unit: 'RPM' },
    ],
    reticleTarget: { x: 52, y: 52, label: 'VARIABLE CAMSHIFT VALVE' },
  },
];

export const KtmHeroAwakening: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const leftBoxRef = useRef<HTMLDivElement>(null);
  const rightBoxRef = useRef<HTMLDivElement>(null);

  // Act II Anatomy Elements inside the unified master pinned stage
  const portalCardRef = useRef<HTMLDivElement>(null);
  const centerHookRef = useRef<HTMLDivElement>(null);
  const splitDissectionRef = useRef<HTMLDivElement>(null);

  const [activeStage, setActiveStage] = useState(0);
  const [stage0Values, setStage0Values] = useState<number[]>([12, 189, 25, 100]);
  const [stage1Values, setStage1Values] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Entrance Animation (On page mount)
      const entranceTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      entranceTl
        .fromTo(
          bgRef.current,
          { scale: 1.08, opacity: 0.8 },
          { scale: 1.0, opacity: 1, duration: 1.6 }
        )
        .fromTo(
          '.hero-ready-line',
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.18 },
          '-=1.0'
        )
        .fromTo(
          '.hero-ready-sub',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          '-=0.4'
        );

      // 2. DESKTOP MASTER PINNED TIMELINE (UNIFIED ACT I & ACT II)
      // 0 -> 18: Beat 1 (Left Box "READY TO RACE" fades out)
      // 15 -> 32: Beat 2 (Right Box "KTM 1390" specs fades in)
      // 32 -> 38: Right Box fades out, HERO BACKGROUND BIKE REMAINS 100% VISIBLE!
      // 38 -> 54: PORSCHE CARD EXPANDS FROM BOTTOM-CENTER EDGE (58% width, 20% height -> 100% full screen)
      //           Colossal kinetic text reveals: "THE BEAST STRIPPED BARE." with laser glow & split entrance
      // 54 -> 62: Hook text dissolves, 2-STAGE DISSECTION ENTERS FROM RIGHT TO LEFT!
      // 62 -> 78: Stage 01 (Khung sườn — Bike as hero, Telemetry counts 0 -> max)
      // 78 -> 86: Crossfade Stage 01 -> Stage 02:
      //           Bike background disappears, Standalone LC8 Engine takes center stage!
      // 86 -> 100: Stage 02 (Động cơ LC8) telemetry counts up 0 -> max & locks at 100% permanently into Act III!
      if (window.innerWidth >= 1024) {
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=800%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            onUpdate: (self) => {
              const progress = self.progress;

              // Intra-stage telemetry counter (active when progress >= 0.50)
              if (progress >= 0.50) {
                if (progress < 0.76) {
                  setActiveStage(0);
                  // Stage 01 (Khung sườn) counts up smoothly from 0.54 to 0.70
                  const ratio0 = Math.min(1, Math.max(0, (progress - 0.54) / 0.16));
                  setStage0Values(
                    ANATOMY_STAGES[0].telemetry.map((t) =>
                      t.isDecimal
                        ? parseFloat((t.targetValue * ratio0).toFixed(t.targetValue < 1 ? 3 : 1))
                        : Math.round(t.targetValue * ratio0)
                    )
                  );
                } else {
                  setActiveStage(1);
                  // Stage 01 stays locked at 100%
                  setStage0Values(ANATOMY_STAGES[0].telemetry.map((t) => t.targetValue));

                  // Stage 02 (Động cơ) COUNTS UP SMOOTHLY from 0.77 to 0.92
                  // Locked at 100% permanently once reaching 0.92 and into Act III!
                  const ratio1 = Math.min(1, Math.max(0, (progress - 0.77) / 0.15));
                  setStage1Values(
                    ANATOMY_STAGES[1].telemetry.map((t) =>
                      t.isDecimal
                        ? parseFloat((t.targetValue * ratio1).toFixed(t.targetValue < 1 ? 3 : 1))
                        : Math.round(t.targetValue * ratio1)
                    )
                  );
                }
              }
            },
          },
        });

        // BEAT 1: Fade out Left Box (0% -> 18%)
        masterTl.to(
          leftBoxRef.current,
          { opacity: 0, x: -60, duration: 18, ease: 'power1.inOut' },
          0
        );

        // Subtle depth scale on bike background across Hero
        masterTl.to(
          bgRef.current,
          { scale: 1.035, duration: 38, ease: 'none' },
          0
        );

        // BEAT 2: Fade in Right Box Specs (15% -> 30%)
        masterTl.fromTo(
          rightBoxRef.current,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 15, ease: 'power2.out' },
          15
        );

        // TRANSITION TO ACT II: Right Box specs fades out (32% -> 38%)
        // HERO BACKGROUND BIKE ON ASPHALT REMAINS 100% VISIBLE! NO BLACK GAP!
        masterTl.to(
          rightBoxRef.current,
          { opacity: 0, y: -40, duration: 6, ease: 'power1.inOut' },
          32
        );

        // PORSCHE ZOOM PORTAL CARD EXPANSION FROM BOTTOM-CENTER EDGE (38% -> 54%)
        // Emerges directly from bottom-center edge (width: 58%, height: 20%, top rounded corners)
        masterTl.fromTo(
          portalCardRef.current,
          {
            opacity: 0,
            width: '58%',
            height: '20%',
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderColor: 'rgba(255, 103, 0, 0.55)',
            boxShadow: '0 -20px 80px rgba(0, 0, 0, 0.95), 0 0 60px rgba(255, 103, 0, 0.35)',
            pointerEvents: 'none',
          },
          {
            opacity: 1,
            width: '100%',
            height: '100%',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderColor: 'rgba(255, 255, 255, 0.04)',
            boxShadow: 'none',
            pointerEvents: 'auto',
            duration: 16,
            ease: 'power2.out',
          },
          38
        );

        // KINETIC MASKED TEXT REVEAL (Colossal Scale, Two-Line Split Entrance, Laser Glow) (38% -> 49%)
        masterTl.fromTo(
          '.kinetic-hook-glow',
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1.15, duration: 9, ease: 'power2.out' },
          38
        );

        masterTl.fromTo(
          '.kinetic-hook-badge',
          { y: 35, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 8, ease: 'power2.out' },
          38
        );

        masterTl.fromTo(
          '.kinetic-hook-title-1',
          { yPercent: 120, opacity: 0, filter: 'blur(16px)', letterSpacing: '-0.06em' },
          { yPercent: 0, opacity: 1, filter: 'blur(0px)', letterSpacing: '-0.03em', duration: 10, ease: 'power4.out' },
          39
        );

        masterTl.fromTo(
          '.kinetic-hook-title-2',
          { yPercent: 120, opacity: 0, filter: 'blur(16px)', letterSpacing: '-0.06em' },
          { yPercent: 0, opacity: 1, filter: 'blur(0px)', letterSpacing: '-0.03em', duration: 10, ease: 'power4.out' },
          40.5
        );

        masterTl.fromTo(
          '.kinetic-hook-sub',
          { y: 30, opacity: 0, letterSpacing: '0.08em' },
          { y: 0, opacity: 1, letterSpacing: '0.28em', duration: 8, ease: 'power2.out' },
          42
        );

        // Readable hold: keeps title in crisp focus, then dissolves out (49% -> 54%)
        masterTl.to(
          centerHookRef.current,
          { opacity: 0, scale: 1.05, filter: 'blur(12px)', duration: 5, ease: 'power2.inOut' },
          49
        );

        // PORSCHE EFFECT: DISSECTION CONTENT SLIDES IN FROM RIGHT TO LEFT! (54% -> 62%)
        masterTl.fromTo(
          splitDissectionRef.current,
          { x: 140, opacity: 0, filter: 'blur(10px)' },
          { x: 0, opacity: 1, filter: 'blur(0px)', duration: 8, ease: 'power3.out' },
          54
        );

        // Initial timeline state anchors at time 0
        masterTl.set('.dissection-bike-base', { opacity: 0.95, scale: 1, filter: 'blur(0px)' }, 0);
        masterTl.set(['.dissection-engine-standalone', '.dissection-engine-glow'], { opacity: 0, visibility: 'hidden', scale: 0.9 }, 0);
        masterTl.set('.kinetic-panel-0', { opacity: 1, y: 0, filter: 'blur(0px)' }, 0);
        masterTl.set('.kinetic-panel-1', { opacity: 0, y: 35, filter: 'blur(10px)' }, 0);

        // CROSSFADE STAGE 01 (Khung sườn) -> STAGE 02 (Động cơ LC8) at 78% -> 86%
        // Yêu cầu: "phần 1 khung sườn giữ nguyên như cũ, xóa cái động cơ đi, còn ở phần 2 động cơ thì zoom to ảnh động cơ lên"
        masterTl
          // 1. Hide bike background completely
          .to(
            '.dissection-bike-base',
            { opacity: 0, scale: 0.94, filter: 'blur(8px)', duration: 8, ease: 'power2.inOut' },
            78
          )
          // 2. Hide Stage 01 text
          .to(
            '.kinetic-panel-0',
            { opacity: 0, y: -30, filter: 'blur(8px)', duration: 8, ease: 'power2.inOut' },
            78
          )
          // 3. Bring in standalone raw LC8 Engine as hero & ZOOM TO IMPACT (scale 0.9 -> 1.35)
          .fromTo(
            '.dissection-engine-standalone',
            { opacity: 0, visibility: 'visible', scale: 0.9, filter: 'blur(10px)' },
            { opacity: 1, visibility: 'visible', scale: 1.35, filter: 'blur(0px)', duration: 8, ease: 'power2.out' },
            79
          )
          .fromTo(
            '.dissection-engine-glow',
            { opacity: 0, visibility: 'visible', scale: 0.75 },
            { opacity: 1, visibility: 'visible', scale: 1.25, duration: 8, ease: 'power2.out' },
            79
          )
          // 4. Bring in Stage 02 text (LC8 Camshift 190 HP)
          .fromTo(
            '.kinetic-panel-1',
            { opacity: 0, y: 35, filter: 'blur(10px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 8, ease: 'power2.inOut' },
            79
          );

        // 5. Hold Stage 02 visible through to end of pinned scroll (87% -> 100%)
        masterTl.to({}, { duration: 13 }, 87);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const targetElement = document.querySelector(sectionId);
    if (targetElement) {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(targetElement as HTMLElement, { offset: -72, duration: 1.2 });
      } else {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <Box
      ref={containerRef}
      component="section"
      id="hero"
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: '#070709',
      }}
    >
      {/* 1. HERO AWAKENING MOTORCYCLE BACKGROUND (Crisp, High-Resolution Base) */}
      <Box
        ref={bgRef}
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url('${awakeningBanner}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 42%',
          backgroundRepeat: 'no-repeat',
          willChange: 'transform',
        }}
      />

      {/* 2. Soft Edge Gradients for Hero contrast */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(90deg, rgba(7, 7, 9, 0.65) 0%, rgba(7, 7, 9, 0.28) 28%, transparent 52%),
            linear-gradient(to bottom, rgba(7, 7, 9, 0.45) 0%, transparent 20%),
            linear-gradient(to top, rgba(7, 7, 9, 0.75) 0%, transparent 25%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* 3. HERO BEAT 1: LEFT BOX ("READY TO RACE") */}
      <Box
        ref={leftBoxRef}
        sx={{
          position: 'absolute',
          top: { xs: '20%', md: '26%', lg: '28%' },
          left: { xs: 20, sm: 40, md: 60, lg: 90 },
          maxWidth: { xs: '340px', sm: '460px', md: '580px', lg: '680px' },
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          pointerEvents: 'none',
          pr: 2,
        }}
      >
        <Box
          className="hero-ready-sub"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.2,
            px: 2,
            py: 0.75,
            borderRadius: '3px',
            backgroundColor: 'rgba(7, 7, 9, 0.82)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            mb: 2.5,
            whiteSpace: 'nowrap',
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#FF6700' }} />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: { xs: '0.65rem', sm: '0.72rem' },
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: '#F4F4F5',
            }}
          >
            MATTIGHOFEN RACING DOCTRINE
          </Typography>
        </Box>

        <Box sx={{ overflow: 'visible', width: '100%' }}>
          <Typography
            className="hero-ready-line"
            component="h1"
            sx={{
              fontFamily: 'var(--font-display, "Outfit", sans-serif)',
              fontWeight: 900,
              fontSize: { xs: '3.6rem', sm: '4.8rem', md: '5.8rem', lg: '7.0rem' },
              lineHeight: 0.94,
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              textShadow: '0 4px 16px rgba(0, 0, 0, 0.95), 0 12px 36px rgba(0, 0, 0, 0.9)',
              pb: { xs: 0.5, md: 1 },
            }}
          >
            READY
          </Typography>
        </Box>

        <Box sx={{ overflow: 'visible', width: '100%' }}>
          <Typography
            className="hero-ready-line"
            sx={{
              fontFamily: 'var(--font-display, "Outfit", sans-serif)',
              fontWeight: 900,
              fontSize: { xs: '3.6rem', sm: '4.8rem', md: '5.8rem', lg: '7.0rem' },
              lineHeight: 0.94,
              letterSpacing: '-0.035em',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              textShadow: '0 4px 16px rgba(0, 0, 0, 0.95), 0 12px 36px rgba(0, 0, 0, 0.9)',
              pb: { xs: 0.5, md: 1 },
            }}
          >
            TO
          </Typography>
        </Box>

        <Box sx={{ overflow: 'visible', width: '100%' }}>
          <Typography
            className="hero-ready-line"
            sx={{
              fontFamily: 'var(--font-display, "Outfit", sans-serif)',
              fontWeight: 900,
              fontSize: { xs: '3.6rem', sm: '4.8rem', md: '5.8rem', lg: '7.0rem' },
              lineHeight: 0.94,
              letterSpacing: '-0.035em',
              color: '#FF6700',
              textTransform: 'uppercase',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.95), 0 12px 36px rgba(255, 103, 0, 0.5)',
              pb: { xs: 0.5, md: 1 },
            }}
          >
            RACE.
          </Typography>
        </Box>
      </Box>

      {/* 4. HERO BEAT 2: RIGHT BOX ("KTM 1390 SUPER DUKE R" + SPECS & CTAs) */}
      <Box
        ref={rightBoxRef}
        sx={{
          position: 'absolute',
          top: { xs: '18%', md: '22%', lg: '24%' },
          right: { xs: 20, sm: 40, md: 70, lg: 100 },
          maxWidth: { xs: '340px', sm: '420px', md: '480px' },
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          opacity: 0,
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.2,
            px: 1.8,
            py: 0.65,
            borderRadius: '3px',
            backgroundColor: 'rgba(12, 12, 18, 0.88)',
            border: '1px solid #FF6700',
            boxShadow: '0 0 16px rgba(255, 103, 0, 0.28)',
            backdropFilter: 'blur(16px)',
            mb: 1.8,
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#FF6700', boxShadow: '0 0 8px #FF6700' }} />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: { xs: '0.65rem', sm: '0.72rem' },
              fontWeight: 800,
              letterSpacing: '0.16em',
              color: '#FF6700',
            }}
          >
            FLAGSHIP RACING HYPERNAKED
          </Typography>
        </Box>

        <Typography
          component="h2"
          sx={{
            fontFamily: 'var(--font-display, "Outfit", sans-serif)',
            fontWeight: 900,
            fontSize: { xs: '2.2rem', sm: '3rem', md: '3.6rem' },
            lineHeight: 0.98,
            letterSpacing: '-0.035em',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            textShadow: '0 4px 20px rgba(0,0,0,0.95), 0 12px 32px rgba(0,0,0,0.85)',
            mb: 0.5,
          }}
        >
          KTM 1390
        </Typography>

        <Typography
          sx={{
            fontFamily: 'var(--font-display, "Outfit", sans-serif)',
            fontWeight: 900,
            fontSize: { xs: '1.8rem', sm: '2.4rem', md: '2.8rem' },
            lineHeight: 0.98,
            letterSpacing: '-0.03em',
            color: '#FF6700',
            textTransform: 'uppercase',
            textShadow: '0 4px 20px rgba(0,0,0,0.95), 0 10px 30px rgba(255,103,0,0.4)',
            mb: 1.5,
          }}
        >
          SUPER DUKE R EVO
        </Typography>

        <Typography
          sx={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            letterSpacing: '0.14em',
            color: '#E4E4E7',
            mb: 3,
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}
        >
          THE BEAST EVOLVED • 1:1 POWER-TO-WEIGHT
        </Typography>

        {/* Specifications Matrix Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 2,
            width: '100%',
            p: 2.8,
            borderRadius: '4px',
            backgroundColor: 'rgba(12, 12, 18, 0.82)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderTop: '1px solid rgba(255, 255, 255, 0.40)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.18)',
            mb: 3,
          }}
        >
          {[
            { label: 'DISPLACEMENT', val: '1,350', unit: 'CC' },
            { label: 'MAX POWER', val: '190', unit: 'HP' },
            { label: 'MAX TORQUE', val: '145', unit: 'NM' },
            { label: '0-100 KM/H', val: '3.0', unit: 'SEC' },
          ].map((item) => (
            <Box key={item.label} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: '#D4D4D8',
                  mb: 0.3,
                }}
              >
                {item.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: { xs: '1.25rem', sm: '1.45rem' },
                  fontWeight: 800,
                  color: '#FFFFFF',
                  textShadow: '0 2px 10px rgba(0,0,0,0.7)',
                }}
              >
                {item.val} <span style={{ fontSize: '0.78rem', color: '#FF6700', fontWeight: 800 }}>{item.unit}</span>
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Action CTAs */}
        <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
          <Box
            onClick={() => handleScrollToSection('#handover')}
            sx={{
              backgroundColor: '#FF6700',
              color: '#070709',
              fontFamily: 'var(--font-display, "Outfit", sans-serif)',
              fontWeight: 900,
              fontSize: '0.82rem',
              letterSpacing: '0.08em',
              py: 1.5,
              px: 3,
              borderRadius: '2px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 30px rgba(255, 103, 0, 0.5)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              userSelect: 'none',
              flexGrow: 1,
              '&:hover': {
                backgroundColor: '#FFA040',
                boxShadow: '0 0 42px rgba(255, 103, 0, 0.8)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            RESERVE 1390 BEAST
          </Box>
        </Box>
      </Box>

      {/* ========================================================================= */}
      {/* 5. ACT II: PORSCHE-STYLE VIEWPORT ZOOM EXPANSION CARD (ZERO BLACK GAP)     */}
      {/* Starts from bottom-center edge and expands over Hero background            */}
      {/* ========================================================================= */}
      <Box
        id="anatomy"
        ref={portalCardRef}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: { xs: '100%', lg: '58%' },
          height: { xs: '100%', lg: '20%' },
          backgroundColor: '#0c0c12',
          overflow: 'hidden',
          zIndex: 25,
          opacity: { xs: 1, lg: 0 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderTopLeftRadius: { xs: 0, lg: '32px' },
          borderTopRightRadius: { xs: 0, lg: '32px' },
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          willChange: 'width, height, border-radius, box-shadow, opacity',
        }}
      >
        {/* Subtle CAD Blueprint Grid Texture inside the card */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.04,
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        {/* Ambient Orange Tech Glow */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 35% 50%, rgba(255, 103, 0, 0.12) 0%, rgba(7, 7, 9, 0) 65%), radial-gradient(circle at 75% 65%, rgba(255, 103, 0, 0.05) 0%, rgba(7, 7, 9, 0) 55%)',
            pointerEvents: 'none',
          }}
        />

        {/* A. KINETIC MASKED OPENING HOOK TEXT */}
        <Box
          ref={centerHookRef}
          sx={{
            position: 'absolute',
            inset: 0,
            display: { xs: 'none', lg: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2.2,
            zIndex: 30,
            px: 4,
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          {/* Laser Glow Aura behind Title - Wide Seamless Atmospheric Halo */}
          <Box
            className="kinetic-hook-glow"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90vw', md: '1200px', xl: '1500px' },
              height: { xs: '220px', md: '340px', xl: '420px' },
              background:
                'radial-gradient(ellipse 75% 55% at center, rgba(255, 103, 0, 0.42) 0%, rgba(255, 103, 0, 0.16) 42%, rgba(255, 103, 0, 0.02) 68%, transparent 82%)',
              filter: 'blur(65px)',
              pointerEvents: 'none',
              zIndex: -1,
            }}
          />

          <Box
            className="kinetic-hook-badge"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.2,
              px: 2.2,
              py: 0.7,
              borderRadius: '2px',
              backgroundColor: 'rgba(255, 103, 0, 0.12)',
              border: '1px solid #FF6700',
              boxShadow: '0 0 24px rgba(255, 103, 0, 0.35)',
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
                fontSize: { xs: '0.68rem', md: '0.76rem' },
                fontWeight: 800,
                color: '#FF6700',
                letterSpacing: '0.18em',
              }}
            >
              CORE ARCHITECTURE • 1,350 CC BEAST
            </Typography>
          </Box>

          {/* Colossal Kinetic Title with Seamless Technical Border Gradients (No Hard Edges) */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 1.5,
              px: { xs: 2, md: 6 },
              width: '100%',
            }}
          >
            {/* Top Technical Border Gradient (Seamless falloff at left & right) */}
            <Box
              sx={{
                width: '100%',
                maxWidth: { xs: '380px', sm: '600px', md: '880px', lg: '1100px' },
                height: '1px',
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255, 103, 0, 0.25) 20%, rgba(255, 103, 0, 0.85) 50%, rgba(255, 103, 0, 0.25) 80%, transparent 100%)',
                boxShadow: '0 0 12px rgba(255, 103, 0, 0.4)',
                mb: 1.5,
              }}
            />

            {/* Line 1: THE BEAST with individual kinetic overflow mask */}
            <Box sx={{ overflow: 'hidden', width: '100%', display: 'flex', justifyContent: 'center', py: 0.5, px: 2 }}>
              <Typography
                className="kinetic-hook-title-1"
                sx={{
                  fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                  fontSize: { xs: '3.2rem', sm: '4.8rem', md: '6.4rem', lg: '8.0rem', xl: '9.4rem' },
                  fontWeight: 950,
                  color: '#FFFFFF',
                  lineHeight: 0.94,
                  letterSpacing: '-0.035em',
                  textTransform: 'uppercase',
                  textShadow: '0 4px 30px rgba(0,0,0,0.95), 0 0 40px rgba(255, 255, 255, 0.25)',
                }}
              >
                THE BEAST
              </Typography>
            </Box>

            {/* Line 2: CHASSIS & ENGINE with individual kinetic overflow mask & soft glow */}
            <Box sx={{ overflow: 'hidden', width: '100%', display: 'flex', justifyContent: 'center', py: 0.5, px: 2 }}>
              <Typography
                className="kinetic-hook-title-2"
                sx={{
                  fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                  fontSize: { xs: '3.2rem', sm: '4.8rem', md: '6.4rem', lg: '8.0rem', xl: '9.4rem' },
                  fontWeight: 950,
                  color: '#FF6700',
                  lineHeight: 0.94,
                  letterSpacing: '-0.035em',
                  textTransform: 'uppercase',
                  textShadow:
                    '0 4px 40px rgba(0,0,0,0.95), 0 0 35px rgba(255, 103, 0, 0.7), 0 0 60px rgba(255, 103, 0, 0.25)',
                }}
              >
                CHASSIS & ENGINE
              </Typography>
            </Box>

            {/* Bottom Technical Border Gradient (Seamless falloff at left & right) */}
            <Box
              sx={{
                width: '100%',
                maxWidth: { xs: '380px', sm: '600px', md: '880px', lg: '1100px' },
                height: '1px',
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255, 103, 0, 0.25) 20%, rgba(255, 103, 0, 0.85) 50%, rgba(255, 103, 0, 0.25) 80%, transparent 100%)',
                boxShadow: '0 0 12px rgba(255, 103, 0, 0.4)',
                mt: 1.5,
              }}
            />
          </Box>

          {/* Expanding Tracking Subhead */}
          <Typography
            className="kinetic-hook-sub"
            sx={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: { xs: '0.75rem', md: '0.88rem' },
              color: '#A1A1AA',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              mt: 1,
            }}
          >
            CHROMIUM-MOLYBDENUM TRELLIS BACKBONE • 190 HP LC8 V-TWIN HEART
          </Typography>
        </Box>

        {/* B. MAIN SPLIT DISSECTION STAGE (ENTERS FROM RIGHT TO LEFT!) */}
        {/* SWAPPED LAYOUT: LEFT = MOTORCYCLE/ENGINE, RIGHT = INFORMATION */}
        <Box
          ref={splitDissectionRef}
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '1920px',
            mx: 'auto',
            px: { xs: 3, md: 5, xl: 8 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 480px', xl: '1fr 520px' },
            gap: { xs: 5, lg: 4, xl: 8 },
            alignItems: 'center',
            minHeight: { xs: 'auto', lg: '740px', xl: '820px' },
            zIndex: 20,
            opacity: { xs: 1, lg: 0 },
            willChange: 'transform, opacity, filter',
          }}
        >
          {/* COLUMN 1 (LEFT): MOTORCYCLE & ENGINE HERO STAGE */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: { xs: '380px', sm: '500px', md: '620px', lg: '720px', xl: '800px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maskImage: 'linear-gradient(to right, transparent 0%, black 28px, black 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 28px, black 100%)',
            }}
          >
            {/* STAGE 01: Full Motorcycle is the main hero (No extra frame overlay) */}
            <Box
              component="img"
              src={bikeBaseImg}
              alt="KTM 1390 Super Duke R Technical Chassis"
              className="dissection-bike-base"
              sx={{
                position: 'absolute',
                width: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                opacity: 0.95,
                filter: 'drop-shadow(0 0 35px rgba(255, 103, 0, 0.28)) drop-shadow(0 20px 50px rgba(0,0,0,0.9))',
                userSelect: 'none',
                pointerEvents: 'none',
                willChange: 'transform, opacity, filter',
              }}
            />

            {/* STAGE 02: Standalone Raw LC8 CamShift Engine (Hidden during Stage 01, Zooms in Stage 02) */}
            <Box
              className="dissection-engine-glow"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '340px', sm: '480px', md: '620px', lg: '780px', xl: '880px' },
                height: { xs: '340px', sm: '480px', md: '620px', lg: '780px', xl: '880px' },
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255, 103, 0, 0.32) 0%, rgba(255, 103, 0, 0.08) 45%, transparent 72%)',
                filter: 'blur(65px)',
                pointerEvents: 'none',
                zIndex: 21,
                opacity: 0,
                visibility: 'hidden',
                willChange: 'transform, opacity',
              }}
            />

            <Box
              component="img"
              src={engineImg}
              alt="KTM 1390 LC8 V-Twin CamShift Engine"
              className="dissection-engine-standalone"
              sx={{
                position: 'absolute',
                width: { xs: '92%', sm: '88%', md: '84%', lg: '100%', xl: '108%' },
                maxWidth: { xs: '520px', sm: '650px', md: '780px', lg: '920px', xl: '1050px' },
                maxHeight: { xs: '92%', lg: '96%', xl: '100%' },
                objectFit: 'contain',
                filter:
                  'drop-shadow(0 0 55px rgba(255, 103, 0, 0.65)) drop-shadow(0 30px 70px rgba(0, 0, 0, 0.98))',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 22,
                opacity: 0,
                visibility: 'hidden',
                willChange: 'transform, opacity, filter',
              }}
            />
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
              const currentVals = idx === 0 ? stage0Values : stage1Values;

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
                  {/* Headline */}
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
                      const displayVal =
                        currentVals[mIdx] !== undefined ? currentVals[mIdx] : item.targetValue;
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
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default KtmHeroAwakening;
