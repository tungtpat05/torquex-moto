import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import KeyIcon from "@mui/icons-material/Key";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import PortalBreadcrumbs from "../../components/portal/PortalBreadcrumbs";
import FilterBar from "../../components/staff/common/FilterBar";
import SearchBar from "../../components/staff/common/SearchBar";
import SectionCard from "../../components/staff/common/SectionCard";
import StatusChip from "../../components/staff/common/StatusChip";
import Pagination from "../../components/staff/common/Pagination";
import ConfirmDialog from "../../components/staff/common/ConfirmDialog";
import ResetPasswordDialog from "../../components/admin/ResetPasswordDialog";
import {
  extractApiErrorMessage,
  formatAdminDate,
} from "../../components/admin/adminFormatters";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import { updateAdminUserStatus } from "../../services/adminUserService";
import { AdminUser, AdminUserRole } from "../../types/adminUser";

const PAGE_SIZE = 10;

const InternalAccountsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | "STAFF" | "ADMIN">("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "locked">("");
  const [page, setPage] = useState(1);
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [statusTarget, setStatusTarget] = useState<AdminUser | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(
    (location.state as { toast?: string } | null)?.toast || null
  );

  useEffect(() => {
    const incomingToast = (location.state as { toast?: string } | null)?.toast;
    if (incomingToast) {
      setToastMessage(incomingToast);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  const isActiveParam =
    statusFilter === "active"
      ? true
      : statusFilter === "locked"
        ? false
        : undefined;

  const { users, totalElements, totalPages, loading, error, refetch } = useAdminUsers({
    group: "INTERNAL",
    role: roleFilter as AdminUserRole | "",
    isActive: isActiveParam,
    search,
    page: page - 1,
    size: PAGE_SIZE,
  });

  useEffect(() => {
    if (loading || page <= 1) return;
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    } else if (totalPages === 0) {
      setPage(1);
    }
  }, [loading, page, totalPages]);

  const hasActiveFilters = Boolean(search || roleFilter || statusFilter);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRoleFilter(event.target.value as "" | "STAFF" | "ADMIN");
    setPage(1);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value as "" | "active" | "locked");
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
    setPage(1);
  };

  const handleConfirmStatusToggle = async () => {
    if (!statusTarget) return;
    setStatusSubmitting(true);
    setActionError(null);
    const nextActive = !statusTarget.isActive;
    try {
      await updateAdminUserStatus(statusTarget.id, { isActive: nextActive });
      setToastMessage(
        nextActive
          ? `${statusTarget.fullName} unlocked successfully.`
          : `${statusTarget.fullName} locked and session revoked.`
      );
      await refetch();
    } catch (err: unknown) {
      setActionError(
        extractApiErrorMessage(err, "Failed to update account status. Please try again.")
      );
    } finally {
      setStatusSubmitting(false);
      setStatusDialogOpen(false);
    }
  };

  const startIndex = totalElements === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(page * PAGE_SIZE, totalElements);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <PortalBreadcrumbs
        items={[
          { label: "Admin", to: "/admin/dashboard" },
          { label: "Internal Accounts" },
        ]}
      />

      <FilterBar>
        <SearchBar
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onClear={() => handleSearchChange("")}
          width={{ xs: "100%", md: 320 }}
          ariaLabel="Search internal accounts"
        />

        <FormControl size="small" sx={{ minWidth: 140, width: { xs: "100%", sm: "auto" } }}>
          <Select
            value={roleFilter}
            onChange={handleRoleChange}
            displayEmpty
            inputProps={{ "aria-label": "Filter by Role" }}
            sx={{
              "& .MuiSelect-select": { py: 1.0, px: 2, fontSize: "0.875rem", fontWeight: 600 },
            }}
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="STAFF">STAFF</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 148, width: { xs: "100%", sm: "auto" } }}>
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            displayEmpty
            inputProps={{ "aria-label": "Filter by Status" }}
            sx={{
              "& .MuiSelect-select": { py: 1.0, px: 2, fontSize: "0.875rem", fontWeight: 600 },
            }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="locked">Locked</MenuItem>
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<RestartAltIcon fontSize="small" />}
            onClick={handleClearFilters}
            sx={{
              borderRadius: "8px",
              borderColor: "rgba(255, 255, 255, 0.16)",
              color: "#A1A1AA",
              fontWeight: 600,
              px: 1.75,
              py: 0.9,
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                borderColor: "#FF6700",
                color: "#F4F4F5",
                backgroundColor: "rgba(255, 103, 0, 0.06)",
              },
            }}
          >
            Clear Filters
          </Button>
        )}

        <Box sx={{ ml: { xs: 0, sm: "auto" }, width: { xs: "100%", sm: "auto" } }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/internal-accounts/create")}
            sx={{
              backgroundColor: "#FF6700",
              color: "#070709",
              fontWeight: 800,
              px: 2.5,
              py: 1,
              borderRadius: "8px",
              width: { xs: "100%", sm: "auto" },
              "&:hover": { backgroundColor: "#FF7D24" },
            }}
          >
            + Create Staff
          </Button>
        </Box>
      </FilterBar>

      {actionError && (
        <Alert
          severity="error"
          onClose={() => setActionError(null)}
          sx={{
            mb: 2.5,
            borderRadius: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.10)",
            color: "#FCA5A5",
            border: "1px solid rgba(239, 68, 68, 0.28)",
          }}
        >
          {actionError}
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 2.5,
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
              onClick={() => void refetch()}
              sx={{
                backgroundColor: "#FF6700",
                color: "#070709",
                fontWeight: 800,
                borderRadius: "8px",
              }}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <SectionCard>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 280 }}>
            <CircularProgress sx={{ color: "#FF6700" }} />
          </Box>
        ) : users.length === 0 ? (
          <Box
            sx={{
              py: 6,
              px: 2,
              textAlign: "center",
              borderRadius: "12px",
              backgroundColor: "#16161D",
              border: "1px dashed rgba(255, 255, 255, 0.14)",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#F4F4F5", mb: 0.75 }}
            >
              {hasActiveFilters ? "No matching internal accounts" : "No internal accounts found"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#A1A1AA", mb: 2.5 }}>
              {hasActiveFilters
                ? "No internal account matches your search or filters."
                : "Create your first STAFF account to grant store portal access."}
            </Typography>
            {hasActiveFilters ? (
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                sx={{
                  borderRadius: "8px",
                  borderColor: "#FF6700",
                  color: "#FF6700",
                  fontWeight: 700,
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => navigate("/admin/internal-accounts/create")}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#FF6700",
                  color: "#070709",
                  fontWeight: 800,
                }}
              >
                + Create Staff
              </Button>
            )}
          </Box>
        ) : (
          <Box sx={{ width: "100%" }}>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="medium" sx={{ minWidth: 760 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                        color: "#A1A1AA",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                        py: 1.5,
                        px: 2,
                      },
                    }}
                  >
                    <TableCell sx={{ width: 84 }}>ID</TableCell>
                    <TableCell sx={{ minWidth: 220 }}>Account</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((account) => {
                    const isAdmin = account.role === "ADMIN";
                    return (
                      <TableRow
                        key={account.id}
                        hover
                        sx={{
                          "& td": {
                            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                            color: "#F4F4F5",
                            py: 1.75,
                            px: 2,
                          },
                          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.02)" },
                        }}
                      >
                        <TableCell
                          className="tabular-nums"
                          sx={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.82rem",
                            color: "#A1A1AA !important",
                          }}
                        >
                          #{account.id}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "#F4F4F5" }}>
                            {account.fullName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontFamily: "var(--font-mono)",
                              color: "#A1A1AA",
                              display: "block",
                              mt: 0.25,
                            }}
                          >
                            {account.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={account.role}
                            sx={{
                              height: 24,
                              fontFamily: "var(--font-mono)",
                              fontWeight: 800,
                              fontSize: "0.7rem",
                              borderRadius: "6px",
                              backgroundColor: isAdmin
                                ? "rgba(255, 255, 255, 0.12)"
                                : "rgba(255, 103, 0, 0.16)",
                              color: isAdmin ? "#FFFFFF" : "#FF6700",
                              border: isAdmin
                                ? "1px solid rgba(255, 255, 255, 0.28)"
                                : "1px solid rgba(255, 103, 0, 0.35)",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <StatusChip status={account.isActive ? "Active" : "Locked"} />
                        </TableCell>
                        <TableCell
                          className="tabular-nums"
                          sx={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.8rem",
                            color: "#A1A1AA !important",
                          }}
                        >
                          {formatAdminDate(account.createdAt)}
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 3 }}>
                          {isAdmin ? (
                            <Chip
                              size="small"
                              icon={<ShieldOutlinedIcon sx={{ fontSize: "0.9rem !important" }} />}
                              label="Protected / Read-Only"
                              sx={{
                                backgroundColor: "rgba(255, 255, 255, 0.04)",
                                color: "#A1A1AA",
                                border: "1px solid rgba(255, 255, 255, 0.14)",
                                fontFamily: "var(--font-mono)",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                              }}
                            />
                          ) : (
                            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                              <Tooltip title="Edit Staff" arrow>
                                <IconButton
                                  aria-label={`Edit ${account.fullName}`}
                                  onClick={() =>
                                    navigate(`/admin/internal-accounts/${account.id}/edit`)
                                  }
                                  sx={{
                                    minWidth: 36,
                                    minHeight: 36,
                                    borderRadius: "8px",
                                    color: "#A1A1AA",
                                    "&:hover": {
                                      color: "#FF6700",
                                      backgroundColor: "rgba(255, 103, 0, 0.10)",
                                    },
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Reset Password" arrow>
                                <IconButton
                                  aria-label={`Reset password for ${account.fullName}`}
                                  onClick={() => setResetTarget(account)}
                                  sx={{
                                    minWidth: 36,
                                    minHeight: 36,
                                    borderRadius: "8px",
                                    color: "#A1A1AA",
                                    "&:hover": {
                                      color: "#FBBF24",
                                      backgroundColor: "rgba(245, 158, 11, 0.12)",
                                    },
                                  }}
                                >
                                  <KeyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title={account.isActive ? "Lock Account" : "Unlock Account"} arrow>
                                <IconButton
                                  aria-label={`${account.isActive ? "Lock" : "Unlock"} ${account.fullName}`}
                                  onClick={() => {
                                    setStatusTarget(account);
                                    setStatusDialogOpen(true);
                                  }}
                                  sx={{
                                    minWidth: 36,
                                    minHeight: 36,
                                    borderRadius: "8px",
                                    color: account.isActive ? "#A1A1AA" : "#4ADE80",
                                    "&:hover": {
                                      color: account.isActive ? "#EF4444" : "#22C55E",
                                      backgroundColor: account.isActive
                                        ? "rgba(239, 68, 68, 0.12)"
                                        : "rgba(34, 197, 94, 0.12)",
                                    },
                                  }}
                                >
                                  {account.isActive ? (
                                    <LockIcon fontSize="small" />
                                  ) : (
                                    <LockOpenIcon fontSize="small" />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Pagination
              currentPage={page}
              totalPages={Math.max(1, totalPages)}
              totalItems={totalElements}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={setPage}
              itemLabel="internal accounts"
            />
          </Box>
        )}
      </SectionCard>

      <ResetPasswordDialog
        open={Boolean(resetTarget)}
        user={resetTarget}
        onClose={() => setResetTarget(null)}
        onSuccess={(updatedUser) =>
          setToastMessage(`Temporary password updated for ${updatedUser.email}.`)
        }
      />

      <ConfirmDialog
        open={statusDialogOpen}
        title={statusTarget?.isActive ? "Lock staff account?" : "Unlock staff account?"}
        description={
          statusTarget?.isActive
            ? `Locking ${statusTarget.email} will revoke their active session immediately and block Staff Portal access until unlocked.`
            : `Unlocking ${statusTarget?.email} restores their ability to sign in to the Staff Portal.`
        }
        confirmLabel={statusTarget?.isActive ? "Lock Account" : "Unlock Account"}
        cancelLabel="Cancel"
        tone={statusTarget?.isActive ? "danger" : "primary"}
        loading={statusSubmitting}
        onConfirm={() => void handleConfirmStatusToggle()}
        onCancel={() => setStatusDialogOpen(false)}
      />

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          onClose={() => setToastMessage(null)}
          sx={{ borderRadius: "10px", fontWeight: 600 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InternalAccountsPage;
