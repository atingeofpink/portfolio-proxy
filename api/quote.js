export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: 'No symbols provided' });

  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}&fields=regularMarketPrice,shortName`;

  try {
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      }
    });

    if (!r.ok) {
      return res.status(502).json({ error: `Yahoo returned ${r.status}` });
    }

    const data = await r.json();
    const quotes = data?.quoteResponse?.result || [];

    const result = {};
    quotes.forEach(q => {
      if (q.regularMarketPrice) result[q.symbol] = q.regularMarketPrice;
    });

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message, stack: e.stack });
  }
}
