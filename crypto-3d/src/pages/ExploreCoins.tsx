import { useState } from 'react';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/Layout';
import CoinDetailsPopup from '@/components/CoinDetailsPopup';

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

const currencies = [
  { code: 'inr', symbol: '₹', name: 'Indian Rupee' },
  { code: 'usd', symbol: '$', name: 'US Dollar' },
  { code: 'eur', symbol: '€', name: 'Euro' },
  { code: 'gbp', symbol: '£', name: 'British Pound' },
  { code: 'jpy', symbol: '¥', name: 'Japanese Yen' },
  { code: 'btc', symbol: '₿', name: 'Bitcoin' },
];

const fetchAllCoins = async (currency: string): Promise<CoinData[]> => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=250&page=1&sparkline=false&locale=en`);
  if (!response.ok) {
    throw new Error('Failed to fetch cryptocurrency data');
  }
  return response.json();
};

const ExploreCoins = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('inr');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const coinsPerPage = 50;

  const { data: allCoins = [], isLoading } = useQuery({
    queryKey: ['allCoins', selectedCurrency],
    queryFn: () => fetchAllCoins(selectedCurrency),
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

  const filteredCoins = allCoins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCoins.length / coinsPerPage);
  const currentCoins = filteredCoins.slice(
    (currentPage - 1) * coinsPerPage,
    currentPage * coinsPerPage
  );

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Explore All Cryptocurrencies
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover and track over 250 cryptocurrencies with real-time prices, market data, and 24-hour changes.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search cryptocurrencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-crypto-blue border-crypto-gray text-white placeholder-gray-400"
            />
          </div>

          {/* Currency Selector */}
          <div className="md:w-64">
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="bg-crypto-blue border-crypto-gray text-white">
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-morphism rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-crypto-neon mb-2">{filteredCoins.length}</div>
            <div className="text-gray-300">Total Coins</div>
          </div>
          <div className="glass-morphism rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {filteredCoins.filter(coin => coin.price_change_percentage_24h > 0).length}
            </div>
            <div className="text-gray-300">Gainers (24h)</div>
          </div>
          <div className="glass-morphism rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {filteredCoins.filter(coin => coin.price_change_percentage_24h < 0).length}
            </div>
            <div className="text-gray-300">Losers (24h)</div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-neon"></div>
          </div>
        ) : (
          <>
            {/* Coins Table */}
            <div className="glass-morphism rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-crypto-blue/50">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-medium">#</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Coin</th>
                      <th className="text-right p-4 text-gray-300 font-medium">Price</th>
                      <th className="text-right p-4 text-gray-300 font-medium">24h Change</th>
                      <th className="text-right p-4 text-gray-300 font-medium hidden md:table-cell">Market Cap</th>
                      <th className="text-right p-4 text-gray-300 font-medium hidden lg:table-cell">Volume (24h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCoins.map((coin, index) => (
                      <tr 
                        key={coin.id} 
                        className="border-t border-crypto-gray hover:bg-crypto-blue/20 transition-colors cursor-pointer"
                        onClick={() => setSelectedCoin(coin.id)}
                      >
                        <td className="p-4 text-gray-400">
                          {(currentPage - 1) * coinsPerPage + index + 1}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={coin.image} 
                              alt={coin.name}
                              className="w-8 h-8 rounded-full"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <div>
                              <div className="font-semibold text-white">{coin.name}</div>
                              <div className="text-gray-400 text-sm">{coin.symbol.toUpperCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right font-semibold text-white">
                          {formatPrice(coin.current_price, selectedCurrency)}
                        </td>
                        <td className="p-4 text-right">
                          <div className={`flex items-center justify-end space-x-1 ${
                            coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {coin.price_change_percentage_24h > 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            <span className="font-semibold">
                              {coin.price_change_percentage_24h > 0 ? '+' : ''}
                              {coin.price_change_percentage_24h?.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right text-gray-300 hidden md:table-cell">
                          {coin.market_cap ? formatPrice(coin.market_cap, selectedCurrency) : 'N/A'}
                        </td>
                        <td className="p-4 text-right text-gray-300 hidden lg:table-cell">
                          {coin.total_volume ? formatPrice(coin.total_volume, selectedCurrency) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 glass-morphism rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-crypto-neon/20 transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, currentPage - 2) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-crypto-neon text-crypto-dark font-semibold'
                            : 'glass-morphism text-white hover:bg-crypto-neon/20'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 glass-morphism rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-crypto-neon/20 transition-colors"
                >
                  Next
                </button>
              </div>
            )}

            {/* Live Indicator */}
            <div className="flex items-center justify-center mt-8">
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
    </Layout>
  );
};

export default ExploreCoins;
