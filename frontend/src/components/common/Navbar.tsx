import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  Collapse,
} from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth, useCart } from "@/context";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import { getLenis } from "@/lib/smoothScroll";
import { isStaffRole } from "@/utils/role";

interface CategoryGroup {
  categoryName: string;
  items: Product[];
}

export const Navbar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [modelsOpen, setModelsOpen] = useState(false);
  const [mobileModelsOpen, setMobileModelsOpen] = useState(true);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const openScrollY = useRef<number | null>(null);

  const { isLogin, user, logout } = useAuth();
  const { cart } = useCart();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const navigate = useNavigate();
  const location = useLocation();

  const isStaff = isStaffRole(user?.role);

  const groupedModels = useMemo<CategoryGroup[]>(() => {
    const active = products.filter((p) => p.isActive !== false);
    const map = new Map<string, Product[]>();
    active.forEach((product) => {
      const catName = product.category?.categoryName || "Other";
      const existing = map.get(catName) || [];
      existing.push(product);
      map.set(catName, existing);
    });
    return Array.from(map.entries()).map(([categoryName, items]) => ({
      categoryName,
      items,
    }));
  }, [products]);

  const closeModelsMenu = () => {
    setModelsOpen(false);
    openScrollY.current = null;
  };

  const openModelsMenu = () => {
    openScrollY.current = typeof window !== "undefined" ? window.scrollY : 0;
    setModelsOpen(true);
  };

  // Close Mega-Menu & Mobile Drawer on route change
  useEffect(() => {
    closeModelsMenu();
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  // Close Mega-Menu on ESC or outside click
  useEffect(() => {
    if (!modelsOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModelsMenu();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (headerWrapperRef.current && !headerWrapperRef.current.contains(e.target as Node)) {
        closeModelsMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modelsOpen]);

  // Hide on Scroll Down, Reveal on Scroll Up, and collapse MODELS Mega-Menu on deliberate scroll (> 40px)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      setIsScrolled(currentScrollY > 15);

        if (openScrollY.current !== null) {
          if (Math.abs(currentScrollY - openScrollY.current) > 40) {
            closeModelsMenu();
          } else {
            lastScrollY.current = Math.max(0, currentScrollY);
            ticking = false;
            return;
          }
        }

        if (Math.abs(delta) < 6) {
          ticking = false;
          return;
        }

        if (currentScrollY <= 25) {
          setIsVisible(true);
        } else if (delta > 6 && currentScrollY > 70) {
          setIsVisible(false);
          closeModelsMenu();
        } else if (delta < -6) {
          setIsVisible(true);
        }

        lastScrollY.current = Math.max(0, currentScrollY);
        ticking = false;
      };

      let rafId: number | null = null;
      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          rafId = window.requestAnimationFrame(handleScroll);
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
        }
      };
    }, []);

  const handleScrollToTopOrHome = () => {
    closeModelsMenu();
    if (location.pathname === "/") {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      navigate("/");
    }
  };

  const handleSelectModel = (productId: number) => {
    closeModelsMenu();
    setMobileDrawerOpen(false);
    navigate(`/products/${productId}`);
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
      navigate("/login");
    } else if (actionPath) {
      navigate(actionPath);
    }
  };

  const getUserInitials = () => {
    if (!user) return "R";
    if (user.fullName) {
      const parts = user.fullName.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const formatShortPrice = (product: Product) => {
    const price =
      product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.basePrice
        ? product.discountPrice
        : product.basePrice;
    return price ? `$${Number(price).toLocaleString()}` : "";
  };

  return (
    <Box
      ref={headerWrapperRef}
      component="header"
      sx={{
        position: "fixed",
        top: { xs: 12, md: 18 },
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: { xs: 1.5, sm: 3, md: 4 },
        pointerEvents: "none",
        transform: isVisible ? "translateY(0)" : "translateY(-130%)",
        opacity: isVisible ? 1 : 0,
        transition: "transform 0.42s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
      }}
    >
      {/* Floating White Capsule Bar */}
      <Box
        sx={{
          pointerEvents: "auto",
          width: "100%",
          maxWidth: "1120px",
          height: { xs: "54px", md: "58px" },
          backgroundColor: "#FFFFFF",
          color: "#0A0A0C",
          borderRadius: { xs: "6px", md: "8px" },
          border: "1px solid rgba(0, 0, 0, 0.08)",
          boxShadow: isScrolled
            ? "0 16px 36px rgba(0, 0, 0, 0.35), 0 4px 12px rgba(0, 0, 0, 0.2)"
            : "0 8px 24px rgba(0, 0, 0, 0.25)",
          display: "flex",
          alignItems: "stretch",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3, md: 4 },
          userSelect: "none",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* LEFT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2.5, sm: 4, md: 6 } }}>
          {/* Brand Logo */}
          <Box
            onClick={handleScrollToTopOrHome}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
            }}
          >
            <Typography
              sx={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: { xs: "1.25rem", md: "1.42rem" },
                letterSpacing: "-0.04em",
                color: "#0A0A0C",
                lineHeight: 1,
              }}
            >
              TORQUEX
            </Typography>
            <Box
              sx={{
                backgroundColor: "#FF6700",
                color: "#FFFFFF",
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "0.62rem",
                letterSpacing: "0.08em",
                px: 0.65,
                py: 0.2,
                borderRadius: "2px",
                lineHeight: 1,
              }}
            >
              KTM
            </Box>
          </Box>

          {/* Desktop Navigation Links: HOME, MODELS */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: { sm: 3, md: 4.5 } }}>
            <Box
              onClick={handleScrollToTopOrHome}
              sx={{
                cursor: "pointer",
                py: 1,
                "&:hover .nav-text": { color: "#FF6700" },
              }}
            >
              <Typography
                className="nav-text"
                sx={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "#18181B",
                  transition: "color 0.2s ease",
                }}
              >
                HOME
              </Typography>
            </Box>

            <Box
              role="button"
              tabIndex={0}
              aria-expanded={modelsOpen}
              aria-haspopup="true"
              onClick={() => (modelsOpen ? closeModelsMenu() : openModelsMenu())}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  modelsOpen ? closeModelsMenu() : openModelsMenu();
                }
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.4,
                cursor: "pointer",
                py: 1,
                "&:hover .nav-text": { color: "#FF6700" },
              }}
            >
              <Typography
                className="nav-text"
                sx={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: modelsOpen ? "#FF6700" : "#18181B",
                  transition: "color 0.2s ease",
                }}
              >
                MODELS
              </Typography>
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: "1rem",
                  color: modelsOpen ? "#FF6700" : "#18181B",
                  transform: modelsOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease, color 0.2s ease",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* RIGHT SECTION */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              px: { xs: 1.5, sm: 2.5, md: 3.5 },
              position: "relative",
            }}
          >
            <Box sx={{ width: "1px", height: "24px", backgroundColor: "rgba(0, 0, 0, 0.12)" }} />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#FF6700",
                fontSize: "0.95rem",
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
                lineHeight: 1,
                backgroundColor: "#FFFFFF",
                px: 0.3,
              }}
            >
              +
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5, md: 2 } }}>
            <IconButton
              onClick={() => navigate("/cart")}
              aria-label="View Shopping Cart"
              sx={{
                color: "#18181B",
                p: { xs: 0.8, md: 1 },
                borderRadius: "4px",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#FF6700",
                  backgroundColor: "rgba(255, 103, 0, 0.08)",
                },
              }}
            >
              <Badge
                badgeContent={cart?.totalQuantity || 0}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#FF6700",
                    color: "#FFFFFF",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    fontSize: "0.62rem",
                    height: 16,
                    minWidth: 16,
                    padding: "0 4px",
                  },
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: { xs: "1.25rem", md: "1.35rem" } }} />
              </Badge>
            </IconButton>

            {isLogin && user ? (
              <Box>
                <IconButton
                  onClick={handleOpenUserMenu}
                  aria-label="Open Account Menu"
                  sx={{
                    p: 0.4,
                    border: "1px solid rgba(0, 0, 0, 0.12)",
                    transition: "border-color 0.2s ease",
                    "&:hover": { borderColor: "#FF6700" },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      backgroundColor: "#0A0A0C",
                      color: "#FFFFFF",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
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
                      backgroundColor: "#FFFFFF",
                      color: "#0A0A0C",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      borderRadius: "6px",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.25)",
                      minWidth: 200,
                      mt: 1.5,
                      "& .MuiMenuItem-root": {
                        fontFamily: "var(--font-body)",
                        fontSize: "0.85rem",
                        py: 1.2,
                        px: 2,
                        color: "#18181B",
                        "&:hover": {
                          backgroundColor: "rgba(255, 103, 0, 0.08)",
                          color: "#FF6700",
                        },
                      },
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    <Typography sx={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", color: "#0A0A0C" }}>
                      {user.fullName || user.email}
                    </Typography>
                    <Typography sx={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#71717A" }}>
                      {user.email}
                    </Typography>
                  </Box>

                  {isStaff && (
                    <MenuItem onClick={() => handleUserSettingClick("/staff/dashboard")}>
                      Staff Portal
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => handleUserSettingClick("/profile")}>
                    Rider Profile
                  </MenuItem>
                  <Box sx={{ borderTop: "1px solid rgba(0,0,0,0.06)", mt: 0.5 }}>
                    <MenuItem
                      onClick={() => handleUserSettingClick(undefined, true)}
                      sx={{ color: "#EF4444 !important" }}
                    >
                      Sign Out
                    </MenuItem>
                  </Box>
                </Menu>
              </Box>
            ) : (
              <IconButton
                onClick={() => navigate("/login")}
                aria-label="User Sign In"
                sx={{
                  color: "#18181B",
                  p: { xs: 0.8, md: 1 },
                  borderRadius: "4px",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "#FF6700",
                    backgroundColor: "rgba(255, 103, 0, 0.08)",
                  },
                }}
              >
                <PersonOutlineOutlinedIcon sx={{ fontSize: { xs: "1.3rem", md: "1.45rem" } }} />
              </IconButton>
            )}

            {/* Mobile Hamburger Button */}
            <IconButton
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open Navigation Menu"
              sx={{
                display: { xs: "flex", sm: "none" },
                color: "#0A0A0C",
                p: 0.8,
                ml: 0.5,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: "4px", width: 16 }}>
                <Box sx={{ height: "2px", backgroundColor: "#0A0A0C", borderRadius: "1px" }} />
                <Box sx={{ height: "2px", backgroundColor: "#0A0A0C", borderRadius: "1px" }} />
              </Box>
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Desktop MODELS Mega-Menu Dropdown (auto-grouped by Category from API) */}
      {modelsOpen && (
        <Box
          role="region"
          aria-label="KTM Models Lineup"
          sx={{
            pointerEvents: "auto",
            display: { xs: "none", sm: "block" },
            width: "100%",
            maxWidth: "1120px",
            mt: 1,
            backgroundColor: "#FFFFFF",
            color: "#0A0A0C",
            borderRadius: "8px",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 24px 56px rgba(0, 0, 0, 0.45)",
            p: { sm: 2.5, md: 3.5 },
            maxHeight: "72vh",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 2,
              mb: 2.5,
              borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
            }}
          >
            <Typography
              sx={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "#71717A",
              }}
            >
              KTM FACTORY LINEUP
            </Typography>
            <Box
              onClick={() => {
                closeModelsMenu();
                navigate("/#fleet");
              }}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
                color: "#FF6700",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <span>SHOWROOM FLEET</span>
              <ArrowOutwardIcon sx={{ fontSize: "0.9rem" }} />
            </Box>
          </Box>

          {productsLoading && (
            <Typography sx={{ color: "#71717A", fontSize: "0.85rem", py: 2 }}>
              Loading KTM fleet...
            </Typography>
          )}
          {!productsLoading && productsError && (
            <Typography sx={{ color: "#ef4444", fontSize: "0.85rem", py: 2 }}>
              Failed to load models from catalog.
            </Typography>
          )}
          {!productsLoading && !productsError && groupedModels.length === 0 && (
            <Typography sx={{ color: "#71717A", fontSize: "0.85rem", py: 2 }}>
              No active motorcycle models available.
            </Typography>
          )}
          {!productsLoading && !productsError && groupedModels.length > 0 && (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  sm: `repeat(${Math.min(2, groupedModels.length)}, 1fr)`,
                  md: `repeat(${Math.min(4, groupedModels.length)}, 1fr)`,
                },
                gap: 3,
              }}
            >
              {groupedModels.map((group) => (
                <Box key={group.categoryName}>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      color: "#FF6700",
                      textTransform: "uppercase",
                      mb: 1.5,
                    }}
                  >
                    {group.categoryName}
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {group.items.map((bike) => (
                      <Box
                        key={bike.id}
                        onClick={() => handleSelectModel(bike.id)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.25,
                          p: 1,
                          borderRadius: "6px",
                          cursor: "pointer",
                          border: "1px solid transparent",
                          transition: "all 0.18s ease",
                          "&:hover": {
                            backgroundColor: "rgba(255, 103, 0, 0.06)",
                            borderColor: "rgba(255, 103, 0, 0.25)",
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src={bike.thumbnail}
                          alt={bike.productName}
                          sx={{
                            width: 52,
                            height: 36,
                            objectFit: "contain",
                            borderRadius: "4px",
                            backgroundColor: "#F4F4F5",
                            p: 0.3,
                            flexShrink: 0,
                          }}
                        />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            noWrap
                            sx={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 800,
                              fontSize: "0.82rem",
                              color: "#0A0A0C",
                            }}
                          >
                            {bike.productName}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.68rem",
                              color: "#71717A",
                            }}
                          >
                            {formatShortPrice(bike)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "85vw",
            maxWidth: 340,
            backgroundColor: "#FFFFFF",
            color: "#0A0A0C",
            p: 3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          },
        }}
      >
        <Box sx={{ overflowY: "auto" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontFamily: "var(--font-display)", fontWeight: 900, color: "#0A0A0C", fontSize: "1.2rem" }}>
                TORQUEX
              </Typography>
              <Box sx={{ backgroundColor: "#FF6700", color: "#FFFFFF", fontWeight: 900, fontSize: "0.62rem", px: 0.6, py: 0.2, borderRadius: "2px" }}>
                KTM
              </Box>
            </Box>
            <IconButton onClick={() => setMobileDrawerOpen(false)} sx={{ color: "#0A0A0C" }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List sx={{ p: 0 }}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  setMobileDrawerOpen(false);
                  handleScrollToTopOrHome();
                }}
                sx={{ py: 1.1, px: 1.5, borderRadius: "4px" }}
              >
                <ListItemText
                  primary="HOME"
                  primaryTypographyProps={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "#0A0A0C",
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => setMobileModelsOpen((prev) => !prev)}
                sx={{ py: 1.1, px: 1.5, borderRadius: "4px", display: "flex", justifyContent: "space-between" }}
              >
                <ListItemText
                  primary="MODELS"
                  primaryTypographyProps={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "#FF6700",
                  }}
                />
                <KeyboardArrowDownIcon
                  sx={{
                    transform: mobileModelsOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                    color: "#FF6700",
                  }}
                />
              </ListItemButton>
            </ListItem>

            <Collapse in={mobileModelsOpen}>
              <Box sx={{ pl: 1.5, pb: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                {groupedModels.map((group) => (
                  <Box key={group.categoryName}>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.66rem",
                        fontWeight: 800,
                        color: "#71717A",
                        textTransform: "uppercase",
                        mb: 0.8,
                      }}
                    >
                      {group.categoryName}
                    </Typography>
                    {group.items.map((bike) => (
                      <Box
                        key={bike.id}
                        onClick={() => handleSelectModel(bike.id)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.2,
                          py: 0.7,
                          px: 1,
                          borderRadius: "4px",
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "rgba(255, 103, 0, 0.08)" },
                        }}
                      >
                        <Box
                          component="img"
                          src={bike.thumbnail}
                          alt={bike.productName}
                          sx={{ width: 40, height: 28, objectFit: "contain", flexShrink: 0 }}
                        />
                        <Typography sx={{ fontSize: "0.84rem", fontWeight: 700, color: "#0A0A0C" }}>
                          {bike.productName}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </Box>
            </Collapse>

            {isStaff && (
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    navigate("/staff/dashboard");
                  }}
                  sx={{ py: 1.1, px: 1.5, borderRadius: "4px" }}
                >
                  <ListItemText
                    primary="STAFF PORTAL"
                    primaryTypographyProps={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: "#FF6700",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>

        <Box sx={{ pt: 3, borderTop: "1px solid rgba(0, 0, 0, 0.08)" }}>
          {!isLogin ? (
            <Box
              component={Link}
              to="/login"
              onClick={() => setMobileDrawerOpen(false)}
              sx={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                color: "#FF6700",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                py: 1.2,
                borderRadius: "4px",
                border: "1px solid #FF6700",
                backgroundColor: "rgba(255, 103, 0, 0.05)",
              }}
            >
              SIGN IN →
            </Box>
          ) : (
            <Box
              onClick={() => handleUserSettingClick(undefined, true)}
              sx={{
                textAlign: "center",
                color: "#EF4444",
                fontFamily: "var(--font-mono)",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
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

export default Navbar;
