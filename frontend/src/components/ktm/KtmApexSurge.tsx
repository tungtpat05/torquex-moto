import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import wheelieActionImg from '@/assets/images/ktm/models/1390_wheelie_action.jpg';
import apexActionImg from '@/assets/images/ktm/models/1390_apex_action.jpg';
import tankImg from '@/assets/images/ktm/anatomy/1390_tank.png';
import headlightImg from '@/assets/images/ktm/anatomy/1390_headlight.png';

gsap.registerPlugin(ScrollTrigger);

interface ActionMoment {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  telemetryMetric: string;
  isTransparent?: boolean;
}

const ACTION_MOMENTS: ActionMoment[] = [
  {
    id: 'wheelie',
    index: '01',
    title: 'POWER WHEELIE',
    tagline: 'MTC DISENGAGED // RAW TORQUE',
    description: '145 Nm hits the rear tire instantly. With anti-wheelie disabled, the front Michelin Power GP claws skyward in second gear under sheer savage acceleration.',
    image: wheelieActionImg,
    telemetryMetric: '0-100 KM/H: 3.0 SEC',
  },
  {
    id: 'apex-angle',
    index: '02',
    title: '52° LEAN ANGLE',
    tagline: 'GRAVITY RESISTANCE // TRACK MODE',
    description: 'ChroMo steel trellis frame provides razor-sharp lateral rigidity. Knee pucks scrape asphalt as the rider locks into the apex with zero chassis deflection.',
    image: apexActionImg,
    telemetryMetric: 'MAX G-FORCE: 1.52 G',
  },
  {
    id: 'aero-tank',
    index: '03',
    title: 'AERO WINGLETS // TANK FLOW',
    tagline: 'HIGH-SPEED DOWNFORCE // 17.5L TANK',
    description: 'Integrated aerodynamic winglets provide stability and front-wheel downforce at triple-digit speeds while channelling airflow directly into the radiators.',
    image: tankImg,
    telemetryMetric: 'DOWNFORCE: +3.5 KG @ 200 KM/H',
    isTransparent: true,
  },
  {
    id: 'predator-drl',
    index: '04',
    title: 'PREDATOR INTAKE',
    tagline: 'SPLIT-FACE LED // RAM-AIR DUCT',
    description: 'The iconic split headlight doubles as a central ram-air induction tunnel, feeding cool pressurized oxygen directly into the 1,350cc combustion chambers.',
    image: headlightImg,
    telemetryMetric: 'RAM-AIR PRESSURE: +3.2 PSI',
    isTransparent: true,
  },
];

export const KtmApexSurge: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Kinetic Marquee Text Scrub (Differential Parallax)
      if (marqueeRef.current) {
        gsap.to(marqueeRef.current, {
          xPercent: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        });
      }

      // 2. Animate Action Cards on entrance
      const cards = gsap.utils.toArray<HTMLElement>('.apex-card');
      cards.forEach((card) => {
        const img = card.querySelector('.apex-card-img');

        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.4,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={containerRef}
      id="action"
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#070709',
        py: { xs: 12, md: 18 },
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* 1. GIANT KINETIC BACKGROUND MARQUEE TEXT */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: '6%', md: '10%' },
          left: 0,
          whiteSpace: 'nowrap',
          userSelect: 'none',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.045,
        }}
      >
        <Typography
          ref={marqueeRef}
          sx={{
            fontFamily: 'var(--font-display, "Outfit", sans-serif)',
            fontSize: { xs: '6rem', sm: '10rem', md: '14rem' },
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            display: 'inline-block',
          }}
        >
          52° APEX LEAN ANGLE // BEND THE LAWS OF PHYSICS // READY TO RACE //
        </Typography>
      </Box>

      {/* 2. SECTION HEADER */}
      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 3, md: 8 }, mb: { xs: 6, md: 10 }, position: 'relative', zIndex: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
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
            ACT III // BRED ON TRACK. UNLEASHED ON ASPHALT.
          </Typography>
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontFamily: 'var(--font-display, "Outfit", sans-serif)',
            fontWeight: 900,
            fontSize: { xs: '2.4rem', sm: '3.6rem', md: '4.6rem' },
            letterSpacing: '-0.035em',
            lineHeight: 0.98,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            maxWidth: '920px',
          }}
        >
          THE BEAST IN ITS NATURAL HUNTING GROUND.
        </Typography>
      </Box>

      {/* 3. STAGGERED ACTION CARDS GRID */}
      <Box
        sx={{
          maxWidth: '1400px',
          mx: 'auto',
          px: { xs: 3, md: 8 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: { xs: 4, md: 6, lg: 8 },
          position: 'relative',
          zIndex: 10,
        }}
      >
        {ACTION_MOMENTS.map((moment, idx) => {
          const isOffset = idx % 2 === 1;

          return (
            <Box
              key={moment.id}
              className="apex-card"
              sx={{
                position: 'relative',
                borderRadius: '3px',
                overflow: 'hidden',
                backgroundColor: '#0F0F14',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderTop: '1px solid rgba(255, 255, 255, 0.20)',
                transition: 'border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                mt: { md: isOffset ? 8 : 0 },
                '&:hover': {
                  borderColor: '#FF6700',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
                  transform: 'translateY(-4px)',
                },
              }}
            >
              {/* Image Frame with Overflow Hidden for Parallax Scrub */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '260px', sm: '340px', lg: '420px' },
                  overflow: 'hidden',
                  backgroundColor: moment.isTransparent ? '#0A0A0F' : 'transparent',
                  display: moment.isTransparent ? 'flex' : 'block',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  className="apex-card-img"
                  component="img"
                  src={moment.image}
                  alt={moment.title}
                  loading="lazy"
                  decoding="async"
                  sx={{
                    width: moment.isTransparent ? '75%' : '100%',
                    height: moment.isTransparent ? '75%' : '116%',
                    objectFit: moment.isTransparent ? 'contain' : 'cover',
                    objectPosition: 'center',
                    filter: moment.isTransparent
                      ? 'drop-shadow(0 0 25px rgba(255,103,0,0.35))'
                      : 'contrast(1.08) brightness(0.96)',
                  }}
                />

                {/* Top Corner Pill: Index and Telemetry */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '2px',
                    backgroundColor: 'rgba(7, 7, 9, 0.88)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    zIndex: 5,
                  }}
                >
                  <Typography sx={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', fontWeight: 800, color: '#FF6700' }}>
                    [{moment.index}]
                  </Typography>
                  <Typography sx={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.62rem', letterSpacing: '0.1em', color: '#D4D4D8' }}>
                    {moment.telemetryMetric}
                  </Typography>
                </Box>
              </Box>

              {/* Bottom Card Content */}
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.68rem',
                    letterSpacing: '0.14em',
                    fontWeight: 700,
                    color: '#FF6700',
                    mb: 1,
                  }}
                >
                  {moment.tagline}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                    fontWeight: 900,
                    fontSize: { xs: '1.4rem', sm: '1.8rem' },
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                    mb: 1.5,
                    textTransform: 'uppercase',
                  }}
                >
                  {moment.title}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'var(--font-body, "Inter", sans-serif)',
                    fontSize: '0.88rem',
                    lineHeight: 1.65,
                    color: '#A1A1AA',
                  }}
                >
                  {moment.description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default KtmApexSurge;
