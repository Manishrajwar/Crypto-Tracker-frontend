const baseurl = process.env.REACT_APP_API_URL;

export const DashboardEnpoints = {
     GET_COINS: `${baseurl}/coins` ,
     GET_COIN_HISTORY: `${baseurl}/history`
}