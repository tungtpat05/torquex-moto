import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SectionCard from "../common/SectionCard";
import StatusChip from "../common/StatusChip";
import ConfirmDialog from "../common/ConfirmDialog";
import { SpecDefinition, SpecDataType } from "../../../types/specDefinition";
import { ApiErrorResponse } from "../../../types/apiError";
import {
  createSpecDefinition,
  createSpecDefinitionOption,
  deleteSpecDefinition,
  deleteSpecDefinitionOption,
  getSpecDefinitionsByCategory,
  updateSpecDefinition,
} from "../../../services/specDefinitionService";
import {
  specDefinitionSchema,
  SpecDefinitionFormValues,
} from "../../../schemas/specDefinitionSchema";
import { applyServerValidationErrors } from "../../../schemas/common";

interface SpecDefinitionManagerProps {
  categoryId?: number;
}

const slugifyKey = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/[\s-]+/g, "_");

const SpecDefinitionManager: React.FC<SpecDefinitionManagerProps> = ({ categoryId }) => {
  const [specDefs, setSpecDefs] = useState<SpecDefinition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDef, setEditingDef] = useState<SpecDefinition | null>(null);
  const [isKeyManuallyEdited, setIsKeyManuallyEdited] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [newOptionValue, setNewOptionValue] = useState("");
  const [draftOptions, setDraftOptions] = useState<string[]>([]);
  const [addingOption, setAddingOption] = useState(false);

  const [pendingDeleteDef, setPendingDeleteDef] = useState<SpecDefinition | null>(null);
  const [deletingDef, setDeletingDef] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    setError: setFieldError,
    formState: { isSubmitting },
  } = useForm<SpecDefinitionFormValues>({
    resolver: zodResolver(specDefinitionSchema),
    mode: "onTouched",
    defaultValues: {
      keyCode: "",
      displayName: "",
      dataType: "text",
      unit: "",
      displayOrder: 1,
      isRequired: false,
      isActive: true,
    },
  });

  const dataType = watch("dataType");

  const fetchSpecDefs = useCallback(async () => {
    if (!categoryId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getSpecDefinitionsByCategory(categoryId, false);
      setSpecDefs(data);
    } catch {
      setError("Failed to load specification fields for this category.");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (categoryId) {
      void fetchSpecDefs();
    }
  }, [categoryId, fetchSpecDefs]);

  const handleOpenAddDialog = () => {
    setEditingDef(null);
    setIsKeyManuallyEdited(false);
    setFormError(null);
    setNewOptionValue("");
    setDraftOptions([]);
    reset({
      keyCode: "",
      displayName: "",
      dataType: "text",
      unit: "",
      displayOrder: specDefs.length + 1,
      isRequired: false,
      isActive: true,
    });
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (def: SpecDefinition) => {
    setEditingDef(def);
    setIsKeyManuallyEdited(true);
    setFormError(null);
    setNewOptionValue("");
    setDraftOptions([]);
    reset({
      keyCode: def.keyCode,
      displayName: def.displayName,
      dataType: def.dataType,
      unit: def.unit || "",
      displayOrder: def.displayOrder,
      isRequired: def.isRequired,
      isActive: def.isActive,
    });
    setDialogOpen(true);
  };

  const onSaveDef = async (values: SpecDefinitionFormValues) => {
    if (!categoryId) return;
    setFormError(null);

    try {
      if (editingDef) {
        await updateSpecDefinition(categoryId, editingDef.id, {
          keyCode: values.keyCode.trim(),
          displayName: values.displayName.trim(),
          dataType: values.dataType,
          unit: values.dataType === "number" ? (values.unit || "").trim() : "",
          displayOrder: values.displayOrder,
          isRequired: values.isRequired,
          isActive: values.isActive,
        });
        setToastMessage("Specification field updated.");
      } else {
        const created = await createSpecDefinition(categoryId, {
          keyCode: values.keyCode.trim(),
          displayName: values.displayName.trim(),
          dataType: values.dataType,
          unit: values.dataType === "number" ? (values.unit || "").trim() : "",
          displayOrder: values.displayOrder,
          isRequired: values.isRequired,
        });

        if (values.dataType === "select" && draftOptions.length > 0) {
          for (let i = 0; i < draftOptions.length; i += 1) {
            await createSpecDefinitionOption(categoryId, created.id, {
              optionValue: draftOptions[i],
              displayOrder: i + 1,
            });
          }
        }
        setToastMessage("Specification field created.");
      }
      setDialogOpen(false);
      await fetchSpecDefs();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: ApiErrorResponse }; message?: string };
      const apiData = axiosErr?.response?.data;
      if (apiData && typeof apiData === "object") {
        applyServerValidationErrors(apiData.details, setFieldError);
        setFormError(apiData.message || "Failed to save spec field.");
      } else {
        setFormError(axiosErr?.message || "Failed to save spec field.");
      }
    }
  };

  const handleConfirmDeleteDef = async () => {
    if (!categoryId || !pendingDeleteDef) return;
    setDeletingDef(true);
    try {
      await deleteSpecDefinition(categoryId, pendingDeleteDef.id);
      setPendingDeleteDef(null);
      setToastMessage("Specification field deleted.");
      await fetchSpecDefs();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || "Failed to delete spec field.");
      setPendingDeleteDef(null);
    } finally {
      setDeletingDef(false);
    }
  };

  const handleAddOption = async () => {
    const trimmed = newOptionValue.trim();
    if (!trimmed) return;

    if (!editingDef) {
      if (!draftOptions.includes(trimmed)) {
        setDraftOptions((prev) => [...prev, trimmed]);
      }
      setNewOptionValue("");
      return;
    }

    if (!categoryId) return;
    setAddingOption(true);
    try {
      await createSpecDefinitionOption(categoryId, editingDef.id, {
        optionValue: trimmed,
        displayOrder: (editingDef.options?.length || 0) + 1,
      });
      setNewOptionValue("");
      const updatedDefs = await getSpecDefinitionsByCategory(categoryId, false);
      setSpecDefs(updatedDefs);
      const updatedCurrent = updatedDefs.find((d) => d.id === editingDef.id);
      if (updatedCurrent) {
        setEditingDef(updatedCurrent);
      }
      setToastMessage(`Option "${trimmed}" added.`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setFormError(axiosErr?.response?.data?.message || "Failed to add option.");
    } finally {
      setAddingOption(false);
    }
  };

  const handleDeleteOption = async (optionId: number) => {
    if (!categoryId || !editingDef) return;
    try {
      await deleteSpecDefinitionOption(categoryId, editingDef.id, optionId);
      const updatedDefs = await getSpecDefinitionsByCategory(categoryId, false);
      setSpecDefs(updatedDefs);
      const updatedCurrent = updatedDefs.find((d) => d.id === editingDef.id);
      if (updatedCurrent) {
        setEditingDef(updatedCurrent);
      }
      setToastMessage("Option removed.");
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setFormError(axiosErr?.response?.data?.message || "Failed to delete option.");
    }
  };

  if (!categoryId) {
    return (
      <SectionCard title="Specification Fields">
        <Typography variant="body2" sx={{ color: "#A1A1AA", fontStyle: "italic", py: 1 }}>
          Save the category first to configure custom specification fields (e.g. Displacement, Max Power, Electronics).
        </Typography>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Specification Fields Configuration">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 2,
        }}
      >
        <Typography variant="body2" sx={{ color: "#A1A1AA" }}>
          Define specs required for models under this category.
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            backgroundColor: "#FF6700",
            color: "#070709",
            fontWeight: 800,
            borderRadius: "8px",
            px: 2,
            "&:hover": { backgroundColor: "#FF7D24" },
          }}
        >
          Add Spec Field
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={28} sx={{ color: "#FF6700" }} />
        </Box>
      ) : specDefs.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: "center",
            backgroundColor: "#16161D",
            borderColor: "rgba(255, 255, 255, 0.12)",
            borderRadius: "12px",
          }}
        >
          <Typography variant="body2" sx={{ color: "#A1A1AA" }}>
            No specification fields defined for this category yet. Click{" "}
            <strong>Add Spec Field</strong> to create fields like <em>Displacement (cc)</em>,{" "}
            <em>Horsepower</em>, or <em>Transmission</em>.
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            overflowX: "auto",
            backgroundColor: "#0F0F14",
            borderColor: "rgba(255, 255, 255, 0.10)",
            borderRadius: "12px",
          }}
        >
          <Table size="small" sx={{ minWidth: 680 }}>
            <TableHead sx={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}>
              <TableRow
                sx={{
                  "& th": {
                    fontFamily: "var(--font-mono)",
                    color: "#A1A1AA",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    letterSpacing: "0.05em",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                <TableCell>#</TableCell>
                <TableCell>DISPLAY NAME</TableCell>
                <TableCell>KEY CODE</TableCell>
                <TableCell>TYPE</TableCell>
                <TableCell>UNIT</TableCell>
                <TableCell>REQ?</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell align="right">ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {specDefs.map((def, idx) => (
                <TableRow
                  key={def.id}
                  hover
                  sx={{
                    "& td": { borderColor: "rgba(255, 255, 255, 0.06)" },
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.02)" },
                  }}
                >
                  <TableCell
                    className="tabular-nums"
                    sx={{ fontFamily: "var(--font-mono)", color: "#E4E4E7" }}
                  >
                    {def.displayOrder || idx + 1}
                  </TableCell>
                  <TableCell sx={{ color: "#F4F4F5", fontWeight: 600 }}>{def.displayName}</TableCell>
                  <TableCell
                    sx={{
                      color: "#A1A1AA",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.78rem",
                    }}
                  >
                    {def.keyCode}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={def.dataType.toUpperCase()}
                      size="small"
                      sx={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.66rem",
                        fontWeight: 700,
                        borderRadius: "4px",
                        backgroundColor:
                          def.dataType === "select" ? "rgba(255, 103, 0, 0.14)" : "#16161D",
                        color: def.dataType === "select" ? "#FF6700" : "#E4E4E7",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#A1A1AA" }}>{def.unit || "—"}</TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.76rem",
                      color: def.isRequired ? "#FCA5A5" : "#71717A",
                    }}
                  >
                    {def.isRequired ? "YES" : "NO"}
                  </TableCell>
                  <TableCell>
                    <StatusChip status={def.isActive ? "Active" : "Inactive"} />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "inline-flex", gap: 0.75 }}>
                      <Tooltip title={`Edit ${def.displayName}`} arrow>
                        <IconButton
                          aria-label={`Edit ${def.displayName}`}
                          onClick={() => handleOpenEditDialog(def)}
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
                      <Tooltip title={`Delete ${def.displayName}`} arrow>
                        <IconButton
                          aria-label={`Delete ${def.displayName}`}
                          onClick={() => setPendingDeleteDef(def)}
                          sx={{
                            minWidth: 36,
                            minHeight: 36,
                            borderRadius: "8px",
                            color: "#A1A1AA",
                            "&:hover": {
                              color: "#EF4444",
                              backgroundColor: "rgba(239, 68, 68, 0.12)",
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add / Edit Spec Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => !isSubmitting && setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#0F0F14",
            color: "#F4F4F5",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderTop: "1px solid rgba(255, 255, 255, 0.22)",
            borderRadius: "16px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "1.1rem",
          }}
        >
          {editingDef ? `Edit Spec Field: ${editingDef.displayName}` : "Add New Specification Field"}
        </DialogTitle>
        <Box
          component="form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void handleSubmit(onSaveDef)(e);
          }}
        >
          <DialogContent dividers sx={{ borderColor: "rgba(255, 255, 255, 0.08)" }}>
            {formError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
                {formError}
              </Alert>
            )}
            <Grid container spacing={2.5} sx={{ pt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="displayName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      label="DISPLAY NAME"
                      placeholder="e.g. Displacement"
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val);
                        if (!isKeyManuallyEdited && !editingDef) {
                          setValue("keyCode", slugifyKey(val), { shouldValidate: true });
                        }
                      }}
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                      disabled={isSubmitting}
                      sx={{ "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" } }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="keyCode"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      label="KEY CODE"
                      placeholder="e.g. displacement"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setIsKeyManuallyEdited(true);
                      }}
                      error={Boolean(fieldState.error)}
                      helperText={
                        fieldState.error?.message ||
                        "Unique identifier code (e.g. displacement, max_power)"
                      }
                      disabled={isSubmitting}
                      sx={{ "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" } }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="dataType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel
                        id="spec-data-type-label"
                        sx={{ color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" }}
                      >
                        DATA TYPE
                      </InputLabel>
                      <Select
                        labelId="spec-data-type-label"
                        value={field.value}
                        label="DATA TYPE"
                        onChange={(e) => field.onChange(e.target.value as SpecDataType)}
                        disabled={isSubmitting}
                        sx={{ color: "#F4F4F5" }}
                      >
                        <MenuItem value="text">Text (Free string)</MenuItem>
                        <MenuItem value="number">Number (Numeric value + Unit)</MenuItem>
                        <MenuItem value="select">Select (Predefined Dropdown)</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="unit"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="UNIT"
                      placeholder="e.g. cc, HP, Nm, L, mm, kg"
                      disabled={isSubmitting || dataType !== "number"}
                      error={Boolean(fieldState.error)}
                      helperText={
                        fieldState.error?.message ||
                        (dataType === "number"
                          ? "Appended to value (e.g. cc)"
                          : "Only applicable for Number type")
                      }
                      sx={{ "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" } }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="displayOrder"
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      fullWidth
                      type="number"
                      label="DISPLAY ORDER"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value === "" ? 0 : Number(e.target.value))
                      }
                      onBlur={field.onBlur}
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                      disabled={isSubmitting}
                      sx={{ "& label": { color: "#A1A1AA", fontWeight: 600, fontSize: "0.85rem" } }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex", alignItems: "center" }}>
                <Controller
                  name="isRequired"
                  control={control}
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
                      label="Is Required Field"
                      sx={{ color: "#F4F4F5" }}
                    />
                  )}
                />
              </Grid>
              {editingDef && (
                <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex", alignItems: "center" }}>
                  <Controller
                    name="isActive"
                    control={control}
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
                        sx={{ color: "#F4F4F5" }}
                      />
                    )}
                  />
                </Grid>
              )}

              {dataType === "select" && (
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1, borderColor: "rgba(255, 255, 255, 0.08)" }} />
                  <Typography variant="subtitle2" sx={{ color: "#FF6700", fontWeight: 700, mb: 1 }}>
                    Predefined Options (Dropdown Choices)
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <TextField
                      size="small"
                      aria-label="New predefined option"
                      placeholder="New option (e.g. 6-speed PANKL)"
                      value={newOptionValue}
                      onChange={(e) => setNewOptionValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          void handleAddOption();
                        }
                      }}
                      disabled={addingOption || isSubmitting}
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => void handleAddOption()}
                      disabled={addingOption || isSubmitting || !newOptionValue.trim()}
                      sx={{
                        color: "#F4F4F5",
                        borderColor: "rgba(255, 255, 255, 0.24)",
                        borderRadius: "8px",
                        fontWeight: 600,
                      }}
                    >
                      {addingOption ? "Adding..." : "Add Option"}
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {editingDef ? (
                      editingDef.options && editingDef.options.length > 0 ? (
                        editingDef.options.map((opt) => (
                          <Chip
                            key={opt.id}
                            label={opt.optionValue}
                            onDelete={() => void handleDeleteOption(opt.id)}
                            sx={{
                              backgroundColor: "#16161D",
                              color: "#F4F4F5",
                              border: "1px solid rgba(255, 255, 255, 0.12)",
                              "& .MuiChip-deleteIcon": {
                                color: "#A1A1AA",
                                "&:hover": { color: "#EF4444" },
                              },
                            }}
                          />
                        ))
                      ) : (
                        <Typography variant="caption" sx={{ color: "#71717A" }}>
                          No options added yet. Add options above.
                        </Typography>
                      )
                    ) : draftOptions.length > 0 ? (
                      draftOptions.map((opt) => (
                        <Chip
                          key={opt}
                          label={opt}
                          onDelete={() =>
                            setDraftOptions((prev) => prev.filter((item) => item !== opt))
                          }
                          sx={{
                            backgroundColor: "#16161D",
                            color: "#F4F4F5",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            "& .MuiChip-deleteIcon": {
                              color: "#A1A1AA",
                              "&:hover": { color: "#EF4444" },
                            },
                          }}
                        />
                      ))
                    ) : (
                      <Typography variant="caption" sx={{ color: "#71717A" }}>
                        Add draft options here — they will be saved automatically with the spec field.
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              onClick={() => setDialogOpen(false)}
              disabled={isSubmitting}
              sx={{ color: "#A1A1AA", borderRadius: "8px" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="contained"
              sx={{
                backgroundColor: "#FF6700",
                color: "#070709",
                fontWeight: 800,
                borderRadius: "8px",
                "&:hover": { backgroundColor: "#FF7D24" },
              }}
            >
              {isSubmitting ? "Saving..." : editingDef ? "Save Changes" : "Create Spec Field"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDeleteDef)}
        title="Delete specification field?"
        description={`Are you sure you want to delete "${pendingDeleteDef?.displayName || ""}"? This cannot be undone.`}
        confirmLabel="Delete Field"
        cancelLabel="Cancel"
        tone="danger"
        loading={deletingDef}
        onConfirm={() => void handleConfirmDeleteDef()}
        onCancel={() => setPendingDeleteDef(null)}
      />

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3500}
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
    </SectionCard>
  );
};

export default SpecDefinitionManager;
