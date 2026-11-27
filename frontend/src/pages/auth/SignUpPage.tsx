import { useState } from 'react';
import {
    Container, Box, Paper, Typography, TextField,
    Button, Stack, Link, Alert, IconButton, InputAdornment
} from '@mui/material';
import HomeIcon from "@mui/icons-material/Home";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as registerAccount } from '../../services/authService';
import { useAuth } from '../../context';
import { ApiErrorResponse } from '../../types/apiError';
import { applyServerValidationErrors } from '../../schemas/common';
import { signUpSchema, SignUpFormValues } from '../../schemas/authSchema';
import { getDefaultLandingPath } from '../../utils/role';
import { TorqueXKtmLockup } from '@/components/common/BrandMark';

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
        mode: 'onTouched',
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: SignUpFormValues) => {
        setError(null);

        try {
            const response = await registerAccount(values.email, values.password, values.fullName);
            loginSuccess(response.user);
            navigate(getDefaultLandingPath(response.user?.role, '/'), { replace: true });
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number; data?: ApiErrorResponse | string }; message?: string };
            const apiErrorData = axiosErr?.response?.data;
            const status = axiosErr?.response?.status;

            if (apiErrorData && typeof apiErrorData === 'object') {
                const { message: apiMsg, details } = apiErrorData;

                applyServerValidationErrors(details, setFieldError);

                if (status === 409) {
                    const dupMsg = details?.email || apiMsg || 'This email address is already registered.';
                    setFieldError('email', { type: 'server', message: dupMsg });
                    setError('Registration failed: This email is already in use.');
                } else if (status === 400) {
                    setError(apiMsg || 'Invalid registration information.');
                } else {
                    setError(apiMsg || 'Registration failed. Please try again.');
                }
            } else {
                setError(axiosErr?.message || 'Registration failed. Please try again.');
            }
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#09090b',
                backgroundImage: 'radial-gradient(ellipse at top, rgba(255, 103, 0, 0.16), transparent 70%)',
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
                        <Box sx={{ mb: 1.5 }}>
                            <TorqueXKtmLockup
                                markSize={34}
                                textSize={{ xs: '1.45rem', sm: '1.65rem' }}
                                badgeText="KTM"
                                asHeading
                            />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#a1a1aa', fontWeight: 550, textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Join The Revolution
                        </Typography>
                    </Box>

                    {/* Form */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
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
                                    error={Boolean(fieldState.error)}
                                    helperText={fieldState.error?.message || "Must be between 2 and 100 characters"}
                                    FormHelperTextProps={{
                                        sx: {
                                            color: fieldState.error ? '#ef4444' : '#a1a1aa',
                                            fontSize: '0.75rem',
                                            mt: 0.5,
                                        },
                                    }}
                                    disabled={isSubmitting}
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
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    error={Boolean(fieldState.error)}
                                    helperText={fieldState.error?.message || "Must be a valid email (e.g. user@example.com)"}
                                    FormHelperTextProps={{
                                        sx: {
                                            color: fieldState.error ? '#ef4444' : '#a1a1aa',
                                            fontSize: '0.75rem',
                                            mt: 0.5,
                                        },
                                    }}
                                    disabled={isSubmitting}
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
                                    error={Boolean(fieldState.error)}
                                    helperText={fieldState.error?.message || "Must be at least 6 characters"}
                                    FormHelperTextProps={{
                                        sx: {
                                            color: fieldState.error ? '#ef4444' : '#a1a1aa',
                                            fontSize: '0.75rem',
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
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </Stack>

                    {/* Footer Actions */}
                    <Stack spacing={2} sx={{ mt: 4 }}>
                        <Typography variant="body2" align="center" sx={{ color: '#a1a1aa' }}>
                            Already have an account?{' '}
                            <Link
                                component={RouterLink}
                                to="/login"
                                underline="hover"
                                sx={{ color: '#ff6b35', fontWeight: 700 }}
                            >
                                Sign In
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

export default SignUpPage;