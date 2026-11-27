import { Box } from "@mui/material";
import { ReactNode } from "react";

interface FilterBarProps {
  children?: ReactNode;
}

const FilterBar = ({ children }: FilterBarProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        mb: 2.5,
        width: "100%",
        flexWrap: "wrap",
        "& .MuiInputBase-root": {
          backgroundColor: "#16161D",
          borderRadius: "8px",
          color: "#F4F4F5",
          fontFamily: "var(--font-body)",
          "& fieldset": {
            borderColor: "rgba(255, 255, 255, 0.12)",
          },
          "&:hover fieldset": {
            borderColor: "rgba(255, 255, 255, 0.24)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#FF6700",
          },
        },
      }}
    >
      {children}
    </Box>
  );
};

export default FilterBar;
