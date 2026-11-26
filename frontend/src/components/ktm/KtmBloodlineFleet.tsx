import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Box, ButtonBase, Snackbar, Typography } from '@mui/material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenis } from '../../lib/smoothScroll';

import sdr1390RightImg from '@/assets/images/ktm/models/1390_sdr_90_right.png';
import duke990Img from '@/assets/images/ktm/models/990_duke_90_right.png';
import duke390Img from '@/assets/images/ktm/models/390_duke_90_right.png';
import rc8cImg from '@/assets/images/ktm/models/rc_8c_studio.png';
import adv1290Img from '@/assets/images/ktm/models/1290_adv_90_right.png';
import smc690Img from '@/assets/images/ktm/models/690_smc_90_right.png';

gsap.registerPlugin(ScrollTrigger);

export interface KtmVehicle {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  category: 'NAKED' | 'SUPERSPORT' | 'TRAVEL & SMC';
  msrpUsd: number;
  msrpVnd: string;
  powerHp: number;
  torqueNm: number;
  displacementCc: number;
  dryWeightKg: number;
  image: string;
  badge?: string;
  isTransparent?: boolean;
}

const KTM_FLEET: KtmVehicle[] = [
  {
    id: 53,
    slug: '1390-super-duke-r-evo',
    name: 'KTM 1390 Super Duke R Evo',
    tagline: 'THE BEAST // APEX PREDATOR',
    category: 'NAKED',
    msrpUsd: 21499,
    msrpVnd: '~546,000,000 VND',
    powerHp: 190,
    torqueNm: 145,
    displacementCc: 1350,
    dryWeightKg: 189,
    image: sdr1390RightImg,
    badge: 'CENTERPIECE FLAGSHIP',
    isTransparent: true,
  },
  {
    id: 54,
    slug: '890-duke-r',
    name: 'KTM 990 Duke',
    tagline: 'THE SCALPEL // LASER PRECISION',
    category: 'NAKED',
    msrpUsd: 12500,
    msrpVnd: '~317,000,000 VND',
    powerHp: 123,
    torqueNm: 103,
    displacementCc: 947,
    dryWeightKg: 179,
    image: duke990Img,
    isTransparent: true,
  },
  {
    id: 56,
    slug: '390-duke',
    name: 'KTM 390 Duke',
    tagline: 'THE CORNER ROCKET // URBAN WEAPON',
    category: 'NAKED',
    msrpUsd: 5899,
    msrpVnd: '~149,000,000 VND',
    powerHp: 45,
    torqueNm: 39,
    displacementCc: 399,
    dryWeightKg: 165,
    image: duke390Img,
    isTransparent: true,
  },
  {
    id: 49,
    slug: 'rc-8c',
    name: 'KTM RC 8C',
    tagline: 'MOTO2 PROTOTYPE DNA // TRACK-ONLY',
    category: 'SUPERSPORT',
    msrpUsd: 41499,
    msrpVnd: '~1,050,000,000 VND',
    powerHp: 135,
    torqueNm: 98,
    displacementCc: 889,
    dryWeightKg: 142,
    image: rc8cImg,
    badge: 'LIMITED 100 UNITS',
    isTransparent: true,
  },
  {
    id: 57,
    slug: '1290-super-adv',
    name: 'KTM 1290 Super Adventure R',
    tagline: 'THE TRANSCONTINENTAL WEAPON',
    category: 'TRAVEL & SMC',
    msrpUsd: 20299,
    msrpVnd: '~515,000,000 VND',
    powerHp: 160,
    torqueNm: 138,
    displacementCc: 1301,
    dryWeightKg: 221,
    image: adv1290Img,
    isTransparent: true,
  },
  {
    id: 61,
    slug: '500-exc-f',
    name: 'KTM 690 SMC R',
    tagline: 'THE SUPERMOTO KING // PURE AGILITY',
    category: 'TRAVEL & SMC',
    msrpUsd: 12499,
    msrpVnd: '~317,000,000 VND',
    powerHp: 74,
    torqueNm: 73.5,
    displacementCc: 693,
    dryWeightKg: 147,
    image: smc690Img,
    isTransparent: true,
  },
];

type FilterCategory = 'ALL' | 'NAKED' | 'SUPERSPORT' | 'TRAVEL & SMC';

const CATEGORY_TABS: { key: FilterCategory; label: string }[] = [
  { key: 'ALL', label: 'ALL MODELS' },
  { key: 'NAKED', label: 'NAKED' },
  { key: 'SUPERSPORT', label: 'SUPERSPORT' },
  { key: 'TRAVEL & SMC', label: 'TRAVEL & SMC' },
];

interface AnimatedSpecValueProps {
  value: number;
  prefix?: string;
  decimals?: number;
}

const AnimatedOdometerValue: React.FC<AnimatedSpecValueProps> = ({
  value,
  prefix = '',
  decimals = 0,
}) => {
  const [display, setDisplay] = useState<number>(value);
  const elRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const node = elRef.current;
    if (prefersReducedMotion || !node || typeof IntersectionObserver === 'undefined') {
      return;
    }

    let tween: gsap.core.Tween | null = null;
    const tweenObj = { val: 0 };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          tween = gsap.to(tweenObj, {
            val: value,
            duration: 0.65,
            ease: 'power2.out',
            onUpdate: () => {
              setDisplay(
                decimals > 0 ? parseFloat(tweenObj.val.toFixed(decimals)) : Math.round(tweenObj.val)
              );
            },
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [value, decimals]);

  return (
    <span ref={elRef}>
      {prefix}
      {display.toLocaleString()}
    </span>
  );
};

export const KtmBloodlineFleet: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const [previewNotice, setPreviewNotice] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackViewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<FilterCategory, number> = {
      ALL: KTM_FLEET.length,
      NAKED: 0,
      SUPERSPORT: 0,
      'TRAVEL & SMC': 0,
    };
    KTM_FLEET.forEach((bike) => {
      counts[bike.category] += 1;
    });
    return counts;
  }, []);

  const filteredVehicles = useMemo(
    () =>
      activeFilter === 'ALL'
        ? KTM_FLEET
        : KTM_FLEET.filter((v) => v.category === activeFilter),
    [activeFilter]
  );

  // Kinetic Text Entrance for Top Header (Clip-Slice + Glow Ignition + Tracking Lock-In)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      });

      headerTl
        .fromTo(
          '.fleet-eyebrow-rule',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.55, ease: 'power3.out' },
          0
        )
        .fromTo(
          '.fleet-eyebrow-text',
          { opacity: 0, letterSpacing: '0.32em' },
          { opacity: 1, letterSpacing: '0.16em', duration: 0.7, ease: 'power3.out' },
          0.05
        )
        .fromTo(
          '.fleet-title-line-1',
          { yPercent: 108, skewY: 2.2 },
          { yPercent: 0, skewY: 0, duration: 0.85, ease: 'power4.out' },
          0.08
        )
        .fromTo(
          '.fleet-title-line-2',
          { yPercent: 108, skewY: 2.2, textShadow: '0 0 0px rgba(255, 103, 0, 0)' },
          {
            yPercent: 0,
            skewY: 0,
            textShadow: '0 0 38px rgba(255, 103, 0, 0.55)',
            duration: 0.95,
            ease: 'power4.out',
          },
          0.18
        )
        .fromTo(
          '.fleet-filter-dock',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out', clearProps: 'transform,opacity' },
          0.26
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Desktop Pinned Horizontal Pit-Lane Scrub + 4-Layer Parallax
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (
      window.innerWidth < 1024 ||
      prefersReducedMotion ||
      !sectionRef.current ||
      !trackViewportRef.current ||
      !trackRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const trackEl = trackRef.current!;
      const viewportEl = trackViewportRef.current!;
      const getTravelDistance = () =>
        Math.max(0, trackEl.scrollWidth - viewportEl.clientWidth);

      const bayCount = filteredVehicles.length;
      const scrollLength = Math.max(120, bayCount * 62);

      const horizTween = gsap.to(trackEl, {
        x: () => -getTravelDistance(),
        ease: 'none',
        scrollTrigger: {
          id: 'fleet-horizontal-pit',
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${scrollLength}%`,
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set('.fleet-pit-progress', { scaleX: Math.min(1, Math.max(0, self.progress)) });
          },
        },
      });

      scrollTriggerRef.current = horizTween.scrollTrigger || null;

      // Per-bay 4-layer parallax tied to horizontal containerAnimation
      const bayEls = gsap.utils.toArray<HTMLElement>('.pit-bay-item');
      bayEls.forEach((bay, index) => {
        const watermark = bay.querySelector('.bay-watermark');
        const bikeVisual = bay.querySelector('.bay-bike-visual');
        const hudPanel = bay.querySelector('.bay-hud-panel');

        if (watermark) {
          gsap.fromTo(
            watermark,
            { xPercent: -10 },
            {
              xPercent: 12,
              ease: 'none',
              scrollTrigger: {
                trigger: bay,
                containerAnimation: horizTween,
                start: 'left right',
                end: 'right left',
                scrub: true,
              },
            }
          );
        }

        if (bikeVisual && index > 0) {
          gsap.fromTo(
            bikeVisual,
            { scale: 0.94, xPercent: 5 },
            {
              scale: 1,
              xPercent: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: bay,
                containerAnimation: horizTween,
                start: 'left 88%',
                end: 'center 52%',
                scrub: true,
              },
            }
          );
        }

        if (hudPanel && index > 0) {
          gsap.fromTo(
            hudPanel,
            { y: 18 },
            {
              y: 0,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: bay,
                containerAnimation: horizTween,
                start: 'left 82%',
                end: 'center 55%',
                scrub: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    // Ensure downstream Part 5 recalculates positions after filter changes
    const refreshId = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, [filteredVehicles]);

  const handleSelectFilter = (cat: FilterCategory) => {
    setActiveFilter(cat);
    const st = scrollTriggerRef.current;
    if (st && window.scrollY > st.start && window.scrollY < st.end) {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(st.start, { duration: 0.6 });
      } else {
        window.scrollTo({ top: st.start, behavior: 'smooth' });
      }
    }
  };

  const handleJumpToBay = (index: number) => {
    const st = scrollTriggerRef.current;
    if (!st || filteredVehicles.length <= 1) return;
    const ratio = index / (filteredVehicles.length - 1);
    const targetY = st.start + (st.end - st.start) * ratio;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(targetY, { duration: 1.0 });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  return (
    <Box
      id="fleet"
      ref={sectionRef}
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 'auto', lg: '100vh' },
        backgroundColor: '#070709',
        marginTop: '-4px',
        zIndex: 4,
        overflow: 'hidden',
        '@media (prefers-reduced-motion: reduce)': {
          height: 'auto',
        },
      }}
    >
      {/* Ambient Overhead Studio Glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '-140px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1100px',
          height: '460px',
          background:
            'radial-gradient(ellipse at center, rgba(255, 103, 0, 0.12) 0%, rgba(255, 103, 0, 0.02) 52%, transparent 76%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Stage Shell (Scales down cleanly as Part 5 shutters over) */}
      <Box
        className="fleet-stage-shell"
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 'auto', lg: '100%' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pt: { xs: 10, lg: '5.5vh' },
          pb: { xs: 8, lg: '3.5vh' },
          willChange: 'transform, opacity',
        }}
      >
        {/* 1. TOP STICKY MOTORSPORT HUD HEADER & FILTER RAIL */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '1440px',
            mx: 'auto',
            px: { xs: 3, md: 6, lg: 8 },
            zIndex: 15,
            flexShrink: 0,
          }}
        >
          {/* Eyebrow with Tracking Lock-In */}
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
              className="fleet-eyebrow-rule"
              sx={{
                width: 24,
                height: '2px',
                backgroundColor: '#FF6700',
                transformOrigin: 'left center',
              }}
            />
            <Typography
              className="fleet-eyebrow-text"
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: { xs: '0.64rem', md: '0.72rem' },
                fontWeight: 800,
                letterSpacing: '0.16em',
                color: '#FF6700',
                textTransform: 'uppercase',
              }}
            >
              MATTIGHOFEN STARTING GRID • {filteredVehicles.length} FACTORY MACHINES
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', lg: 'flex-end' },
              gap: { xs: 3, lg: 4 },
            }}
          >
            {/* Masked Clip-Slice Headline */}
            <Box sx={{ flexShrink: 0 }}>
              <Typography
                component="h2"
                sx={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 950,
                  fontSize: { xs: '2.0rem', sm: '2.6rem', lg: '2.8rem', xl: '3.4rem' },
                  letterSpacing: '-0.035em',
                  lineHeight: 0.98,
                  textTransform: 'uppercase',
                  whiteSpace: { md: 'nowrap' },
                }}
              >
                <Box component="span" sx={{ display: 'block', overflow: 'hidden' }}>
                  <Box
                    component="span"
                    className="fleet-title-line-1"
                    sx={{ display: 'inline-block', color: '#FFFFFF' }}
                  >
                    THE BLOODLINE FLEET.
                  </Box>
                </Box>
                <Box component="span" sx={{ display: 'block', overflow: 'hidden' }}>
                  <Box
                    component="span"
                    className="fleet-title-line-2"
                    sx={{
                      display: 'inline-block',
                      color: '#FF6700',
                      textShadow: '0 0 38px rgba(255, 103, 0, 0.55)',
                    }}
                  >
                    CHOOSE YOUR WEAPON.
                  </Box>
                </Box>
              </Typography>
            </Box>

            {/* Segmented Filter Rail + Bay Indicator */}
            <Box
              className="fleet-filter-dock"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'flex-start', lg: 'flex-end' },
                gap: 1.2,
                maxWidth: '100%',
                flexShrink: 0,
              }}
            >
              <Box
                role="group"
                aria-label="Filter motorcycles by discipline"
                sx={{
                  display: 'flex',
                  flexWrap: { xs: 'wrap', lg: 'nowrap' },
                  alignItems: 'center',
                  gap: 0.55,
                  p: 0.6,
                  borderRadius: { xs: '14px', md: '100px' },
                  backgroundColor: 'rgba(15, 15, 20, 0.92)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.24)',
                  boxShadow: '0 14px 36px rgba(0, 0, 0, 0.65)',
                }}
              >
                {CATEGORY_TABS.map((tab) => {
                  const isActive = activeFilter === tab.key;
                  return (
                    <ButtonBase
                      key={tab.key}
                      aria-pressed={isActive}
                      onClick={() => handleSelectFilter(tab.key)}
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.85,
                        px: { xs: 1.4, lg: 1.6, xl: 2 },
                        py: 0.85,
                        borderRadius: '100px',
                        whiteSpace: 'nowrap',
                        backgroundColor: isActive ? '#FF6700' : 'transparent',
                        color: isActive ? '#070709' : '#D4D4D8',
                        boxShadow: isActive ? '0 0 24px rgba(255, 103, 0, 0.45)' : 'none',
                        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                        '&:hover': {
                          backgroundColor: isActive ? '#FF7D24' : 'rgba(255, 255, 255, 0.08)',
                          color: isActive ? '#070709' : '#FFFFFF',
                        },
                        '&:focus-visible': {
                          outline: '2px solid #FF6700',
                          outlineOffset: '2px',
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          letterSpacing: '0.09em',
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {tab.label}
                      </Typography>
                      <Box
                        component="span"
                        className="tabular-nums"
                        sx={{
                          px: 0.75,
                          py: 0.22,
                          borderRadius: '100px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.60rem',
                          fontWeight: 800,
                          lineHeight: 1,
                          backgroundColor: isActive
                            ? 'rgba(7, 7, 9, 0.18)'
                            : 'rgba(255, 255, 255, 0.08)',
                          color: isActive ? '#070709' : '#D4D4D8',
                        }}
                      >
                        {String(categoryCounts[tab.key]).padStart(2, '0')}
                      </Box>
                    </ButtonBase>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* 2. HORIZONTAL PIT-LANE TRACK (GSAP Pinned Scrub on Desktop, Horizontal Snap on Mobile) */}
        <Box
          ref={trackViewportRef}
          sx={{
            position: 'relative',
            width: '100%',
            flex: { lg: 1 },
            display: 'flex',
            alignItems: 'center',
            overflowX: { xs: 'auto', lg: 'hidden' },
            scrollSnapType: { xs: 'x mandatory', lg: 'none' },
            mt: { xs: 4, lg: 0 },
            pb: { xs: 2, lg: 0 },
            '&::-webkit-scrollbar': { display: 'none' },
            '@media (prefers-reduced-motion: reduce)': {
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              pb: 3,
            },
          }}
        >
          <Box
            ref={trackRef}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 3, lg: '8vw' },
              px: { xs: 3, md: 6, lg: '9vw' },
              width: 'max-content',
              willChange: 'transform',
            }}
          >
            {filteredVehicles.map((bike, idx) => (
                <Box
                  key={bike.id}
                  className="pit-bay-item"
                  sx={{
                    position: 'relative',
                    width: { xs: '86vw', sm: '76vw', md: '66vw', lg: '82vw', xl: '80vw' },
                    maxWidth: { lg: '1240px' },
                    minHeight: { xs: 'auto', lg: '56vh' },
                    flexShrink: 0,
                    scrollSnapAlign: { xs: 'center', lg: 'none' },
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', lg: '1.25fr 0.9fr' },
                    gap: { xs: 3, lg: 6 },
                    alignItems: 'center',
                    py: { xs: 3, lg: 2 },
                  }}
                >
                  {/* Layer 0: Deep Parallax Ghost Displacement Watermark */}
                  <Typography
                    className="bay-watermark"
                    aria-hidden="true"
                    sx={{
                      position: 'absolute',
                      top: { xs: '6%', lg: '8%' },
                      left: { xs: '4%', lg: '2%' },
                      fontFamily: 'var(--font-display)',
                      fontWeight: 950,
                      fontSize: { xs: '4.5rem', sm: '7rem', lg: '10.5rem', xl: '12rem' },
                      lineHeight: 0.9,
                      letterSpacing: '-0.05em',
                      color: 'rgba(255, 255, 255, 0.032)',
                      userSelect: 'none',
                      pointerEvents: 'none',
                      whiteSpace: 'nowrap',
                      zIndex: 0,
                    }}
                  >
                    {bike.displacementCc} CC
                  </Typography>

                  {/* Layer 1 & 2: Pit Floor Horizon + Hero Profile Machine */}
                  <Box
                    className="bay-bike-visual"
                    sx={{
                      position: 'relative',
                      height: { xs: '230px', sm: '300px', lg: '48vh' },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                    }}
                  >
                    {/* Radial Orange Pit-Bay Spotlight */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '85%',
                        height: '58%',
                        background:
                          'radial-gradient(ellipse at center, rgba(255, 103, 0, 0.24) 0%, rgba(255, 103, 0, 0.05) 48%, transparent 74%)',
                        filter: 'blur(26px)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Continuous Pit Floor Baseline */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: { xs: '10%', lg: '11%' },
                        left: '4%',
                        right: '4%',
                        height: '1px',
                        background:
                          'linear-gradient(90deg, transparent 0%, rgba(255, 103, 0, 0.55) 50%, transparent 100%)',
                        pointerEvents: 'none',
                      }}
                    />

                    {/* Bay Index + Badge Floating Chips */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        zIndex: 4,
                      }}
                    >
                      <Box
                        sx={{
                          px: 1.4,
                          py: 0.45,
                          borderRadius: '100px',
                          backgroundColor: 'rgba(15, 15, 20, 0.85)',
                          backdropFilter: 'blur(12px)',
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                        }}
                      >
                        <Typography
                          className="tabular-nums"
                          sx={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            color: '#D4D4D8',
                            letterSpacing: '0.12em',
                          }}
                        >
                          BAY {String(idx + 1).padStart(2, '0')} // {bike.category}
                        </Typography>
                      </Box>

                      {bike.badge && (
                        <Box
                          sx={{
                            px: 1.3,
                            py: 0.45,
                            borderRadius: '100px',
                            backgroundColor: '#FF6700',
                            color: '#070709',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.58rem',
                            fontWeight: 800,
                            letterSpacing: '0.1em',
                            boxShadow: '0 0 18px rgba(255, 103, 0, 0.45)',
                          }}
                        >
                          {bike.badge}
                        </Box>
                      )}
                    </Box>

                    <Box
                      component="img"
                      src={bike.image}
                      alt={bike.name}
                      loading={idx < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      sx={{
                        position: 'relative',
                        zIndex: 3,
                        maxWidth: '94%',
                        maxHeight: '92%',
                        objectFit: 'contain',
                        filter:
                          'drop-shadow(0 22px 35px rgba(0, 0, 0, 0.92)) drop-shadow(0 0 28px rgba(255, 103, 0, 0.18))',
                      }}
                    />
                  </Box>

                  {/* Layer 3: Floating Glass Telemetry & Action HUD */}
                  <Box
                    className="bay-hud-panel"
                    sx={{
                      position: 'relative',
                      zIndex: 3,
                      p: { xs: 3, lg: 4 },
                      borderRadius: '16px',
                      backgroundColor: 'rgba(15, 15, 20, 0.90)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.10)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                      boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2.2,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          letterSpacing: '0.14em',
                          color: '#FF6700',
                          mb: 0.7,
                        }}
                      >
                        {bike.tagline}
                      </Typography>

                      <Typography
                        component="h3"
                        sx={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 950,
                          fontSize: { xs: '1.55rem', sm: '1.9rem', lg: '2.2rem' },
                          letterSpacing: '-0.025em',
                          lineHeight: 1.06,
                          color: '#FFFFFF',
                          textTransform: 'uppercase',
                        }}
                      >
                        {bike.name}
                      </Typography>
                    </Box>

                    {/* Odometer Telemetry Matrix */}
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 1.5,
                        p: 2,
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.10)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.20)',
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.60rem',
                            fontWeight: 700,
                            color: '#A1A1AA',
                            letterSpacing: '0.08em',
                            mb: 0.3,
                          }}
                        >
                          POWER
                        </Typography>
                        <Typography
                          className="tabular-nums"
                          sx={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: { xs: '1.05rem', lg: '1.22rem' },
                            fontWeight: 900,
                            color: '#FFFFFF',
                          }}
                        >
                          <AnimatedOdometerValue value={bike.powerHp} />{' '}
                          <Box component="span" sx={{ fontSize: '0.68rem', color: '#FF6700' }}>
                            HP
                          </Box>
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.60rem',
                            fontWeight: 700,
                            color: '#A1A1AA',
                            letterSpacing: '0.08em',
                            mb: 0.3,
                          }}
                        >
                          TORQUE
                        </Typography>
                        <Typography
                          className="tabular-nums"
                          sx={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: { xs: '1.05rem', lg: '1.22rem' },
                            fontWeight: 900,
                            color: '#FFFFFF',
                          }}
                        >
                          <AnimatedOdometerValue
                            value={bike.torqueNm}
                            decimals={Number.isInteger(bike.torqueNm) ? 0 : 1}
                          />{' '}
                          <Box component="span" sx={{ fontSize: '0.68rem', color: '#FF6700' }}>
                            NM
                          </Box>
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.60rem',
                            fontWeight: 700,
                            color: '#A1A1AA',
                            letterSpacing: '0.08em',
                            mb: 0.3,
                          }}
                        >
                          DRY WT
                        </Typography>
                        <Typography
                          className="tabular-nums"
                          sx={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: { xs: '1.05rem', lg: '1.22rem' },
                            fontWeight: 900,
                            color: '#FFFFFF',
                          }}
                        >
                          <AnimatedOdometerValue value={bike.dryWeightKg} />{' '}
                          <Box component="span" sx={{ fontSize: '0.68rem', color: '#FF6700' }}>
                            KG
                          </Box>
                        </Typography>
                      </Box>
                    </Box>

                    {/* MSRP Row */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        pt: 1.5,
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          color: '#A1A1AA',
                          letterSpacing: '0.1em',
                        }}
                      >
                        STARTING MSRP
                      </Typography>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          className="tabular-nums"
                          sx={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '1.35rem',
                            fontWeight: 900,
                            color: '#FFFFFF',
                          }}
                        >
                          <AnimatedOdometerValue value={bike.msrpUsd} prefix="$" />
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.66rem',
                            color: '#71717A',
                          }}
                        >
                          {bike.msrpVnd}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Mock Action Buttons */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 1.5 }}>
                      <ButtonBase
                        onClick={() =>
                          setPreviewNotice(`${bike.name} — cart preview coming soon.`)
                        }
                        sx={{
                          py: 1.25,
                          px: 1.5,
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          color: '#D4D4D8',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.70rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            borderColor: '#FF6700',
                            color: '#FFFFFF',
                            backgroundColor: 'rgba(255, 103, 0, 0.08)',
                          },
                          '&:focus-visible': {
                            outline: '2px solid #FF6700',
                            outlineOffset: '2px',
                          },
                        }}
                      >
                        ADD TO CART
                      </ButtonBase>

                      <ButtonBase
                        onClick={() =>
                          setPreviewNotice(`${bike.name} — showroom configurator coming soon.`)
                        }
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.8,
                          py: 1.25,
                          px: 1.5,
                          borderRadius: '8px',
                          backgroundColor: '#FF6700',
                          color: '#070709',
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.78rem',
                          fontWeight: 900,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          boxShadow: '0 0 24px rgba(255, 103, 0, 0.35)',
                          transition: 'all 0.25s ease',
                          '&:hover': {
                            backgroundColor: '#FF7D24',
                            boxShadow: '0 0 32px rgba(255, 103, 0, 0.55)',
                          },
                          '&:focus-visible': {
                            outline: '2px solid #FFFFFF',
                            outlineOffset: '2px',
                          },
                        }}
                      >
                        <span>ORDER NOW</span>
                        <ArrowOutwardIcon sx={{ fontSize: '0.9rem' }} />
                      </ButtonBase>
                    </Box>
                  </Box>
                </Box>
            ))}
          </Box>
        </Box>

        {/* 3. BOTTOM PIT-LANE LASER SCRUBBER & BAY DOTS (Desktop) */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'block' },
            width: '100%',
            maxWidth: '1440px',
            mx: 'auto',
            px: 8,
            zIndex: 15,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              mb: 1.8,
            }}
          >
            <Box
              className="fleet-pit-progress"
              sx={{
                height: '100%',
                width: '100%',
                backgroundColor: '#FF6700',
                boxShadow: '0 0 12px #FF6700',
                transform: 'scaleX(0)',
                transformOrigin: 'left center',
                willChange: 'transform',
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              {filteredVehicles.map((bike, idx) => (
                  <ButtonBase
                    key={`jump-${bike.id}`}
                    onClick={() => handleJumpToBay(idx)}
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.8,
                      py: 0.4,
                      opacity: 0.7,
                      transition: 'opacity 0.25s ease',
                      '&:hover': {
                        opacity: 1,
                        '& .jump-dot': {
                          backgroundColor: '#FF6700',
                          boxShadow: '0 0 8px #FF6700',
                        },
                      },
                    }}
                  >
                    <Box
                      className="jump-dot"
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.45)',
                        transition: 'all 0.25s ease',
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        color: '#D4D4D8',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {bike.name.replace('KTM ', '').toUpperCase()}
                    </Typography>
                  </ButtonBase>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={Boolean(previewNotice)}
        autoHideDuration={2600}
        onClose={() => setPreviewNotice(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setPreviewNotice(null)}
          severity="info"
          variant="filled"
          sx={{
            backgroundColor: '#0F0F16',
            color: '#F4F4F5',
            border: '1px solid rgba(255, 103, 0, 0.55)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            '& .MuiAlert-icon': { color: '#FF6700' },
          }}
        >
          {previewNotice}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default KtmBloodlineFleet;
