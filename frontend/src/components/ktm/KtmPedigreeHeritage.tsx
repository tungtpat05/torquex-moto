import React from 'react';
import { Box, Typography } from '@mui/material';
import rc8cAction1Img from '@/assets/images/ktm/models/rc8c_action_1.jpg';

interface Milestone {
  era: string;
  badge: string;
  title: string;
  summary: string;
  image: string;
}

const MILESTONES: Milestone[] = [
  {
    era: '1953',
    badge: 'FOUNDING PROVENANCE',
    title: 'THE MATTIGHOFEN REPAIR SHOP',
    summary: 'Forged in a small Austrian mechanical workshop with one uncompromising doctrine: lightweight chassis, high-output single-cylinder torque, and "Ready to Race" directly off the showroom floor.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
  },
  {
    era: '2001 – 2019',
    badge: 'DESERT DOMINANCE',
    title: '18 CONSECUTIVE DAKAR VICTORIES',
    summary: '18 straight titles across 9,000 km of punishing Sahara sand and Atacama rocks. KTM machines endured sub-zero nights, 50°C dunes, and full-throttle river crossings without mechanical failure.',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80',
  },
  {
    era: '2026',
    badge: 'PREMIER GP TIER',
    title: 'RED BULL KTM FACTORY RACING',
    summary: 'Direct transfer of MotoGP aerodynamic carbon winglets, launch control software, and WP APEX PRO suspension from Brad Binder and Pedro Acosta’s RC16 prototype into every road-legal Super Duke.',
    image: rc8cAction1Img,
  },
];

export const KtmPedigreeHeritage: React.FC = () => {
  return (
    <Box
      id="heritage"
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#070709',
        py: { xs: 10, md: 16 },
        px: { xs: 3, md: 6, lg: 10 },
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Box
        sx={{
          maxWidth: '1280px',
          mx: 'auto',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '420px 1fr' },
          gap: { xs: 6, lg: 10 },
        }}
      >
        {/* Left Sticky Anchor Column on Desktop */}
        <Box
          sx={{
            position: { xs: 'relative', lg: 'sticky' },
            top: { lg: '120px' },
            alignSelf: 'start',
          }}
        >
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
              CHAPTER 04 • BLOODLINE PEDIGREE
            </Typography>
          </Box>

          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: { xs: '2.2rem', sm: '3rem', lg: '3.4rem' },
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              color: '#F4F4F5',
              textTransform: 'uppercase',
              mb: 3,
            }}
          >
            18 DAKAR TITLES. MOTOGP DNA.
          </Typography>

          <Typography
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: '#A1A1AA',
              mb: 4,
            }}
          >
            "We do not race to sell motorcycles. We sell motorcycles so we can fund our obsession with winning on the track."
          </Typography>

          <Box
            sx={{
              p: 2.5,
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 103, 0, 0.04)',
              border: '1px solid rgba(255, 103, 0, 0.2)',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: '#FF6700',
                letterSpacing: '0.12em',
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              FACTORY DOCTRINE
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: '#D4D4D8',
                lineHeight: 1.5,
              }}
            >
              Every engineering milestone forged under race conditions flows directly into our serial production line in Mattighofen.
            </Typography>
          </Box>
        </Box>

        {/* Right Milestones Stream */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 6 } }}>
          {MILESTONES.map((m) => (
            <Box
              key={m.era}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: '6px',
                backgroundColor: '#0F0F14',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'border-color 0.25s ease',
                '&:hover': {
                  borderColor: 'rgba(255, 103, 0, 0.4)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#FF6700',
                  }}
                >
                  {m.era}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.12em',
                    color: '#71717A',
                    px: 1,
                    py: 0.3,
                    borderRadius: '2px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {m.badge}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  color: '#F4F4F5',
                  mb: 1.5,
                }}
              >
                {m.title}
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  color: '#A1A1AA',
                  mb: 3,
                }}
              >
                {m.summary}
              </Typography>

              <Box
                sx={{
                  width: '100%',
                  height: '200px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <Box
                  component="img"
                  src={m.image}
                  alt={m.title}
                  loading="lazy"
                  decoding="async"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(0.6) contrast(1.1) brightness(0.9)',
                    transition: 'filter 0.4s ease, transform 0.4s ease',
                    '&:hover': {
                      filter: 'grayscale(0) contrast(1.08) brightness(1)',
                      transform: 'scale(1.02)',
                    },
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default KtmPedigreeHeritage;
