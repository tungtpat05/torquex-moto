import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '../../lib/smoothScroll';

export const KtmHeroAwakening: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  // Audio synthesis state (Subtle mechanical paddock hum via Web Audio API)
  const [isAudioActive, setIsAudioActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance reveal
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        bgRef.current,
        { scale: 1.12, opacity: 0 },
        { scale: 1.0, opacity: 1, duration: 1.8 }
      )
        .fromTo(
          '.hero-badge',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=1.2'
        )
        .fromTo(
          '.hero-headline-line',
          { y: '100%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 1.0, stagger: 0.15 },
          '-=0.8'
        )
        .fromTo(
          hudRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.6'
        )
        .fromTo(
          '.hero-cta-group',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.4'
        );

      // Differential parallax on natural scroll
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.3,
        onUpdate: (self) => {
          const progress = self.progress;
          if (bgRef.current) {
            gsap.set(bgRef.current, {
              yPercent: progress * 15,
              scale: 1.0 + progress * 0.05,
            });
          }
          if (contentRef.current) {
            gsap.set(contentRef.current, {
              yPercent: -progress * 25,
              opacity: 1 - progress * 1.3,
            });
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Web Audio Mechanical Ambience Synth (Low-frequency 42Hz engine idle rumble)
  const togglePaddockAudio = () => {
    if (!isAudioActive) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Sub-bass oscillator (42Hz LC8 V-Twin idle cadence)
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(42, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(110, ctx.currentTime);
        filter.Q.setValueAtTime(3, ctx.currentTime);

        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 1.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        gainNodeRef.current = gain;
        setIsAudioActive(true);
      } catch (err) {
        console.warn('Web Audio initialization error:', err);
      }
    } else {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.5);
        setTimeout(() => {
          audioCtxRef.current?.close();
          audioCtxRef.current = null;
          gainNodeRef.current = null;
          setIsAudioActive(false);
        }, 550);
      } else {
        setIsAudioActive(false);
      }
    }
  };

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
        minHeight: '100svh',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#070709',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: { xs: 2.5, md: 6, lg: 10 },
      }}
    >
      {/* 1. Cinematic Background Layer with Dark Studio Lighting & Paddock Reflections */}
      <Box
        ref={bgRef}
        sx={{
          position: 'absolute',
          inset: '-5%',
          width: '110%',
          height: '110%',
          backgroundImage: `
            radial-gradient(circle at 50% 45%, rgba(255, 103, 0, 0.12) 0%, transparent 60%),
            linear-gradient(to bottom, rgba(7, 7, 9, 0.4) 0%, rgba(7, 7, 9, 0.8) 75%, #070709 100%),
            url('https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=2400&q=90')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center 42%',
          backgroundRepeat: 'no-repeat',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />

      {/* 2. Precision Telemetry Vignette Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(7,7,9,0.7) 0%, rgba(7,7,9,0.1) 40%, rgba(7,7,9,0.6) 80%, #070709 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Grid Guide Overlay (Motorsport Technical Aesthetics) */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* 3. Hero Content Center Node */}
      <Box
        ref={contentRef}
        sx={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1280px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          pt: { xs: 10, md: 8 },
        }}
      >
        {/* Monospace Factory Badge */}
        <Box
          className="hero-badge"
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.2,
            px: 2,
            py: 0.75,
            borderRadius: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            mb: 3,
            backdropFilter: 'blur(8px)',
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#FF6700' }} />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: { xs: '0.68rem', sm: '0.75rem' },
              fontWeight: 600,
              letterSpacing: '0.18em',
              color: '#D4D4D8',
            }}
          >
            FACTORY RACING DIVISION // MATTIGHOFEN, AUSTRIA
          </Typography>
        </Box>

        {/* Primary Display Headline (Masked kinetic unit) */}
        <Box sx={{ overflow: 'hidden', mb: 1 }}>
          <Typography
            className="hero-headline-line"
            component="h1"
            sx={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '4rem', md: '5.2rem', lg: '6.2rem' },
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#F4F4F5',
            }}
          >
            WE DON'T BUILD
          </Typography>
        </Box>
        <Box sx={{ overflow: 'hidden', mb: 3 }}>
          <Typography
            className="hero-headline-line"
            sx={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '4rem', md: '5.2rem', lg: '6.2rem' },
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#FF6700',
              textShadow: '0 0 40px rgba(255, 103, 0, 0.35)',
            }}
          >
            FOR THE TIMID.
          </Typography>
        </Box>

        {/* Machine Identity Lead */}
        <Typography
          sx={{
            fontFamily: 'var(--font-mono)',
            fontSize: { xs: '0.85rem', sm: '1.05rem' },
            letterSpacing: '0.16em',
            color: '#A1A1AA',
            mb: 4,
            fontWeight: 500,
          }}
        >
          KTM 1290 SUPER DUKE R EVO <span style={{ color: '#FF6700' }}>//</span> THE BEAST
        </Typography>

        {/* Telemetry HUD Strip (Porsche Style) */}
        <Box
          ref={hudRef}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 2, sm: 3, md: 5 },
            py: 1.8,
            px: { xs: 2.5, sm: 4 },
            borderRadius: '4px',
            backgroundColor: 'rgba(15, 15, 20, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(16px)',
            mb: 5,
            maxWidth: '920px',
            width: '100%',
          }}
        >
          {[
            { label: 'DISPLACEMENT', val: '1,301', unit: 'CC' },
            { label: 'MAX POWER', val: '180', unit: 'HP' },
            { label: 'MAX TORQUE', val: '140', unit: 'NM' },
            { label: 'DRY WEIGHT', val: '189', unit: 'KG' },
            { label: 'POWER-TO-WEIGHT', val: '0.95', unit: 'HP/KG' },
          ].map((item) => (
            <Box key={item.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.12em',
                  color: '#71717A',
                  mb: 0.2,
                }}
              >
                {item.label}
              </Typography>
              <Typography
                className="tabular-nums"
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: { xs: '1rem', sm: '1.18rem' },
                  fontWeight: 700,
                  color: '#F4F4F5',
                }}
              >
                {item.val} <span style={{ fontSize: '0.72rem', color: '#FF6700' }}>{item.unit}</span>
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Primary Action Buttons */}
        <Box
          className="hero-cta-group"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <Box
            onClick={() => handleScrollToSection('#handover')}
            sx={{
              backgroundColor: '#FF6700',
              color: '#070709',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              px: 4,
              py: 1.6,
              borderRadius: '2px',
              cursor: 'pointer',
              boxShadow: '0 0 32px rgba(255, 103, 0, 0.4)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              userSelect: 'none',
              '&:hover': {
                backgroundColor: '#FFA040',
                transform: 'translateY(-2px)',
                boxShadow: '0 0 45px rgba(255, 103, 0, 0.7)',
              },
            }}
          >
            RESERVE ALLOCATION — 10% DEPOSIT
          </Box>

          <Box
            onClick={() => handleScrollToSection('#anatomy')}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              color: '#F4F4F5',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              fontSize: '0.82rem',
              letterSpacing: '0.12em',
              px: 3.5,
              py: 1.6,
              borderRadius: '2px',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.25s ease',
              userSelect: 'none',
              '&:hover': {
                borderColor: '#FF6700',
                color: '#FF6700',
                backgroundColor: 'rgba(255, 103, 0, 0.05)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            EXPLORE ANATOMY ↓
          </Box>
        </Box>
      </Box>

      {/* 4. Bottom Utilities: Scroll Cue & Paddock Ambience Toggle */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          px: { xs: 3, md: 8 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {/* Subtle Scroll Cue */}
        <Box
          onClick={() => handleScrollToSection('#anatomy')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            opacity: 0.7,
            transition: 'opacity 0.2s ease',
            '&:hover': { opacity: 1 },
          }}
        >
          <ArrowDownwardIcon sx={{ fontSize: '1rem', color: '#FF6700' }} className="animate-pulse-subtle" />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.15em',
              color: '#A1A1AA',
            }}
          >
            SCROLL TO WITNESS THE ANATOMY
          </Typography>
        </Box>

        {/* Paddock Ambience Sound Switch */}
        <Box
          onClick={togglePaddockAudio}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.6,
            borderRadius: '20px',
            backgroundColor: isAudioActive ? 'rgba(255, 103, 0, 0.15)' : 'rgba(255, 255, 255, 0.04)',
            border: isAudioActive ? '1px solid #FF6700' : '1px solid rgba(255, 255, 255, 0.08)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#FF6700',
            },
          }}
        >
          {isAudioActive ? (
            <VolumeUpIcon sx={{ fontSize: '0.9rem', color: '#FF6700' }} />
          ) : (
            <VolumeOffIcon sx={{ fontSize: '0.9rem', color: '#71717A' }} />
          )}
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.1em',
              color: isAudioActive ? '#FF6700' : '#71717A',
            }}
          >
            PADDOCK SOUND [{isAudioActive ? 'ON' : 'OFF'}]
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default KtmHeroAwakening;
