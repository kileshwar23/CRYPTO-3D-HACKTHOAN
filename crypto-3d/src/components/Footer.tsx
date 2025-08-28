
import { Bitcoin, Github, Twitter } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: "Live Prices", href: "#prices" },
    { name: "Learn Crypto", href: "#learn" },
    { name: "Market Analysis", href: "#analysis" },
    { name: "API Documentation", href: "#api" },
    { name: "Support Center", href: "#support" },
    { name: "Privacy Policy", href: "#privacy" }
  ];

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/BitnaroCrypto" },
    { name: "Discord", icon: () => (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.010c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.120.098.246.195.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ), href: "https://discord.gg/cryptotrack" },
    { name: "GitHub", icon: Github, href: "https://github.com/bitnaro-cryptotrack" }
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-crypto-dark via-crypto-blue to-crypto-dark">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, #00ff88 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 neumorphic rounded-xl flex items-center justify-center mr-4">
                <Bitcoin className="w-6 h-6 text-crypto-neon" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">CryptoTrack</h3>
                <p className="text-gray-400 text-sm">by Bitnaro</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              The most advanced cryptocurrency tracking platform. Stay informed, 
              make better decisions, and succeed in the digital asset market.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-morphism rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-crypto-neon">250+</div>
                <div className="text-gray-400 text-sm">Cryptocurrencies</div>
              </div>
              <div className="glass-morphism rounded-xl p-4 text-center">
                <div className="text-xl font-bold text-crypto-neon">30s</div>
                <div className="text-gray-400 text-sm">Refresh</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold text-white mb-6">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-300 hover:text-crypto-neon transition-colors duration-300 py-2 hover:translate-x-1 transform"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Community & Contact */}
          <div className="lg:col-span-1">
            <h4 className="text-xl font-bold text-white mb-6">Join Our Community</h4>
            <p className="text-gray-300 mb-6">
              Connect with thousands of crypto enthusiasts and stay updated with the latest market trends.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mb-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-12 h-12 neumorphic rounded-xl flex items-center justify-center text-gray-400 hover:text-crypto-neon transition-all duration-300 hover:scale-110"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon />
                </a>
              ))}
            </div>

            {/* Newsletter CTA */}
            <div className="glass-morphism rounded-xl p-4">
              <h5 className="font-semibold text-white mb-2">Get Market Updates</h5>
              <p className="text-gray-400 text-sm mb-3">
                Weekly insights delivered to your inbox
              </p>
              <button className="w-full bg-crypto-neon text-crypto-dark font-semibold py-2 px-4 rounded-lg hover:scale-105 transition-transform duration-300">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-crypto-gray/30 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Bitnaro CryptoTrack. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#terms" className="hover:text-crypto-neon transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#privacy" className="hover:text-crypto-neon transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#cookies" className="hover:text-crypto-neon transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Glow Effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-crypto-neon/50 to-transparent"></div>
    </footer>
  );
};

export default Footer;
