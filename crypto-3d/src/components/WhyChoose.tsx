
import { Zap, Shield, Smartphone, BarChart3, Users, Clock } from 'lucide-react';

const WhyChoose = () => {
  const features = [
    {
      id: 1,
      title: "Real-time Prices",
      description: "Get instant updates on cryptocurrency prices with millisecond precision across all major exchanges.",
      icon: Zap,
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      id: 2,
      title: "Beginner-Friendly UI",
      description: "Intuitive interface designed for both newcomers and experienced traders with clean, accessible design.",
      icon: Users,
      gradient: "from-green-400 to-emerald-500"
    },
    {
      id: 3,
      title: "Mobile Ready",
      description: "Fully responsive design that works seamlessly across all devices - desktop, tablet, and mobile.",
      icon: Smartphone,
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      id: 4,
      title: "Advanced Analytics",
      description: "Comprehensive charts, technical indicators, and market analysis tools for informed decision making.",
      icon: BarChart3,
      gradient: "from-purple-400 to-pink-500"
    },
    {
      id: 5,
      title: "Secure & Reliable",
      description: "Bank-grade security measures and 99.9% uptime ensure your data is always safe and accessible.",
      icon: Shield,
      gradient: "from-red-400 to-rose-500"
    },
    {
      id: 6,
      title: "24/7 Monitoring",
      description: "Round-the-clock market surveillance with instant alerts for price movements and market changes.",
      icon: Clock,
      gradient: "from-indigo-400 to-blue-500"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #00ff88 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Why Choose CryptoTrack?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the most advanced cryptocurrency tracking platform with features designed 
            to give you the competitive edge in the digital asset market.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.id}
              className="group relative neumorphic rounded-3xl p-8 hover:scale-105 transition-all duration-500 overflow-hidden cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className="w-16 h-16 neumorphic-inset rounded-2xl flex items-center justify-center group-hover:animate-pulse">
                  <feature.icon className="w-8 h-8 text-crypto-neon group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-crypto-neon transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-crypto-neon/0 to-crypto-neon/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <div className="glass-morphism rounded-3xl p-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Stats */}
              <div className="text-center">
                <div className="text-3xl font-bold text-crypto-neon mb-2">30s</div>
                <div className="text-gray-300">Refresh</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-crypto-neon mb-2">99.9%</div>
                <div className="text-gray-300">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-crypto-neon mb-2">24/7</div>
                <div className="text-gray-300">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
