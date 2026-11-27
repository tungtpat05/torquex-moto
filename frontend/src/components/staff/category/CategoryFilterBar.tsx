import { Box, Button, FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FilterBar from "../common/FilterBar";
import SearchBar from "../common/SearchBar";

interface CategoryFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  onReset?: () => void;
  onAddClick?: () => void;
}

const CategoryFilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onReset,
  onAddClick,
}: CategoryFilterBarProps) => {
  const hasFilters = Boolean(search || status);

  return (
    <FilterBar>
      <SearchBar
        placeholder="Search categories..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onClear={() => onSearchChange("")}
        width={{ xs: "100%", md: 360 }}
      />

      <FormControl size="small" sx={{ minWidth: 148, width: { xs: "100%", sm: "auto" } }}>
        <Select
          value={status}
          onChange={(e: SelectChangeEvent) => onStatusChange(e.target.value)}
          displayEmpty
          inputProps={{ "aria-label": "Select Status" }}
          sx={{
            "& .MuiSelect-select": { py: 1.0, px: 2, fontSize: "0.875rem", fontWeight: 600 },
          }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      {hasFilters && onReset && (
        <Button
          size="small"
          variant="outlined"
          startIcon={<RestartAltIcon fontSize="small" />}
          onClick={onReset}
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

      {onAddClick && (
        <Box sx={{ ml: { xs: 0, sm: "auto" }, width: { xs: "100%", sm: "auto" } }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddClick}
            sx={{
              backgroundColor: "#FF6700",
              color: "#070709",
              fontWeight: 800,
              px: 2.5,
              py: 1,
              borderRadius: "8px",
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                backgroundColor: "#FF7D24",
              },
            }}
          >
            Add Category
          </Button>
        </Box>
      )}
    </FilterBar>
  );
};

export default CategoryFilterBar;
