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
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { StickyChat } from "./components/StickyChat";
import { TrackPageView } from './utils/analytics';
// Helper component to provide eventContext from location
function ChatWithContext() {
  const { eventContext } = useAIContext();
  return <StickyChat onSend={streamModelResponse} eventContext={eventContext} />;
}

// Track page views for all routes
const TrackedPage = ({ children, name }: { children: React.ReactNode; name: string }) => {
  return (
    <>
      <TrackPageView name={name} />
      {children}
    </>
  );
};

function App() {
  return (
    <AIContextProvider>
      <HelmetProvider>
        <Analytics 
          mode="production"
          beforeSend={(event) => {
            // You can add custom logic here to filter or modify events
            return event;
          }}
        />
        <SpeedInsights />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<TrackedPage name="Home"><Home /></TrackedPage>} />
            <Route path="/about" element={<TrackedPage name="About"><About /></TrackedPage>} />
            <Route path="/faq" element={<TrackedPage name="FAQ"><FAQ /></TrackedPage>} />
            <Route path="/mnemosys-case-study" element={<TrackedPage name="Mnemosys Case Study"><MnemosysCaseStudyPage /></TrackedPage>} />
            <Route path="/apps/:slug" element={<TrackedPage name="App Detail"><AppPage /></TrackedPage>} />
            <Route path="/promotions" element={<TrackedPage name="Promotions"><PromotionsPage /></TrackedPage>} />
            <Route path="/gptbuilder" element={<TrackedPage name="GPT Builder"><GPTBuilder /></TrackedPage>} />
            <Route path="/pricing" element={<TrackedPage name="Pricing"><Pricing /></TrackedPage>} />
            <Route path="/waitlist" element={<TrackedPage name="Waitlist"><WaitlistPage /></TrackedPage>} />
            <Route path="/disclaimer" element={<TrackedPage name="Disclaimer"><DisclaimerPage /></TrackedPage>} />
            <Route path="/privacy" element={<TrackedPage name="Privacy Policy"><PrivacyPage /></TrackedPage>} />
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
