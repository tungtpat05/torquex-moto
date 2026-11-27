import { useState } from 'react';
import {
    Container, Box, Paper, Typography, TextField,
    Button, Divider, Stack, Link, Alert, IconButton, InputAdornment
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import HomeIcon from '@mui/icons-material/Home';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginWithEmail } from '../../services/authService';
import { useAuth } from '../../context';
import { signInSchema, SignInFormValues } from '../../schemas/authSchema';
import { getDefaultLandingPath } from '../../utils/role';
import logo from '@/assets/images/common/logo.png';

const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    window.location.href = `${backendUrl}/oauth2/authorization/google`;
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
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: SignInFormValues) => {
        setError(null);

        try {
            const response = await loginWithEmail(values.email, values.password);
            loginSuccess(response.user);

            const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/';
            navigate(getDefaultLandingPath(response.user?.role, from), { replace: true });
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number; data?: { message?: string } | string }; message?: string };
            const status = axiosErr?.response?.status;
            const rawData = axiosErr?.response?.data;
            const serverMessage =
                typeof rawData === 'object' && rawData !== null
                    ? rawData.message
                    : typeof rawData === 'string'
                        ? rawData
                        : null;

            if (status === 401 || status === 403 || status === 400) {
                setError(serverMessage || 'Incorrect email or password. Please try again.');
            } else if (status === 404) {
                setError('Login API not found (404 Not Found). Please check the server.');
            } else {
                setError(serverMessage || axiosErr?.message || 'Login failed. Please check your connection.');
            }
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#09090b',
                backgroundImage: 'radial-gradient(ellipse at top, rgba(255, 107, 53, 0.18), transparent 70%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                px: 2,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={16}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 4,
                        backgroundColor: 'rgba(24, 24, 27, 0.85)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.7)',
                        color: '#ffffff',
                    }}
                >
                    {/* Header with Logo */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                            <img src={logo} alt="TORQUE X Logo" style={{ width: 44, height: 44 }} />
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontFamily: 'monospace',
                                    fontWeight: 900,
                                    letterSpacing: '.25rem',
                                    color: '#ffffff',
                                }}
                            >
                                TORQUE<span style={{ color: '#ff6b35' }}>X</span>
                            </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#a1a1aa', fontWeight: 550, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Access Your Account
                        </Typography>
                    </Box>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                color: '#fca5a5',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                borderRadius: 2,
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
                                    disabled={isSubmitting}
                                    error={Boolean(fieldState.error)}
                                    helperText={fieldState.error?.message}
                                    FormHelperTextProps={{
                                        sx: { color: '#ef4444', fontSize: '0.75rem', mt: 0.5 },
                                    }}
                                    sx={{
                                        '& label': { color: '#a1a1aa', fontWeight: 500 },
                                        '& label.Mui-focused': { color: '#ff6b35' },
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#18181b',
                                            color: '#ffffff',
                                            borderRadius: 2,
                                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                                            '&:hover fieldset': { borderColor: '#ff6b35' },
                                            '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
                                        },
                                    }}
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
                                    type={showPassword ? 'text' : 'password'}
                                    disabled={isSubmitting}
                                    error={Boolean(fieldState.error)}
                                    helperText={fieldState.error?.message}
                                    FormHelperTextProps={{
                                        sx: { color: '#ef4444', fontSize: '0.75rem', mt: 0.5 },
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword((show) => !show)}
                                                    edge="end"
                                                    sx={{ color: '#a1a1aa' }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& label': { color: '#a1a1aa', fontWeight: 500 },
                                        '& label.Mui-focused': { color: '#ff6b35' },
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: '#18181b',
                                            color: '#ffffff',
                                            borderRadius: 2,
                                            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                                            '&:hover fieldset': { borderColor: '#ff6b35' },
                                            '&.Mui-focused fieldset': { borderColor: '#ff6b35' },
                                        },
                                    }}
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
                                py: 1.5,
                                backgroundColor: '#ff6b35',
                                color: '#ffffff',
                                fontWeight: 800,
                                fontSize: '1rem',
                                borderRadius: 2,
                                textTransform: 'none',
                                boxShadow: '0 8px 20px rgba(255, 107, 53, 0.25)',
                                '&:hover': {
                                    backgroundColor: '#e05a2b',
                                    boxShadow: '0 12px 24px rgba(255, 107, 53, 0.35)',
                                },
                            }}
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </Button>

                        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: '#71717a', fontSize: '0.85rem' }}>
                            OR CONTINUE WITH
                        </Divider>

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<GoogleIcon sx={{ color: '#ea4335' }} />}
                            onClick={() => handleGoogleLogin()}
                            disabled={isSubmitting}
                            sx={{
                                py: 1.25,
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                color: '#ffffff',
                                fontWeight: 600,
                                borderRadius: 2,
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: '#ff6b35',
                                    backgroundColor: 'rgba(255, 107, 53, 0.08)',
                                },
                            }}
                        >
                            Sign In With Google
                        </Button>
                    </Stack>

                    {/* Footer Actions */}
                    <Stack spacing={2} sx={{ mt: 4 }}>
                        <Typography variant="body2" align="center" sx={{ color: '#a1a1aa' }}>
                            Don't have an account?{' '}
                            <Link
                                component={RouterLink}
                                to="/register"
                                underline="hover"
                                sx={{ color: '#ff6b35', fontWeight: 700 }}
                            >
                                Sign Up
                            </Link>
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                startIcon={<HomeIcon />}
                                component={RouterLink}
                                to="/"
                                variant="text"
                                size="small"
                                sx={{ color: '#71717a', '&:hover': { color: '#ffffff' } }}
                            >
                                Back to Store
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default SignInPage;
