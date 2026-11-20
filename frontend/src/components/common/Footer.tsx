import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  Divider,
} from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#070709",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        pt: { xs: 8, md: 10 },
        pb: { xs: 5, md: 7 },
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 3, md: 6, lg: 10 } }}>
        <Grid container spacing={{ xs: 5, md: 8 }}>
          {/* Brand & Manifesto Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '1.4rem',
                  letterSpacing: '-0.03em',
                  color: '#F4F4F5',
                }}
              >
                TORQUEX
              </Typography>
              <Box
                sx={{
                  backgroundColor: '#FF6700',
                  color: '#070709',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  px: 0.8,
                  py: 0.2,
                  borderRadius: '2px',
                }}
              >
                KTM
              </Box>
            </Box>

            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: '#FF6700',
                letterSpacing: '0.14em',
                mb: 2,
              }}
            >
              EXCLUSIVE DIGITAL BOUTIQUE // MATTIGHOFEN, AUSTRIA
            </Typography>

            <Typography
              sx={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: '#71717A',
                lineHeight: 1.6,
                maxWidth: 360,
              }}
            >
              Curated official factory showcase for high-performance KTM weapons. Built with uncompromising READY TO RACE telemetry.
            </Typography>
          </Grid>

          {/* Quick Links Column 1: Fleet */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#F4F4F5',
                mb: 2.5,
              }}
            >
              FACTORY FLEET
            </Typography>
            <Stack spacing={1.2}>
              <Link href="/products/53" sx={{ color: '#A1A1AA', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#FF6700' } }}>
                1290 Super Duke R Evo
              </Link>
              <Link href="/products/54" sx={{ color: '#A1A1AA', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#FF6700' } }}>
                990 Duke
              </Link>
              <Link href="/products/56" sx={{ color: '#A1A1AA', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#FF6700' } }}>
                390 Duke
              </Link>
              <Link href="/products/49" sx={{ color: '#A1A1AA', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#FF6700' } }}>
                RC 8C Track Prototype
              </Link>
              <Link href="/products/57" sx={{ color: '#A1A1AA', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#FF6700' } }}>
                1290 Super Adventure R
              </Link>
              <Link href="/products/61" sx={{ color: '#A1A1AA', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#FF6700' } }}>
                690 SMC R
              </Link>
            </Stack>
          </Grid>

          {/* Quick Links Column 2: Paddock */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#F4F4F5',
                mb: 2.5,
              }}
            >
              PADDOCK & STORY
            </Typography>
            <Stack spacing={1.2}>
              <Link href="/#anatomy" sx={{ color: '#A1A1AA', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#FF6700' } }}>
                The Anatomy of Fury
              </Link>
              <Link href="/#action" sx={{ color: '#A1A1AA', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#FF6700' } }}>
                The Apex Surge
              </Link>
              <Link href="/#heritage" sx={{ color: '#A1A1AA', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#FF6700' } }}>
                18x Dakar Pedigree
              </Link>
              <Link href="/#handover" sx={{ color: '#A1A1AA', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#FF6700' } }}>
                VIN Crate Handover
              </Link>
              <Link href="/products" sx={{ color: '#A1A1AA', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#FF6700' } }}>
                All Specifications
              </Link>
            </Stack>
          </Grid>

          {/* Quick Links Column 3: VIP Concierge */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#F4F4F5',
                mb: 2.5,
              }}
            >
              VIP CONCIERGE
            </Typography>
            <Stack spacing={1.2}>
              <Link href="/cart" sx={{ color: '#A1A1AA', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#FF6700' } }}>
                Allocation Cart
              </Link>
              <Link href="/order" sx={{ color: '#A1A1AA', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#FF6700' } }}>
                Order Tracking
              </Link>
              <Link href="/profile" sx={{ color: '#A1A1AA', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#FF6700' } }}>
                Rider Account
              </Link>
              <Link href="/support" sx={{ color: '#A1A1AA', fontSize: '0.82rem', textDecoration: 'none', '&:hover': { color: '#FF6700' } }}>
                Paddock Support
              </Link>
            </Stack>
          </Grid>

          {/* Quick Links Column 4: Factory Legal */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#F4F4F5',
                mb: 2.5,
              }}
            >
              LEGAL & WARRANTY
            </Typography>
            <Stack spacing={1.2}>
              <Typography sx={{ color: '#71717A', fontSize: '0.8rem' }}>
                3-Year Factory Warranty
              </Typography>
              <Typography sx={{ color: '#71717A', fontSize: '0.8rem' }}>
                PayOS Escrow Policy
              </Typography>
              <Typography sx={{ color: '#71717A', fontSize: '0.8rem' }}>
                EU Homologation
              </Typography>
              <Typography sx={{ color: '#71717A', fontSize: '0.8rem' }}>
                Privacy & Data Security
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 5, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#71717A' }}>
            © {new Date().getFullYear()} TORQUEX MOTO. OFFICIAL KTM FACTORY PARTNER. ALL RIGHTS RESERVED.
          </Typography>

          <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#FF6700', letterSpacing: '0.1em' }}>
            READY TO RACE // MATTIGHOFEN, AUSTRIA
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
