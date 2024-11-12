const axios = require("axios");
const BinanceService = require("../../services/BinanceService");

jest.mock("axios");

describe("BinanceService", () => {
  let service;
  let mockGet;

  beforeEach(() => {
    mockGet = jest.fn();
    axios.create.mockReturnValue({ get: mockGet });
    service = new BinanceService.constructor();  // Instantiate a new service for each test
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetchTrades should call the correct API endpoint with symbol and limit", async () => {
    const symbol = "BTCUSDT";
    const limit = 5;

    const mockData = [
      { price: "50000", qty: "0.1", time: 1620000000000 },
      { price: "51000", qty: "0.2", time: 1620000001000 }
    ];

    mockGet.mockResolvedValueOnce({ data: mockData });

    const result = await service.fetchTrades(symbol, limit);

    expect(mockGet).toHaveBeenCalledWith(`/trades?symbol=${symbol}&limit=${limit}`);
    expect(result).toEqual([
      { symbol, price: 50000, qty: 0.1, time: new Date(1620000000000) },
      { symbol, price: 51000, qty: 0.2, time: new Date(1620000001000) }
    ]);
  });

  it("fetchTrades should handle errors appropriately", async () => {
    const symbol = "BTCUSDT";
    const limit = 5;

    mockGet.mockRejectedValueOnce(new Error("API Error"));

    await expect(service.fetchTrades(symbol, limit)).rejects.toThrow("API Error");
  });
});