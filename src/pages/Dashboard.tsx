import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Star, LogOut, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// A type for the data fetched from the CoinGecko API
interface CoinData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [favoriteCoins, setFavoriteCoins] = useState<string[]>(['bitcoin', 'ethereum']);
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [cryptoData, setCryptoData] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&locale=en";

  const fetchCryptoData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: CoinData[] = await response.json();
      setCryptoData(data);
      setLastUpdate(new Date());
      toast({
        title: "Data Updated",
        description: "Cryptocurrency prices have been refreshed.",
        duration: 3000,
      });
    } catch (e: any) {
      setError(e.message);
      toast({
        title: "Error",
        description: `Failed to fetch data: ${e.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const toggleFavorite = (coinId: string) => {
    setFavoriteCoins(prev => 
      prev.includes(coinId) 
        ? prev.filter(id => id !== coinId)
        : [...prev, coinId]
    );
  };
  
  const topCoins = cryptoData.slice(0, 3);
  const chartCoin = cryptoData.find(c => c.id === selectedCoin);
  
  // Create a mock price history for the chart since the API doesn't provide it in this endpoint.
  // This is a necessary substitution if a separate historical data API is not used.
  const mockPriceData = chartCoin ? [
    { time: '00:00', price: chartCoin.current_price * (1 - chartCoin.price_change_percentage_24h / 100) },
    { time: '04:00', price: chartCoin.current_price * (1 - chartCoin.price_change_percentage_24h / 100) * 1.01 },
    { time: '08:00', price: chartCoin.current_price * (1 - chartCoin.price_change_percentage_24h / 100) * 0.995 },
    { time: '12:00', price: chartCoin.current_price * (1 - chartCoin.price_change_percentage_24h / 100) * 1.02 },
    { time: '16:00', price: chartCoin.current_price * (1 - chartCoin.price_change_percentage_24h / 100) * 1.03 },
    { time: '20:00', price: chartCoin.current_price * (1 - chartCoin.price_change_percentage_24h / 100) * 1.04 },
    { time: '24:00', price: chartCoin.current_price },
  ] : [];

  if (loading && cryptoData.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-green-400">Crypto Dashboard</h1>
            <p className="text-sm text-gray-400">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={fetchCryptoData} className="bg-slate-800 border-slate-700 text-green-400 hover:bg-slate-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="bg-slate-800 border-slate-700 text-red-400 hover:bg-slate-700">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        {/* Favorite Coins Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {topCoins.map((coin) => (
            <Card key={coin.id} className="relative bg-slate-800 border-slate-700 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-400">{coin.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(coin.id)}
                  className="h-8 w-8 p-0"
                >
                  <Star 
                    className={`h-4 w-4 ${favoriteCoins.includes(coin.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} 
                  />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${coin.current_price.toLocaleString()}</div>
                <div className="flex items-center text-sm">
                  {coin.price_change_percentage_24h > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}>
                    {coin.price_change_percentage_24h > 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                  <span className="text-gray-400 ml-1">24h</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Analysis */}
        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardHeader>
            <CardTitle>Price Analysis</CardTitle>
            <CardDescription className="text-gray-400">Real-time price charts for your favorite cryptocurrencies</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedCoin} onValueChange={setSelectedCoin}>
              <TabsList className="grid w-full grid-cols-3 bg-slate-700 border-slate-600">
                {topCoins.map((coin) => (
                  <TabsTrigger 
                    key={coin.id} 
                    value={coin.id} 
                    className="flex items-center gap-2 data-[state=active]:bg-green-400/20 data-[state=active]:text-green-400 data-[state=active]:shadow-lg"
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: coin.id === 'bitcoin' ? '#f7931a' : coin.id === 'ethereum' ? '#627eea' : '#0033ad' }}
                    />
                    {coin.symbol.toUpperCase()}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {chartCoin && (
                <TabsContent value={chartCoin.id} className="space-y-4 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{chartCoin.name} ({chartCoin.symbol.toUpperCase()})</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">${chartCoin.current_price.toLocaleString()}</span>
                        <Badge variant={chartCoin.price_change_percentage_24h > 0 ? "default" : "destructive"} className={chartCoin.price_change_percentage_24h > 0 ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                          {chartCoin.price_change_percentage_24h > 0 ? '+' : ''}{chartCoin.price_change_percentage_24h.toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                    {favoriteCoins.includes(chartCoin.id) && (
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400 bg-transparent">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Favorite
                      </Badge>
                    )}
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockPriceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                        <XAxis dataKey="time" stroke="#cbd5e0" />
                        <YAxis stroke="#cbd5e0" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem' }}
                          labelStyle={{ color: '#e2e8f0' }}
                          itemStyle={{ color: '#a0aec0' }}
                          formatter={(value: any) => [`$${Number(value).toLocaleString()}`, chartCoin.symbol.toUpperCase()]}
                          labelFormatter={(label: any) => `Time: ${label}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke={chartCoin.id === 'bitcoin' ? '#f7931a' : chartCoin.id === 'ethereum' ? '#627eea' : '#0033ad'}
                          strokeWidth={2}
                          dot={{ fill: chartCoin.id === 'bitcoin' ? '#f7931a' : chartCoin.id === 'ethereum' ? '#627eea' : '#0033ad', strokeWidth: 2, r: 4 }}
                          activeDot={{ fill: chartCoin.id === 'bitcoin' ? '#f7931a' : chartCoin.id === 'ethereum' ? '#627eea' : '#0033ad', stroke: '#fff', strokeWidth: 2, r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;