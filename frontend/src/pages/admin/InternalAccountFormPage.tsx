import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PortalBreadcrumbs from "../../components/portal/PortalBreadcrumbs";
import SectionCard from "../../components/staff/common/SectionCard";
import ConfirmDialog from "../../components/staff/common/ConfirmDialog";
import { extractApiErrorMessage } from "../../components/admin/adminFormatters";
import {
  createStaffAccount,
  getAdminUserById,
  updateStaffAccount,
} from "../../services/adminUserService";
import {
  createStaffSchema,
  CreateStaffFormValues,
  editStaffSchema,
  EditStaffFormValues,
} from "../../schemas/adminUserSchema";
import { applyServerValidationErrors } from "../../schemas/common";
import { AdminUser } from "../../types/adminUser";
import { ApiErrorResponse } from "../../types/apiError";

interface InternalAccountFormPageProps {
  mode?: "create" | "edit";
}

const inputSx = {
  "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#16161D",
    color: "#F4F4F5",
    borderRadius: "8px",
    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.14)" },
    "&:not(.Mui-error):not(.Mui-disabled):hover fieldset": { borderColor: "#FF6700" },
    "&:not(.Mui-error).Mui-focused fieldset": { borderColor: "#FF6700" },
  },
};

const InternalAccountFormPage = ({ mode: propMode }: InternalAccountFormPageProps) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const isEditPath = location.pathname.includes("/edit") || id !== undefined;
  const mode = propMode || (isEditPath ? "edit" : "create");

  const [loading, setLoading] = useState(mode === "edit");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadedUser, setLoadedUser] = useState<AdminUser | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);

  const createForm = useForm<CreateStaffFormValues>({
    resolver: zodResolver(createStaffSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      isActive: true,
    },
  });

  const editForm = useForm<EditStaffFormValues>({
    resolver: zodResolver(editStaffSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      isActive: true,
    },
  });

  const fetchTargetUser = useCallback(async () => {
    if (mode !== "edit" || !id) return;
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getAdminUserById(Number(id));
      setLoadedUser(data);
      if (data.role === "STAFF") {
        editForm.reset({
          fullName: data.fullName || "",
          isActive: Boolean(data.isActive),
        });
      }
    } catch (err: unknown) {
      setLoadError(
        extractApiErrorMessage(err, "Failed to load account details. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  }, [mode, id, editForm]);

  useEffect(() => {
    void fetchTargetUser();
  }, [fetchTargetUser]);

  const isSubmitting =
    mode === "create" ? createForm.formState.isSubmitting : editForm.formState.isSubmitting;
  const isDirty =
    mode === "create" ? createForm.formState.isDirty : editForm.formState.isDirty;

  const handleAttemptLeave = () => {
    if (isDirty && !isSubmitting) {
      setConfirmLeaveOpen(true);
      return;
    }
    navigate("/admin/internal-accounts");
  };

  const onCreateSubmit = async (values: CreateStaffFormValues) => {
    setSubmitError(null);
    try {
      await createStaffAccount({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        isActive: values.isActive,
      });
      navigate("/admin/internal-accounts", {
        state: { toast: "Staff account created successfully." },
      });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: ApiErrorResponse } };
      const apiData = axiosErr?.response?.data;
      if (apiData && typeof apiData === "object") {
        applyServerValidationErrors(apiData.details, createForm.setError);
      }
      setSubmitError(
        extractApiErrorMessage(err, "Failed to create staff account. Please try again.")
      );
    }
  };

  const onEditSubmit = async (values: EditStaffFormValues) => {
    if (!id) return;
    setSubmitError(null);
    try {
      await updateStaffAccount(Number(id), {
        fullName: values.fullName.trim(),
        isActive: values.isActive,
      });
      navigate("/admin/internal-accounts", {
        state: { toast: "Staff account changes saved." },
      });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: ApiErrorResponse } };
      const apiData = axiosErr?.response?.data;
      if (apiData && typeof apiData === "object") {
        applyServerValidationErrors(apiData.details, editForm.setError);
      }
      setSubmitError(
        extractApiErrorMessage(err, "Failed to update staff account. Please try again.")
      );
    }
  };

  const breadcrumbsItems = [
    { label: "Admin", to: "/admin/dashboard" },
    { label: "Internal Accounts", onClick: handleAttemptLeave },
    {
      label:
        mode === "create"
          ? "Create Staff Account"
          : loadedUser?.email
            ? `Edit Staff : ${loadedUser.email}`
            : "Edit Staff Account",
    },
  ];

  if (loading) {
    return (
      <Box>
        <PortalBreadcrumbs items={breadcrumbsItems} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 280,
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: "#FF6700" }} />
          <Typography variant="body2" sx={{ color: "#A1A1AA", fontWeight: 600 }}>
            Loading staff account...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box>
        <PortalBreadcrumbs items={breadcrumbsItems} />
        <Alert
          severity="error"
          sx={{
            borderRadius: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.10)",
            color: "#FCA5A5",
            border: "1px solid rgba(239, 68, 68, 0.28)",
            mb: 2,
          }}
        >
          {loadError}
        </Alert>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => void fetchTargetUser()}
            sx={{
              backgroundColor: "#FF6700",
              color: "#070709",
              fontWeight: 800,
              borderRadius: "8px",
            }}
          >
            Retry
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/admin/internal-accounts")}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.16)",
              color: "#F4F4F5",
              borderRadius: "8px",
              fontWeight: 600,
            }}
          >
            Back to Internal Accounts
          </Button>
        </Box>
      </Box>
    );
  }

  if (mode === "edit" && loadedUser && loadedUser.role !== "STAFF") {
    return (
      <Box>
        <PortalBreadcrumbs items={breadcrumbsItems} />
        <Alert
          severity="warning"
          sx={{
            borderRadius: "12px",
            backgroundColor: "rgba(245, 158, 11, 0.12)",
            color: "#FBBF24",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            mb: 2.5,
          }}
        >
          Only STAFF internal accounts can be edited here. Account{" "}
          <strong>{loadedUser.email}</strong> has role <strong>{loadedUser.role}</strong>.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/internal-accounts")}
          sx={{
            borderColor: "rgba(255, 255, 255, 0.16)",
            color: "#F4F4F5",
            borderRadius: "8px",
            fontWeight: 700,
          }}
        >
          Back to Internal Accounts
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      noValidate
      onSubmit={
        mode === "create"
          ? createForm.handleSubmit(onCreateSubmit)
          : editForm.handleSubmit(onEditSubmit)
      }
      sx={{ width: "100%" }}
    >
      <PortalBreadcrumbs items={breadcrumbsItems} />

      {submitError && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.10)",
            color: "#FCA5A5",
            border: "1px solid rgba(239, 68, 68, 0.28)",
          }}
        >
          {submitError}
        </Alert>
      )}

      <Grid container spacing={3.5}>
        <Grid size={{ xs: 12, lg: 8 }} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <SectionCard
            title={mode === "create" ? "Staff Credentials" : "Staff Account Details"}
            subtitle={
              mode === "create"
                ? "Creates a store operations STAFF account with direct BCrypt password"
                : "Update staff display name or account access status"
            }
          >
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                {mode === "create" ? (
                  <Controller
                    name="fullName"
                    control={createForm.control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label="Full Name"
                        placeholder="e.g. Store Operations Lead"
                        disabled={isSubmitting}
                        error={Boolean(fieldState.error)}
                        helperText={fieldState.error?.message}
                        sx={inputSx}
                      />
                    )}
                  />
                ) : (
                  <Controller
                    name="fullName"
                    control={editForm.control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label="Full Name"
                        disabled={isSubmitting}
                        error={Boolean(fieldState.error)}
                        helperText={fieldState.error?.message}
                        sx={inputSx}
                      />
                    )}
                  />
                )}
              </Grid>

              <Grid size={{ xs: 12 }}>
                {mode === "create" ? (
                  <Controller
                    name="email"
                    control={createForm.control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        type="email"
                        label="Email Address"
                        placeholder="staff.member@torquex.com"
                        disabled={isSubmitting}
                        error={Boolean(fieldState.error)}
                        helperText={fieldState.error?.message}
                        sx={inputSx}
                      />
                    )}
                  />
                ) : (
                  <TextField
                    fullWidth
                    disabled
                    label="Email Address"
                    value={loadedUser?.email || ""}
                    helperText="Email address cannot be modified after account creation"
                    sx={inputSx}
                  />
                )}
              </Grid>

              {mode === "create" && (
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="password"
                    control={createForm.control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label="Initial Password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        disabled={isSubmitting}
                        error={Boolean(fieldState.error)}
                        helperText={
                          fieldState.error?.message || "Minimum 6 characters (hashed with BCrypt)"
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword((prev) => !prev)}
                                edge="end"
                                sx={{ color: "#A1A1AA", "&:hover": { color: "#FF6700" } }}
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={inputSx}
                      />
                    )}
                  />
                </Grid>
              )}
            </Grid>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <SectionCard title="Role & Access">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "10px",
                  backgroundColor: "#16161D",
                  border: "1px solid rgba(255, 255, 255, 0.10)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      fontFamily: "var(--font-mono)",
                      color: "#A1A1AA",
                      fontWeight: 700,
                    }}
                  >
                    ASSIGNED ROLE
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#71717A" }}>
                    Fixed to Store Operations
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label="STAFF"
                  sx={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 800,
                    fontSize: "0.72rem",
                    backgroundColor: "rgba(255, 103, 0, 0.16)",
                    color: "#FF6700",
                    border: "1px solid rgba(255, 103, 0, 0.35)",
                  }}
                />
              </Box>

              {mode === "create" ? (
                <Controller
                  name="isActive"
                  control={createForm.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Boolean(field.value)}
                          onChange={(e) => field.onChange(e.target.checked)}
                          disabled={isSubmitting}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": { color: "#FF6700" },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#FF6700",
                            },
                          }}
                        />
                      }
                      label="Active Status"
                      labelPlacement="start"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mx: 0,
                        color: "#F4F4F5",
                        "& .MuiTypography-root": { fontSize: "0.9rem", fontWeight: 600 },
                      }}
                    />
                  )}
                />
              ) : (
                <Controller
                  name="isActive"
                  control={editForm.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Boolean(field.value)}
                          onChange={(e) => field.onChange(e.target.checked)}
                          disabled={isSubmitting}
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": { color: "#FF6700" },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                              backgroundColor: "#FF6700",
                            },
                          }}
                        />
                      }
                      label="Active Status"
                      labelPlacement="start"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mx: 0,
                        color: "#F4F4F5",
                        "& .MuiTypography-root": { fontSize: "0.9rem", fontWeight: 600 },
                      }}
                    />
                  )}
                />
              )}
            </Box>
          </SectionCard>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                py: 1.25,
                backgroundColor: "#FF6700",
                color: "#070709",
                fontWeight: 800,
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#FF7D24" },
              }}
            >
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Create Staff"
                  : "Save Changes"}
            </Button>

            <Button
              fullWidth
              disabled={isSubmitting}
              onClick={handleAttemptLeave}
              sx={{
                py: 1.25,
                color: "#A1A1AA",
                fontWeight: 600,
                borderRadius: "8px",
                "&:hover": {
                  color: "#EF4444",
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirmLeaveOpen}
        title="Discard unsaved changes?"
        description="You have unsaved edits on this staff account. Leaving now will discard your changes."
        confirmLabel="Discard"
        cancelLabel="Keep Editing"
        tone="warning"
        onConfirm={() => {
          setConfirmLeaveOpen(false);
          navigate("/admin/internal-accounts");
        }}
        onCancel={() => setConfirmLeaveOpen(false)}
      />
    </Box>
  );
};

export default InternalAccountFormPage;
