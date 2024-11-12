const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const TradingService = require('../../services/TradingService');
const BinanceService = require('../../services/BinanceService');
const Trade = require('../../models/Trade');

jest.mock('../../services/BinanceService');

describe('TradingService', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Trade.deleteMany({});
    jest.clearAllMocks();
  });

  describe('fetchAndStoreTrades', () => {
    it('should fetch trades and store them in database', async () => {
      const mockTrades = [
        { symbol: 'BTCUSDT', price: 50000, qty: 0.001, time: new Date() }
      ];

      BinanceService.fetchTrades = jest.fn().mockResolvedValue(mockTrades);

      const result = await TradingService.fetchAndStoreTrades('BTCUSDT');

      // Verify BinanceService was called
      expect(BinanceService.fetchTrades).toHaveBeenCalledWith('BTCUSDT');

      // Verify trades were stored in database
      const storedTrades = await Trade.find({});
      expect(storedTrades).toHaveLength(1);
      expect(storedTrades[0].price).toBe(50000);

      // Verify returned trades
      expect(result).toEqual(mockTrades);
    });

    it('should handle errors appropriately', async () => {
      BinanceService.fetchTrades = jest.fn().mockRejectedValue(new Error('API Error'));

      await expect(TradingService.fetchAndStoreTrades('BTCUSDT'))
        .rejects.toThrow('Error fetching or storing trades: API Error');
    });
  });
}); 