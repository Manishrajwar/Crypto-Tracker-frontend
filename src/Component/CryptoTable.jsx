import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  TableSortLabel,
  Modal,
   Snackbar, Alert
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { DashboardEnpoints } from "../services/apis";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CryptoTable() {
  const [allCoins, setAllCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "market_cap",
    direction: "desc",
  });

  const [showHint, setShowHint] = useState(true);

  const [selectedCoinHistory, setSelectedCoinHistory] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCoinName, setSelectedCoinName] = useState("");
  const [coin, setCoin] = useState([]);


  const requestSort = (key) => {
    let direction = "asc";
    console.log('sortConfig.key' ,sortConfig.key , key);
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";

    }

     let filterdata = [];
     if(direction === "asc"){
         if(key === "name"){
             filterdata = allCoins.sort((a , b)=>  a.name.localeCompare(b.name));
            } else if(key === "current_price"){
             filterdata = allCoins.sort((a , b)=>  a.priceUsd - b.priceUsd);
            }   
            else{
                filterdata = allCoins;
            }

     }
     else{
         if(key === "name"){
             filterdata = allCoins.sort((a , b)=>  b.name.localeCompare(a.name));
            }
            else if(key === "current_price"){
             filterdata = allCoins.sort((a , b)=>  b.priceUsd - a.priceUsd);
            }   
            else{
                 filterdata = allCoins;
            }
     }

  setCoin(filterdata);

    setSortConfig({ key, direction });
  };

  //   This is for opening the modal and fetching the history of the selected coin

  const handleRowClick = async (coin) => {
    try {
      const res = await axios.get(
        `${DashboardEnpoints.GET_COIN_HISTORY}/${coin.coinId}`
      );
      setSelectedCoinHistory(res.data);
      setSelectedCoinName(coin.name);
      setOpenModal(true);
    } catch (err) {
      console.error("Failed to fetch coin history", err);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCoinHistory([]);
  };

 //   for Searcing Using debounce concept
  const debounceFunction = (func, delay) => {
    let timer;
    return (...args) => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const filterFunction = (term) => {
    if (term) {
      const filterdata = allCoins.filter((coin) => {
        return coin?.name?.toLowerCase()?.includes(term.toLowerCase());
      });
      setCoin(filterdata);
    } else {
      setCoin(allCoins);
    }
  };

  const debouncedFilter = debounceFunction(filterFunction, 500);

 useEffect(() => {
  if(coin.length  !== allCoins.length || searchTerm) {
 debouncedFilter(searchTerm);
  }
}, [searchTerm, allCoins]);

useEffect(() => {
  const timer = setTimeout(() => {
    setShowHint(false);
  }, 5000);

  return () => clearTimeout(timer);
}, []);

// Fetching coins data from the API in the interval of every 30 minutes

 useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const res = await axios.get(DashboardEnpoints.GET_COINS);
        setAllCoins(res.data);
        setCoin(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);


  return (
    <Box>
     
      <Box sx={{ my: 4, textAlign: "center" }}>
        <TextField
          variant="outlined"
          placeholder="Search by coin name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "300px" }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress size={60} thickness={5} color="primary" />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            backgroundColor: "background.paper",
            boxShadow: "0 0 20px rgba(0,0,0,0.2)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "primary.main" }}>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  <TableSortLabel
                    active={sortConfig.key === "name"}
                    direction={sortConfig.direction}
                    onClick={() => requestSort("name")}
                    sx={{ color: "#fff" }}
                  >
                    Coin Name
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Symbol
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  <TableSortLabel
                    active={sortConfig.key === "current_price"}
                    direction={sortConfig.direction}
                    onClick={() => requestSort("current_price")}
                    sx={{ color: "#fff" }}
                  >
                    Price (USD)
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                    Market Cap
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  24h % Change
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Last Updated
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coin?.length > 0 ? (
                coin.map((coin) => (
                  <TableRow
                    key={coin.coinId}
                    hover
                    onClick={() => handleRowClick(coin)}
                    sx={{
                      cursor: "pointer",
                      "&:nth-of-type(odd)": {
                        backgroundColor: "rgba(255,255,255,0.02)",
                      },
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
                      transition: "background-color 0.3s",
                    }}
                  >
                    <TableCell>{coin?.name}</TableCell>
                    <TableCell>{coin?.symbol?.toUpperCase()}</TableCell>
                    <TableCell>${coin.priceUsd?.toLocaleString()}</TableCell>
                    <TableCell>${coin.marketCap}</TableCell>
                    <TableCell
                      sx={{
                        color:
                          coin.percentChange24h > 0
                            ? "success.main"
                            : "error.main",
                      }}
                    >
                      {coin.percentChange24h?.toFixed(2)}%
                    </TableCell>
                    <TableCell>
                      {new Date(coin.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow
                  sx={{
                    cursor: "pointer",
                    "&:nth-of-type(odd)": {
                      backgroundColor: "rgba(255,255,255,0.02)",
                    },
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
                    transition: "background-color 0.3s",
                  }}
                >
                  <TableCell>No Data Found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {selectedCoinName} Price History
          </Typography>
          {selectedCoinHistory.length > 0 ? (
            <Line
                          data={{
                           labels: selectedCoinHistory.map((h) =>
              new Date(h.timestamp).toLocaleDateString()
            ),
                            datasets: [
                              {
                                label: `${selectedCoinName} Price (USD)`,
                                data: selectedCoinHistory.map((h) => h.priceUsd),
                                borderColor: '#1976d2',
                                backgroundColor: 'rgba(25, 118, 210, 0.2)',
                                fill: true,
                                tension: 0.4
                              }
                            ]
                          }}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: { display: true }
                            }
                          }}
            />
          ) : (
            <Typography>No history data available.</Typography>
          )}
        </Box>
      </Modal>

   <Snackbar
  open={showHint}
  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
>
  <Alert
    severity="info"
    sx={{
      width: '100%',
      bgcolor: '#2196f3', 
      color: '#fff',      
      fontWeight: 'bold'
    }}
    onClose={() => setShowHint(false)}
  >
Click a row to see history. Click Coin Name or Price to sort.  </Alert>
</Snackbar>

    </Box>
  );
}
