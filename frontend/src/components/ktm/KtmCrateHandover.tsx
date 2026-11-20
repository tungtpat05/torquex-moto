import React, { useState } from 'react';
import { Box, Typography, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

export const KtmCrateHandover: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [allocationStep, setAllocationStep] = useState<'qr' | 'success'>('qr');

  const handleOpenModal = () => {
    setAllocationStep('qr');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Box
      id="handover"
      component="section"
      sx={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#070709',
        py: { xs: 12, md: 20 },
        px: { xs: 3, md: 6, lg: 10 },
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Dramatic Overhead Spotlight Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '600px',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 103, 0, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ maxWidth: '1280px', mx: 'auto', position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
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
              ACT V // THE PADDOCK HANDOVER & VIN ALLOCATION
            </Typography>
            <Box sx={{ width: 12, height: 2, backgroundColor: '#FF6700' }} />
          </Box>

          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: { xs: '2.4rem', sm: '3.8rem', md: '5rem' },
              letterSpacing: '-0.04em',
              lineHeight: 0.98,
              color: '#F4F4F5',
              textTransform: 'uppercase',
              mb: 2.5,
            }}
          >
            YOUR BEAST AWAITS.
            <br />
            <span style={{ color: '#FF6700' }}>DIRECT FROM MATTIGHOFEN.</span>
          </Typography>

          <Typography
            sx={{
              fontFamily: 'var(--font-body)',
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              color: '#A1A1AA',
              maxWidth: '680px',
              mx: 'auto',
              lineHeight: 1.7,
            }}
          >
            Every machine arrives sealed in an authentic wooden export freight crate from the Austrian factory. Reserve your allocation slot with a refundable 10% deposit.
          </Typography>
        </Box>

        {/* 2-Column Split: Wooden Crate Visual + VIP Reservation Terminal */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: { xs: 6, lg: 8 },
            alignItems: 'center',
          }}
        >
          {/* Left: Authentic Factory Wooden Crate Frame */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: '6px',
              overflow: 'hidden',
              backgroundColor: '#0F0F14',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9)',
              height: { xs: '360px', sm: '460px', lg: '540px' },
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1600&q=85"
              alt="Mattighofen Factory Crate"
              loading="lazy"
              decoding="async"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.1) brightness(0.85)',
              }}
            />

            {/* Crate Stencil & Factory Stamp Graphic Overlay */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(7, 7, 9, 0.92) 0%, rgba(7, 7, 9, 0.3) 50%, rgba(7, 7, 9, 0.8) 100%)',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.6,
                    borderRadius: '2px',
                    border: '1px solid #FF6700',
                    backgroundColor: 'rgba(255, 103, 0, 0.15)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 700, color: '#FF6700' }}>
                    EXPORT SEAL: VBKM-2026-AUT
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#71717A' }}>
                  MATTIGHOFEN PADDOCK VAULT
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.14em',
                    color: '#FF6700',
                    mb: 0.5,
                  }}
                >
                  VIN ALLOCATION STATUS
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: { xs: '1.4rem', sm: '1.8rem' },
                    color: '#F4F4F5',
                    letterSpacing: '-0.02em',
                  }}
                >
                  KTM 1290 SUPER DUKE R EVO
                </Typography>
                <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#A1A1AA', mt: 0.5 }}>
                  CHASSIS NUMBER: #VBK-LC8-0921-2026
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right: VIP Reservation Terminal & Pricing Breakdown */}
          <Box
            sx={{
              p: { xs: 3.5, sm: 5 },
              borderRadius: '6px',
              backgroundColor: '#0F0F14',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* 3 VIP Privileges */}
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                letterSpacing: '0.14em',
                color: '#FF6700',
                mb: 2,
              }}
            >
              VIP HANDOVER PRIVILEGES
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 4 }}>
              {[
                {
                  icon: <LocalShippingOutlinedIcon sx={{ color: '#FF6700', fontSize: '1.4rem' }} />,
                  title: 'PRIVATE UNCRATING CEREMONY',
                  desc: 'Direct factory shipment from Mattighofen. Experience the opening of your sealed crate in our private paddock bay.',
                },
                {
                  icon: <ConstructionOutlinedIcon sx={{ color: '#FF6700', fontSize: '1.4rem' }} />,
                  title: 'WP SUSPENSION TELEMETRY TUNING',
                  desc: 'Factory certified suspension technicians dial in preload and damping curves tailored specifically to your body weight.',
                },
                {
                  icon: <VerifiedUserOutlinedIcon sx={{ color: '#FF6700', fontSize: '1.4rem' }} />,
                  title: '3-YEAR FACTORY WARRANTY & PIT ACCESS',
                  desc: 'Full factory warranty coverage, including VIP pit-lane access to KTM trackday sessions across Southeast Asia.',
                },
              ].map((item) => (
                <Box key={item.title} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ mt: 0.3 }}>{item.icon}</Box>
                  <Box>
                    <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.88rem', color: '#F4F4F5', mb: 0.3 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: '#A1A1AA', lineHeight: 1.5 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Financial Ledger (10% Deposit Matrix) */}
            <Box
              sx={{
                p: 3,
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                mb: 4,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#71717A' }}>
                  Total Vehicle MSRP
                </Typography>
                <Typography className="tabular-nums" sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#D4D4D8' }}>
                  $19,799 (~502,000,000 VND)
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#FF6700', fontWeight: 700 }}>
                  10% Deposit to Lock VIN (PayOS)
                </Typography>
                <Typography className="tabular-nums" sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 800, color: '#FF6700' }}>
                  $1,979 (~50,200,000 VND)
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1.5, borderTop: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#71717A' }}>
                  90% Balance Due Upon Paddock Handover
                </Typography>
                <Typography className="tabular-nums" sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#A1A1AA' }}>
                  $17,820 (~451,800,000 VND)
                </Typography>
              </Box>
            </Box>

            {/* Action CTA: Lock Allocation */}
            <Box
              onClick={handleOpenModal}
              sx={{
                backgroundColor: '#FF6700',
                color: '#070709',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '0.88rem',
                letterSpacing: '0.08em',
                py: 1.8,
                borderRadius: '2px',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 0 35px rgba(255, 103, 0, 0.4)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                userSelect: 'none',
                '&:hover': {
                  backgroundColor: '#FFA040',
                  boxShadow: '0 0 50px rgba(255, 103, 0, 0.7)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              LOCK ALLOCATION WITH PAYOS VIETQR
            </Box>
          </Box>
        </Box>
      </Box>

      {/* PayOS VietQR Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          backdropFilter: 'blur(16px)',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 480,
            backgroundColor: '#0F0F14',
            border: '1px solid rgba(255, 103, 0, 0.3)',
            borderRadius: '6px',
            p: 4,
            boxShadow: '0 30px 90px rgba(0, 0, 0, 0.95)',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: 'absolute', top: 16, right: 16, color: '#A1A1AA' }}
          >
            <CloseIcon />
          </IconButton>

          {allocationStep === 'qr' ? (
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <QrCode2Icon sx={{ color: '#FF6700', fontSize: '1.5rem' }} />
                <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#FF6700', fontWeight: 700 }}>
                  PAYOS VIETQR GATEWAY
                </Typography>
              </Box>

              <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.4rem', color: '#F4F4F5', mb: 1 }}>
                KTM 1290 SUPER DUKE R EVO
              </Typography>
              <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#71717A', mb: 3 }}>
                DEPOSIT AMOUNT: 50,200,000 VND ($1,979 USD)
              </Typography>

              {/* Realistic QR Code Box */}
              <Box
                sx={{
                  width: '220px',
                  height: '220px',
                  mx: 'auto',
                  p: 2,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <Box
                  component="img"
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYOS-TORQUEX-KTM-1290-ALLOCATION-50200000VND"
                  alt="PayOS VietQR Code"
                  sx={{ width: '100%', height: '100%' }}
                />
              </Box>

              <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#A1A1AA', mb: 3 }}>
                Scan using any banking app supporting VietQR (Vietcombank, Techcombank, MB, ACB, etc.).
              </Typography>

              <Box
                onClick={() => setAllocationStep('success')}
                sx={{
                  backgroundColor: '#FF6700',
                  color: '#070709',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  py: 1.4,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#FFA040' },
                }}
              >
                SIMULATE CONFIRMATION
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleOutlineIcon sx={{ color: '#10B981', fontSize: '3.5rem', mb: 2 }} />
              <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.6rem', color: '#F4F4F5', mb: 1 }}>
                ALLOCATION VIN LOCKED
              </Typography>
              <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#10B981', mb: 2 }}>
                CHASSIS #VBK-LC8-0921-2026 CONFIRMED
              </Typography>
              <Typography sx={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: '#A1A1AA', lineHeight: 1.6, mb: 4 }}>
                Your 10% allocation deposit has been verified via PayOS. A TorqueX Paddock Concierge will reach out within 2 hours to confirm your private uncrating schedule.
              </Typography>

              <Box
                onClick={handleCloseModal}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#F4F4F5',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  py: 1.4,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.15)' },
                }}
              >
                RETURN TO PADDOCK
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default KtmCrateHandover;
