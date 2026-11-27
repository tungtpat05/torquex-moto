import { Box, Typography, Button } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 8, md: 10 },
        px: { xs: 3, md: 5 },
        textAlign: "center",
        backgroundColor: "rgba(15, 15, 20, 0.90)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.10)",
        borderTop: "1px solid rgba(255, 255, 255, 0.25)",
        borderRadius: "16px",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.75)",
        maxWidth: "660px",
        mx: "auto",
        my: 4,
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(255, 103, 0, 0.10)",
          border: "1px solid rgba(255, 103, 0, 0.35)",
          borderRadius: "50%",
          width: 88,
          height: 88,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
          boxShadow: "0 0 30px rgba(255, 103, 0, 0.18)",
        }}
      >
        <ShoppingBagOutlinedIcon sx={{ fontSize: "2.4rem", color: "#FF6700" }} />
      </Box>

      <Typography
        sx={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          fontWeight: 800,
          letterSpacing: "0.16em",
          color: "#FF6700",
          textTransform: "uppercase",
          mb: 1.2,
        }}
      >
        NO ACTIVE ALLOCATIONS
      </Typography>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 950,
          mb: 1.75,
          fontFamily: "var(--font-display)",
          fontSize: { xs: "1.75rem", md: "2.15rem" },
          letterSpacing: "-0.025em",
          textTransform: "uppercase",
        }}
      >
        Your Cart is Empty
      </Typography>

      <Typography
        sx={{
          color: "#A1A1AA",
          fontFamily: "var(--font-body)",
          maxWidth: "430px",
          mx: "auto",
          lineHeight: 1.65,
          mb: 4.5,
          fontSize: { xs: "0.94rem", md: "1rem" },
        }}
      >
        Select your next READY TO RACE machine from our official KTM flagship lineup.
      </Typography>

      <Button
        component={Link}
        to="/#fleet"
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        sx={{
          backgroundColor: "#FF6700",
          color: "#070709",
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          borderRadius: "8px",
          px: 4.5,
          py: 1.5,
          fontSize: "0.9rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          boxShadow: "0 0 24px rgba(255, 103, 0, 0.35)",
          "&:hover": {
            backgroundColor: "#FF7D24",
            boxShadow: "0 0 32px rgba(255, 103, 0, 0.55)",
          },
        }}
      >
        Explore Lineup
      </Button>
    </Box>
  );
};

export default EmptyCart;
