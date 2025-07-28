import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { TrackedButton } from '../../components/TrackedButton';

const CTA = () => (
  <section className="relative py-16 text-center overflow-hidden">
    {/* Animated glassmorphic overlays */}
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute top-[-8%] left-[-5%] w-[36vw] h-[36vw] bg-gradient-to-tr from-cta/40 to-accent1/30 rounded-full blur-3xl opacity-70 animate-pulse-slow" />
      <div className="absolute bottom-[-8%] right-[-5%] w-[28vw] h-[28vw] bg-gradient-to-tr from-accent2/50 to-primary/40 rounded-full blur-2xl opacity-60 animate-pulse-slower" />
    </div>
    
    <div className="relative z-10 max-w-4xl mx-auto px-4">
      <motion.div
        className="bg-black/30 backdrop-blur-md rounded-3xl shadow-2xl border border-accent2/30 py-12 px-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-tr from-accent1 via-cta to-white bg-clip-text text-transparent drop-shadow-[0_4px_32px_rgba(76,91,255,0.45)]"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Want to keep your digital presence evolving without surprise costs?
        </motion.h2>
        
        <motion.p 
          className="text-xl mb-8 text-white/90"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Choose an After Care Plan that grows with you.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <TrackedButton
            as="a"
            href="/contact"
            trackingName="Get Started"
            trackingSection="Pricing CTA"
            variant="primary"
            size="lg"
            className="flex items-center gap-2 px-8 py-6 text-lg"
            trackingProps={{
              ctaType: 'primary',
              destination: '/contact',
              source: 'pricing_page_cta'
            }}
            icon={<Mail className="w-5 h-5" />}
          >
            Get Started
          </TrackedButton>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default CTA;
