import { Box, IconButton, Tooltip } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface ActionButtonsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
}

const ActionButtons = ({
  onView,
  onEdit,
  onDelete,
  viewLabel = "View",
  editLabel = "Edit",
  deleteLabel = "Delete",
}: ActionButtonsProps) => {
  const sharedButtonSx = {
    minWidth: { xs: 40, sm: 36 },
    minHeight: { xs: 40, sm: 36 },
    borderRadius: "8px",
    color: "#A1A1AA",
    "&:focus-visible": {
      outline: "2px solid #FF6700",
      outlineOffset: "2px",
    },
  };

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      {onView && (
        <Tooltip title={viewLabel} arrow>
          <IconButton
            aria-label={viewLabel}
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            sx={{
              ...sharedButtonSx,
              "&:hover": {
                color: "#F4F4F5",
                backgroundColor: "rgba(255, 255, 255, 0.06)",
              },
            }}
          >
            <RemoveRedEyeIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip title={editLabel} arrow>
          <IconButton
            aria-label={editLabel}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            sx={{
              ...sharedButtonSx,
              "&:hover": {
                color: "#FF6700",
                backgroundColor: "rgba(255, 103, 0, 0.10)",
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {onDelete && (
        <Tooltip title={deleteLabel} arrow>
          <IconButton
            aria-label={deleteLabel}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            sx={{
              ...sharedButtonSx,
              "&:hover": {
                color: "#EF4444",
                backgroundColor: "rgba(239, 68, 68, 0.12)",
              },
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default ActionButtons;
