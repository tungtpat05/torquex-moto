import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider, CartProvider } from "./context";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FF6700", // KTM Ready to Race Orange
      contrastText: "#070709",
    },
    secondary: {
      main: "#A1A1AA", // Telemetry slate
    },
    background: {
      default: "#070709", // Canvas black
      paper: "#0F0F14", // Paddock surface
    },
    text: {
      primary: "#F4F4F5",
      secondary: "#A1A1AA",
    },
  },
  typography: {
    fontFamily: 'var(--font-body)',
    h1: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#070709",
          color: "#F4F4F5",
          fontFamily: 'var(--font-body)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(7, 7, 9, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 800,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
