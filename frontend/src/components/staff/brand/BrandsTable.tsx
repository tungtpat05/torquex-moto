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
import { Brand } from "../../../types/brand";

interface BrandsTableProps {
  brands: Brand[];
  page?: number;
  onPageChange?: (page: number) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

const BrandsTable = ({
  brands,
  page: controlledPage,
  onPageChange,
  hasActiveFilters = false,
  onClearFilters,
}: BrandsTableProps) => {
  const navigate = useNavigate();
  const [internalPage, setInternalPage] = useState(1);

  const itemsPerPage = 8;
  const totalItems = brands.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const rawPage = controlledPage ?? internalPage;
  const safePage = Math.min(Math.max(1, rawPage), totalPages);
  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(safePage * itemsPerPage, totalItems);

  const paginatedBrands = brands.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

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
          {hasActiveFilters ? "No matching brands" : "No brands found"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#A1A1AA", mb: 2.5 }}>
          {hasActiveFilters
            ? "No brand matches your current search or status filter."
            : "Add your first manufacturer brand to start cataloguing motorcycles."}
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
            onClick={() => navigate("/staff/brands/add")}
            sx={{
              borderRadius: "8px",
              backgroundColor: "#FF6700",
              color: "#070709",
              fontWeight: 800,
              "&:hover": { backgroundColor: "#FF7D24" },
            }}
          >
            Add Brand
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
              <TableCell sx={{ width: 112 }}>Logo</TableCell>
              <TableCell sx={{ minWidth: 200 }}>Brand</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBrands.map((brand) => (
              <TableRow
                key={brand.id}
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
                    src={brand.logoUrl}
                    alt={brand.brandName}
                    sx={{
                      width: 80,
                      height: 44,
                      p: 0.75,
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
                      {brand.brandName}
                    </Typography>
                    {brand.description && (
                      <Tooltip title={brand.description} placement="bottom-start" arrow>
                        <Typography
                          variant="caption"
                          noWrap
                          sx={{ color: "#A1A1AA", display: "block", mt: 0.25 }}
                        >
                          {brand.description}
                        </Typography>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <StatusChip status={brand.isActive ? "Active" : "Inactive"} />
                </TableCell>
                <TableCell align="right">
                  <ActionButtons
                    onEdit={() => navigate(`/staff/brands/edit/${brand.id}`)}
                    editLabel={`Edit ${brand.brandName}`}
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
        itemLabel="brands"
      />
    </Box>
  );
};

export default BrandsTable;
