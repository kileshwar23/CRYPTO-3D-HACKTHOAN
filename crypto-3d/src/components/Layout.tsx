
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-crypto-dark text-white overflow-x-hidden">
      <Navbar />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
};

export default Layout;
