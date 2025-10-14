import { alpha, createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    brand: Palette['primary'];
  }

  interface PaletteOptions {
    brand?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    brand: true;
  }
}

export const theme = createTheme({
  palette: {
    background: {
      default: '#fdf5f7',
    },
    brand: {
      main: '#f36b8a',
      light: '#ff9db3',
      dark: '#d65071',
      contrastText: '#fff',
    },
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#635bff',
    },
    text: {
      primary: '#111827',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem',
      letterSpacing: '-0.04em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '-0.03em',
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '24px',
          boxShadow:
            '0 24px 50px -24px rgba(15,23,42,0.45), 0 12px 20px -16px rgba(15,23,42,0.3)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'medium',
      },
      styleOverrides: {
        root: {
          borderRadius: '999px',
          textTransform: 'none',
          fontWeight: 600,
          paddingInline: '1.5rem',
        },
        containedPrimary: {
          boxShadow: 'none',
          ':hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.brand.main, 0.12),
          color: theme.palette.brand.dark,
          fontWeight: 600,
          letterSpacing: '0.01em',
        }),
      },
    },
  },
});
