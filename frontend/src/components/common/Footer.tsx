import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
  Stack,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";

const Footer = () => {
  const { products, loading, error } = useProducts();
  const activeModels = products.filter((p) => p.isActive !== false);

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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "1.4rem",
                  letterSpacing: "-0.03em",
                  color: "#F4F4F5",
                }}
              >
                TORQUEX
              </Typography>
              <Box
                sx={{
                  backgroundColor: "#FF6700",
                  color: "#070709",
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  px: 0.8,
                  py: 0.2,
                  borderRadius: "2px",
                }}
              >
                KTM
              </Box>
            </Box>

            <Typography
              sx={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.68rem",
                color: "#FF6700",
                letterSpacing: "0.14em",
                mb: 2,
              }}
            >
              EXCLUSIVE DIGITAL BOUTIQUE // MATTIGHOFEN, AUSTRIA
            </Typography>

            <Typography
              sx={{
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                color: "#71717A",
                lineHeight: 1.6,
                maxWidth: 360,
              }}
            >
              Curated official factory showcase for high-performance KTM weapons. Built with uncompromising READY TO RACE telemetry.
            </Typography>
          </Grid>

          {/* Quick Links Column 1: Live Factory Fleet from DB */}
          <Grid size={{ xs: 6, sm: 4, md: 2.5 }}>
            <Typography
              sx={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#F4F4F5",
                mb: 2.5,
              }}
            >
              FACTORY FLEET
            </Typography>
            <Stack spacing={1.2}>
              {loading && (
                <Typography sx={{ color: "#71717A", fontSize: "0.8rem" }}>
                  Loading lineup...
                </Typography>
              )}
              {!loading && error && (
                <Typography sx={{ color: "#ef4444", fontSize: "0.8rem" }}>
                  Unable to load models
                </Typography>
              )}
              {!loading && !error && activeModels.length === 0 && (
                <Typography sx={{ color: "#71717A", fontSize: "0.8rem" }}>
                  No active models
                </Typography>
              )}
              {!loading &&
                !error &&
                activeModels.map((bike) => (
                  <MuiLink
                    key={bike.id}
                    component={RouterLink}
                    to={`/products/${bike.id}`}
                    sx={{
                      color: "#A1A1AA",
                      fontSize: "0.82rem",
                      textDecoration: "none",
                      "&:hover": { color: "#FF6700" },
                    }}
                  >
                    {bike.productName}
                  </MuiLink>
                ))}
            </Stack>
          </Grid>

          {/* Quick Links Column 2: Paddock */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              sx={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#F4F4F5",
                mb: 2.5,
              }}
            >
              PADDOCK & STORY
            </Typography>
            <Stack spacing={1.2}>
              <MuiLink component={RouterLink} to="/#anatomy" sx={{ color: "#A1A1AA", fontSize: "0.82rem", textDecoration: "none", "&:hover": { color: "#FF6700" } }}>
                The Anatomy of Fury
              </MuiLink>
              <MuiLink component={RouterLink} to="/#action" sx={{ color: "#A1A1AA", fontSize: "0.82rem", textDecoration: "none", "&:hover": { color: "#FF6700" } }}>
                The Apex Surge
              </MuiLink>
              <MuiLink component={RouterLink} to="/#heritage" sx={{ color: "#A1A1AA", fontSize: "0.82rem", textDecoration: "none", "&:hover": { color: "#FF6700" } }}>
                18x Dakar Pedigree
              </MuiLink>
              <MuiLink component={RouterLink} to="/#handover" sx={{ color: "#A1A1AA", fontSize: "0.82rem", textDecoration: "none", "&:hover": { color: "#FF6700" } }}>
                VIN Crate Handover
              </MuiLink>
              <MuiLink component={RouterLink} to="/#fleet" sx={{ color: "#A1A1AA", fontSize: "0.82rem", textDecoration: "none", "&:hover": { color: "#FF6700" } }}>
                All Specifications
              </MuiLink>
            </Stack>
          </Grid>

          {/* Quick Links Column 3: VIP Concierge */}
          <Grid size={{ xs: 6, sm: 4, md: 1.5 }}>
            <Typography
              sx={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#F4F4F5",
                mb: 2.5,
              }}
            >
              VIP CONCIERGE
            </Typography>
            <Stack spacing={1.2}>
              <MuiLink component={RouterLink} to="/cart" sx={{ color: "#A1A1AA", fontSize: "0.82rem", textDecoration: "none", "&:hover": { color: "#FF6700" } }}>
                Allocation Cart
              </MuiLink>
              <MuiLink component={RouterLink} to="/profile" sx={{ color: "#A1A1AA", fontSize: "0.82rem", textDecoration: "none", "&:hover": { color: "#FF6700" } }}>
                Rider Account
              </MuiLink>
            </Stack>
          </Grid>

          {/* Quick Links Column 4: Factory Legal */}
          <Grid size={{ xs: 6, sm: 4, md: 2 }}>
            <Typography
              sx={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "#F4F4F5",
                mb: 2.5,
              }}
            >
              LEGAL & WARRANTY
            </Typography>
            <Stack spacing={1.2}>
              <Typography sx={{ color: "#71717A", fontSize: "0.8rem" }}>
                3-Year Factory Warranty
              </Typography>
              <Typography sx={{ color: "#71717A", fontSize: "0.8rem" }}>
                EU Homologation
              </Typography>
              <Typography sx={{ color: "#71717A", fontSize: "0.8rem" }}>
                Privacy & Data Security
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 5, borderColor: "rgba(255, 255, 255, 0.08)" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Typography sx={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#71717A" }}>
            © {new Date().getFullYear()} TORQUEX MOTO. OFFICIAL KTM FACTORY PARTNER. ALL RIGHTS RESERVED.
          </Typography>

          <Typography sx={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#FF6700", letterSpacing: "0.1em" }}>
            READY TO RACE // MATTIGHOFEN, AUSTRIA
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
