import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
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
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import RefreshIcon from "@mui/icons-material/Refresh";
import PortalBreadcrumbs from "../../components/portal/PortalBreadcrumbs";
import FilterBar from "../../components/staff/common/FilterBar";
import SearchBar from "../../components/staff/common/SearchBar";
import SectionCard from "../../components/staff/common/SectionCard";
import StatusChip from "../../components/staff/common/StatusChip";
import Pagination from "../../components/staff/common/Pagination";
import ConfirmDialog from "../../components/staff/common/ConfirmDialog";
import {
  extractApiErrorMessage,
  formatAdminDate,
  resolveAuthBadge,
} from "../../components/admin/adminFormatters";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import { updateAdminUserStatus } from "../../services/adminUserService";
import { AdminUser } from "../../types/adminUser";

const PAGE_SIZE = 10;

const CustomersPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "locked">("");
  const [page, setPage] = useState(1);
  const [statusTarget, setStatusTarget] = useState<AdminUser | null>(null);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isActiveParam =
    statusFilter === "active"
      ? true
      : statusFilter === "locked"
        ? false
        : undefined;

  const { users, totalElements, totalPages, loading, error, refetch } = useAdminUsers({
    group: "CUSTOMER",
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

  const hasActiveFilters = Boolean(search || statusFilter);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value as "" | "active" | "locked");
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
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
          : `${statusTarget.fullName} locked and signed out immediately.`
      );
      await refetch();
    } catch (err: unknown) {
      setActionError(
        extractApiErrorMessage(err, "Failed to update customer status. Please try again.")
      );
    } finally {
      setStatusSubmitting(false);
      setStatusTarget(null);
    }
  };

  const startIndex = totalElements === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(page * PAGE_SIZE, totalElements);

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <PortalBreadcrumbs
        items={[
          { label: "Admin", to: "/admin/dashboard" },
          { label: "Customers" },
        ]}
      />

      <FilterBar>
        <SearchBar
          placeholder="Search customers by name or email..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onClear={() => handleSearchChange("")}
          width={{ xs: "100%", md: 360 }}
          ariaLabel="Search customers"
        />

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
              {hasActiveFilters ? "No matching customers" : "No customer accounts found"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#A1A1AA", mb: 2.5 }}>
              {hasActiveFilters
                ? "No customer account matches your current search or status filter."
                : "Customer accounts appear here when riders sign up or authenticate via Google."}
            </Typography>
            {hasActiveFilters && (
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
            )}
          </Box>
        ) : (
          <Box sx={{ width: "100%" }}>
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table size="medium" sx={{ minWidth: 720 }}>
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
                    <TableCell>Auth</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Joined</TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((customer) => {
                    const authLabel = resolveAuthBadge(customer.authProviders);
                    const isGoogle = authLabel === "GOOGLE";

                    return (
                      <TableRow
                        key={customer.id}
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
                          #{customer.id}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: "#F4F4F5" }}>
                            {customer.fullName}
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
                            {customer.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={authLabel}
                            sx={{
                              height: 24,
                              fontFamily: "var(--font-mono)",
                              fontWeight: 700,
                              fontSize: "0.7rem",
                              borderRadius: "6px",
                              backgroundColor: isGoogle
                                ? "rgba(59, 130, 246, 0.14)"
                                : "rgba(255, 255, 255, 0.06)",
                              color: isGoogle ? "#93C5FD" : "#D4D4D8",
                              border: isGoogle
                                ? "1px solid rgba(59, 130, 246, 0.30)"
                                : "1px solid rgba(255, 255, 255, 0.14)",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <StatusChip status={customer.isActive ? "Active" : "Locked"} />
                        </TableCell>
                        <TableCell
                          className="tabular-nums"
                          sx={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.8rem",
                            color: "#A1A1AA !important",
                          }}
                        >
                          {formatAdminDate(customer.createdAt)}
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 3 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            aria-label={`${customer.isActive ? "Lock" : "Unlock"} ${customer.fullName}`}
                            startIcon={
                              customer.isActive ? (
                                <LockIcon fontSize="small" />
                              ) : (
                                <LockOpenIcon fontSize="small" />
                              )
                            }
                            onClick={() => setStatusTarget(customer)}
                            sx={{
                              borderRadius: "8px",
                              fontWeight: 700,
                              borderColor: customer.isActive
                                ? "rgba(239, 68, 68, 0.40)"
                                : "rgba(34, 197, 94, 0.40)",
                              color: customer.isActive ? "#FCA5A5" : "#4ADE80",
                              "&:hover": {
                                borderColor: customer.isActive ? "#EF4444" : "#22C55E",
                                backgroundColor: customer.isActive
                                  ? "rgba(239, 68, 68, 0.12)"
                                  : "rgba(34, 197, 94, 0.12)",
                              },
                            }}
                          >
                            {customer.isActive ? "Lock" : "Unlock"}
                          </Button>
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
              itemLabel="customers"
            />
          </Box>
        )}
      </SectionCard>

      <ConfirmDialog
        open={Boolean(statusTarget)}
        title={statusTarget?.isActive ? "Lock customer account?" : "Unlock customer account?"}
        description={
          statusTarget?.isActive
            ? `Locking ${statusTarget.email}: This customer will be signed out immediately and blocked from logging in until unlocked.`
            : `Unlocking ${statusTarget?.email} will allow this customer to sign in again.`
        }
        confirmLabel={statusTarget?.isActive ? "Lock Account" : "Unlock Account"}
        cancelLabel="Cancel"
        tone={statusTarget?.isActive ? "danger" : "primary"}
        loading={statusSubmitting}
        onConfirm={() => void handleConfirmStatusToggle()}
        onCancel={() => setStatusTarget(null)}
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

export default CustomersPage;
