import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth, useCart } from '../../context';
import { getLenis } from '../../lib/smoothScroll';

export const KtmNavbar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const lastScrollY = useRef(0);
  const { isLogin, user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = user?.role?.toUpperCase() || '';
  const isAdmin = userRole === 'ADMIN' || userRole === 'ROLE_ADMIN';

  // Smooth Hide on Scroll Down, Reveal on Scroll Up
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      setIsScrolled(currentScrollY > 15);

      if (Math.abs(delta) < 6) {
        ticking = false;
        return;
      }

      if (currentScrollY <= 25) {
        // Always visible at the top of the page
        setIsVisible(true);
      } else if (delta > 6 && currentScrollY > 70) {
        // Scrolling down -> hide navbar smoothly
        setIsVisible(false);
      } else if (delta < -6) {
        // Scrolling up -> reveal navbar smoothly
        setIsVisible(true);
      }

      lastScrollY.current = Math.max(0, currentScrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleScrollToTopOrHome = () => {
    if (location.pathname === '/') {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      navigate('/');
    }
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleUserSettingClick = async (actionPath?: string, isLogout?: boolean) => {
    handleCloseUserMenu();
    if (isLogout) {
      await logout();
      navigate('/login');
    } else if (actionPath) {
      navigate(actionPath);
    }
  };

  const getUserInitials = () => {
    if (!user) return 'R';
    if (user.fullName) {
      const parts = user.fullName.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: { xs: 12, md: 18 },
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        px: { xs: 1.5, sm: 3, md: 4 },
        pointerEvents: 'none', // Allow clicking through outside the capsule
        transform: isVisible ? 'translateY(0)' : 'translateY(-130%)',
        opacity: isVisible ? 1 : 0,
        transition: 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
      }}
    >
      {/* Scout Motors-Style Floating White Capsule Bar */}
      <Box
        sx={{
          pointerEvents: 'auto',
          width: '100%',
          maxWidth: '1120px',
          height: { xs: '54px', md: '58px' },
          backgroundColor: '#FFFFFF',
          color: '#0A0A0C',
          borderRadius: { xs: '6px', md: '8px' },
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: isScrolled
            ? '0 16px 36px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.2)'
            : '0 8px 24px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3, md: 4 },
          userSelect: 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* LEFT SECTION: Logo & Core Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2.5, sm: 4, md: 6 } }}>
          {/* Brand Logo (Scout Motors Architectural Style) */}
          <Box
            onClick={handleScrollToTopOrHome}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: { xs: '1.25rem', md: '1.42rem' },
                letterSpacing: '-0.04em',
                color: '#0A0A0C',
                lineHeight: 1,
              }}
            >
              TORQUEX
            </Typography>
            <Box
              sx={{
                backgroundColor: '#FF6700',
                color: '#FFFFFF',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '0.62rem',
                letterSpacing: '0.08em',
                px: 0.65,
                py: 0.2,
                borderRadius: '2px',
                lineHeight: 1,
              }}
            >
              KTM
            </Box>
          </Box>

          {/* Core Desktop Navigation Links: HOME, SUPPORT */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: { sm: 3, md: 4.5 } }}>
            <Box
              onClick={handleScrollToTopOrHome}
              sx={{
                cursor: 'pointer',
                py: 1,
                position: 'relative',
                '&:hover .nav-text': { color: '#FF6700' },
              }}
            >
              <Typography
                className="nav-text"
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: '#18181B',
                  transition: 'color 0.2s ease',
                }}
              >
                HOME
              </Typography>
            </Box>

            <Box
              onClick={() => navigate('/support')}
              sx={{
                cursor: 'pointer',
                py: 1,
                position: 'relative',
                '&:hover .nav-text': { color: '#FF6700' },
              }}
            >
              <Typography
                className="nav-text"
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: '#18181B',
                  transition: 'color 0.2s ease',
                }}
              >
                SUPPORT
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* RIGHT SECTION: Divider with Red/Orange '+' Cross & Utility Icons (Cart, User) */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Scout-Style Red/Orange Plus '+' Crosshair Divider */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              px: { xs: 1.5, sm: 2.5, md: 3.5 },
              position: 'relative',
            }}
          >
            {/* Vertical hairline divider line */}
            <Box
              sx={{
                width: '1px',
                height: '24px',
                backgroundColor: 'rgba(0, 0, 0, 0.12)',
              }}
            />
            {/* Orange cross symbol in the middle */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#FF6700',
                fontSize: '0.95rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                lineHeight: 1,
                backgroundColor: '#FFFFFF',
                px: 0.3,
              }}
            >
              +
            </Box>
          </Box>

          {/* Right Action Icons: Cart & User */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5, md: 2 } }}>
            {/* Shopping Cart Icon with dynamic badge */}
            <IconButton
              onClick={() => navigate('/cart')}
              aria-label="View Shopping Cart"
              sx={{
                color: '#18181B',
                p: { xs: 0.8, md: 1 },
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: '#FF6700',
                  backgroundColor: 'rgba(255, 103, 0, 0.08)',
                },
              }}
            >
              <Badge
                badgeContent={cart?.totalQuantity || 0}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#FF6700',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.62rem',
                    height: 16,
                    minWidth: 16,
                    padding: '0 4px',
                  },
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: { xs: '1.25rem', md: '1.35rem' } }} />
              </Badge>
            </IconButton>

            {/* User Account Icon / Avatar */}
            {isLogin && user ? (
              <Box>
                <IconButton
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0.4,
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    transition: 'border-color 0.2s ease',
                    '&:hover': { borderColor: '#FF6700' },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      backgroundColor: '#0A0A0C',
                      color: '#FFFFFF',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {getUserInitials()}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    sx: {
                      backgroundColor: '#FFFFFF',
                      color: '#0A0A0C',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      borderRadius: '6px',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
                      minWidth: 200,
                      mt: 1.5,
                      '& .MuiMenuItem-root': {
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.85rem',
                        py: 1.2,
                        px: 2,
                        color: '#18181B',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 103, 0, 0.08)',
                          color: '#FF6700',
                        },
                      },
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: '#0A0A0C' }}>
                      {user.fullName || user.email}
                    </Typography>
                    <Typography sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#71717A' }}>
                      {user.email || 'KTM VIP CLIENT'}
                    </Typography>
                  </Box>

                  {isAdmin && (
                    <MenuItem onClick={() => handleUserSettingClick('/admin/dashboard')}>
                      Admin Paddock
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => handleUserSettingClick('/profile')}>
                    Rider Profile
                  </MenuItem>
                  <MenuItem onClick={() => handleUserSettingClick('/order')}>
                    Allocations & Orders
                  </MenuItem>
                  <Box sx={{ borderTop: '1px solid rgba(0,0,0,0.06)', mt: 0.5 }}>
                    <MenuItem
                      onClick={() => handleUserSettingClick(undefined, true)}
                      sx={{ color: '#EF4444 !important' }}
                    >
                      Sign Out
                    </MenuItem>
                  </Box>
                </Menu>
              </Box>
            ) : (
              <IconButton
                onClick={() => navigate('/login')}
                aria-label="User Sign In"
                sx={{
                  color: '#18181B',
                  p: { xs: 0.8, md: 1 },
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#FF6700',
                    backgroundColor: 'rgba(255, 103, 0, 0.08)',
                  },
                }}
              >
                <PersonOutlineOutlinedIcon sx={{ fontSize: { xs: '1.3rem', md: '1.45rem' } }} />
              </IconButton>
            )}

            {/* Scout-Style Minimal Two-Line Hamburger Button on Mobile */}
            <IconButton
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open Navigation Menu"
              sx={{
                display: { xs: 'flex', sm: 'none' },
                color: '#0A0A0C',
                p: 0.8,
                ml: 0.5,
              }}
            >
              {/* Scout minimal 2-bar menu icon */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', width: 16 }}>
                <Box sx={{ height: '2px', backgroundColor: '#0A0A0C', borderRadius: '1px' }} />
                <Box sx={{ height: '2px', backgroundColor: '#0A0A0C', borderRadius: '1px' }} />
              </Box>
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: '85vw',
            maxWidth: 320,
            backgroundColor: '#FFFFFF',
            color: '#0A0A0C',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          },
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: '#0A0A0C', fontSize: '1.2rem' }}>
                TORQUEX
              </Typography>
              <Box sx={{ backgroundColor: '#FF6700', color: '#FFFFFF', fontWeight: 900, fontSize: '0.62rem', px: 0.6, py: 0.2, borderRadius: '2px' }}>
                KTM
              </Box>
            </Box>
            <IconButton onClick={() => setMobileDrawerOpen(false)} sx={{ color: '#0A0A0C' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ p: 0 }}>
            <ListItem disablePadding sx={{ mb: 1.5 }}>
              <ListItemButton
                onClick={() => {
                  setMobileDrawerOpen(false);
                  handleScrollToTopOrHome();
                }}
                sx={{
                  py: 1.2,
                  px: 1.5,
                  borderRadius: '4px',
                  '&:hover': { backgroundColor: 'rgba(255, 103, 0, 0.08)' },
                }}
              >
                <ListItemText
                  primary="HOME"
                  primaryTypographyProps={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: '#0A0A0C',
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 1.5 }}>
              <ListItemButton
                onClick={() => {
                  setMobileDrawerOpen(false);
                  navigate('/support');
                }}
                sx={{
                  py: 1.2,
                  px: 1.5,
                  borderRadius: '4px',
                  '&:hover': { backgroundColor: 'rgba(255, 103, 0, 0.08)' },
                }}
              >
                <ListItemText
                  primary="SUPPORT"
                  primaryTypographyProps={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    color: '#0A0A0C',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        <Box sx={{ pt: 3, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
          {!isLogin ? (
            <Box
              component={Link}
              to="/login"
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                display: 'block',
                textAlign: 'center',
                textDecoration: 'none',
                color: '#FF6700',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                py: 1.2,
                borderRadius: '4px',
                border: '1px solid #FF6700',
                backgroundColor: 'rgba(255, 103, 0, 0.05)',
              }}
            >
              SIGN IN →
            </Box>
          ) : (
            <Box
              onClick={() => handleUserSettingClick(undefined, true)}
              sx={{
                textAlign: 'center',
                color: '#EF4444',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                py: 1,
              }}
            >
              SIGN OUT
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default KtmNavbar;
