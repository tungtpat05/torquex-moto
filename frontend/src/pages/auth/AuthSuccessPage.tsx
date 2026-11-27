import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Paper,
  Container,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useAuth } from "../../context";
import { getDefaultLandingPath } from "../../utils/role";
import { TorqueXKtmLockup } from "@/components/common/BrandMark";

const AuthSuccessPage = () => {
  const navigate = useNavigate();
  const { isLogin, user, loading, refetchUser } = useAuth();

  useEffect(() => {
    // Authenticate session from HttpOnly cookie set by OAuth2 redirect
    refetchUser();
  }, [refetchUser]);

  useEffect(() => {
    if (!loading && isLogin && user) {
      const timer = setTimeout(() => {
        navigate(getDefaultLandingPath(user.role, "/"), { replace: true });
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [loading, isLogin, user, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#070709",
        backgroundImage: "radial-gradient(ellipse at top, rgba(255, 103, 0, 0.14), transparent 65%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#F4F4F5",
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: "16px",
            backgroundColor: "rgba(15, 15, 20, 0.90)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            borderTop: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.80)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ mb: 1 }}>
            <TorqueXKtmLockup markSize={28} textSize="1.2rem" badgeText="KTM" />
          </Box>

          {loading && (
            <>
              <CircularProgress size={44} thickness={4} sx={{ my: 1, color: "#FF6700" }} />
              <Typography
                component="h1"
                sx={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "1.3rem",
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                }}
              >
                Authenticating...
              </Typography>
              <Typography sx={{ color: "#A1A1AA", fontSize: "0.9rem" }}>
                Securing your session with TORQUEX KTM.
              </Typography>
            </>
          )}

          {!loading && !isLogin && (
            <>
              <ErrorOutlineIcon sx={{ fontSize: 56, color: "#EF4444", mb: 0.5 }} />
              <Typography
                component="h1"
                sx={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "1.3rem",
                  color: "#EF4444",
                  textTransform: "uppercase",
                }}
              >
                Authentication Failed
              </Typography>
              <Typography sx={{ color: "#A1A1AA", fontSize: "0.9rem", mb: 1.5 }}>
                An error occurred during the login process. Please try again.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate("/login")}
                sx={{
                  borderRadius: "8px",
                  py: 1.3,
                  backgroundColor: "#FF6700",
                  color: "#070709",
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  "&:hover": { backgroundColor: "#FF7D24" },
                }}
              >
                Back to Sign In
              </Button>
            </>
          )}

          {!loading && isLogin && user && (
            <>
              <CheckCircleOutlineIcon sx={{ fontSize: 56, color: "#10B981", mb: 0.5 }} />
              <Typography
                component="h1"
                sx={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: "1.3rem",
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                }}
              >
                Welcome back, {user.fullName}!
              </Typography>
              <Typography
                sx={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.74rem",
                  letterSpacing: "0.08em",
                  color: "#FF6700",
                  textTransform: "uppercase",
                }}
              >
                Redirecting to showroom...
              </Typography>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthSuccessPage;
