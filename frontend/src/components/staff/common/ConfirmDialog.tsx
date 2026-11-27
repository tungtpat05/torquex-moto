import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "warning" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Shared paddock-styled confirmation dialog replacing browser window.confirm prompts. */
const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const confirmButtonSx =
    tone === "danger"
      ? {
          backgroundColor: "#DC2626",
          color: "#FFFFFF",
          "&:hover": { backgroundColor: "#B91C1C" },
        }
      : {
          backgroundColor: "#FF6700",
          color: "#070709",
          "&:hover": { backgroundColor: "#FF7D24" },
        };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
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
      <DialogTitle
        id="confirm-dialog-title"
        sx={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "1.1rem",
          color: "#F4F4F5",
          pb: 1,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="confirm-dialog-description"
          sx={{
            fontFamily: "var(--font-body)",
            color: "#A1A1AA",
            fontSize: "0.9rem",
            lineHeight: 1.5,
          }}
        >
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          autoFocus
          onClick={onCancel}
          disabled={loading}
          sx={{
            color: "#A1A1AA",
            borderRadius: "8px",
            fontWeight: 600,
            "&:hover": {
              color: "#F4F4F5",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
            "&:focus-visible": {
              outline: "2px solid #FF6700",
              outlineOffset: "2px",
            },
          }}
        >
          {cancelLabel}
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            borderRadius: "8px",
            fontWeight: 800,
            ...confirmButtonSx,
            "&:focus-visible": {
              outline: "2px solid #FF6700",
              outlineOffset: "2px",
            },
          }}
        >
          {loading ? "Processing..." : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
