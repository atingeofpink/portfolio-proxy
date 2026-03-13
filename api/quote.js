export default async function handler(req, res) {
  const { symbols } = req.query;
  if (!symbols) return res.status(400).json({ error: 'No symbols provided' });

  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}&fields=regularMarketPrice`;

  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await r.json();
    const result = {};
    const quotes = data?.quoteResponse?.result || [];
    quotes.forEach(q => {
      result[q.symbol] = q.regularMarketPrice;
    });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(result);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
```

**4. Deploy to Vercel**
- Go to vercel.com → New Project → import your `portfolio-proxy` repo → Deploy
- Takes about 2 minutes
- Your proxy URL will be: `https://portfolio-proxy.vercel.app/api/quote`

**5. Tell me your proxy URL**
I'll swap the SG stock fetching in your dashboard to call it like:
```
https://your-proxy.vercel.app/api/quote?symbols=D05.SI,O39.SI,A17U.SI,...
