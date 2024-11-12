require("./config/db");
const TradingService = require("./services/TradingService");
const SimpleStrategy = require("./strategies/SimpleStrategy");
const { TRADING } = require("./utils/constants");

async function runTradingBot() {
  const strategy = new SimpleStrategy(
    TRADING.DEFAULT_DROP_PERCENT,
    TRADING.DEFAULT_RISE_PERCENT
  );

  try {
    const trades = await TradingService.fetchAndStoreTrades(
      TRADING.DEFAULT_SYMBOL
    );
    const decision = await strategy.analyze(trades);
    console.log(`Trading decision: ${decision.action} - ${decision.reason}`);
  } catch (error) {
    console.error("Error running trading bot:", error);
  }
}

// Initial run
runTradingBot();

// Set up interval to run the bot every X milliseconds
const FETCH_INTERVAL = process.env.FETCH_INTERVAL || 60000; // Default to 1 minute
setInterval(runTradingBot, FETCH_INTERVAL);

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down trading bot...");
  process.exit(0);
});
