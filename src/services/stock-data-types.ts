type SymbolName = 'AAPL'; // | 'AMZN' | 'BABA' | 'BAC' | 'DIS' | 'GOOGL';
const SUPPORTED_SYMBOLS: SymbolName[] = ['AAPL']; //, 'AMZN', 'BABA', 'BAC', 'DIS', 'GOOGL'];

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

export { SymbolName, SUPPORTED_SYMBOLS, DailyQuote, Symbol };