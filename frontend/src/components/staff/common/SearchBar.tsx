import { ChangeEvent } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  width?: string | number | Record<string, string | number>;
  ariaLabel?: string;
}

const SearchBar = ({
  placeholder = "Search...",
  value,
  onChange,
  onClear,
  width = { xs: "100%", sm: 320 },
  ariaLabel,
}: SearchBarProps) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
      return;
    }
    const syntheticEvent = {
      target: { value: "" },
    } as ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <TextField
      slotProps={{
        htmlInput: {
          "aria-label": ariaLabel || placeholder,
        },
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#71717A" }} />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={handleClear}
                aria-label="Clear search"
                sx={{
                  color: "#A1A1AA",
                  p: 0.5,
                  "&:hover": { color: "#F4F4F5" },
                  "&:focus-visible": {
                    outline: "2px solid #FF6700",
                    outlineOffset: "2px",
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      size="small"
      sx={{
        width,
        "& .MuiOutlinedInput-root": {
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
        "& .MuiInputBase-input::placeholder": {
          color: "#71717A",
          opacity: 1,
        },
      }}
    />
  );
};

export default SearchBar;
