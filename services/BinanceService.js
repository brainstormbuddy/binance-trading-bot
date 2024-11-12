const axios = require("axios");

class BinanceService {
  constructor() {
    this.api = axios.create({
      baseURL: "https://api.binance.com/api/v3",
    });
  }

  async fetchTrades(symbol, limit = 10) {
    const response = await this.api.get(
      `/trades?symbol=${symbol}&limit=${limit}`
    );
    return response.data.map(trade => ({
      symbol,
      price: parseFloat(trade.price),
      qty: parseFloat(trade.qty),
      time: new Date(trade.time),
    }));
  }
}

module.exports = new BinanceService();