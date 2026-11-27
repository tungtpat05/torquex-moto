import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SectionCard from "../common/SectionCard";
import { SpecDefinition, SpecDataType } from "../../../types/specDefinition";
import { ApiErrorResponse } from "../../../types/apiError";
import {
  getSpecDefinitionsByCategory,
  createSpecDefinition,
  updateSpecDefinition,
  deleteSpecDefinition,
  createSpecDefinitionOption,
  deleteSpecDefinitionOption,
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
  const [addingOption, setAddingOption] = useState(false);

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
      } else {
        await createSpecDefinition(categoryId, {
          keyCode: values.keyCode.trim(),
          displayName: values.displayName.trim(),
          dataType: values.dataType,
          unit: values.dataType === "number" ? (values.unit || "").trim() : "",
          displayOrder: values.displayOrder,
          isRequired: values.isRequired,
        });
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

  const handleDeleteDef = async (defId: number) => {
    if (!categoryId) return;
    if (!window.confirm("Are you sure you want to delete this specification field?")) return;

    try {
      await deleteSpecDefinition(categoryId, defId);
      await fetchSpecDefs();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || "Failed to delete spec field.");
    }
  };

  const handleAddOption = async () => {
    if (!categoryId || !editingDef || !newOptionValue.trim()) return;
    setAddingOption(true);
    try {
      await createSpecDefinitionOption(categoryId, editingDef.id, {
        optionValue: newOptionValue.trim(),
        displayOrder: (editingDef.options?.length || 0) + 1,
      });
      setNewOptionValue("");
      const updatedDefs = await getSpecDefinitionsByCategory(categoryId, false);
      setSpecDefs(updatedDefs);
      const updatedCurrent = updatedDefs.find((d) => d.id === editingDef.id);
      if (updatedCurrent) {
        setEditingDef(updatedCurrent);
      }
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
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setFormError(axiosErr?.response?.data?.message || "Failed to delete option.");
    }
  };

  if (!categoryId) {
    return (
      <SectionCard title="Specification Fields">
        <Typography variant="body2" sx={{ color: "#71717a", fontStyle: "italic", py: 1 }}>
          Save the category first to configure custom specification fields (e.g. Displacement, Max Power, Electronics).
        </Typography>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Specification Fields Configuration">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="body2" sx={{ color: "#a1a1aa" }}>
          Define specs required for models under this category.
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
          sx={{
            backgroundColor: "#ff6b35",
            color: "#ffffff",
            fontWeight: 650,
            textTransform: "none",
            "&:hover": { backgroundColor: "#e05a2b" },
          }}
        >
          Add Spec Field
        </Button>
      </Box>

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={28} color="warning" />
        </Box>
      ) : specDefs.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <Typography variant="body2" sx={{ color: "#71717a" }}>
            No specification fields defined for this category yet. Click <strong>"Add Spec Field"</strong> to create fields like <em>Displacement (cc)</em>, <em>Horsepower</em>, or <em>Transmission</em>.
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            backgroundColor: "#18181b",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
        >
          <Table size="small">
            <TableHead sx={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}>
              <TableRow>
                <TableCell sx={{ color: "#71717a", fontWeight: 700, fontSize: "0.75rem" }}>#</TableCell>
                <TableCell sx={{ color: "#71717a", fontWeight: 700, fontSize: "0.75rem" }}>DISPLAY NAME</TableCell>
                <TableCell sx={{ color: "#71717a", fontWeight: 700, fontSize: "0.75rem" }}>KEY CODE</TableCell>
                <TableCell sx={{ color: "#71717a", fontWeight: 700, fontSize: "0.75rem" }}>TYPE</TableCell>
                <TableCell sx={{ color: "#71717a", fontWeight: 700, fontSize: "0.75rem" }}>UNIT</TableCell>
                <TableCell sx={{ color: "#71717a", fontWeight: 700, fontSize: "0.75rem" }}>REQ?</TableCell>
                <TableCell sx={{ color: "#71717a", fontWeight: 700, fontSize: "0.75rem" }}>STATUS</TableCell>
                <TableCell align="right" sx={{ color: "#71717a", fontWeight: 700, fontSize: "0.75rem" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {specDefs.map((def, idx) => (
                <TableRow key={def.id} hover sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.02)" } }}>
                  <TableCell sx={{ color: "#e4e4e7" }}>{def.displayOrder || idx + 1}</TableCell>
                  <TableCell sx={{ color: "#ffffff", fontWeight: 600 }}>{def.displayName}</TableCell>
                  <TableCell sx={{ color: "#a1a1aa", fontFamily: "monospace", fontSize: "0.8rem" }}>
                    {def.keyCode}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={def.dataType.toUpperCase()}
                      size="small"
                      sx={{
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        backgroundColor:
                          def.dataType === "number"
                            ? "rgba(59, 130, 246, 0.15)"
                            : def.dataType === "select"
                            ? "rgba(168, 85, 247, 0.15)"
                            : "rgba(113, 113, 122, 0.2)",
                        color:
                          def.dataType === "number"
                            ? "#60a5fa"
                            : def.dataType === "select"
                            ? "#c084fc"
                            : "#a1a1aa",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#a1a1aa" }}>{def.unit || "—"}</TableCell>
                  <TableCell sx={{ color: def.isRequired ? "#ef4444" : "#71717a" }}>
                    {def.isRequired ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={def.isActive ? "Active" : "Disabled"}
                      size="small"
                      sx={{
                        fontSize: "0.65rem",
                        backgroundColor: def.isActive ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        color: def.isActive ? "#4ade80" : "#f87171",
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenEditDialog(def)} sx={{ color: "#a1a1aa", "&:hover": { color: "#ffffff" } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteDef(def.id)} sx={{ color: "#71717a", "&:hover": { color: "#ef4444" } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
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
            backgroundColor: "#18181b",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
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
              <Typography color="error" variant="body2" sx={{ mb: 2, p: 1.5, borderRadius: 1, backgroundColor: "rgba(239, 68, 68, 0.1)" }}>
                {formError}
              </Typography>
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
                      sx={{ "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" } }}
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
                      helperText={fieldState.error?.message || "Unique identifier code (e.g. displacement, max_power)"}
                      disabled={isSubmitting}
                      sx={{ "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" } }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="dataType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth size="small">
                      <InputLabel sx={{ color: "#71717a", fontWeight: 600 }}>DATA TYPE</InputLabel>
                      <Select
                        value={field.value}
                        label="DATA TYPE"
                        onChange={(e) => field.onChange(e.target.value as SpecDataType)}
                        disabled={isSubmitting}
                        sx={{ color: "#ffffff" }}
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
                        (dataType === "number" ? "Appended to value (e.g. cc)" : "Only applicable for Number type")
                      }
                      sx={{ "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" } }}
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
                      onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                      onBlur={field.onBlur}
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                      disabled={isSubmitting}
                      sx={{ "& label": { color: "#71717a", fontWeight: 600, fontSize: "0.85rem" } }}
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
                          sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#ff6b35" } }}
                        />
                      }
                      label="Is Required Field"
                      sx={{ color: "#e4e4e7" }}
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
                            sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#ff6b35" } }}
                          />
                        }
                        label="Active Status"
                        sx={{ color: "#e4e4e7" }}
                      />
                    )}
                  />
                </Grid>
              )}

              {dataType === "select" && editingDef && (
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1, borderColor: "rgba(255, 255, 255, 0.08)" }} />
                  <Typography variant="subtitle2" sx={{ color: "#ff6b35", fontWeight: 700, mb: 1 }}>
                    Predefined Options (Dropdown Choices)
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <TextField
                      size="small"
                      placeholder="New option (e.g. 6-speed PANKL)"
                      value={newOptionValue}
                      onChange={(e) => setNewOptionValue(e.target.value)}
                      disabled={addingOption}
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleAddOption}
                      disabled={addingOption || !newOptionValue.trim()}
                      sx={{ color: "#ffffff", borderColor: "#71717a" }}
                    >
                      {addingOption ? "Adding..." : "Add Option"}
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {editingDef.options && editingDef.options.length > 0 ? (
                      editingDef.options.map((opt) => (
                        <Chip
                          key={opt.id}
                          label={opt.optionValue}
                          onDelete={() => handleDeleteOption(opt.id)}
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            color: "#ffffff",
                            "& .MuiChip-deleteIcon": { color: "#71717a", "&:hover": { color: "#ef4444" } },
                          }}
                        />
                      ))
                    ) : (
                      <Typography variant="caption" sx={{ color: "#71717a" }}>
                        No options added yet. Add options above.
                      </Typography>
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setDialogOpen(false)} disabled={isSubmitting} sx={{ color: "#71717a" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="contained"
              sx={{ backgroundColor: "#ff6b35", color: "#ffffff", fontWeight: 700, "&:hover": { backgroundColor: "#e05a2b" } }}
            >
              {isSubmitting ? "Saving..." : editingDef ? "Save Changes" : "Create Spec Field"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </SectionCard>
  );
};

export default SpecDefinitionManager;
