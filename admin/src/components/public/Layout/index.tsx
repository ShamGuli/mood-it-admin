import Image from 'next/image';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: LayoutProps) {
  return (
    <>
      {/* Preloader */}
      <div className="preloader">
        <div className="loading-container">
          <div className="loading"></div>
          <div id="loading-icon">
            <Image src="/images/loader.png" alt="Loading" width={80} height={80} priority />
          </div>
        </div>
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <Footer />
    </>
  );
}
