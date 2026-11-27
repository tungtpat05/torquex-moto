import { Box, Button, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

const getPaginationRange = (currentPage: number, totalPages: number) => {
  const siblings = 1;

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblings, 1);
  const rightSiblingIndex = Math.min(currentPage + siblings, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblings;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "...", totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblings;
    const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
    return [1, "...", ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [1, "...", ...middleRange, "...", totalPages];
  }

  return [];
};

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  itemLabel = "items",
}: PaginationProps) => {
  const isEmpty = totalItems === 0;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
        width: "100%",
        pt: 2.5,
        mt: 1.5,
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <Typography
        variant="body2"
        className="tabular-nums"
        sx={{
          fontFamily: "var(--font-mono)",
          color: "#A1A1AA",
          fontSize: "0.78rem",
        }}
      >
        {isEmpty
          ? `0 ${itemLabel}`
          : `Showing ${startIndex}-${endIndex} of ${totalItems} ${itemLabel}`}
      </Typography>

      {!isEmpty && (
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.75 }}>
          <IconButton
            size="small"
            aria-label="Previous page"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            sx={{
              minWidth: 36,
              height: 36,
              color: "#A1A1AA",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "#F4F4F5",
              },
              "&:focus-visible": {
                outline: "2px solid #FF6700",
                outlineOffset: "2px",
              },
              "&.Mui-disabled": {
                color: "#3F3F46",
                borderColor: "rgba(255, 255, 255, 0.04)",
              },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>

          {getPaginationRange(currentPage, totalPages).map((page, index) => {
            if (page === "...") {
              return (
                <Box
                  key={`dots-${index}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 36,
                    height: 36,
                    fontFamily: "var(--font-mono)",
                    color: "#71717A",
                    fontSize: "0.8rem",
                  }}
                >
                  ...
                </Box>
              );
            }

            const isSelected = page === currentPage;

            return (
              <Button
                key={page}
                aria-label={`Page ${page}`}
                aria-current={isSelected ? "page" : undefined}
                onClick={() => onPageChange(page as number)}
                className="tabular-nums"
                sx={{
                  minWidth: 36,
                  height: 36,
                  p: 0,
                  borderRadius: "8px",
                  fontFamily: "var(--font-mono)",
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: "0.8rem",
                  backgroundColor: isSelected ? "#FF6700" : "transparent",
                  color: isSelected ? "#070709" : "#A1A1AA",
                  border: "1px solid",
                  borderColor: isSelected ? "#FF6700" : "rgba(255, 255, 255, 0.10)",
                  "&:hover": {
                    backgroundColor: isSelected ? "#FF7D24" : "rgba(255, 255, 255, 0.05)",
                    color: isSelected ? "#070709" : "#F4F4F5",
                  },
                  "&:focus-visible": {
                    outline: "2px solid #FF6700",
                    outlineOffset: "2px",
                  },
                }}
              >
                {page}
              </Button>
            );
          })}

          <IconButton
            size="small"
            aria-label="Next page"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            sx={{
              minWidth: 36,
              height: 36,
              color: "#A1A1AA",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "#F4F4F5",
              },
              "&:focus-visible": {
                outline: "2px solid #FF6700",
                outlineOffset: "2px",
              },
              "&.Mui-disabled": {
                color: "#3F3F46",
                borderColor: "rgba(255, 255, 255, 0.04)",
              },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default Pagination;
