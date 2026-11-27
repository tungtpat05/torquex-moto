import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminUser } from "../../types/adminUser";
import { ApiErrorResponse } from "../../types/apiError";
import { resetStaffPassword } from "../../services/adminUserService";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "../../schemas/adminUserSchema";
import { applyServerValidationErrors } from "../../schemas/common";
import { extractApiErrorMessage } from "./adminFormatters";

interface ResetPasswordDialogProps {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onSuccess: (user: AdminUser) => void;
}

const ResetPasswordDialog = ({
  open,
  user,
  onClose,
  onSuccess,
}: ResetPasswordDialogProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
    defaultValues: {
      newPassword: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({ newPassword: "" });
      setShowPassword(false);
      setSubmitError(null);
    }
  }, [open, user?.id, reset]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!user) return;
    setSubmitError(null);
    try {
      await resetStaffPassword(user.id, { newPassword: values.newPassword });
      onSuccess(user);
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: ApiErrorResponse } };
      const apiData = axiosErr?.response?.data;
      if (apiData && typeof apiData === "object") {
        applyServerValidationErrors(apiData.details, setError);
      }
      setSubmitError(
        extractApiErrorMessage(err, "Failed to reset staff password. Please try again.")
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="reset-password-dialog-title"
      PaperProps={{
        sx: {
          backgroundColor: "#0F0F14",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderTop: "1px solid rgba(255, 255, 255, 0.22)",
          borderRadius: "16px",
          color: "#F4F4F5",
        },
      }}
    >
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle
          id="reset-password-dialog-title"
          sx={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.1rem",
            color: "#F4F4F5",
            pb: 1,
          }}
        >
          Reset Staff Password
        </DialogTitle>
        <DialogContent sx={{ pt: 0.5 }}>
          {user && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: "10px",
                backgroundColor: "#16161D",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#F4F4F5" }}>
                {user.fullName}
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
                {user.email}
              </Typography>
            </Box>
          )}

          {submitError && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: "10px",
                backgroundColor: "rgba(239, 68, 68, 0.12)",
                color: "#FCA5A5",
                border: "1px solid rgba(239, 68, 68, 0.28)",
              }}
            >
              {submitError}
            </Alert>
          )}

          <Controller
            name="newPassword"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                required
                fullWidth
                autoFocus
                label="New Temporary Password"
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
                sx={{
                  mt: 0.5,
                  "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#16161D",
                    color: "#F4F4F5",
                    borderRadius: "8px",
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.14)" },
                    "&:not(.Mui-error):hover fieldset": { borderColor: "#FF6700" },
                    "&:not(.Mui-error).Mui-focused fieldset": { borderColor: "#FF6700" },
                  },
                }}
              />
            )}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={onClose}
            disabled={isSubmitting}
            sx={{
              color: "#A1A1AA",
              borderRadius: "8px",
              fontWeight: 600,
              "&:hover": {
                color: "#F4F4F5",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              borderRadius: "8px",
              backgroundColor: "#FF6700",
              color: "#070709",
              fontWeight: 800,
              "&:hover": { backgroundColor: "#FF7D24" },
            }}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ResetPasswordDialog;
