
import { Bitcoin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-crypto-dark via-crypto-blue to-crypto-dark opacity-90"></div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-crypto-neon rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Animated Bitcoin Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 neumorphic rounded-full flex items-center justify-center animate-rotate">
              <Bitcoin className="w-16 h-16 text-crypto-neon animate-glow" />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-crypto-neon to-blue-400 opacity-20 animate-pulse"></div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient animate-fade-in">
          Track Crypto Instantly
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in">
          Stay updated with live prices of top cryptocurrencies. 
          Professional tracking with real-time data and modern interface.
        </p>

        {/* CTA Button */}
        <Button 
          size="lg" 
          onClick={() => navigate('/explore-coins')}
          className="bg-crypto-neon hover:bg-crypto-neon/90 text-crypto-dark font-semibold px-8 py-4 text-lg neumorphic border-0 transition-all duration-300 hover:scale-105 animate-fade-in"
        >
          Explore Coins
        </Button>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { label: "Cryptocurrencies", value: "250+" },
            { label: "Market Cap", value: "$2.1T" },
            { label: "24h Volume", value: "$89B" }
          ].map((stat, index) => (
            <div key={index} className="glass-morphism rounded-2xl p-6 animate-fade-in">
              <div className="text-3xl font-bold text-crypto-neon mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
