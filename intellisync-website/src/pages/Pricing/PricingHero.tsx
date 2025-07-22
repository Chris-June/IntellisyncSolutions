import { motion } from 'framer-motion';

const PricingHero = () => (
  <section className="relative py-20 text-center bg-gradient-to-br from-[#090d1f] via-[#1a1a2e] to-[#232946] text-white overflow-hidden">
    {/* Animated glassmorphic overlays */}
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute top-[-8%] left-[-5%] w-[36vw] h-[36vw] bg-gradient-to-tr from-cta/40 to-accent1/30 rounded-full blur-3xl opacity-70 animate-pulse-slow" />
      <div className="absolute bottom-[-8%] right-[-5%] w-[28vw] h-[28vw] bg-gradient-to-tr from-accent2/50 to-primary/40 rounded-full blur-2xl opacity-60 animate-pulse-slower" />
    </div>
    
    <div className="relative z-10">
      <motion.h1
        className="text-5xl pb-4 md:text-6xl font-extrabold mb-6 bg-gradient-to-tr from-accent1 via-cta to-white bg-clip-text text-transparent drop-shadow-[0_4px_32px_rgba(76,91,255,0.45)] animate-gradient-x"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        After Care Program
      </motion.h1>
      <motion.p
        className="text-xl md:text-2xl max-w-2xl mx-auto mb-6 text-accent1 font-medium"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
      >
        Support, Maintenance & Future Growth for Your AI-Powered Web Platform
      </motion.p>
      <motion.p
        className="text-lg md:text-xl max-w-2xl mx-auto text-white/80"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
      >
        Our After Care Plans are designed for businesses and individuals that value ongoing support, stability, and future-readiness. Choose a plan that meets your needs today and scales with your vision tomorrow.
      </motion.p>
    </div>
  </section>
);

export default PricingHero;
