const SimpleStrategy = require('../../strategies/SimpleStrategy');

describe('SimpleStrategy', () => {
  let strategy;

  beforeEach(() => {
    strategy = new SimpleStrategy(1, 1); // 1% drop and rise thresholds
  });

  describe('analyze', () => {
    it('should return null if insufficient trades', async () => {
      const result = await strategy.analyze([{ price: 100 }]);
      expect(result).toBeNull();
    });

    it('should recommend BUY when price drops sufficiently', async () => {
      const trades = [
        { price: 99 },  // Latest price
        { price: 100 }  // Previous price
      ];

      const result = await strategy.analyze(trades);
      expect(result).toEqual({
        action: 'BUY',
        reason: 'Price dropped by 1%'
      });
    });

    it('should recommend SELL when price rises sufficiently', async () => {
      const trades = [
        { price: 101 },  // Latest price
        { price: 100 }   // Previous price
      ];

      const result = await strategy.analyze(trades);
      expect(result).toEqual({
        action: 'SELL',
        reason: 'Price rose by 1%'
      });
    });

    it('should recommend HOLD when price change is insufficient', async () => {
      const trades = [
        { price: 100.5 },  // Latest price
        { price: 100 }     // Previous price
      ];

      const result = await strategy.analyze(trades);
      expect(result).toEqual({
        action: 'HOLD',
        reason: 'No trade action required'
      });
    });
  });
}); 