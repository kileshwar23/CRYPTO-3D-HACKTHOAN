
import { Book, Coins, Network, Shield } from 'lucide-react';

const LearnCrypto = () => {
  const topics = [
    {
      id: 1,
      title: "Bitcoin",
      description: "Learn about the world's first and most valuable cryptocurrency, its technology, and investment potential.",
      icon: Bitcoin,
      color: "from-orange-400 to-yellow-500"
    },
    {
      id: 2,
      title: "Ethereum", 
      description: "Discover smart contracts, DeFi, and the revolutionary platform that powers thousands of applications.",
      icon: Network,
      color: "from-blue-400 to-purple-500"
    },
    {
      id: 3,
      title: "Altcoins",
      description: "Explore alternative cryptocurrencies beyond Bitcoin and their unique use cases in the digital economy.",
      icon: Coins,
      color: "from-green-400 to-cyan-500"
    },
    {
      id: 4,
      title: "Blockchain",
      description: "Understand the underlying technology that makes cryptocurrencies secure, transparent, and decentralized.",
      icon: Shield,
      color: "from-purple-400 to-pink-500"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Learn Crypto
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Master cryptocurrency fundamentals with our comprehensive educational resources. 
            From beginner basics to advanced concepts.
          </p>
        </div>

        {/* Learning Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {topics.map((topic, index) => (
            <div 
              key={topic.id}
              className="group relative neumorphic rounded-3xl p-8 hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 neumorphic-inset rounded-2xl flex items-center justify-center group-hover:animate-pulse">
                  <topic.icon className="w-10 h-10 text-crypto-neon" />
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-crypto-neon transition-colors duration-300">
                  {topic.title}
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {topic.description}
                </p>
                
                {/* Learn More Link */}
                <div className="flex items-center text-crypto-neon font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <Book className="w-5 h-5 mr-2" />
                  <span>Learn More</span>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-crypto-neon/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="glass-morphism rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Start Your Crypto Journey?
            </h3>
            <p className="text-gray-300 mb-6">
              Join thousands of users who trust CryptoTrack for their cryptocurrency education and tracking needs.
            </p>
            <button className="bg-gradient-to-r from-crypto-neon to-blue-400 text-crypto-dark font-semibold px-8 py-3 rounded-full hover:scale-105 transition-transform duration-300">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Bitcoin icon component for consistency
const Bitcoin = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 14.73c-.38 1.504-1.594 2.044-3.51 1.77l-.717 2.87-1.75-.436.698-2.797c-.46-.115-.934-.223-1.402-.332l-.702 2.812-1.75-.436.717-2.87c-.381-.086-.752-.17-1.115-.25h-.002l-2.414-.602.465-1.86s1.294.297 1.266.28c.707.177.835-.307.835-.307l.934-3.742c.056.014.128.035.207.067l-.208-.052.662-2.654c.05-.394-.087-.855-.714-1.05.016-.023-1.266-.316-1.266-.316l.25-2.005 2.557.637-.002.01c.402.1.82.193 1.244.284l.71-2.846 1.75.436-.696 2.787c.479.109.943.223 1.396.34l.693-2.78 1.75.437-.71 2.844c2.947.558 5.158.333 6.09-2.333.75-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538.292-1.975-.604-3.13-2.595-3.87zm-4.634 6.504c-.535 2.146-4.148.985-5.32.735l.95-3.805c1.172.293 4.929.874 4.37 3.07zm.535-6.536c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.244 4.118.7 3.61 2.733z"/>
  </svg>
);

export default LearnCrypto;
