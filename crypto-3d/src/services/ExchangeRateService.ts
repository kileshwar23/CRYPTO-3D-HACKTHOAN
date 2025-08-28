interface ExchangeRate {
  currency: string;
  rate: number;
  name: string;
  symbol: string;
  change24h?: number;
}

interface ExchangeRateResponse {
  base: string;
  rates: { [key: string]: number };
  date: string;
}

export class ExchangeRateService {
  private static readonly BASE_URL = 'https://api.exchangerate-api.com/v4/latest';
  
  static async getExchangeRates(baseCurrency = 'USD'): Promise<ExchangeRate[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/${baseCurrency}`);
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rates');
      }
      
      const data: ExchangeRateResponse = await response.json();
      
      const currencyInfo = {
        USD: { name: 'US Dollar', symbol: '$' },
        EUR: { name: 'Euro', symbol: '€' },
        GBP: { name: 'British Pound', symbol: '£' },
        JPY: { name: 'Japanese Yen', symbol: '¥' },
        INR: { name: 'Indian Rupee', symbol: '₹' },
        CNY: { name: 'Chinese Yuan', symbol: '¥' },
        CAD: { name: 'Canadian Dollar', symbol: 'C$' },
        AUD: { name: 'Australian Dollar', symbol: 'A$' },
      };
      
      return Object.entries(data.rates)
        .filter(([currency]) => currency in currencyInfo)
        .map(([currency, rate]) => ({
          currency,
          rate,
          name: currencyInfo[currency as keyof typeof currencyInfo].name,
          symbol: currencyInfo[currency as keyof typeof currencyInfo].symbol,
        }));
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw error;
    }
  }
}