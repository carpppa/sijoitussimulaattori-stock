const express = require('express');
const app = express();
const port = 8888;

function availableStocks(symbol, functionName) {
  const filename = __dirname + '/data/' + symbol + '/' + functionName + '.json';
  return require(filename);
}

app.get('/query', (req, res) => {
  const symbol = req.query.symbol || req.query.keywords;
  res.send(availableStocks(symbol, req.query.function));
});

app.listen(port, () => {
  console.log(`Alpha Vantage dev-server listening on http://127.0.0.1:${port}`);
});
