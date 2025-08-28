
import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CoinDetailsPopup from './CoinDetailsPopup';

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

const currencies = [
  { code: 'inr', symbol: '₹', name: 'Indian Rupee' },
  { code: 'usd', symbol: '$', name: 'US Dollar' },
  { code: 'eur', symbol: '€', name: 'Euro' },
  { code: 'gbp', symbol: '£', name: 'British Pound' },
  { code: 'jpy', symbol: '¥', name: 'Japanese Yen' },
  { code: 'btc', symbol: '₿', name: 'Bitcoin' },
];

const fetchTopCoins = async (currency: string): Promise<CoinData[]> => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=6&page=1&sparkline=false`);
  if (!response.ok) {
    throw new Error('Failed to fetch cryptocurrency data');
  }
  return response.json();
};

const LivePrices = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('inr');
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const currentCurrency = currencies.find(c => c.code === selectedCurrency) || currencies[0];

  const { data: cryptoData = [], isLoading } = useQuery({
    queryKey: ['topCoins', selectedCurrency],
    queryFn: () => fetchTopCoins(selectedCurrency),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const formatPrice = (price: number, currency: string) => {
    const currencyData = currencies.find(c => c.code === currency) || currencies[0];
    
    if (currency === 'btc') {
      return `${currencyData.symbol}${price.toFixed(8)}`;
    }
    
    if (price < 1) {
      return `${currencyData.symbol}${price.toFixed(4)}`;
    }
    
    if (currency === 'jpy') {
      return `${currencyData.symbol}${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    
    return `${currencyData.symbol}${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Fallback icons for coins
  const getCoinIcon = (symbol: string) => {
    const icons: { [key: string]: string } = {
      'BTC': '₿',
      'ETH': 'Ξ',
      'ADA': '₳',
      'SOL': '◎',
      'DOT': '●',
      'LINK': '⬢',
      'BNB': 'B',
      'XRP': 'X',
      'MATIC': 'M',
      'AVAX': 'A'
    };
    return icons[symbol.toUpperCase()] || '●';
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Live Crypto Prices
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Real-time cryptocurrency prices with 24-hour change indicators. 
            Stay informed with our professional tracking system.
          </p>

          {/* Currency Selector */}
          <div className="flex justify-center mb-8">
            <div className="glass-morphism rounded-xl p-4">
              <label className="text-sm text-gray-300 mb-2 block">Select Currency</label>
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="w-48 bg-crypto-blue border-crypto-gray text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-crypto-blue border-crypto-gray">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code} className="text-white hover:bg-crypto-gray">
                      {currency.symbol} {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-neon"></div>
          </div>
        ) : (
          <>
            {/* Crypto Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cryptoData.map((crypto, index) => (
                <div 
                  key={crypto.id} 
                  className="neumorphic rounded-3xl p-8 hover:scale-105 transition-all duration-300 group cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedCoin(crypto.id)}
                >
                  {/* Crypto Icon & Name */}
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 neumorphic-inset rounded-full flex items-center justify-center mr-4 group-hover:animate-pulse">
                      <span className="text-2xl font-bold text-crypto-neon">{getCoinIcon(crypto.symbol)}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{crypto.name}</h3>
                      <p className="text-gray-400">{crypto.symbol.toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-white mb-2">
                      {formatPrice(crypto.current_price, selectedCurrency)}
                    </div>
                  </div>

                  {/* 24h Change */}
                  <div className="flex items-center">
                    {crypto.price_change_percentage_24h > 0 ? (
                      <>
                        <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                        <span className="text-green-400 font-semibold">
                          +{crypto.price_change_percentage_24h?.toFixed(2)}%
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-5 h-5 text-red-400 mr-2" />
                        <span className="text-red-400 font-semibold">
                          {crypto.price_change_percentage_24h?.toFixed(2)}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-crypto-neon/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Live Indicator */}
            <div className="flex items-center justify-center mt-12">
              <div className="flex items-center glass-morphism rounded-full px-6 py-3">
                <div className="w-3 h-3 bg-crypto-neon rounded-full animate-pulse mr-3"></div>
                <span className="text-gray-300 font-medium">Live Data Updates (30s)</span>
              </div>
            </div>
          </>
        )}

        {/* Coin Details Popup */}
        <CoinDetailsPopup
          coinId={selectedCoin || ''}
          isOpen={!!selectedCoin}
          onClose={() => setSelectedCoin(null)}
          currency={selectedCurrency}
        />
      </div>
    </section>
  );
};

export default LivePrices;
