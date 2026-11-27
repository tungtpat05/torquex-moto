import { Box, Button, FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FilterBar from "../common/FilterBar";
import SearchBar from "../common/SearchBar";
import { Brand } from "../../../types/brand";
import { Category } from "../../../types/category";

interface ProductFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  brand: string;
  onBrandChange: (val: string) => void;
  category: string;
  onCategoryChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  brands: Brand[];
  categories: Category[];
  onReset?: () => void;
  onAddClick?: () => void;
}

const ProductFilterBar = ({
  search,
  onSearchChange,
  brand,
  onBrandChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  brands,
  categories,
  onReset,
  onAddClick,
}: ProductFilterBarProps) => {
  const hasFilters = Boolean(search || brand || category || status);

  return (
    <FilterBar>
      <SearchBar
        placeholder="Search products, brand..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onClear={() => onSearchChange("")}
        width={{ xs: "100%", md: 360 }}
      />

      <FormControl size="small" sx={{ minWidth: 140, width: { xs: "100%", sm: "auto" } }}>
        <Select
          value={brand}
          onChange={(e: SelectChangeEvent) => onBrandChange(e.target.value)}
          displayEmpty
          inputProps={{ "aria-label": "Select Brand" }}
          sx={{
            "& .MuiSelect-select": { py: 1.0, px: 2, fontSize: "0.875rem", fontWeight: 600 },
          }}
        >
          <MenuItem value="">All Brands</MenuItem>
          {brands.map((b) => (
            <MenuItem key={b.id} value={b.brandName}>
              {b.brandName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 154, width: { xs: "100%", sm: "auto" } }}>
        <Select
          value={category}
          onChange={(e: SelectChangeEvent) => onCategoryChange(e.target.value)}
          displayEmpty
          inputProps={{ "aria-label": "Select Category" }}
          sx={{
            "& .MuiSelect-select": { py: 1.0, px: 2, fontSize: "0.875rem", fontWeight: 600 },
          }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.categoryName}>
              {c.categoryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 140, width: { xs: "100%", sm: "auto" } }}>
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
            Add Product
          </Button>
        </Box>
      )}
    </FilterBar>
  );
};

export default ProductFilterBar;
