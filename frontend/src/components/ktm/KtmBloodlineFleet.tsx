import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getLenis } from '../../lib/smoothScroll';

import sdr1390RightImg from '@/assets/images/ktm/models/1390_sdr_90_right.png';
import duke990Img from '@/assets/images/ktm/models/990_duke_90_right.png';
import duke390Img from '@/assets/images/ktm/models/390_duke_90_right.png';
import rc8cImg from '@/assets/images/ktm/models/rc_8c_studio.png';
import adv1290Img from '@/assets/images/ktm/models/1290_adv_90_right.png';
import smc690Img from '@/assets/images/ktm/models/690_smc_90_right.png';

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

export const KTM_FLEET: KtmVehicle[] = [
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

export const KtmBloodlineFleet: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const navigate = useNavigate();

  const filteredVehicles = activeFilter === 'ALL'
    ? KTM_FLEET
    : KTM_FLEET.filter((v) => v.category === activeFilter);

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
      id="fleet"
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
      <Box sx={{ maxWidth: '1280px', mx: 'auto' }}>
        {/* Section Header */}
        <Box sx={{ display: 'flex', flexDirection: 'column', mb: { xs: 6, md: 8 } }}>
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
              ACT IV // THE BLOODLINE FLEET
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 3 }}>
            <Typography
              component="h2"
              sx={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: { xs: '2.4rem', sm: '3.6rem', md: '4.4rem' },
                letterSpacing: '-0.035em',
                lineHeight: 1,
                color: '#F4F4F5',
                textTransform: 'uppercase',
              }}
            >
              6 WEAPONS. 4 DISCIPLINES. ZERO COMPROMISE.
            </Typography>

            {/* Filter Pills */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(['ALL', 'NAKED', 'SUPERSPORT', 'TRAVEL & SMC'] as FilterCategory[]).map((cat) => (
                <Box
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  sx={{
                    px: 2,
                    py: 0.8,
                    borderRadius: '2px',
                    cursor: 'pointer',
                    backgroundColor: activeFilter === cat ? '#FF6700' : 'rgba(255, 255, 255, 0.04)',
                    color: activeFilter === cat ? '#070709' : '#A1A1AA',
                    border: activeFilter === cat ? '1px solid #FF6700' : '1px solid rgba(255, 255, 255, 0.08)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    transition: 'all 0.2s ease',
                    userSelect: 'none',
                    '&:hover': {
                      borderColor: '#FF6700',
                      color: activeFilter === cat ? '#070709' : '#FFFFFF',
                    },
                  }}
                >
                  {cat === 'ALL' ? 'ALL WEAPONS (6)' : cat}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* 6 Vehicle Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 4,
          }}
        >
          {filteredVehicles.map((bike) => (
            <Box
              key={bike.id}
              sx={{
                position: 'relative',
                borderRadius: '6px',
                overflow: 'hidden',
                backgroundColor: '#0F0F14',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
                '&:hover': {
                  borderColor: 'rgba(255, 103, 0, 0.5)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              {/* Vehicle Studio Image Frame */}
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '230px',
                  overflow: 'hidden',
                  backgroundColor: '#070709',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  component="img"
                  src={bike.image}
                  alt={bike.name}
                  loading="lazy"
                  decoding="async"
                  sx={{
                    width: bike.isTransparent ? '88%' : '100%',
                    height: bike.isTransparent ? '88%' : '100%',
                    objectFit: bike.isTransparent ? 'contain' : 'cover',
                    objectPosition: 'center',
                    filter: bike.isTransparent
                      ? 'drop-shadow(0 0 16px rgba(255,103,0,0.35))'
                      : 'contrast(1.06) brightness(0.95)',
                    transition: 'transform 0.4s ease',
                    '&:hover': {
                      transform: 'scale(1.04)',
                    },
                  }}
                />

                {/* Badge if present */}
                {bike.badge && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      px: 1.2,
                      py: 0.4,
                      borderRadius: '2px',
                      backgroundColor: '#FF6700',
                      color: '#070709',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                    }}
                  >
                    {bike.badge}
                  </Box>
                )}

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    left: 12,
                    px: 1,
                    py: 0.3,
                    borderRadius: '2px',
                    backgroundColor: 'rgba(7, 7, 9, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#A1A1AA' }}>
                    {bike.category}
                  </Typography>
                </Box>
              </Box>

              {/* Card Body */}
              <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    letterSpacing: '0.12em',
                    color: '#FF6700',
                    mb: 0.8,
                  }}
                >
                  {bike.tagline}
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.35rem',
                    color: '#F4F4F5',
                    mb: 2.5,
                  }}
                >
                  {bike.name}
                </Typography>

                {/* Technical Specifications Matrix */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 1.5,
                    p: 2,
                    borderRadius: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 600, color: '#D4D4D8', letterSpacing: '0.08em' }}>
                      POWER
                    </Typography>
                    <Typography className="tabular-nums" sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>
                      {bike.powerHp} <span style={{ fontSize: '0.68rem', color: '#FF6700', fontWeight: 800 }}>HP</span>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 600, color: '#D4D4D8', letterSpacing: '0.08em' }}>
                      TORQUE
                    </Typography>
                    <Typography className="tabular-nums" sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>
                      {bike.torqueNm} <span style={{ fontSize: '0.68rem', color: '#FF6700', fontWeight: 800 }}>NM</span>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 600, color: '#D4D4D8', letterSpacing: '0.08em' }}>
                      DRY WT
                    </Typography>
                    <Typography className="tabular-nums" sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.98rem', fontWeight: 700, color: '#FFFFFF' }}>
                      {bike.dryWeightKg} <span style={{ fontSize: '0.68rem', color: '#FF6700', fontWeight: 800 }}>KG</span>
                    </Typography>
                  </Box>
                </Box>

                {/* MSRP & Action Buttons */}
                <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
                    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 600, color: '#D4D4D8', letterSpacing: '0.08em' }}>
                      STARTING MSRP
                    </Typography>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography className="tabular-nums" sx={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>
                        ${bike.msrpUsd.toLocaleString()}
                      </Typography>
                      <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#A1A1AA' }}>
                        {bike.msrpVnd}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                    <Box
                      onClick={() => navigate(`/products/${bike.id}`)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.6,
                        py: 1.1,
                        borderRadius: '2px',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        color: '#D4D4D8',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#FF6700',
                          color: '#FF6700',
                        },
                      }}
                    >
                      <span>DETAILS</span>
                      <ArrowForwardIcon sx={{ fontSize: '0.8rem' }} />
                    </Box>

                    <Box
                      onClick={() => handleScrollToSection('#handover')}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 1.1,
                        borderRadius: '2px',
                        backgroundColor: '#FF6700',
                        color: '#070709',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        letterSpacing: '0.08em',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#FFA040',
                        },
                      }}
                    >
                      RESERVE
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default KtmBloodlineFleet;
