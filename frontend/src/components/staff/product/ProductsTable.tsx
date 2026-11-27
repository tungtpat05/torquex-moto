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
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatusChip from "../common/StatusChip";
import ActionButtons from "../common/ActionButtons";
import Pagination from "../common/Pagination";
import { Product } from "../../../types/product";

interface ProductsTableProps {
  products: Product[];
  page?: number;
  onPageChange?: (page: number) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

const ProductsTable = ({
  products,
  page: controlledPage,
  onPageChange,
  hasActiveFilters = false,
  onClearFilters,
}: ProductsTableProps) => {
  const [internalPage, setInternalPage] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 8;
  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const rawPage = controlledPage ?? internalPage;
  const safePage = Math.min(Math.max(1, rawPage), totalPages);
  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(safePage * itemsPerPage, totalItems);

  const paginatedProducts = products.slice(
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
          {hasActiveFilters ? "No matching products" : "No products found"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#A1A1AA", mb: 2.5 }}>
          {hasActiveFilters
            ? "No motorcycle model matches your current search or filters."
            : "Add your first motorcycle model to populate the catalog."}
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
            onClick={() => navigate("/staff/products/add")}
            sx={{
              borderRadius: "8px",
              backgroundColor: "#FF6700",
              color: "#070709",
              fontWeight: 800,
              "&:hover": { backgroundColor: "#FF7D24" },
            }}
          >
            Add Product
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table size="medium" sx={{ minWidth: 780 }}>
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
              <TableCell sx={{ minWidth: 200 }}>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right" sx={{ pr: 3 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => {
              const hasDiscount =
                product.discountPrice !== null &&
                product.discountPrice !== undefined &&
                product.discountPrice > 0 &&
                product.discountPrice < product.basePrice;
              const activePrice = hasDiscount ? product.discountPrice : product.basePrice;

              return (
                <TableRow
                  key={product.id}
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
                      src={product.thumbnail || ""}
                      alt={product.productName}
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
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: "#F4F4F5", fontSize: "0.9rem" }}
                      >
                        {product.productName || "—"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#A1A1AA", display: "block", mt: 0.25 }}>
                        {product.brand?.brandName || "—"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#E4E4E7", fontSize: "0.875rem" }}
                    >
                      {product.category?.categoryName || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Typography
                        variant="body2"
                        className="tabular-nums"
                        sx={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          color: "#F4F4F5",
                          fontSize: "0.85rem",
                        }}
                      >
                        {activePrice !== null && activePrice !== undefined
                          ? `$${activePrice.toLocaleString()}`
                          : "—"}
                      </Typography>
                      {hasDiscount && (
                        <Typography
                          variant="caption"
                          className="tabular-nums"
                          sx={{
                            fontFamily: "var(--font-mono)",
                            color: "#71717A",
                            textDecoration: "line-through",
                            fontSize: "0.72rem",
                          }}
                        >
                          {product.basePrice !== null && product.basePrice !== undefined
                            ? `$${product.basePrice.toLocaleString()}`
                            : "—"}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <StatusChip status={product.isActive ? "Active" : "Inactive"} />
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <ActionButtons
                      onView={() => window.open(`/products/${product.id}`, "_blank", "noopener,noreferrer")}
                      onEdit={() => navigate(`/staff/products/edit/${product.id}`)}
                      viewLabel={`View ${product.productName} on Storefront`}
                      editLabel={`Edit ${product.productName}`}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
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
        itemLabel="products"
      />
    </Box>
  );
};

export default ProductsTable;
