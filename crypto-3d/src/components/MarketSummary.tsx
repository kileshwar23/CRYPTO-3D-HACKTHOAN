import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, RefreshCw, DollarSign, BarChart3 } from 'lucide-react';
import { ExchangeRateService } from '@/services/ExchangeRateService';
import { AIService } from '@/services/AIService';
import { Badge } from '@/components/ui/badge';

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
}

const fetchTopCoins = async (currency: string): Promise<CoinData[]> => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=6&page=1&sparkline=false`);
  if (!response.ok) {
    throw new Error('Failed to fetch cryptocurrency data');
  }
  return response.json();
};

const MarketSummary = () => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [marketSummary, setMarketSummary] = useState<any>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const { data: cryptoData = [] } = useQuery({
    queryKey: ['topCoins', 'usd'],
    queryFn: () => fetchTopCoins('usd'),
    refetchInterval: 30000,
  });

  const { data: exchangeRates = [] } = useQuery({
    queryKey: ['exchangeRates', baseCurrency],
    queryFn: () => ExchangeRateService.getExchangeRates(baseCurrency),
    refetchInterval: 30000,
  });

  const generateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const summary = await AIService.generateMarketSummary({
        cryptoData,
        exchangeRates
      });
      setMarketSummary(summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  useEffect(() => {
    if (cryptoData.length > 0 && exchangeRates.length > 0) {
      generateSummary();
    }
  }, [cryptoData, exchangeRates]);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="w-4 h-4" />;
      case 'bearish': return <TrendingDown className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Market Intelligence
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI-powered market analysis combining cryptocurrency trends and currency exchange rates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Exchange Rates Card */}
          <Card className="neumorphic p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 text-crypto-neon mr-3" />
                <h3 className="text-2xl font-bold text-white">Exchange Rates</h3>
              </div>
              <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                <SelectTrigger className="w-32 bg-crypto-blue border-crypto-gray text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-crypto-blue border-crypto-gray">
                  {['USD', 'EUR', 'GBP', 'JPY', 'INR'].map((currency) => (
                    <SelectItem key={currency} value={currency} className="text-white hover:bg-crypto-gray">
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {exchangeRates.slice(0, 6).map((rate) => (
                <div key={rate.currency} className="glass-morphism rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">{rate.currency}</div>
                      <div className="text-lg font-semibold text-white">
                        {rate.symbol}{rate.rate.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* AI Market Summary Card */}
          <Card className="neumorphic p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <BarChart3 className="w-6 h-6 text-crypto-neon mr-3" />
                <h3 className="text-2xl font-bold text-white">AI Market Analysis</h3>
              </div>
              <Button
                onClick={generateSummary}
                disabled={isGeneratingSummary}
                variant="outline"
                size="sm"
                className="border-crypto-gray text-crypto-neon hover:bg-crypto-gray"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {marketSummary ? (
              <div className="space-y-6">
                <div className="flex items-center">
                  <Badge variant="outline" className={`${getSentimentColor(marketSummary.sentiment)} border-current`}>
                    {getSentimentIcon(marketSummary.sentiment)}
                    <span className="ml-2 capitalize">{marketSummary.sentiment}</span>
                  </Badge>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Market Summary</h4>
                  <p className="text-gray-300 leading-relaxed">{marketSummary.summary}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Key Insights</h4>
                  <ul className="space-y-2">
                    {marketSummary.keyPoints.map((point: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-crypto-neon rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-neon"></div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default MarketSummary;