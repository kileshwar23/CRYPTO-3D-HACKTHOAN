
import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  if (isSubscribed) {
    return (
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="neumorphic rounded-3xl p-12">
              <div className="w-20 h-20 bg-crypto-neon rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <CheckCircle className="w-10 h-10 text-crypto-dark" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                You're All Set! 🎉
              </h3>
              <p className="text-gray-300 mb-6">
                Thank you for subscribing! You'll receive the latest crypto insights and market updates directly in your inbox.
              </p>
              <div className="text-crypto-neon font-semibold">
                Welcome to the CryptoTrack community!
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-crypto-blue/20 to-crypto-dark opacity-50"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="neumorphic rounded-3xl p-12">
            {/* Icon */}
            <div className="w-20 h-20 neumorphic-inset rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
              <Mail className="w-10 h-10 text-crypto-neon" />
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
              Stay Ahead of the Market
            </h2>
            
            {/* Description */}
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Get exclusive crypto insights, market analysis, and price alerts delivered 
              straight to your inbox. Join our community of informed investors.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <div className="flex-1 relative">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 bg-crypto-gray/30 border-crypto-gray text-white placeholder-gray-400 rounded-2xl focus:ring-2 focus:ring-crypto-neon focus:border-transparent text-lg neumorphic-inset"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-crypto-neon hover:bg-crypto-neon/90 text-crypto-dark font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 neumorphic border-0 text-lg flex items-center justify-center min-w-[140px]"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-crypto-dark border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Notify Me
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Privacy Note */}
            <p className="text-sm text-gray-400 mt-6">
              We respect your privacy. Unsubscribe at any time. No spam, ever.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-crypto-gray/30">
              {[
                { title: "Daily Insights", desc: "Market analysis & trends" },
                { title: "Price Alerts", desc: "Never miss opportunities" },
                { title: "Exclusive Content", desc: "Premium research reports" }
              ].map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="text-crypto-neon font-semibold mb-1">{benefit.title}</div>
                  <div className="text-gray-400 text-sm">{benefit.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
