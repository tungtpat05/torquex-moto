import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { gsap } from 'gsap';
import { getLenis } from '../../lib/smoothScroll';
import awakeningBanner from '@/assets/images/home/awakening-banner.jpg';

export const KtmHeroAwakening: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const leftBoxRef = useRef<HTMLDivElement>(null);
  const rightBoxRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  // Audio synthesis state (Subtle mechanical paddock hum via Web Audio API)
  const [isAudioActive, setIsAudioActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

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

      // 2. Desktop Pinned Scroll Choreography (2-Beat Scout Motors-style Storytelling)
      // When scrolling:
      // - Background bike stays pinned in place with subtle scale depth (1.0 -> 1.04).
      // - Left box ("READY TO RACE") smoothly fades and translates out (opacity 1 -> 0, x: 0 -> -60px).
      // - Right box (KTM 1390 SUPER DUKE R + Specs) smoothly rises from below (opacity 0 -> 1, y: 60px -> 0).
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
        },
      });

      // Beat 1: Fade out Left Box as user scrolls (0% -> 45%)
      scrollTl.to(
        leftBoxRef.current,
        {
          opacity: 0,
          x: -60,
          duration: 35,
          ease: 'power1.inOut',
        },
        0
      );

      // Subtle depth scale on bike background
      scrollTl.to(
        bgRef.current,
        {
          scale: 1.035,
          duration: 100,
          ease: 'none',
        },
        0
      );

      // Fade out scroll cue early
      scrollTl.to(
        scrollCueRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 20,
          ease: 'power1.out',
        },
        0
      );

      // Beat 2: Fade in Right Box as scroll progresses (35% -> 85%)
      scrollTl.fromTo(
        rightBoxRef.current,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 45,
          ease: 'power2.out',
        },
        35
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Web Audio Mechanical Ambience Synth (Low-frequency 42Hz engine idle rumble)
  const togglePaddockAudio = () => {
    if (!isAudioActive) {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
        gainNodeRef.current.gain.exponentialRampToValueAtTime(
          0.0001,
          audioCtxRef.current.currentTime + 0.5
        );
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
        height: '100vh',
        minHeight: '100vh',
        overflow: 'hidden',
        backgroundColor: '#070709',
      }}
    >
      {/* 1. High-Resolution Motorcycle Visual (Clear & Crisp, No Muddy Black Cover) */}
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

      {/* 2. Soft Edge Gradients (Left vignette for text contrast, top for navbar, bottom for section blend) */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(90deg, rgba(7, 7, 9, 0.65) 0%, rgba(7, 7, 9, 0.28) 28%, transparent 52%),
            linear-gradient(to bottom, rgba(7, 7, 9, 0.45) 0%, transparent 20%),
            linear-gradient(to top, rgba(7, 7, 9, 0.95) 0%, rgba(7, 7, 9, 0.4) 10%, transparent 25%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* 3. BEAT 1: LEFT BOX ("READY TO RACE") */}
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
              fontFamily: 'var(--font-mono)',
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
              fontFamily: 'var(--font-display)',
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
              fontFamily: 'var(--font-display)',
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
              fontFamily: 'var(--font-display)',
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

      {/* 4. BEAT 2: RIGHT BOX ("KTM 1390 SUPER DUKE R" + SPECS & CTAs) */}
      <Box
        ref={rightBoxRef}
        sx={{
          position: 'absolute',
          top: { xs: '18%', md: '22%', lg: '24%' },
          right: { xs: 20, sm: 40, md: 70, lg: 100 },
          maxWidth: { xs: '340px', sm: '420px', md: '480px' },
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          opacity: 0, // Driven by GSAP scrollTrigger
        }}
      >
        {/* Flagship Badge */}
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
              fontFamily: 'var(--font-mono)',
              fontSize: { xs: '0.65rem', sm: '0.72rem' },
              fontWeight: 800,
              letterSpacing: '0.16em',
              color: '#FF6700',
            }}
          >
            FLAGSHIP RACING HYPERNAKED
          </Typography>
        </Box>

        {/* Model Headline: KTM 1390 SUPER DUKE R */}
        <Typography
          component="h2"
          sx={{
            fontFamily: 'var(--font-display)',
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
            fontFamily: 'var(--font-display)',
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
            fontFamily: 'var(--font-mono)',
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            letterSpacing: '0.14em',
            color: '#E4E4E7',
            mb: 3,
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}
        >
          THE BEAST EVOLVED <span style={{ color: '#FF6700' }}>//</span> 1:1 POWER-TO-WEIGHT
        </Typography>

        {/* Specifications Matrix Grid (High-Luminance Rim-Lit Crystal Card) */}
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
            borderTop: '1px solid rgba(255, 255, 255, 0.40)', // Daylight rim-light edge
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
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: '#D4D4D8', // High-contrast Cool Silver instead of dark muddy grey
                  mb: 0.3,
                }}
              >
                {item.label}
              </Typography>
              <Typography
                className="tabular-nums"
                sx={{
                  fontFamily: 'var(--font-mono)',
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1.5,
            width: '100%',
          }}
        >
          <Box
            onClick={() => handleScrollToSection('#handover')}
            sx={{
              backgroundColor: '#FF6700',
              color: '#070709',
              fontFamily: 'var(--font-display)',
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

          <Box
            onClick={() => handleScrollToSection('#anatomy')}
            sx={{
              backgroundColor: 'rgba(12, 12, 18, 0.85)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              py: 1.5,
              px: 2.8,
              borderRadius: '2px',
              textAlign: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s ease',
              userSelect: 'none',
              '&:hover': {
                borderColor: '#FF6700',
                color: '#FF6700',
                backgroundColor: 'rgba(255, 103, 0, 0.08)',
              },
            }}
          >
            EXPLORE ↓
          </Box>
        </Box>
      </Box>

      {/* 5. BOTTOM UTILITIES: Scroll Cue & Paddock Ambience Switch */}
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
          zIndex: 15,
        }}
      >
        {/* Subtle Scroll Cue */}
        <Box
          ref={scrollCueRef}
          onClick={() => handleScrollToSection('#anatomy')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            opacity: 0.85,
            transition: 'opacity 0.2s ease',
            backgroundColor: 'rgba(7, 7, 9, 0.5)',
            px: 1.5,
            py: 0.5,
            borderRadius: '20px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            '&:hover': { opacity: 1 },
          }}
        >
          <ArrowDownwardIcon sx={{ fontSize: '0.9rem', color: '#FF6700' }} />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.14em',
              color: '#D4D4D8',
            }}
          >
            SCROLL TO UNVEIL THE 1390 BEAST
          </Typography>
        </Box>

        {/* Paddock Ambience Sound Switch */}
        <Box
          onClick={togglePaddockAudio}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 1.6,
            py: 0.6,
            borderRadius: '20px',
            backgroundColor: isAudioActive ? 'rgba(255, 103, 0, 0.2)' : 'rgba(7, 7, 9, 0.65)',
            border: isAudioActive ? '1px solid #FF6700' : '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(8px)',
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
            <VolumeOffIcon sx={{ fontSize: '0.9rem', color: '#A1A1AA' }} />
          )}
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.1em',
              color: isAudioActive ? '#FF6700' : '#A1A1AA',
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
