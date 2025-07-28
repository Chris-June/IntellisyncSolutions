import Home from "./pages/home/Home";
import About from "./pages/about/About";
import GPTBuilder from './pages/GPTBuilder';
import Pricing from './pages/Pricing/PricingPage';
import StorePage from './pages/store/StorePage';
import AppPage from './pages/AppPage';
import PromotionsPage from './pages/promotions/PromotionsPage';
import ContactPage from './pages/contact/ContactPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import DisclaimerPage from "./pages/disclaimer";
import PrivacyPage from "./pages/privacy";
import TermsPage from "./pages/terms";
import WaitlistPage from "./pages/waitlist";
import Blog from "./pages/blog/Blog";
import FAQ from "./pages/FAQ/FAQ";
import ScrollToTop from './components/ScrollToTop';
import MnemosysCaseStudyPage from "./pages/products/mnemosys-case-study";
import ProductsPage from './pages/products/ProductsPage';

import { streamModelResponse } from "./lib/streamModelResponse";

import { AIContextProvider, useAIContext } from './context/AIContext';

import { StickyChat } from "./components/StickyChat";
// Helper component to provide eventContext from location
function ChatWithContext() {
  const { eventContext } = useAIContext();
  return <StickyChat onSend={streamModelResponse} eventContext={eventContext} />;
}

function App() {
  return (
    <AIContextProvider>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/mnemosys-case-study" element={<MnemosysCaseStudyPage />} />
            <Route path="/apps/:slug" element={<AppPage />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/gptbuilder" element={<GPTBuilder />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/waitlist" element={<WaitlistPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
          <ChatWithContext />
        </BrowserRouter>
      </HelmetProvider>
    </AIContextProvider>
  );
}

export default App;
