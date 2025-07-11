// src/App.jsx
import { ThemeProvider, CssBaseline, Container, Typography, Box } from '@mui/material';
import darkTheme from './theme';
import CryptoTable from './Component/CryptoTable';

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" style={{textAlign:"center"}} gutterBottom>
            Crypto Dashboard
          </Typography>
          <CryptoTable />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
