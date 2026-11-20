import React, { useState, useEffect } from 'react';
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
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAuth, useCart } from '../../context';
import { getLenis } from '../../lib/smoothScroll';

export const KtmNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const { isLogin, user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = user?.role?.toUpperCase() || '';
  const isAdmin = userRole === 'ADMIN' || userRole === 'ROLE_ADMIN';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    setMobileDrawerOpen(false);
    if (location.pathname !== '/') {
      navigate(`/${sectionId}`);
      return;
    }

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

  const navLinks = [
    { label: 'FLEET', action: () => handleScrollToSection('#fleet') },
    { label: 'ANATOMY', action: () => handleScrollToSection('#anatomy') },
    { label: 'ACTION', action: () => handleScrollToSection('#action') },
    { label: 'HERITAGE', action: () => handleScrollToSection('#heritage') },
    { label: 'SUPPORT', action: () => { setMobileDrawerOpen(false); navigate('/support'); } },
  ];

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
        top: 0,
        left: 0,
        right: 0,
        height: '72px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2.5, md: 5, lg: 8 },
        transition: 'background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
        backgroundColor: isScrolled ? 'rgba(7, 7, 9, 0.88)' : 'rgba(7, 7, 9, 0.40)',
        backdropFilter: isScrolled ? 'blur(24px)' : 'blur(8px)',
        WebkitBackdropFilter: isScrolled ? 'blur(24px)' : 'blur(8px)',
        borderBottom: isScrolled
          ? '1px solid rgba(255, 255, 255, 0.08)'
          : '1px solid rgba(255, 255, 255, 0.03)',
      }}
    >
      {/* 1. Left Node: Brand Monogram & Factory Racing Badge */}
      <Box
        onClick={() => {
          if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            navigate('/');
          }
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: { xs: '1.25rem', md: '1.45rem' },
                letterSpacing: '-0.03em',
                color: '#F4F4F5',
                lineHeight: 1,
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
                lineHeight: 1,
              }}
            >
              KTM
            </Box>
          </Box>
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: '#71717A',
              letterSpacing: '0.12em',
              mt: 0.4,
              display: { xs: 'none', sm: 'block' },
            }}
          >
            MATTIGHOFEN RACING BOUTIQUE
          </Typography>
        </Box>
      </Box>

      {/* 2. Center Node: Navigation Links (Desktop) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          gap: { md: 3, lg: 4.5 },
        }}
      >
        {navLinks.map((item) => (
          <Box
            key={item.label}
            onClick={item.action}
            sx={{
              position: 'relative',
              cursor: 'pointer',
              py: 1,
              '&:hover .nav-indicator': {
                width: '100%',
                backgroundColor: '#FF6700',
              },
              '&:hover .nav-text': {
                color: '#FFFFFF',
              },
            }}
          >
            <Typography
              className="nav-text"
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.14em',
                color: '#A1A1AA',
                transition: 'color 0.2s ease',
              }}
            >
              {item.label}
            </Typography>
            <Box
              className="nav-indicator"
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '2px',
                width: '0%',
                backgroundColor: 'transparent',
                transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease',
              }}
            />
          </Box>
        ))}
      </Box>

      {/* 3. Right Node: Utility Actions (Cart, User, Reserve CTA) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2, md: 2.5 } }}>
        {/* Shopping Cart Button */}
        <IconButton
          onClick={() => navigate('/cart')}
          aria-label="View Shopping Cart"
          sx={{
            color: '#D4D4D8',
            p: 1,
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: 'rgba(255, 103, 0, 0.4)',
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
                color: '#070709',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '0.65rem',
                height: 16,
                minWidth: 16,
                padding: '0 4px',
              },
            }}
          >
            <ShoppingBagOutlinedIcon sx={{ fontSize: '1.25rem' }} />
          </Badge>
        </IconButton>

        {/* User Account Badge or Sign In */}
        {isLogin && user ? (
          <Box>
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{
                p: 0.5,
                border: '1px solid rgba(255, 255, 255, 0.12)',
                transition: 'border-color 0.2s ease',
                '&:hover': { borderColor: '#FF6700' },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: '#16161D',
                  color: '#FF6700',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: '1px solid rgba(255, 103, 0, 0.3)',
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
                  backgroundColor: '#0F0F14',
                  color: '#F4F4F5',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                  minWidth: 200,
                  mt: 1.5,
                  '& .MuiMenuItem-root': {
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.85rem',
                    py: 1.2,
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 103, 0, 0.1)',
                      color: '#FF6700',
                    },
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>
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
              <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', mt: 0.5 }}>
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
          <Box
            component={Link}
            to="/login"
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              alignItems: 'center',
              textDecoration: 'none',
              color: '#F4F4F5',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              px: 2,
              py: 0.9,
              borderRadius: '2px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#FF6700',
                color: '#FF6700',
                backgroundColor: 'rgba(255, 103, 0, 0.05)',
              },
            }}
          >
            SIGN IN
          </Box>
        )}

        {/* Fast Action CTA: [ RESERVE BEAST ] */}
        <Box
          onClick={() => handleScrollToSection('#handover')}
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            alignItems: 'center',
            gap: 0.8,
            cursor: 'pointer',
            backgroundColor: '#FF6700',
            color: '#070709',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            px: { sm: 2, md: 2.6 },
            py: 1,
            borderRadius: '2px',
            boxShadow: '0 0 20px rgba(255, 103, 0, 0.3)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            userSelect: 'none',
            '&:hover': {
              backgroundColor: '#FFA040',
              boxShadow: '0 0 28px rgba(255, 103, 0, 0.6)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          <span>RESERVE BEAST</span>
          <ArrowForwardIosIcon sx={{ fontSize: '0.65rem' }} />
        </Box>

        {/* Mobile Hamburger Toggle */}
        <IconButton
          onClick={() => setMobileDrawerOpen(true)}
          sx={{
            display: { xs: 'flex', md: 'none' },
            color: '#F4F4F5',
            p: 1,
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: '85vw',
            maxWidth: 360,
            backgroundColor: '#0A0A0E',
            backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(255, 103, 0, 0.08) 0%, transparent 60%)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          },
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: '#F4F4F5' }}>
                TORQUEX
              </Typography>
              <Box sx={{ backgroundColor: '#FF6700', color: '#070709', fontWeight: 900, fontSize: '0.65rem', px: 0.6, py: 0.2, borderRadius: '2px' }}>
                KTM
              </Box>
            </Box>
            <IconButton onClick={() => setMobileDrawerOpen(false)} sx={{ color: '#A1A1AA' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ p: 0 }}>
            {navLinks.map((item) => (
              <ListItem key={item.label} disablePadding sx={{ mb: 1.5 }}>
                <ListItemButton
                  onClick={item.action}
                  sx={{
                    py: 1.2,
                    px: 1.5,
                    borderRadius: '4px',
                    '&:hover': { backgroundColor: 'rgba(255, 103, 0, 0.1)' },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      color: '#F4F4F5',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ pt: 3, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <Box
            onClick={() => handleScrollToSection('#handover')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              backgroundColor: '#FF6700',
              color: '#070709',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.85rem',
              py: 1.4,
              borderRadius: '2px',
              cursor: 'pointer',
              mb: 2,
            }}
          >
            <span>RESERVE 1290 SUPER DUKE</span>
          </Box>

          {!isLogin ? (
            <Box
              component={Link}
              to="/login"
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                display: 'block',
                textAlign: 'center',
                textDecoration: 'none',
                color: '#D4D4D8',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                py: 1,
              }}
            >
              RIDER SIGN IN →
            </Box>
          ) : (
            <Box
              onClick={() => handleUserSettingClick(undefined, true)}
              sx={{
                textAlign: 'center',
                color: '#EF4444',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
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
