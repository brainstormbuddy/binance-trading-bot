class SimpleStrategy {
  constructor(dropPercent, risePercent) {
    this.dropPercent = dropPercent;
    this.risePercent = risePercent;
  }

  async analyze(trades) {
    if (trades.length < 2) return null;

    const latestPrice = trades[0].price;
    const previousPrice = trades[1].price;

    const dropThreshold = previousPrice * (1 - this.dropPercent / 100);
    const riseThreshold = previousPrice * (1 + this.risePercent / 100);

    if (latestPrice <= dropThreshold) {
      return { action: "BUY", reason: `Price dropped by ${this.dropPercent}%` };
    } else if (latestPrice >= riseThreshold) {
      return { action: "SELL", reason: `Price rose by ${this.risePercent}%` };
    }
    return { action: "HOLD", reason: "No trade action required" };
  }
}

module.exports = SimpleStrategy;
