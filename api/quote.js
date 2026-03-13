import yahooFinance from 'yahoo-finance2';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: 'No symbols provided' });

  const symbolList = symbols.split(',').map(s => s.trim()).filter(Boolean);

  try {
    const result = {};
    await Promise.all(symbolList.map(async sym => {
      try {
        const quote = await yahooFinance.quote(sym);
        if (quote && quote.regularMarketPrice) {
          result[sym] = quote.regularMarketPrice;
        }
      } catch(e) {
        // skip failed symbol, don't crash whole request
        console.error(`Failed to fetch ${sym}:`, e.message);
      }
    }));

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
