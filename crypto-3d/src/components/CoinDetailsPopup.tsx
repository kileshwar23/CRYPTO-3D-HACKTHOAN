import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Globe, Calendar, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { AIService } from '@/services/AIService';

interface CoinDetailsPopupProps {
  coinId: string;
  isOpen: boolean;
  onClose: () => void;
  currency: string;
}

interface DetailedCoinData {
  id: string;
  name: string;
  symbol: string;
  image: { large: string };
  market_data: {
    current_price: { [key: string]: number };
    price_change_percentage_24h: number;
    market_cap: { [key: string]: number };
    total_volume: { [key: string]: number };
    circulating_supply: number;
    max_supply: number;
  };
  market_cap_rank: number;
  description: { en: string };
  links: {
    homepage: string[];
    whitepaper?: string;
  };
  genesis_date?: string;
}

const fetchCoinDetails = async (coinId: string): Promise<DetailedCoinData> => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch coin details');
  }
  return response.json();
};

const CoinDetailsPopup = ({ coinId, isOpen, onClose, currency }: CoinDetailsPopupProps) => {
  const { data: coinData, isLoading } = useQuery({
    queryKey: ['coinDetails', coinId],
    queryFn: () => fetchCoinDetails(coinId),
    enabled: isOpen && !!coinId,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time data
  });

  const { data: aiAnalysis, isLoading: aiLoading } = useQuery({
    queryKey: ['coinAnalysis', coinId],
    queryFn: () => coinData ? AIService.generateCoinAnalysis(coinData, currency) : null,
    enabled: !!coinData,
  });

  const currencies = [
    { code: 'inr', symbol: '₹' },
    { code: 'usd', symbol: '$' },
    { code: 'eur', symbol: '€' },
    { code: 'gbp', symbol: '£' },
    { code: 'jpy', symbol: '¥' },
    { code: 'btc', symbol: '₿' },
  ];

  const formatPrice = (price: number, curr: string) => {
    const currencyData = currencies.find(c => c.code === curr) || currencies[0];
    
    if (curr === 'btc') {
      return `${currencyData.symbol}${price?.toFixed(8) || '0.00000000'}`;
    }
    
    if (price < 1) {
      return `${currencyData.symbol}${price?.toFixed(4) || '0.0000'}`;
    }
    
    if (curr === 'jpy') {
      return `${currencyData.symbol}${price?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '0'}`;
    }
    
    return `${currencyData.symbol}${price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num?.toFixed(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-crypto-dark border-crypto-gray">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white flex items-center gap-3">
            {coinData?.image?.large && (
              <img src={coinData.image.large} alt={coinData.name} className="w-8 h-8" />
            )}
            {coinData?.name} ({coinData?.symbol?.toUpperCase()})
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crypto-neon"></div>
          </div>
        ) : coinData ? (
          <div className="space-y-6">
            {/* Price & Market Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-morphism rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">Current Price</div>
                <div className="text-2xl font-bold text-white">
                  {formatPrice(coinData.market_data?.current_price?.[currency], currency)}
                </div>
                <div className={`flex items-center mt-2 ${
                  coinData.market_data?.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {coinData.market_data?.price_change_percentage_24h > 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  <span className="font-semibold">
                    {coinData.market_data?.price_change_percentage_24h > 0 ? '+' : ''}
                    {coinData.market_data?.price_change_percentage_24h?.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="glass-morphism rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">Market Cap</div>
                <div className="text-xl font-bold text-white">
                  {formatPrice(coinData.market_data?.market_cap?.[currency], currency)}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Rank #{coinData.market_cap_rank}
                </div>
              </div>

              <div className="glass-morphism rounded-xl p-4">
                <div className="text-sm text-gray-400 mb-1">24h Volume</div>
                <div className="text-xl font-bold text-white">
                  {formatPrice(coinData.market_data?.total_volume?.[currency], currency)}
                </div>
              </div>
            </div>

            {/* Supply Info */}
            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Supply Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Circulating Supply</div>
                  <div className="text-lg font-semibold text-white">
                    {formatNumber(coinData.market_data?.circulating_supply)} {coinData.symbol?.toUpperCase()}
                  </div>
                </div>
                {coinData.market_data?.max_supply && (
                  <div>
                    <div className="text-sm text-gray-400">Max Supply</div>
                    <div className="text-lg font-semibold text-white">
                      {formatNumber(coinData.market_data?.max_supply)} {coinData.symbol?.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Analysis */}
            {aiLoading ? (
              <div className="glass-morphism rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-crypto-neon"></div>
                  <h3 className="text-lg font-semibold text-white">AI Analysis Loading...</h3>
                </div>
              </div>
            ) : aiAnalysis ? (
              <div className="glass-morphism rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-crypto-neon">🤖</span>
                  AI Market Analysis
                  <Badge variant={aiAnalysis.sentiment === 'bullish' ? 'default' : aiAnalysis.sentiment === 'bearish' ? 'destructive' : 'secondary'}>
                    {aiAnalysis.sentiment.toUpperCase()}
                  </Badge>
                </h3>
                <p className="text-gray-300 mb-4">{aiAnalysis.summary}</p>
                <div className="space-y-2">
                  {aiAnalysis.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-crypto-neon rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Description */}
            {coinData.description?.en && (
              <div className="glass-morphism rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">About {coinData.name}</h3>
                <p className="text-gray-300 leading-relaxed">
                  {coinData.description.en.split('.').slice(0, 3).join('.')}...
                </p>
              </div>
            )}

            {/* Links */}
            <div className="glass-morphism rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
              <div className="flex flex-wrap gap-3">
                {coinData.links?.homepage?.[0] && (
                  <a
                    href={coinData.links.homepage[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-crypto-blue rounded-lg hover:bg-crypto-gray transition-colors text-white"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                 {coinData.genesis_date && (
                   <div className="flex items-center gap-2 px-4 py-2 bg-crypto-blue rounded-lg text-white">
                     <Calendar className="w-4 h-4" />
                     Since {new Date(coinData.genesis_date).getFullYear()}
                   </div>
                 )}
                 <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 rounded-lg text-green-400 border border-green-600/30">
                   <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                   <span className="text-sm font-medium">Live Data (30s updates)</span>
                 </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default CoinDetailsPopup;