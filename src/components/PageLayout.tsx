import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatbotWidget from './ChatbotWidget';
import MobileBottomBar from './MobileBottomBar';
import ExitIntentPopup from './ExitIntentPopup';
import SEO from './SEO';

export default function PageLayout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-[var(--color-offwhite)]">
      <SEO />
      <Header />
      <main className="flex-grow pt-[100px] md:pt-[130px] pb-[60px] md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
      <MobileBottomBar />
      <ExitIntentPopup />
    </div>
  );
}
