// src/theme.js
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0d1117',
      paper: '#161b22'
    },
    text: {
      primary: '#ffffff'
    },
    primary: {
      main: '#0d6efd'
    },
  },
});

export default darkTheme;
