import { createTheme } from "@mui/material/styles";

// Paleta "bilheteria": tinta profunda + âmbar de talão de ingresso,
// sobre papel — evocando cartaz e canhoto físico, não o gradiente
// genérico de dashboard SaaS.
const tinta = "#1B1F3B";
const tintaClara = "#2C3266";
const ambar = "#F2A93B";
const ambarEscuro = "#C98620";
const papel = "#FAFAF7";
const grafite = "#22242B";
const grafiteSuave = "#5B5E6B";
const verde = "#2E7D5B";
const vermelho = "#C1443D";
const linhaTracejada = "#D8D3C6";

export const cores = {
  tinta,
  tintaClara,
  ambar,
  ambarEscuro,
  papel,
  grafite,
  grafiteSuave,
  verde,
  vermelho,
  linhaTracejada,
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: tinta, light: tintaClara, contrastText: "#FFFFFF" },
    secondary: { main: ambar, dark: ambarEscuro, contrastText: tinta },
    success: { main: verde },
    error: { main: vermelho },
    background: { default: papel, paper: "#FFFFFF" },
    text: { primary: grafite, secondary: grafiteSuave },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h2: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h3: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h5: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h6: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
    overline: { letterSpacing: "0.12em" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 18 },
        containedSecondary: { color: tinta },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: tinta },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        "*:focus-visible": {
          outline: `2px solid ${ambarEscuro}`,
          outlineOffset: "2px",
        },
        code: { fontFamily: '"IBM Plex Mono", monospace' },
      },
    },
  },
});

export default theme;
