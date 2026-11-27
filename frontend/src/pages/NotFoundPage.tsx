import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "calc(100vh - 220px)",
        backgroundColor: "#070709",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: { xs: 8, md: 12 },
        overflow: "hidden",
      }}
    >
      {/* Ambient Overhead Studio Glow */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "340px", md: "760px" },
          height: { xs: "240px", md: "360px" },
          background:
            "radial-gradient(ellipse at center, rgba(255, 103, 0, 0.16) 0%, rgba(255, 103, 0, 0.03) 50%, transparent 75%)",
          filter: "blur(55px)",
          pointerEvents: "none",
        }}
      />

      {/* Giant Architectural 404 Watermark */}
      <Typography
        aria-hidden="true"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "var(--font-display)",
          fontWeight: 950,
          fontSize: { xs: "8.5rem", sm: "14rem", md: "20rem" },
          lineHeight: 0.9,
          letterSpacing: "-0.06em",
          color: "rgba(255, 255, 255, 0.035)",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        404
      </Typography>

      {/* Glass Telemetry Card */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          maxWidth: "560px",
          width: "100%",
          p: { xs: 3.5, md: 5 },
          borderRadius: "16px",
          backgroundColor: "rgba(15, 15, 20, 0.90)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.10)",
          borderTop: "1px solid rgba(255, 255, 255, 0.25)",
          boxShadow: "0 24px 60px rgba(0, 0, 0, 0.80)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            fontWeight: 800,
            letterSpacing: "0.16em",
            color: "#FF6700",
            textTransform: "uppercase",
            mb: 1.25,
          }}
        >
          Error 404
        </Typography>

        <Typography
          component="h1"
          sx={{
            fontFamily: "var(--font-display)",
            fontWeight: 950,
            fontSize: { xs: "2.4rem", sm: "3.2rem" },
            lineHeight: 0.98,
            letterSpacing: "-0.035em",
            color: "#FFFFFF",
            textTransform: "uppercase",
            mb: 1.75,
          }}
        >
          Off Track.
        </Typography>

        <Typography
          sx={{
            fontFamily: "var(--font-body)",
            fontSize: "0.96rem",
            color: "#A1A1AA",
            lineHeight: 1.65,
            maxWidth: "420px",
            mb: 4,
          }}
        >
          The paddock coordinates you requested do not exist or have been moved from the showroom grid.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Button
            component={Link}
            to="/"
            variant="contained"
            startIcon={<ArrowBackIcon />}
            sx={{
              backgroundColor: "#FF6700",
              color: "#070709",
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "0.84rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              borderRadius: "8px",
              px: 3.5,
              py: 1.4,
              boxShadow: "0 0 24px rgba(255, 103, 0, 0.35)",
              "&:hover": {
                backgroundColor: "#FF7D24",
                boxShadow: "0 0 32px rgba(255, 103, 0, 0.55)",
              },
            }}
          >
            Return to Showroom
          </Button>

          <Button
            component={Link}
            to="/#fleet"
            variant="outlined"
            endIcon={<ArrowOutwardIcon sx={{ fontSize: "1rem" }} />}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.16)",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              color: "#F4F4F5",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "0.76rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              borderRadius: "8px",
              px: 3,
              py: 1.4,
              "&:hover": {
                borderColor: "#FF6700",
                backgroundColor: "rgba(255, 103, 0, 0.08)",
                color: "#FF6700",
              },
            }}
          >
            Explore Fleet
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
