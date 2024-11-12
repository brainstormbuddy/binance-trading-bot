const Trade = require("../models/Trade");
const BinanceService = require("./BinanceService");

class TradingService {
  async fetchAndStoreTrades(symbol) {
    try {
      const trades = await BinanceService.fetchTrades(symbol);
      await Trade.insertMany(trades);
      return trades;
    } catch (error) {
      throw new Error(`Error fetching or storing trades: ${error.message}`);
    }
  }
}

module.exports = new TradingService();
