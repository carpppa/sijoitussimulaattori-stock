type SymbolName = 'AAPL' | 'AMZN'; // | 'BABA' | 'BAC' | 'DIS' | 'GOOGL';
const SUPPORTED_SYMBOLS: SymbolName[] = ['AAPL', 'AMZN']; //, 'AMZN', 'BABA', 'BAC', 'DIS', 'GOOGL'];

interface DailyQuote {
  symbol: SymbolName;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Symbol {
  symbol: SymbolName;
  name: string;
  type: string;
  region: string;
  marketOpen: string;
  marketClose: string;
  timeZone: string;
  currency: string;
}

interface Stock {
  symbol: string;
  name: string;
  high: number;
  low: number;
  revenue: number;
  close: number;
}

export { SymbolName, SUPPORTED_SYMBOLS, DailyQuote, Symbol, Stock };
