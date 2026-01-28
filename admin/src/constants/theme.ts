import { createTheme } from '@mui/material/styles';

// Brand Colors
export const colors = {
  primary: {
    purple: '#8a4fff',
    blue: '#4185DD',
    pink: '#B42FDA',
  },
  background: {
    dark: '#1C1B2B',
    secondary: '#252435',
    tertiary: '#2D2C3D',
    white: '#FFFFFF',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#D1D1D1',
    muted: '#9E9E9E',
    dark: '#1C1B2B',
  },
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  border: '#3A3949',
};

// MUI Theme
export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary.purple,
      light: colors.primary.pink,
      dark: colors.primary.blue,
    },
    secondary: {
      main: colors.primary.blue,
    },
    background: {
      default: colors.background.tertiary,
      paper: colors.background.secondary,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    success: {
      main: colors.status.success,
    },
    warning: {
      main: colors.status.warning,
    },
    error: {
      main: colors.status.error,
    },
    info: {
      main: colors.status.info,
    },
    divider: colors.border,
  },
  typography: {
    fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.875rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.primary.blue}, ${colors.primary.pink})`,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primary.purple}, ${colors.primary.pink})`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
