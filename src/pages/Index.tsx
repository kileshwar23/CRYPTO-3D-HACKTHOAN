
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import LivePrices from '@/components/LivePrices';
import LearnCrypto from '@/components/LearnCrypto';
import WhyChoose from '@/components/WhyChoose';
import MarketSummary from '@/components/MarketSummary';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-crypto-dark text-white overflow-x-hidden">
      <Navbar />
      <div className="pt-16">
        <Hero />
        <LivePrices />
        <MarketSummary />
        <LearnCrypto />
        <WhyChoose />
        <Newsletter />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
