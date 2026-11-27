import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
import PortalBreadcrumbs from "../../components/portal/PortalBreadcrumbs";
import SectionCard from "../../components/staff/common/SectionCard";
import StatusChip from "../../components/staff/common/StatusChip";
import MetricCard from "../../components/staff/dashboard/MetricCard";
import { useAdminUserSummary } from "../../hooks/useAdminUserSummary";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import { formatAdminDate } from "../../components/admin/adminFormatters";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useAdminUserSummary();
  const {
    users: internalUsers,
    loading: internalLoading,
    error: internalError,
    refetch: refetchInternal,
  } = useAdminUsers({ group: "INTERNAL", page: 0, size: 5 });
  const {
    users: lockedUsers,
    loading: lockedLoading,
    error: lockedError,
    refetch: refetchLocked,
  } = useAdminUsers({ group: "ALL", isActive: false, page: 0, size: 5 });

  const loading = summaryLoading || internalLoading || lockedLoading;
  const error = summaryError || internalError || lockedError;

  const handleRetry = () => {
    void Promise.all([refetchSummary(), refetchInternal(), refetchLocked()]);
  };

  if (loading) {
    return (
      <Box>
        <PortalBreadcrumbs items={[{ label: "Admin" }, { label: "Dashboard" }]} />
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 320 }}>
          <CircularProgress sx={{ color: "#FF6700" }} />
        </Box>
      </Box>
    );
  }

  if (error || !summary) {
    return (
      <Box>
        <PortalBreadcrumbs items={[{ label: "Admin" }, { label: "Dashboard" }]} />
        <Alert
          severity="error"
          sx={{
            borderRadius: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.10)",
            color: "#FCA5A5",
            border: "1px solid rgba(239, 68, 68, 0.28)",
            alignItems: "center",
          }}
          action={
            <Button
              size="small"
              variant="contained"
              startIcon={<RefreshIcon fontSize="small" />}
              onClick={handleRetry}
              sx={{
                backgroundColor: "#FF6700",
                color: "#070709",
                fontWeight: 800,
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#FF7D24" },
              }}
            >
              Retry
            </Button>
          }
        >
          {error || "Failed to load admin telemetry."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <PortalBreadcrumbs items={[{ label: "Admin" }, { label: "Dashboard" }]} />

      {/* Account Telemetry Metrics */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Total Accounts"
            value={summary.totalUsers.toLocaleString()}
            diff={`${summary.activeCount} active · ${summary.lockedCount} locked`}
            tone={summary.totalUsers > 0 ? "positive" : "neutral"}
            icon={<GroupIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Internal Team"
            value={summary.internalCount.toLocaleString()}
            diff={`${summary.staffCount} staff · ${summary.adminCount} admin`}
            tone="neutral"
            icon={<ManageAccountsIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Customers"
            value={summary.customerCount.toLocaleString()}
            diff={`${summary.googleCustomerCount} Google linked`}
            tone="positive"
            icon={<PersonOutlineIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <MetricCard
            title="Locked Accounts"
            value={summary.lockedCount.toLocaleString()}
            diff={
              summary.lockedCount > 0
                ? "Session & login blocked"
                : "All accounts active"
            }
            tone={summary.lockedCount > 0 ? "danger" : "positive"}
            icon={<LockOutlinedIcon />}
          />
        </Grid>
      </Grid>

      {/* Quick Navigation & Recent Snapshots */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <SectionCard
            title="Internal Team Roster"
            subtitle="STAFF accounts can be created, edited, reset, or locked; ADMIN seed accounts stay read-only"
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.5,
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              <Button
                size="small"
                variant="outlined"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                onClick={() => navigate("/admin/internal-accounts")}
                sx={{
                  borderColor: "rgba(255, 255, 255, 0.16)",
                  color: "#F4F4F5",
                  fontWeight: 700,
                  borderRadius: "8px",
                  "&:hover": {
                    borderColor: "#FF6700",
                    color: "#FF6700",
                  },
                }}
              >
                Manage Internal Accounts
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/admin/internal-accounts/create")}
                sx={{
                  backgroundColor: "#FF6700",
                  color: "#070709",
                  fontWeight: 800,
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#FF7D24" },
                }}
              >
                Create Staff
              </Button>
            </Box>

            {internalUsers.length === 0 ? (
              <Typography variant="body2" sx={{ color: "#A1A1AA" }}>
                No internal accounts found.
              </Typography>
            ) : (
              <TableContainer sx={{ overflowX: "auto" }}>
                <Table size="small" sx={{ minWidth: 500 }}>
                  <TableHead>
                    <TableRow
                      sx={{
                        "& th": {
                          backgroundColor: "rgba(255, 255, 255, 0.03)",
                          color: "#A1A1AA",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.10)",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        },
                      }}
                    >
                      <TableCell>Account</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {internalUsers.map((account) => (
                      <TableRow
                        key={account.id}
                        hover
                        sx={{
                          "& td": {
                            borderColor: "rgba(255, 255, 255, 0.06)",
                            color: "#F4F4F5",
                          },
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {account.fullName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ fontFamily: "var(--font-mono)", color: "#A1A1AA" }}
                          >
                            {account.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={account.role}
                            sx={{
                              height: 22,
                              fontFamily: "var(--font-mono)",
                              fontWeight: 800,
                              fontSize: "0.68rem",
                              borderRadius: "6px",
                              backgroundColor:
                                account.role === "ADMIN"
                                  ? "rgba(255, 255, 255, 0.10)"
                                  : "rgba(255, 103, 0, 0.16)",
                              color: account.role === "ADMIN" ? "#F4F4F5" : "#FF6700",
                              border:
                                account.role === "ADMIN"
                                  ? "1px solid rgba(255, 255, 255, 0.22)"
                                  : "1px solid rgba(255, 103, 0, 0.35)",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <StatusChip status={account.isActive ? "Active" : "Locked"} />
                        </TableCell>
                        <TableCell
                          align="right"
                          className="tabular-nums"
                          sx={{ fontFamily: "var(--font-mono)", color: "#A1A1AA", fontSize: "0.78rem" }}
                        >
                          {formatAdminDate(account.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Stack spacing={3}>
            <SectionCard
              title="Locked Accounts Watchlist"
              subtitle="Accounts currently denied API and login access"
            >
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  endIcon={<ArrowForwardIcon fontSize="small" />}
                  onClick={() => navigate("/admin/customers")}
                  sx={{
                    borderColor: "rgba(255, 255, 255, 0.16)",
                    color: "#F4F4F5",
                    fontWeight: 700,
                    borderRadius: "8px",
                    "&:hover": {
                      borderColor: "#FF6700",
                      color: "#FF6700",
                    },
                  }}
                >
                  Manage Customers
                </Button>
              </Box>

              {lockedUsers.length === 0 ? (
                <Typography variant="body2" sx={{ color: "#4ADE80", fontWeight: 600 }}>
                  No accounts are currently locked.
                </Typography>
              ) : (
                <Stack spacing={1.25}>
                  {lockedUsers.map((account) => (
                    <Box
                      key={account.id}
                      sx={{
                        p: 1.5,
                        borderRadius: "10px",
                        backgroundColor: "#16161D",
                        border: "1px solid rgba(255, 255, 255, 0.10)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1.5,
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 700, color: "#F4F4F5" }}>
                          {account.fullName}
                        </Typography>
                        <Typography
                          variant="caption"
                          noWrap
                          sx={{
                            display: "block",
                            fontFamily: "var(--font-mono)",
                            color: "#A1A1AA",
                            fontSize: "0.72rem",
                          }}
                        >
                          {account.email}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                        <Chip
                          size="small"
                          label={account.role}
                          sx={{
                            height: 22,
                            fontFamily: "var(--font-mono)",
                            fontWeight: 700,
                            fontSize: "0.66rem",
                            borderRadius: "6px",
                            backgroundColor: "rgba(255, 255, 255, 0.06)",
                            color: "#D4D4D8",
                            border: "1px solid rgba(255, 255, 255, 0.14)",
                          }}
                        />
                        <StatusChip status="Locked" />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              )}
            </SectionCard>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;
