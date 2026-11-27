import React, { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, ButtonBase, CircularProgress, Snackbar, Typography } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocation, useNavigate } from "react-router-dom";
import { getLenis } from "@/lib/smoothScroll";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useAuth, useCart } from "@/context";
import { Product } from "@/types/product";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSpecValueProps {
  value: number;
  prefix?: string;
  decimals?: number;
}

const AnimatedOdometerValue: React.FC<AnimatedSpecValueProps> = ({
  value,
  prefix = "",
  decimals = 0,
}) => {
  const [display, setDisplay] = useState<number>(value);
  const elRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    setDisplay(value);
  }, [value]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const node = elRef.current;
    if (prefersReducedMotion || !node || typeof IntersectionObserver === "undefined") {
      return;
    }

    let tween: gsap.core.Tween | null = null;
    const tweenObj = { val: 0 };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          tween = gsap.to(tweenObj, {
            val: value,
            duration: 0.65,
            ease: "power2.out",
            onUpdate: () => {
              setDisplay(
                decimals > 0 ? parseFloat(tweenObj.val.toFixed(decimals)) : Math.round(tweenObj.val)
              );
            },
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [value, decimals]);

  return (
    <span ref={elRef}>
      {prefix}
      {display.toLocaleString()}
    </span>
  );
};

const getNumericSpec = (product: Product, keyCode: string): number | null => {
  const found = product.specifications?.find((s) => s.keyCode === keyCode);
  if (!found) return null;
  if (found.valueNumber !== undefined && found.valueNumber !== null) {
    return Number(found.valueNumber);
  }
  if (found.value) {
    const parsed = Number(found.value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const getEffectivePrice = (product: Product): number => {
  if (product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.basePrice) {
    return Number(product.discountPrice);
  }
  return Number(product.basePrice);
};

export const BloodlineFleet: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [addingId, setAddingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: "success" | "error" | "info" } | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { isLogin, user } = useAuth();
  const { addItemToCart } = useCart();
  const { products, loading: productsLoading, error: productsError, refetch } = useProducts();
  const { categories } = useCategories();

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackViewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  const activeProducts = useMemo(
    () => products.filter((p) => p.isActive !== false),
    [products]
  );

  const categoryTabs = useMemo(() => {
    const activeCats = categories.filter((c) => c.isActive !== false);
    if (activeCats.length > 0) {
      return [
        { key: "ALL", label: "ALL MODELS" },
        ...activeCats.map((c) => ({
          key: String(c.id),
          label: c.categoryName.toUpperCase(),
        })),
      ];
    }
    const distinctFromProducts = new Map<string, string>();
    activeProducts.forEach((p) => {
      if (p.category?.id && p.category.categoryName) {
        distinctFromProducts.set(String(p.category.id), p.category.categoryName.toUpperCase());
      }
    });
    return [
      { key: "ALL", label: "ALL MODELS" },
      ...Array.from(distinctFromProducts.entries()).map(([key, label]) => ({ key, label })),
    ];
  }, [categories, activeProducts]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: activeProducts.length };
    categoryTabs.forEach((tab) => {
      if (tab.key !== "ALL") counts[tab.key] = 0;
    });
    activeProducts.forEach((bike) => {
      const catKey = bike.category?.id ? String(bike.category.id) : "";
      if (catKey) {
        counts[catKey] = (counts[catKey] || 0) + 1;
      }
    });
    return counts;
  }, [activeProducts, categoryTabs]);

  const filteredVehicles = useMemo(
    () =>
      activeFilter === "ALL"
        ? activeProducts
        : activeProducts.filter((v) => String(v.category?.id) === activeFilter),
    [activeFilter, activeProducts]
  );

  // Header entrance animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
          refreshPriority: 2,
        },
      });

      headerTl
        .fromTo(".fleet-eyebrow-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: "power3.out" }, 0)
        .fromTo(
          ".fleet-eyebrow-text",
          { opacity: 0, letterSpacing: "0.32em" },
          { opacity: 1, letterSpacing: "0.16em", duration: 0.7, ease: "power3.out" },
          0.05
        )
        .fromTo(".fleet-title-line-1", { yPercent: 108, skewY: 2.2 }, { yPercent: 0, skewY: 0, duration: 0.85, ease: "power4.out" }, 0.08)
        .fromTo(
          ".fleet-title-line-2",
          { yPercent: 108, skewY: 2.2, textShadow: "0 0 0px rgba(255, 103, 0, 0)" },
          { yPercent: 0, skewY: 0, textShadow: "0 0 38px rgba(255, 103, 0, 0.55)", duration: 0.95, ease: "power4.out" },
          0.18
        )
        .fromTo(
          ".fleet-filter-dock",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: "power3.out", clearProps: "transform,opacity" },
          0.26
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Desktop Pinned Horizontal Pit-Lane Scrub + ScrollTrigger refresh when live data arrives
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (
      filteredVehicles.length === 0 ||
      window.innerWidth < 1024 ||
      prefersReducedMotion ||
      !sectionRef.current ||
      !trackViewportRef.current ||
      !trackRef.current
    ) {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
      return;
    }

    const ctx = gsap.context(() => {
      const trackEl = trackRef.current!;
      const viewportEl = trackViewportRef.current!;
      const getTravelDistance = () => Math.max(0, trackEl.scrollWidth - viewportEl.clientWidth);

      const bayCount = filteredVehicles.length;
      const scrollLength = Math.max(120, bayCount * 62);

      const horizTween = gsap.to(trackEl, {
        x: () => -getTravelDistance(),
        ease: "none",
        scrollTrigger: {
          id: "fleet-horizontal-pit",
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${scrollLength}%`,
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 2,
          onUpdate: (self) => {
            gsap.set(".fleet-pit-progress", { scaleX: Math.min(1, Math.max(0, self.progress)) });
          },
        },
      });

      scrollTriggerRef.current = horizTween.scrollTrigger || null;

      const bayEls = gsap.utils.toArray<HTMLElement>(".pit-bay-item");
      bayEls.forEach((bay, index) => {
        const watermark = bay.querySelector(".bay-watermark");
        const bikeVisual = bay.querySelector(".bay-bike-visual");
        const hudPanel = bay.querySelector(".bay-hud-panel");

        if (watermark) {
          gsap.fromTo(
            watermark,
            { xPercent: -10 },
            {
              xPercent: 12,
              ease: "none",
              scrollTrigger: {
                trigger: bay,
                containerAnimation: horizTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }

        if (bikeVisual && index > 0) {
          gsap.fromTo(
            bikeVisual,
            { scale: 0.94, xPercent: 5 },
            {
              scale: 1,
              xPercent: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: bay,
                containerAnimation: horizTween,
                start: "left 88%",
                end: "center 52%",
                scrub: true,
              },
            }
          );
        }

        if (hudPanel && index > 0) {
          gsap.fromTo(
            hudPanel,
            { y: 18 },
            {
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: bay,
                containerAnimation: horizTween,
                start: "left 82%",
                end: "center 55%",
                scrub: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    const refreshId = window.requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, [filteredVehicles]);

  const handleSelectFilter = (cat: string) => {
    setActiveFilter(cat);
    const st = scrollTriggerRef.current;
    if (st && window.scrollY > st.start && window.scrollY < st.end) {
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(st.start, { duration: 0.6 });
      } else {
        window.scrollTo({ top: st.start, behavior: "smooth" });
      }
    }
  };

  const handleJumpToBay = (index: number) => {
    const st = scrollTriggerRef.current;
    if (!st || filteredVehicles.length <= 1) return;
    const ratio = index / (filteredVehicles.length - 1);
    const targetY = st.start + (st.end - st.start) * ratio;
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(targetY, { duration: 1.0 });
    } else {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  const handleAddToCart = async (bike: Product) => {
    if (!isLogin || !user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    const buyableVariant = bike.variants?.find(
      (v) => v.isActive !== false && v.stockQuantity > 0
    );
    if (!buyableVariant) {
      setToast({
        message: `${bike.productName} is currently out of stock.`,
        severity: "error",
      });
      return;
    }

    setAddingId(bike.id);
    try {
      await addItemToCart(buyableVariant.id, 1);
      setToast({
        message: `Added "${bike.productName}" to your shopping cart!`,
        severity: "success",
      });
    } catch (err: any) {
      console.error("Failed to add bike to cart:", err);
      setToast({
        message: err?.response?.data?.message || "Failed to add item to cart.",
        severity: "error",
      });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Box
      id="fleet"
      ref={sectionRef}
      component="section"
      sx={{
        position: "relative",
        width: "100%",
        height: filteredVehicles.length > 0 ? { xs: "auto", lg: "100vh" } : "auto",
        minHeight: { xs: "420px", lg: "70vh" },
        backgroundColor: "#070709",
        marginTop: "-4px",
        zIndex: 4,
        overflow: "hidden",
        "@media (prefers-reduced-motion: reduce)": {
          height: "auto",
        },
      }}
    >
      {/* Ambient Overhead Studio Glow */}
      <Box
        sx={{
          position: "absolute",
          top: "-140px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1100px",
          height: "460px",
          background:
            "radial-gradient(ellipse at center, rgba(255, 103, 0, 0.12) 0%, rgba(255, 103, 0, 0.02) 52%, transparent 76%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <Box
        className="fleet-stage-shell"
        sx={{
          position: "relative",
          width: "100%",
          height: filteredVehicles.length > 0 ? { xs: "auto", lg: "100%" } : "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pt: { xs: 10, lg: "5.5vh" },
          pb: { xs: 8, lg: "3.5vh" },
          willChange: "transform, opacity",
        }}
      >
        {/* 1. TOP HUD HEADER & FILTER RAIL */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "1440px",
            mx: "auto",
            px: { xs: 3, md: 6, lg: 8 },
            zIndex: 15,
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.4, mb: 1.5 }}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#FF6700",
                boxShadow: "0 0 10px #FF6700",
              }}
            />
            <Box
              className="fleet-eyebrow-rule"
              sx={{
                width: 24,
                height: "2px",
                backgroundColor: "#FF6700",
                transformOrigin: "left center",
              }}
            />
            <Typography
              className="fleet-eyebrow-text"
              sx={{
                fontFamily: "var(--font-mono)",
                fontSize: { xs: "0.64rem", md: "0.72rem" },
                fontWeight: 800,
                letterSpacing: "0.16em",
                color: "#FF6700",
                textTransform: "uppercase",
              }}
            >
              MATTIGHOFEN STARTING GRID • {filteredVehicles.length} FACTORY MACHINES
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", lg: "flex-end" },
              gap: { xs: 3, lg: 4 },
            }}
          >
            <Box sx={{ flexShrink: 0 }}>
              <Typography
                component="h2"
                sx={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 950,
                  fontSize: { xs: "2.0rem", sm: "2.6rem", lg: "2.8rem", xl: "3.4rem" },
                  letterSpacing: "-0.035em",
                  lineHeight: 0.98,
                  textTransform: "uppercase",
                  whiteSpace: { md: "nowrap" },
                }}
              >
                <Box component="span" sx={{ display: "block", overflow: "hidden" }}>
                  <Box component="span" className="fleet-title-line-1" sx={{ display: "inline-block", color: "#FFFFFF" }}>
                    THE BLOODLINE FLEET.
                  </Box>
                </Box>
                <Box component="span" sx={{ display: "block", overflow: "hidden" }}>
                  <Box
                    component="span"
                    className="fleet-title-line-2"
                    sx={{
                      display: "inline-block",
                      color: "#FF6700",
                      textShadow: "0 0 38px rgba(255, 103, 0, 0.55)",
                    }}
                  >
                    CHOOSE YOUR WEAPON.
                  </Box>
                </Box>
              </Typography>
            </Box>

            <Box
              className="fleet-filter-dock"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "flex-start", lg: "flex-end" },
                gap: 1.2,
                maxWidth: "100%",
                flexShrink: 0,
              }}
            >
              <Box
                role="group"
                aria-label="Filter motorcycles by discipline"
                sx={{
                  display: "flex",
                  flexWrap: { xs: "wrap", lg: "nowrap" },
                  alignItems: "center",
                  gap: 0.55,
                  p: 0.6,
                  borderRadius: { xs: "14px", md: "100px" },
                  backgroundColor: "rgba(15, 15, 20, 0.92)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderTop: "1px solid rgba(255, 255, 255, 0.24)",
                  boxShadow: "0 14px 36px rgba(0, 0, 0, 0.65)",
                }}
              >
                {categoryTabs.map((tab) => {
                  const isActive = activeFilter === tab.key;
                  return (
                    <ButtonBase
                      key={tab.key}
                      aria-pressed={isActive}
                      onClick={() => handleSelectFilter(tab.key)}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.85,
                        px: { xs: 1.4, lg: 1.6, xl: 2 },
                        py: 0.85,
                        borderRadius: "100px",
                        whiteSpace: "nowrap",
                        backgroundColor: isActive ? "#FF6700" : "transparent",
                        color: isActive ? "#070709" : "#D4D4D8",
                        boxShadow: isActive ? "0 0 24px rgba(255, 103, 0, 0.45)" : "none",
                        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                        "&:hover": {
                          backgroundColor: isActive ? "#FF7D24" : "rgba(255, 255, 255, 0.08)",
                          color: isActive ? "#070709" : "#FFFFFF",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.66rem",
                          fontWeight: 800,
                          letterSpacing: "0.09em",
                          lineHeight: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tab.label}
                      </Typography>
                      <Box
                        component="span"
                        className="tabular-nums"
                        sx={{
                          px: 0.75,
                          py: 0.22,
                          borderRadius: "100px",
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.60rem",
                          fontWeight: 800,
                          lineHeight: 1,
                          backgroundColor: isActive ? "rgba(7, 7, 9, 0.18)" : "rgba(255, 255, 255, 0.08)",
                          color: isActive ? "#070709" : "#D4D4D8",
                        }}
                      >
                        {String(categoryCounts[tab.key] || 0).padStart(2, "0")}
                      </Box>
                    </ButtonBase>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* 2. DATA STATE OR HORIZONTAL TRACK */}
        {productsLoading ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 10,
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: "#FF6700" }} />
            <Typography sx={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "#A1A1AA" }}>
              LOADING KTM FACTORY LINEUP...
            </Typography>
          </Box>
        ) : productsError ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 10,
              px: 3,
              textAlign: "center",
              gap: 2.5,
            }}
          >
            <Typography variant="h6" sx={{ color: "#EF4444", fontWeight: 800 }}>
              Failed to load fleet catalog
            </Typography>
            <Typography sx={{ color: "#A1A1AA", fontSize: "0.9rem", maxWidth: 460 }}>
              {productsError}
            </Typography>
            <ButtonBase
              onClick={() => void refetch()}
              sx={{
                px: 3.5,
                py: 1.2,
                borderRadius: "8px",
                backgroundColor: "#FF6700",
                color: "#070709",
                fontFamily: "var(--font-mono)",
                fontWeight: 800,
                fontSize: "0.8rem",
                letterSpacing: "0.1em",
              }}
            >
              RETRY
            </ButtonBase>
          </Box>
        ) : filteredVehicles.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 10,
              gap: 1.5,
            }}
          >
            <Typography sx={{ color: "#D4D4D8", fontWeight: 700 }}>
              No KTM machines found in this segment.
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              ref={trackViewportRef}
              sx={{
                position: "relative",
                width: "100%",
                flex: { lg: 1 },
                display: "flex",
                alignItems: "center",
                overflowX: { xs: "auto", lg: "hidden" },
                scrollSnapType: { xs: "x mandatory", lg: "none" },
                mt: { xs: 4, lg: 0 },
                pb: { xs: 2, lg: 0 },
                "&::-webkit-scrollbar": { display: "none" },
                "@media (prefers-reduced-motion: reduce)": {
                  overflowX: "auto",
                  scrollSnapType: "x mandatory",
                  pb: 3,
                },
              }}
            >
              <Box
                ref={trackRef}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 3, lg: "8vw" },
                  px: { xs: 3, md: 6, lg: "9vw" },
                  width: "max-content",
                  willChange: "transform",
                }}
              >
                {filteredVehicles.map((bike, idx) => {
                  const displacementCc = getNumericSpec(bike, "displacement");
                  const powerHp = getNumericSpec(bike, "max_power");
                  const torqueNm = getNumericSpec(bike, "max_torque");
                  const dryWeightKg = getNumericSpec(bike, "dry_weight");
                  const effectivePrice = getEffectivePrice(bike);
                  const categoryLabel = bike.category?.categoryName?.toUpperCase() || "KTM";
                  const inStockVariant = bike.variants?.find(
                    (v) => v.isActive !== false && v.stockQuantity > 0
                  );

                  return (
                    <Box
                      key={bike.id}
                      className="pit-bay-item"
                      sx={{
                        position: "relative",
                        width: { xs: "86vw", sm: "76vw", md: "66vw", lg: "82vw", xl: "80vw" },
                        maxWidth: { lg: "1240px" },
                        minHeight: { xs: "auto", lg: "56vh" },
                        flexShrink: 0,
                        scrollSnapAlign: { xs: "center", lg: "none" },
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", lg: "1.25fr 0.9fr" },
                        gap: { xs: 3, lg: 6 },
                        alignItems: "center",
                        py: { xs: 3, lg: 2 },
                      }}
                    >
                      {displacementCc !== null && (
                        <Typography
                          className="bay-watermark"
                          aria-hidden="true"
                          sx={{
                            position: "absolute",
                            top: { xs: "6%", lg: "8%" },
                            left: { xs: "4%", lg: "2%" },
                            fontFamily: "var(--font-display)",
                            fontWeight: 950,
                            fontSize: { xs: "4.5rem", sm: "7rem", lg: "10.5rem", xl: "12rem" },
                            lineHeight: 0.9,
                            letterSpacing: "-0.05em",
                            color: "rgba(255, 255, 255, 0.032)",
                            userSelect: "none",
                            pointerEvents: "none",
                            whiteSpace: "nowrap",
                            zIndex: 0,
                          }}
                        >
                          {displacementCc} CC
                        </Typography>
                      )}

                      <Box
                        className="bay-bike-visual"
                        sx={{
                          position: "relative",
                          height: { xs: "230px", sm: "300px", lg: "48vh" },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 2,
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: "10%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "85%",
                            height: "58%",
                            background:
                              "radial-gradient(ellipse at center, rgba(255, 103, 0, 0.24) 0%, rgba(255, 103, 0, 0.05) 48%, transparent 74%)",
                            filter: "blur(26px)",
                            pointerEvents: "none",
                          }}
                        />

                        <Box
                          sx={{
                            position: "absolute",
                            bottom: { xs: "10%", lg: "11%" },
                            left: "4%",
                            right: "4%",
                            height: "1px",
                            background:
                              "linear-gradient(90deg, transparent 0%, rgba(255, 103, 0, 0.55) 50%, transparent 100%)",
                            pointerEvents: "none",
                          }}
                        />

                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            zIndex: 4,
                          }}
                        >
                          <Box
                            sx={{
                              px: 1.4,
                              py: 0.45,
                              borderRadius: "100px",
                              backgroundColor: "rgba(15, 15, 20, 0.85)",
                              backdropFilter: "blur(12px)",
                              border: "1px solid rgba(255, 255, 255, 0.14)",
                            }}
                          >
                            <Typography
                              className="tabular-nums"
                              sx={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.62rem",
                                fontWeight: 800,
                                color: "#D4D4D8",
                                letterSpacing: "0.12em",
                              }}
                            >
                              BAY {String(idx + 1).padStart(2, "0")} // {categoryLabel}
                            </Typography>
                          </Box>

                          {bike.isFeatured && (
                            <Box
                              sx={{
                                px: 1.3,
                                py: 0.45,
                                borderRadius: "100px",
                                backgroundColor: "#FF6700",
                                color: "#070709",
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.58rem",
                                fontWeight: 800,
                                letterSpacing: "0.1em",
                                boxShadow: "0 0 18px rgba(255, 103, 0, 0.45)",
                              }}
                            >
                              FACTORY FLAGSHIP
                            </Box>
                          )}
                        </Box>

                        <Box
                          component="img"
                          src={bike.thumbnail}
                          alt={bike.productName}
                          loading={idx < 2 ? "eager" : "lazy"}
                          decoding="async"
                          sx={{
                            position: "relative",
                            zIndex: 3,
                            maxWidth: "94%",
                            maxHeight: "92%",
                            objectFit: "contain",
                            filter:
                              "drop-shadow(0 22px 35px rgba(0, 0, 0, 0.92)) drop-shadow(0 0 28px rgba(255, 103, 0, 0.18))",
                          }}
                        />
                      </Box>

                      <Box
                        className="bay-hud-panel"
                        sx={{
                          position: "relative",
                          zIndex: 3,
                          p: { xs: 3, lg: 4 },
                          borderRadius: "16px",
                          backgroundColor: "rgba(15, 15, 20, 0.90)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(255, 255, 255, 0.10)",
                          borderTop: "1px solid rgba(255, 255, 255, 0.25)",
                          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.75)",
                          display: "flex",
                          flexDirection: "column",
                          gap: 2.2,
                        }}
                      >
                        <Box>
                          {bike.summary && (
                            <Typography
                              sx={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                fontWeight: 800,
                                letterSpacing: "0.14em",
                                color: "#FF6700",
                                mb: 0.7,
                              }}
                            >
                              {bike.summary}
                            </Typography>
                          )}

                          <Typography
                            component="h3"
                            sx={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 950,
                              fontSize: { xs: "1.55rem", sm: "1.9rem", lg: "2.2rem" },
                              letterSpacing: "-0.025em",
                              lineHeight: 1.06,
                              color: "#FFFFFF",
                              textTransform: "uppercase",
                            }}
                          >
                            {bike.productName}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 1.5,
                            p: 2,
                            borderRadius: "10px",
                            backgroundColor: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid rgba(255, 255, 255, 0.10)",
                            borderTop: "1px solid rgba(255, 255, 255, 0.20)",
                          }}
                        >
                          <Box>
                            <Typography sx={{ fontFamily: "var(--font-mono)", fontSize: "0.60rem", fontWeight: 700, color: "#A1A1AA", letterSpacing: "0.08em", mb: 0.3 }}>
                              POWER
                            </Typography>
                            <Typography className="tabular-nums" sx={{ fontFamily: "var(--font-mono)", fontSize: { xs: "1.05rem", lg: "1.22rem" }, fontWeight: 900, color: "#FFFFFF" }}>
                              {powerHp !== null ? <AnimatedOdometerValue value={powerHp} /> : "—"}{" "}
                              <Box component="span" sx={{ fontSize: "0.68rem", color: "#FF6700" }}>
                                HP
                              </Box>
                            </Typography>
                          </Box>

                          <Box>
                            <Typography sx={{ fontFamily: "var(--font-mono)", fontSize: "0.60rem", fontWeight: 700, color: "#A1A1AA", letterSpacing: "0.08em", mb: 0.3 }}>
                              TORQUE
                            </Typography>
                            <Typography className="tabular-nums" sx={{ fontFamily: "var(--font-mono)", fontSize: { xs: "1.05rem", lg: "1.22rem" }, fontWeight: 900, color: "#FFFFFF" }}>
                              {torqueNm !== null ? (
                                <AnimatedOdometerValue
                                  value={torqueNm}
                                  decimals={Number.isInteger(torqueNm) ? 0 : 1}
                                />
                              ) : (
                                "—"
                              )}{" "}
                              <Box component="span" sx={{ fontSize: "0.68rem", color: "#FF6700" }}>
                                NM
                              </Box>
                            </Typography>
                          </Box>

                          <Box>
                            <Typography sx={{ fontFamily: "var(--font-mono)", fontSize: "0.60rem", fontWeight: 700, color: "#A1A1AA", letterSpacing: "0.08em", mb: 0.3 }}>
                              DRY WT
                            </Typography>
                            <Typography className="tabular-nums" sx={{ fontFamily: "var(--font-mono)", fontSize: { xs: "1.05rem", lg: "1.22rem" }, fontWeight: 900, color: "#FFFFFF" }}>
                              {dryWeightKg !== null ? <AnimatedOdometerValue value={dryWeightKg} /> : "—"}{" "}
                              <Box component="span" sx={{ fontSize: "0.68rem", color: "#FF6700" }}>
                                KG
                              </Box>
                            </Typography>
                          </Box>
                        </Box>

                        {/* MSRP Row */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            pt: 1.5,
                            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                          }}
                        >
                          <Typography sx={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", fontWeight: 700, color: "#A1A1AA", letterSpacing: "0.1em" }}>
                            STARTING MSRP
                          </Typography>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography className="tabular-nums" sx={{ fontFamily: "var(--font-mono)", fontSize: "1.35rem", fontWeight: 900, color: "#FFFFFF" }}>
                              <AnimatedOdometerValue value={effectivePrice} prefix="$" />
                            </Typography>
                            {bike.discountPrice > 0 && bike.discountPrice < bike.basePrice && (
                              <Typography sx={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "#71717A", textDecoration: "line-through" }}>
                                ${Number(bike.basePrice).toLocaleString()}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        {/* Live Action Buttons */}
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 1.5 }}>
                          <ButtonBase
                            disabled={!inStockVariant || addingId === bike.id}
                            onClick={() => void handleAddToCart(bike)}
                            sx={{
                              py: 1.25,
                              px: 1.5,
                              borderRadius: "8px",
                              border: "1px solid rgba(255, 255, 255, 0.14)",
                              backgroundColor: "rgba(255, 255, 255, 0.03)",
                              color: inStockVariant ? "#D4D4D8" : "#71717A",
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.70rem",
                              fontWeight: 700,
                              letterSpacing: "0.08em",
                              transition: "all 0.2s ease",
                              "&:hover": inStockVariant
                                ? {
                                    borderColor: "#FF6700",
                                    color: "#FFFFFF",
                                    backgroundColor: "rgba(255, 103, 0, 0.08)",
                                  }
                                : undefined,
                            }}
                          >
                            {addingId === bike.id
                              ? "ADDING..."
                              : inStockVariant
                              ? "ADD TO CART"
                              : "OUT OF STOCK"}
                          </ButtonBase>

                          <ButtonBase
                            onClick={() => navigate(`/products/${bike.id}`)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 0.8,
                              py: 1.25,
                              px: 1.5,
                              borderRadius: "8px",
                              backgroundColor: "#FF6700",
                              color: "#070709",
                              fontFamily: "var(--font-display)",
                              fontSize: "0.78rem",
                              fontWeight: 900,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                              boxShadow: "0 0 24px rgba(255, 103, 0, 0.35)",
                              transition: "all 0.25s ease",
                              "&:hover": {
                                backgroundColor: "#FF7D24",
                                boxShadow: "0 0 32px rgba(255, 103, 0, 0.55)",
                              },
                            }}
                          >
                            <span>VIEW MACHINE</span>
                            <ArrowOutwardIcon sx={{ fontSize: "0.9rem" }} />
                          </ButtonBase>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* 3. BOTTOM PIT-LANE LASER SCRUBBER */}
            <Box
              sx={{
                display: { xs: "none", lg: "block" },
                width: "100%",
                maxWidth: "1440px",
                mx: "auto",
                px: 8,
                zIndex: 15,
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "2px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  mb: 1.8,
                }}
              >
                <Box
                  className="fleet-pit-progress"
                  sx={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "#FF6700",
                    boxShadow: "0 0 12px #FF6700",
                    transform: "scaleX(0)",
                    transformOrigin: "left center",
                    willChange: "transform",
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                  {filteredVehicles.map((bike, idx) => (
                    <ButtonBase
                      key={`jump-${bike.id}`}
                      onClick={() => handleJumpToBay(idx)}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.8,
                        py: 0.4,
                        opacity: 0.7,
                        transition: "opacity 0.25s ease",
                        "&:hover": {
                          opacity: 1,
                          "& .jump-dot": {
                            backgroundColor: "#FF6700",
                            boxShadow: "0 0 8px #FF6700",
                          },
                        },
                      }}
                    >
                      <Box
                        className="jump-dot"
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "rgba(255, 255, 255, 0.45)",
                          transition: "all 0.25s ease",
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.62rem",
                          fontWeight: 800,
                          color: "#D4D4D8",
                          letterSpacing: "0.1em",
                        }}
                      >
                        {bike.productName.replace("KTM ", "").toUpperCase()}
                      </Typography>
                    </ButtonBase>
                  ))}
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast(null)}
          severity={toast?.severity || "info"}
          variant="filled"
          sx={{
            backgroundColor: toast?.severity === "success" ? "#FF6700" : toast?.severity === "error" ? "#991B1B" : "#0F0F16",
            color: toast?.severity === "success" ? "#070709" : "#F4F4F5",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: "0.75rem",
          }}
        >
          {toast?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BloodlineFleet;
