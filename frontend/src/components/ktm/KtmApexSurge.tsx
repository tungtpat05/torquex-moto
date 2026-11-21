import React, { useState } from 'react';
import { Box, Typography, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

import wheelieActionImg from '@/assets/images/ktm/models/1390_wheelie_action.jpg';
import apexActionImg from '@/assets/images/ktm/models/1390_apex_action.jpg';
import rc8cActionImg from '@/assets/images/ktm/models/rc8c_action_1.jpg';
import tankImg from '@/assets/images/ktm/anatomy/1390_tank.png';
import headlightImg from '@/assets/images/ktm/anatomy/1390_headlight.png';
import engineImg from '@/assets/images/ktm/anatomy/1390_engine.png';
import brakesImg from '@/assets/images/ktm/anatomy/1390_brakes.png';

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
      'ChroMo steel trellis architecture provides razor-sharp lateral rigidity. Knee pucks scrape asphalt as the rider locks into the apex with zero deflection.',
    image: apexActionImg,
  },
  {
    id: 'rc8c',
    tag: 'MOTO2 BLOODLINE',
    title: 'RC 8C TRACK WEAPON',
    metric: 'DRY WEIGHT • 142 KG',
    description:
      'Purpose-built racing prototype crafted alongside Grand Prix engineers. Hand-assembled Bespoke WP APEX PRO suspension and aerodynamic wing package.',
    image: rc8cActionImg,
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

export const KtmApexSurge: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CardItem | null>(null);

  // Render a 3:4 Hero Card
  const renderHeroCard = (card: CardItem, keyPrefix: string) => (
    <Box
      key={`${keyPrefix}-${card.id}`}
      onClick={() => setSelectedCard(card)}
      sx={{
        flexShrink: 0,
        width: { xs: '300px', sm: '360px', lg: '410px' },
        height: { xs: '420px', sm: '500px', lg: '560px' },
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor: '#0E0E14',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          borderColor: '#FF6700',
          transform: 'translateY(-8px)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(255, 103, 0, 0.35)',
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
          objectFit: 'cover',
          transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Dark Vignette Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(7, 7, 9, 0.95) 0%, rgba(7, 7, 9, 0.4) 50%, rgba(7, 7, 9, 0.1) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Pill & Arrow Button */}
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          right: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 5,
        }}
      >
        <Box
          sx={{
            px: 1.6,
            py: 0.6,
            borderRadius: '100px',
            backgroundColor: 'rgba(7, 7, 9, 0.82)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
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
            {card.tag}
          </Typography>
        </Box>

        <Box
          className="card-arrow"
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            backgroundColor: 'rgba(7, 7, 9, 0.82)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            color: '#E4E4E7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
        >
          <ArrowOutwardIcon sx={{ fontSize: '1.05rem' }} />
        </Box>
      </Box>

      {/* Bottom Content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          right: 24,
          zIndex: 5,
        }}
      >
        <Typography
          sx={{
            fontFamily: 'var(--font-display, "Outfit", sans-serif)',
            fontSize: { xs: '1.5rem', sm: '1.85rem' },
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
            px: 1.4,
            py: 0.5,
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 103, 0, 0.14)',
            border: '1px solid rgba(255, 103, 0, 0.45)',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.68rem',
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
      key={`${keyPrefix}-cluster`}
      sx={{
        flexShrink: 0,
        width: { xs: '300px', sm: '360px', lg: '400px' },
        height: { xs: '420px', sm: '500px', lg: '560px' },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, lg: 2.5 },
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
            backgroundColor: '#0C0C12',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.65)',
            display: 'flex',
            alignItems: 'center',
            p: 3,
            gap: 2.5,
            transition: 'all 0.35s ease',
            '&:hover': {
              borderColor: '#FF6700',
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 45px rgba(0, 0, 0, 0.85), 0 0 25px rgba(255, 103, 0, 0.25)',
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
              width: { xs: '85px', sm: '110px' },
              height: { xs: '85px', sm: '110px' },
              flexShrink: 0,
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1.2,
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
                filter: 'drop-shadow(0 0 16px rgba(255, 103, 0, 0.45))',
                transition: 'transform 0.5s ease',
              }}
            />
          </Box>

          {/* Details */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.62rem',
                fontWeight: 800,
                color: '#FF6700',
                letterSpacing: '0.14em',
                mb: 0.5,
              }}
            >
              {card.tag}
            </Typography>

            <Typography
              sx={{
                fontFamily: 'var(--font-display, "Outfit", sans-serif)',
                fontSize: { xs: '1.05rem', sm: '1.25rem' },
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.15,
                textTransform: 'uppercase',
                mb: 0.8,
              }}
            >
              {card.title}
            </Typography>

            <Typography
              sx={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.68rem',
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
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#A1A1AA',
              transition: 'all 0.25s ease',
            }}
          >
            <ArrowOutwardIcon sx={{ fontSize: '0.95rem' }} />
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box
      id="action"
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: 'auto', lg: '1050px', xl: '1120px' },
        backgroundColor: '#070709',
        overflow: 'hidden',
        py: { xs: 10, lg: 12 },
      }}
    >
      {/* 1. CINEMATIC AMBIENT BACKGROUND RACETRACK VIDEO (PORSCHE STYLE) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <Box
          component="video"
          src="/videos/track-run.mp4"
          autoPlay
          muted
          loop
          playsInline
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%',
            opacity: 0.42,
            filter: 'contrast(1.15) brightness(0.85)',
          }}
        />

        {/* Master Vignette Gradients */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, #070709 0%, rgba(7, 7, 9, 0.25) 30%, rgba(7, 7, 9, 0.70) 70%, #070709 100%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 35%, rgba(7, 7, 9, 0.85) 100%)',
          }}
        />
      </Box>

      {/* 2. PORSCHE-STYLE MONUMENTAL CENTERED HEADLINE */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '1300px',
          mx: 'auto',
          px: { xs: 3, md: 6 },
          mb: { xs: 8, lg: 10 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1.8,
        }}
      >
        {/* Pulsing Status Pill */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.2,
            px: 2.2,
            py: 0.6,
            borderRadius: '100px',
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
              fontSize: { xs: '0.68rem', md: '0.74rem' },
              fontWeight: 800,
              color: '#FF6700',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            ACT III • RACING PROTOCOLS
          </Typography>
        </Box>

        {/* Colossal Statement Headline */}
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'var(--font-display, "Outfit", sans-serif)',
            fontSize: { xs: '2.5rem', sm: '3.8rem', md: '5.0rem', lg: '6.2rem' },
            fontWeight: 950,
            lineHeight: 0.96,
            letterSpacing: '-0.035em',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            textShadow: '0 4px 30px rgba(0,0,0,0.95), 0 0 50px rgba(255, 255, 255, 0.15)',
          }}
        >
          BRED ON TRACK.{' '}
          <Box
            component="span"
            sx={{
              color: '#FF6700',
              textShadow:
                '0 4px 40px rgba(0,0,0,0.95), 0 0 50px rgba(255, 103, 0, 0.75), 0 0 90px rgba(255, 103, 0, 0.35)',
            }}
          >
            UNLEASHED ON ASPHALT.
          </Box>
        </Typography>

        {/* Subhead Narrative */}
        <Typography
          sx={{
            fontFamily: 'var(--font-body, "Inter", sans-serif)',
            fontSize: { xs: '0.85rem', md: '1.05rem' },
            color: '#A1A1AA',
            letterSpacing: '0.04em',
            maxWidth: '680px',
            mt: 0.5,
          }}
        >
          Born from 18 Dakar Championships and Grand Prix prototype telemetry. Every millimeter engineered for
          pure unhinged acceleration.
        </Typography>
      </Box>

      {/* 3. HARDWARE-ACCELERATED CONTINUOUS CSS INFINITE MARQUEE (PORSCHE STYLE) */}
      {/* Overlaps the bottom of the video, pauses instantly on hover */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 15,
          width: '100%',
          overflow: 'hidden',
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
            gap: { xs: 2.5, lg: 3.5 },
            width: 'max-content',
            animation: 'apexMarqueeScroll 48s linear infinite',
            willChange: 'transform',
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
  );
};

export default KtmApexSurge;
