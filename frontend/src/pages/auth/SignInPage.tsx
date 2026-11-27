import { useState } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Stack,
  Link,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginWithEmail } from "../../services/authService";
import { useAuth } from "../../context";
import { signInSchema, SignInFormValues } from "../../schemas/authSchema";
import { getDefaultLandingPath } from "../../utils/role";
import { TorqueXKtmLockup } from "@/components/common/BrandMark";

const handleGoogleLogin = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
  window.location.href = `${backendUrl}/oauth2/authorization/google`;
};

const fieldSx = {
  "& label": { color: "#A1A1AA", fontWeight: 500 },
  "& label.Mui-focused:not(.Mui-error)": { color: "#FF6700" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#16161D",
    color: "#F4F4F5",
    borderRadius: "8px",
    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.14)" },
    "&:not(.Mui-error):hover fieldset": { borderColor: "#FF6700" },
    "&:not(.Mui-error).Mui-focused fieldset": { borderColor: "#FF6700" },
  },
};

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginSuccess } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignInFormValues) => {
    setError(null);

    try {
      const response = await loginWithEmail(values.email, values.password);
      loginSuccess(response.user);

      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/";
      navigate(getDefaultLandingPath(response.user?.role, from), { replace: true });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } | string }; message?: string };
      const status = axiosErr?.response?.status;
      const rawData = axiosErr?.response?.data;
      const serverMessage =
        typeof rawData === "object" && rawData !== null
          ? rawData.message
          : typeof rawData === "string"
            ? rawData
            : null;

      if (status === 401 || status === 403 || status === 400) {
        setError(serverMessage || "Incorrect email or password. Please try again.");
      } else if (status === 404) {
        setError("Login API not found (404 Not Found). Please check the server.");
      } else {
        setError(serverMessage || axiosErr?.message || "Login failed. Please check your connection.");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#070709",
        backgroundImage: "radial-gradient(ellipse at top, rgba(255, 103, 0, 0.14), transparent 65%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: "16px",
            backgroundColor: "rgba(15, 15, 20, 0.90)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.10)",
            borderTop: "1px solid rgba(255, 255, 255, 0.25)",
            boxShadow: "0 24px 60px rgba(0, 0, 0, 0.80)",
            color: "#F4F4F5",
          }}
        >
          {/* Header with Logo */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", mb: 4 }}>
            <Box sx={{ mb: 2 }}>
              <TorqueXKtmLockup
                markSize={34}
                textSize={{ xs: "1.45rem", sm: "1.65rem" }}
                badgeText="KTM"
              />
            </Box>

            <Typography
              component="h1"
              sx={{
                fontFamily: "var(--font-display)",
                fontWeight: 950,
                fontSize: { xs: "1.65rem", sm: "2rem" },
                letterSpacing: "-0.025em",
                color: "#FFFFFF",
                textTransform: "uppercase",
              }}
            >
              Sign In
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                backgroundColor: "rgba(153, 27, 27, 0.25)",
                color: "#FCA5A5",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                borderRadius: "8px",
              }}
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <Stack spacing={3} component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  FormHelperTextProps={{
                    sx: { color: "#F87171", fontSize: "0.75rem", mt: 0.5 },
                  }}
                  sx={fieldSx}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  FormHelperTextProps={{
                    sx: { color: "#F87171", fontSize: "0.75rem", mt: 0.5 },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword((show) => !show)}
                          edge="end"
                          sx={{ color: "#A1A1AA", "&:hover": { color: "#FF6700" } }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={fieldSx}
                />
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{
                py: 1.55,
                backgroundColor: "#FF6700",
                color: "#070709",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.95rem",
                letterSpacing: "0.06em",
                borderRadius: "8px",
                textTransform: "uppercase",
                boxShadow: "0 0 24px rgba(255, 103, 0, 0.35)",
                "&:hover": {
                  backgroundColor: "#FF7D24",
                  boxShadow: "0 0 32px rgba(255, 103, 0, 0.55)",
                },
                "&.Mui-disabled": {
                  backgroundColor: "rgba(255, 103, 0, 0.45)",
                  color: "#070709",
                },
              }}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Button>

            <Divider
              sx={{
                borderColor: "rgba(255, 255, 255, 0.10)",
                color: "#71717A",
                fontFamily: "var(--font-mono)",
                fontSize: "0.70rem",
                letterSpacing: "0.1em",
              }}
            >
              OR CONTINUE WITH
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon sx={{ color: "#EA4335" }} />}
              onClick={() => handleGoogleLogin()}
              disabled={isSubmitting}
              sx={{
                py: 1.35,
                borderColor: "rgba(255, 255, 255, 0.16)",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                color: "#F4F4F5",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#FF6700",
                  backgroundColor: "rgba(255, 103, 0, 0.08)",
                },
              }}
            >
              Sign In With Google
            </Button>
          </Stack>

          {/* Footer Actions */}
          <Stack spacing={2} sx={{ mt: 4 }}>
            <Typography variant="body2" align="center" sx={{ color: "#A1A1AA" }}>
              Don&apos;t have an account?{" "}
              <Link
                component={RouterLink}
                to="/register"
                underline="hover"
                sx={{ color: "#FF6700", fontWeight: 700 }}
              >
                Sign Up
              </Link>
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                startIcon={<ArrowBackIcon sx={{ fontSize: "0.95rem" }} />}
                component={RouterLink}
                to="/"
                variant="text"
                size="small"
                sx={{
                  color: "#A1A1AA",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  "&:hover": { color: "#FF6700", backgroundColor: "rgba(255, 103, 0, 0.06)" },
                }}
              >
                Back to Showroom
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignInPage;
