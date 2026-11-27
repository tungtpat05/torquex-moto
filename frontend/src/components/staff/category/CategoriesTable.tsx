import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatusChip from "../common/StatusChip";
import ActionButtons from "../common/ActionButtons";
import Pagination from "../common/Pagination";
import { Category } from "../../../types/category";

interface CategoriesTableProps {
  categories: Category[];
  page?: number;
  onPageChange?: (page: number) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

const CategoriesTable = ({
  categories,
  page: controlledPage,
  onPageChange,
  hasActiveFilters = false,
  onClearFilters,
}: CategoriesTableProps) => {
  const navigate = useNavigate();
  const [internalPage, setInternalPage] = useState(1);

  const itemsPerPage = 8;
  const totalItems = categories.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const rawPage = controlledPage ?? internalPage;
  const safePage = Math.min(Math.max(1, rawPage), totalPages);
  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(safePage * itemsPerPage, totalItems);

  const paginatedCategories = categories.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  if (totalItems === 0) {
    return (
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
          {hasActiveFilters ? "No matching categories" : "No categories found"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#A1A1AA", mb: 2.5 }}>
          {hasActiveFilters
            ? "No category matches your current search or status filter."
            : "Create your first motorcycle category and specification template."}
        </Typography>
        {hasActiveFilters && onClearFilters ? (
          <Button
            variant="outlined"
            onClick={onClearFilters}
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
            onClick={() => navigate("/staff/categories/add")}
            sx={{
              borderRadius: "8px",
              backgroundColor: "#FF6700",
              color: "#070709",
              fontWeight: 800,
              "&:hover": { backgroundColor: "#FF7D24" },
            }}
          >
            Add Category
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="medium" sx={{ minWidth: 620 }}>
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
              <TableCell sx={{ width: 100 }}>Image</TableCell>
              <TableCell sx={{ minWidth: 200 }}>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow
                key={category.id}
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
                <TableCell>
                  <Avatar
                    variant="rounded"
                    src={category.categoryImage}
                    alt={category.categoryName}
                    sx={{
                      width: 68,
                      height: 44,
                      p: 0.5,
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      backgroundColor: "#16161D",
                      "& img": { objectFit: "contain" },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: 380 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "#F4F4F5", fontSize: "0.9rem" }}
                    >
                      {category.categoryName}
                    </Typography>
                    {category.description && (
                      <Tooltip title={category.description} placement="bottom-start" arrow>
                        <Typography
                          variant="caption"
                          noWrap
                          sx={{ color: "#A1A1AA", display: "block", mt: 0.25 }}
                        >
                          {category.description}
                        </Typography>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <StatusChip status={category.isActive ? "Active" : "Inactive"} />
                </TableCell>
                <TableCell align="right">
                  <ActionButtons
                    onEdit={() => navigate(`/staff/categories/edit/${category.id}`)}
                    editLabel={`Edit ${category.categoryName}`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={handlePageChange}
        itemLabel="categories"
      />
    </Box>
  );
};

export default CategoriesTable;
