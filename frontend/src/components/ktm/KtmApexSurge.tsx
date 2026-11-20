import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { gsap } from 'gsap';

interface ActionMoment {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  telemetryMetric: string;
}

const ACTION_MOMENTS: ActionMoment[] = [
  {
    id: 'wheelie',
    index: '01',
    title: 'POWER WHEELIE',
    tagline: 'MTC DISENGAGED // RAW TORQUE',
    description: '140 Nm hits the rear tire instantly. With anti-wheelie disabled, the front Bridgestone S22 claws skyward in second gear under sheer acceleration.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    telemetryMetric: '0-100 KM/H: 3.1 SEC',
  },
  {
    id: 'apex-angle',
    index: '02',
    title: '52° LEAN ANGLE',
    tagline: 'GRAVITY RESISTANCE // TRACK MODE',
    description: 'ChroMo steel trellis frame provides razor-sharp lateral rigidity. Knee pucks scrape asphalt as the rider locks into the apex with zero chassis flex.',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    telemetryMetric: 'MAX G-FORCE: 1.48 G',
  },
  {
    id: 'titanium-exhaust',
    index: '03',
    title: 'TITANIUM RESONANCE',
    tagline: 'AKRAPOVIČ FULL SYSTEM // BLUE HEAT',
    description: 'Hydroformed titanium headers glow translucent violet under continuous 10,500 RPM full-throttle load down the straightaway.',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80',
    telemetryMetric: 'EXHAUST VELOCITY: MACH 0.4',
  },
  {
    id: 'predator-drl',
    index: '04',
    title: 'PREDATOR INTAKE',
    tagline: 'SPLIT-FACE LED // RAM-AIR DUCT',
    description: 'The iconic split headlight doubles as a central ram-air induction tunnel, feeding cool pressurized oxygen directly into the 1,301cc combustion chambers.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    telemetryMetric: 'RAM-AIR PRESSURE: +3.2 PSI',
  },
];

export const KtmApexSurge: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate action cards on entrance with stagger and differential parallax
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
            duration: 0.9,
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
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 6, lg: 10 },
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Track Geometry */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 103, 0, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Section Header */}
      <Box sx={{ maxWidth: '1280px', mx: 'auto', mb: { xs: 6, md: 10 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
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
            ACT III // BRED ON TRACK. UNLEASHED ON ASPHALT.
          </Typography>
        </Box>

        <Typography
          component="h2"
          sx={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: { xs: '2.4rem', sm: '3.6rem', md: '4.8rem' },
            letterSpacing: '-0.035em',
            lineHeight: 0.98,
            color: '#F4F4F5',
            textTransform: 'uppercase',
            maxWidth: '850px',
          }}
        >
          THE BEAST IN ITS NATURAL HUNTING GROUND.
        </Typography>
      </Box>

      {/* 4 Staggered Action Cards Grid */}
      <Box
        sx={{
          maxWidth: '1280px',
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: { xs: 4, md: 6, lg: 8 },
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
                borderRadius: '6px',
                overflow: 'hidden',
                backgroundColor: '#0F0F14',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'border-color 0.3s ease, transform 0.3s ease',
                mt: { md: isOffset ? 8 : 0 },
                '&:hover': {
                  borderColor: 'rgba(255, 103, 0, 0.5)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              {/* Image Frame with Overflow Hidden for Parallax Scrub */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '260px', sm: '340px', lg: '400px' },
                  overflow: 'hidden',
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
                    width: '100%',
                    height: '116%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    filter: 'contrast(1.08) brightness(0.95)',
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
                    backgroundColor: 'rgba(7, 7, 9, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: '#FF6700' }}>
                    [{moment.index}]
                  </Typography>
                  <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.1em', color: '#D4D4D8' }}>
                    {moment.telemetryMetric}
                  </Typography>
                </Box>
              </Box>

              {/* Bottom Card Content */}
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    letterSpacing: '0.14em',
                    color: '#FF6700',
                    mb: 1,
                  }}
                >
                  {moment.tagline}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: { xs: '1.4rem', sm: '1.75rem' },
                    letterSpacing: '-0.02em',
                    color: '#F4F4F5',
                    mb: 1.5,
                  }}
                >
                  {moment.title}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'var(--font-body)',
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
