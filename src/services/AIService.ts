interface MarketSummaryData {
  cryptoData: any[];
  exchangeRates: any[];
}

interface SummaryResponse {
  summary: string;
  keyPoints: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

interface CoinAnalysisData {
  id: string;
  name: string;
  symbol: string;
  market_data: {
    current_price: { [key: string]: number };
    price_change_percentage_24h: number;
    market_cap: { [key: string]: number };
    circulating_supply: number;
    max_supply?: number;
  };
  market_cap_rank: number;
}

interface CoinAnalysisResponse {
  summary: string;
  keyPoints: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export class AIService {
  static async generateMarketSummary(data: MarketSummaryData): Promise<SummaryResponse> {
    try {
      // Create a comprehensive market analysis prompt
      const cryptoTrends = data.cryptoData.map(crypto => ({
        name: crypto.name,
        price: crypto.current_price,
        change: crypto.price_change_percentage_24h
      }));
      
      const marketAnalysis = this.analyzeMarketData(cryptoTrends, data.exchangeRates);
      
      return {
        summary: marketAnalysis.summary,
        keyPoints: marketAnalysis.keyPoints,
        sentiment: marketAnalysis.sentiment
      };
    } catch (error) {
      console.error('Error generating market summary:', error);
      return {
        summary: "Unable to generate market summary at this time.",
        keyPoints: ["Market data analysis temporarily unavailable"],
        sentiment: 'neutral'
      };
    }
  }
  
  private static analyzeMarketData(cryptoTrends: any[], exchangeRates: any[]) {
    const positiveChanges = cryptoTrends.filter(c => c.change > 0).length;
    const negativeChanges = cryptoTrends.filter(c => c.change < 0).length;
    const totalCryptos = cryptoTrends.length;
    
    const avgChange = cryptoTrends.reduce((sum, c) => sum + c.change, 0) / totalCryptos;
    
    let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (avgChange > 2) sentiment = 'bullish';
    else if (avgChange < -2) sentiment = 'bearish';
    
    const summary = `Current market shows ${sentiment} sentiment with ${positiveChanges} out of ${totalCryptos} top cryptocurrencies gaining value. Average 24h change is ${avgChange.toFixed(2)}%. ${sentiment === 'bullish' ? 'Strong upward momentum observed across major assets.' : sentiment === 'bearish' ? 'Market correction underway with significant selling pressure.' : 'Mixed signals with balanced buying and selling activity.'}`;
    
    const keyPoints = [
      `${positiveChanges} cryptocurrencies up, ${negativeChanges} down`,
      `Average 24h change: ${avgChange > 0 ? '+' : ''}${avgChange.toFixed(2)}%`,
      `Market sentiment: ${sentiment.toUpperCase()}`,
      `Top performer: ${cryptoTrends.sort((a, b) => b.change - a.change)[0]?.name || 'N/A'}`,
      `Currency markets stable with USD as base reference`
    ];
    
    return { summary, keyPoints, sentiment };
  }

  static async generateCoinAnalysis(coinData: CoinAnalysisData, currency: string): Promise<CoinAnalysisResponse> {
    try {
      const analysis = this.analyzeCoinData(coinData, currency);
      
      return {
        summary: analysis.summary,
        keyPoints: analysis.keyPoints,
        sentiment: analysis.sentiment
      };
    } catch (error) {
      console.error('Error generating coin analysis:', error);
      return {
        summary: "Unable to generate coin analysis at this time.",
        keyPoints: ["Coin data analysis temporarily unavailable"],
        sentiment: 'neutral'
      };
    }
  }

  private static analyzeCoinData(coin: CoinAnalysisData, currency: string) {
    const priceChange = coin.market_data?.price_change_percentage_24h || 0;
    const marketCapRank = coin.market_cap_rank || 999;
    const supplyRatio = coin.market_data?.max_supply ? (coin.market_data?.circulating_supply / coin.market_data?.max_supply) * 100 : null;
    
    let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (priceChange > 5) sentiment = 'bullish';
    else if (priceChange < -5) sentiment = 'bearish';
    
    const rankDescription = marketCapRank <= 10 ? 'top-tier' : marketCapRank <= 50 ? 'established' : marketCapRank <= 100 ? 'mid-cap' : 'emerging';
    
    const summary = `${coin.name} (${coin.symbol.toUpperCase()}) is currently showing ${sentiment} momentum with a ${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)}% change in the last 24 hours. As a ${rankDescription} cryptocurrency ranked #${marketCapRank} by market cap, it ${sentiment === 'bullish' ? 'demonstrates strong buying pressure and positive market sentiment' : sentiment === 'bearish' ? 'faces selling pressure with declining market confidence' : 'maintains stable trading activity with mixed market signals'}.`;
    
    const keyPoints = [
      `Current rank: #${marketCapRank} by market capitalization`,
      `24-hour price change: ${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)}%`,
      `Market sentiment: ${sentiment.toUpperCase()}`,
      supplyRatio ? `Supply utilization: ${supplyRatio.toFixed(1)}% of max supply in circulation` : 'No maximum supply limit defined',
      `Classification: ${rankDescription.charAt(0).toUpperCase() + rankDescription.slice(1)} cryptocurrency`,
      sentiment === 'bullish' ? 'Strong upward momentum suggests positive investor confidence' : 
      sentiment === 'bearish' ? 'Downward pressure indicates market concerns or profit-taking' : 
      'Stable price action reflects balanced market dynamics'
    ];
    
    return { summary, keyPoints, sentiment };
  }
}