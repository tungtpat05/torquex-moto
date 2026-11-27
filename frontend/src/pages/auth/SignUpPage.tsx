import { useState } from "react";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Link,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { register as registerAccount } from "../../services/authService";
import { useAuth } from "../../context";
import { ApiErrorResponse } from "../../types/apiError";
import { applyServerValidationErrors } from "../../schemas/common";
import { signUpSchema, SignUpFormValues } from "../../schemas/authSchema";
import { getDefaultLandingPath } from "../../utils/role";
import { TorqueXKtmLockup } from "@/components/common/BrandMark";

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

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  const {
    control,
    handleSubmit,
    setError: setFieldError,
    formState: { isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setError(null);

    try {
      const response = await registerAccount(values.email, values.password, values.fullName);
      loginSuccess(response.user);
      navigate(getDefaultLandingPath(response.user?.role, "/"), { replace: true });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: ApiErrorResponse | string }; message?: string };
      const apiErrorData = axiosErr?.response?.data;
      const status = axiosErr?.response?.status;

      if (apiErrorData && typeof apiErrorData === "object") {
        const { message: apiMsg, details } = apiErrorData;

        applyServerValidationErrors(details, setFieldError);

        if (status === 409) {
          const dupMsg = details?.email || apiMsg || "This email address is already registered.";
          setFieldError("email", { type: "server", message: dupMsg });
          setError("Registration failed: This email is already in use.");
        } else if (status === 400) {
          setError(apiMsg || "Invalid registration information.");
        } else {
          setError(apiMsg || "Registration failed. Please try again.");
        }
      } else {
        setError(axiosErr?.message || "Registration failed. Please try again.");
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
              Create Account
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

          <Stack spacing={3} component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="fullName"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label="Full Name"
                  autoComplete="name"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message || "Must be between 2 and 100 characters"}
                  FormHelperTextProps={{
                    sx: {
                      color: fieldState.error ? "#F87171" : "#A1A1AA",
                      fontSize: "0.75rem",
                      mt: 0.5,
                    },
                  }}
                  disabled={isSubmitting}
                  sx={fieldSx}
                />
              )}
            />
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
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message || "Must be a valid email (e.g. user@example.com)"}
                  FormHelperTextProps={{
                    sx: {
                      color: fieldState.error ? "#F87171" : "#A1A1AA",
                      fontSize: "0.75rem",
                      mt: 0.5,
                    },
                  }}
                  disabled={isSubmitting}
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
                  autoComplete="new-password"
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message || "Must be at least 6 characters"}
                  FormHelperTextProps={{
                    sx: {
                      color: fieldState.error ? "#F87171" : "#A1A1AA",
                      fontSize: "0.75rem",
                      mt: 0.5,
                    },
                  }}
                  disabled={isSubmitting}
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
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </Stack>

          {/* Footer Actions */}
          <Stack spacing={2} sx={{ mt: 4 }}>
            <Typography variant="body2" align="center" sx={{ color: "#A1A1AA" }}>
              Already have an account?{" "}
              <Link
                component={RouterLink}
                to="/login"
                underline="hover"
                sx={{ color: "#FF6700", fontWeight: 700 }}
              >
                Sign In
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

export default SignUpPage;
