import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import ShieldIcon from "@mui/icons-material/Shield";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context";
import { getUser } from "../../services/authService";
import { User } from "../../types/user";
import { isAdminRole, isStaffRole, normalizeRole } from "../../utils/role";

const paddockCardSx = {
  borderRadius: "16px",
  backgroundColor: "rgba(15, 15, 20, 0.90)",
  backdropFilter: "blur(20px)",
  backgroundImage: "none",
  border: "1px solid rgba(255, 255, 255, 0.10)",
  borderTop: "1px solid rgba(255, 255, 255, 0.25)",
  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.70)",
  color: "#F4F4F5",
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user: contextUser, logout } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(contextUser);
  const [loading, setLoading] = useState<boolean>(!contextUser);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchFreshUserData = useCallback(async () => {
    try {
      setFetchError(null);
      const freshData = await getUser();
      setProfileUser(freshData);
    } catch (err) {
      console.error("Failed to fetch profile details:", err);
      setFetchError("Unable to refresh rider profile telemetry. Showing cached session info.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFreshUserData();
  }, [fetchFreshUserData]);

  const displayUser = profileUser || contextUser;

  const initialLetter = displayUser?.fullName
    ? displayUser.fullName.trim().charAt(0).toUpperCase()
    : "U";

  const userRole = normalizeRole(displayUser?.role) || "CUSTOMER";
  const isStaff = isStaffRole(displayUser?.role);
  const isAdmin = isAdminRole(displayUser?.role);
  const isPrivilegedRole = isStaff || isAdmin;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        backgroundColor: "#070709",
        pt: { xs: 2, md: 3 },
        pb: 12,
        overflowX: "hidden",
      }}
    >
      {/* Overhead Ambient Studio Glow */}
      <Box
        sx={{
          position: "absolute",
          top: "-140px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1000px",
          height: "380px",
          background:
            "radial-gradient(ellipse at center, rgba(255, 103, 0, 0.10) 0%, rgba(255, 103, 0, 0.02) 52%, transparent 76%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1440px",
          mx: "auto",
          px: { xs: 2.5, md: 6, lg: 8 },
        }}
      >
        <Breadcrumbs
          separator={<NavigateNextIcon sx={{ fontSize: "0.95rem", color: "#71717A" }} />}
          aria-label="breadcrumb"
          sx={{ mb: 4 }}
        >
          <Typography
            component={Link}
            to="/"
            sx={{
              color: "#A1A1AA",
              textDecoration: "none",
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              "&:hover": { color: "#FF6700" },
            }}
          >
            Home
          </Typography>
          <Typography
            sx={{
              color: "#FF6700",
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Rider Account
          </Typography>
        </Breadcrumbs>

        {fetchError && (
          <Alert
            severity="warning"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => void fetchFreshUserData()}
                sx={{ fontFamily: "var(--font-mono)", fontWeight: 800 }}
              >
                RETRY
              </Button>
            }
            sx={{
              mb: 3,
              backgroundColor: "rgba(255, 103, 0, 0.12)",
              color: "#F4F4F5",
              border: "1px solid rgba(255, 103, 0, 0.35)",
              borderRadius: "8px",
            }}
          >
            {fetchError}
          </Alert>
        )}

        {/* Profile Header Hero Card */}
        <Paper elevation={0} sx={{ ...paddockCardSx, p: { xs: 3, sm: 4 }, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size="auto">
              {loading ? (
                <Skeleton
                  variant="circular"
                  width={96}
                  height={96}
                  sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: { xs: 76, sm: 96 },
                    height: { xs: 76, sm: 96 },
                    bgcolor: "rgba(255, 103, 0, 0.14)",
                    color: "#FF6700",
                    fontFamily: "var(--font-display)",
                    fontSize: { xs: "2rem", sm: "2.6rem" },
                    fontWeight: 950,
                    border: "2.5px solid #FF6700",
                    boxShadow: "0 0 28px rgba(255, 103, 0, 0.35)",
                  }}
                >
                  {initialLetter}
                </Avatar>
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: "grow" }}>
              {loading ? (
                <Stack spacing={1}>
                  <Skeleton width="60%" height={40} sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }} />
                  <Skeleton width="40%" height={24} sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }} />
                </Stack>
              ) : (
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 1 }}>
                    <Typography
                      component="h1"
                      sx={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 950,
                        fontSize: { xs: "1.65rem", sm: "2.15rem" },
                        letterSpacing: "-0.025em",
                        color: "#FFFFFF",
                        textTransform: "uppercase",
                      }}
                    >
                      {displayUser?.fullName || "Rider Profile"}
                    </Typography>
                    <Chip
                      icon={isPrivilegedRole ? <AdminPanelSettingsIcon /> : <ShieldIcon />}
                      label={userRole}
                      sx={{
                        backgroundColor: isPrivilegedRole ? "rgba(255, 103, 0, 0.16)" : "rgba(16, 185, 129, 0.14)",
                        color: isPrivilegedRole ? "#FF6700" : "#10B981",
                        border: `1px solid ${isPrivilegedRole ? "rgba(255, 103, 0, 0.4)" : "rgba(16, 185, 129, 0.35)"}`,
                        fontFamily: "var(--font-mono)",
                        fontWeight: 800,
                        fontSize: "0.72rem",
                      }}
                    />
                    <Chip
                      icon={<CheckCircleIcon sx={{ fontSize: "1rem !important", color: "#10B981 !important" }} />}
                      label="Active Account"
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        color: "#D4D4D8",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color: "#A1A1AA",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.82rem",
                      overflowWrap: "anywhere",
                    }}
                  >
                    <EmailIcon sx={{ fontSize: 17, color: "#FF6700", flexShrink: 0 }} />
                    {displayUser?.email}
                  </Typography>
                </Box>
              )}
            </Grid>

            <Grid size={{ xs: 12, md: "auto" }}>
              <Stack direction={{ xs: "row", sm: "row", md: "column" }} spacing={1.5}>
                {isAdmin && (
                  <Button
                    variant="contained"
                    startIcon={<AdminPanelSettingsIcon />}
                    onClick={() => navigate("/admin/dashboard")}
                    sx={{
                      backgroundColor: "#FF6700",
                      color: "#070709",
                      fontFamily: "var(--font-display)",
                      fontWeight: 900,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      borderRadius: "8px",
                      boxShadow: "0 0 24px rgba(255, 103, 0, 0.35)",
                      "&:hover": { backgroundColor: "#FF7D24" },
                    }}
                  >
                    Admin Portal
                  </Button>
                )}
                {isStaff && (
                  <Button
                    variant="contained"
                    startIcon={<AdminPanelSettingsIcon />}
                    onClick={() => navigate("/staff/dashboard")}
                    sx={{
                      backgroundColor: "#FF6700",
                      color: "#070709",
                      fontFamily: "var(--font-display)",
                      fontWeight: 900,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      borderRadius: "8px",
                      boxShadow: "0 0 24px rgba(255, 103, 0, 0.35)",
                      "&:hover": { backgroundColor: "#FF7D24" },
                    }}
                  >
                    Staff Portal
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    borderColor: "rgba(239, 68, 68, 0.4)",
                    color: "#FCA5A5",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    borderRadius: "8px",
                    "&:hover": {
                      borderColor: "#EF4444",
                      backgroundColor: "rgba(239, 68, 68, 0.12)",
                    },
                  }}
                >
                  Sign Out
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Detailed Information Grid */}
        <Grid container spacing={3}>
          {/* Card 1: Account Overview */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                ...paddockCardSx,
                height: "100%",
                transition: "border-color 0.25s ease",
                "&:hover": { borderColor: "rgba(255, 103, 0, 0.4)" },
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                <Box sx={{ mb: 2.5, display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 0.9,
                      borderRadius: "8px",
                      bgcolor: "rgba(255, 103, 0, 0.14)",
                      border: "1px solid rgba(255, 103, 0, 0.3)",
                      color: "#FF6700",
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 19 }} />
                  </Box>
                  <Typography
                    component="h2"
                    sx={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#FF6700",
                    }}
                  >
                    Rider Telemetry
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.08)" }} />

                <Stack spacing={2.5}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1.5,
                      py: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#A1A1AA",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.74rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 17, color: "#71717A" }} /> Full Name
                    </Typography>
                    <Typography
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: 700,
                        overflowWrap: "anywhere",
                        textAlign: "right",
                      }}
                    >
                      {displayUser?.fullName || "N/A"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1.5,
                      py: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#A1A1AA",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.74rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <EmailIcon sx={{ fontSize: 17, color: "#71717A" }} /> Email Address
                    </Typography>
                    <Typography
                      sx={{
                        color: "#FFFFFF",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.86rem",
                        fontWeight: 700,
                        overflowWrap: "anywhere",
                        textAlign: "right",
                      }}
                    >
                      {displayUser?.email || "N/A"}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2: Security & Credentials */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={0}
              sx={{
                ...paddockCardSx,
                height: "100%",
                transition: "border-color 0.25s ease",
                "&:hover": { borderColor: "rgba(255, 103, 0, 0.4)" },
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                <Box sx={{ mb: 2.5, display: "flex", alignItems: "center", gap: 1.25 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 0.9,
                      borderRadius: "8px",
                      bgcolor: "rgba(255, 103, 0, 0.14)",
                      border: "1px solid rgba(255, 103, 0, 0.3)",
                      color: "#FF6700",
                    }}
                  >
                    <ShieldIcon sx={{ fontSize: 19 }} />
                  </Box>
                  <Typography
                    component="h2"
                    sx={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.78rem",
                      fontWeight: 800,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#FF6700",
                    }}
                  >
                    Account Security &amp; Role
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.08)" }} />

                <Stack spacing={2.5}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1.5,
                      py: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#A1A1AA",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.74rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <ShieldIcon sx={{ fontSize: 17, color: "#71717A" }} /> Access Level
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 800,
                        color: isPrivilegedRole ? "#FF6700" : "#10B981",
                      }}
                    >
                      {userRole}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1.5,
                      py: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#A1A1AA",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.74rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 17, color: "#71717A" }} /> Account Status
                    </Typography>
                    <Typography sx={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "#10B981" }}>
                      {displayUser?.isActive !== false ? "Active & Verified" : "Suspended"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1.5,
                      py: 0.5,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#A1A1AA",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.74rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <CalendarTodayIcon sx={{ fontSize: 17, color: "#71717A" }} /> Member Since
                    </Typography>
                    <Typography
                      className="tabular-nums"
                      sx={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "#FFFFFF" }}
                    >
                      {formatDate(displayUser?.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions Bar */}
          <Grid size={{ xs: 12 }}>
            <Paper elevation={0} sx={{ ...paddockCardSx, p: { xs: 3, md: 3.5 } }}>
              <Typography
                component="h2"
                sx={{
                  mb: 2,
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.76rem",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#A1A1AA",
                }}
              >
                Quick Navigation
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Button
                  variant="outlined"
                  startIcon={<ShoppingBagIcon />}
                  onClick={() => navigate("/cart")}
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.16)",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    color: "#F4F4F5",
                    borderRadius: "8px",
                    px: 2.75,
                    py: 1.1,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    "&:hover": {
                      borderColor: "#FF6700",
                      backgroundColor: "rgba(255, 103, 0, 0.08)",
                      color: "#FF6700",
                    },
                  }}
                >
                  Allocation Cart
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate("/#fleet")}
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.16)",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    color: "#F4F4F5",
                    borderRadius: "8px",
                    px: 2.75,
                    py: 1.1,
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    "&:hover": {
                      borderColor: "#FF6700",
                      backgroundColor: "rgba(255, 103, 0, 0.08)",
                      color: "#FF6700",
                    },
                  }}
                >
                  Explore Lineup
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProfilePage;
