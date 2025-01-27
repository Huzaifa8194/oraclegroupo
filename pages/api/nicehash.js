import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const BLOCKCHAIN_INFO_API = 'https://blockchain.info';

// Constants for algorithms and units
const ALGORITHMS = {
  sha256: 6.25, // Bitcoin (SHA-256) block reward
  ethash: 2,    // Example block reward for Ethereum (ETH)
};

const UNIT_MULTIPLIERS = {
  H: 1,
  kH: 1e3,
  MH: 1e6,
  GH: 1e9,
  TH: 1e12,
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { action, payload } = req.body;

    switch (action) {
      case 'getBitcoinPrice': {
        const response = await axios.get(`${COINGECKO_API}/simple/price`, {
          params: { ids: 'bitcoin', vs_currencies: 'usd' },
        });
        res.status(200).json(response.data.bitcoin);
        break;
      }

      case 'getMiningDifficulty': {
        const response = await axios.get(`${BLOCKCHAIN_INFO_API}/q/getdifficulty`);
        res.status(200).json({ difficulty: response.data });
        break;
      }

      case 'calculateProfitability': {
        const {
          hashrate,
          btcPrice,
          networkDifficulty,
          algorithm,
          unit,
          powerConsumption,
          electricityCost,
          poolFee,
        } = payload;

        if (
          !hashrate ||
          !btcPrice ||
          !networkDifficulty ||
          !algorithm ||
          !unit ||
          powerConsumption === undefined ||
          electricityCost === undefined ||
          poolFee === undefined
        ) {
          return res.status(400).json({ error: 'Missing required parameters.' });
        }

        // Convert hashrate to H/s
        const hashrateInH = hashrate * (UNIT_MULTIPLIERS[unit] || 1);

        // Get block reward for the algorithm
        const blockReward = ALGORITHMS[algorithm] || 0;

        // Calculate BTC earned per day
        const btcPerDay = (hashrateInH * blockReward * 86400) / (networkDifficulty * 2 ** 32);

        // Calculate gross revenue in USD
        const grossRevenue = btcPerDay * btcPrice;

        // Calculate daily electricity costs
        const dailyElectricityCost = (powerConsumption * 24) / 1000 * electricityCost;

        // Calculate pool fees
        const poolFeeAmount = grossRevenue * (poolFee / 100);

        // Calculate net profitability
        const netProfit = grossRevenue - dailyElectricityCost - poolFeeAmount;

        res.status(200).json({
          btcPerDay,
          grossRevenue,
          dailyElectricityCost,
          poolFeeAmount,
          netProfit,
        });
        break;
      }

      default:
        res.status(400).json({ error: 'Invalid action.' });
    }
  } catch (error) {
    console.error('Error in API handler:', error.message);
    res.status(500).json({ error: 'An error occurred.', details: error.message });
  }
}
