import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { TrackedButton } from '../../components/TrackedButton';

// Hero image path
const HERO_IMAGE = '/assets/images/heroHome.png';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[70vh] w-full bg-gradient-to-br from-[#090d1f] via-[#1a1a2e] to-[#232946] text-white py-16 overflow-hidden">
  {/* Animated glassmorphic overlays */}
  <div className="absolute inset-0 pointer-events-none z-0">
    <div className="absolute top-[-8%] left-[-5%] w-[36vw] h-[36vw] bg-gradient-to-tr from-cta/40 to-accent1/30 rounded-full blur-3xl opacity-70 animate-pulse-slow" />
    <div className="absolute bottom-[-8%] right-[-5%] w-[28vw] h-[28vw] bg-gradient-to-tr from-accent2/50 to-primary/40 rounded-full blur-2xl opacity-60 animate-pulse-slower" />
  </div>
      {/* Container */}
      <div className="w-full px-6 md:px-12 flex flex-col-reverse md:flex-row items-center justify-between gap-10 z-10">
        
        {/* Left Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start text-left space-y-6">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-center md:text-left bg-gradient-to-tr from-cta via-accent1 to-white bg-clip-text text-transparent drop-shadow-[0_4px_32px_rgba(76,91,255,0.45)] animate-gradient-x"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            IntelliSync Solutions
            <span className="block text-2xl md:text-4xl font-semibold tracking-tight mt-2 text-accent1 drop-shadow-[0_2px_16px_rgba(198,167,109,0.35)] animate-fade-in">AI. Unleashed.</span>
          </motion.h1>
          
          <motion.p
            className="text-white md:text-lg"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
          >
            Where visionaries build the future. IntelliSync Solutions engineers AI systems that redefine possibility—empowering teams, transforming industries, and unlocking human potential. Discover the power of intelligence, orchestrated.
          </motion.p>
          
          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
          >
            <TrackedButton
              as="a"
              href="/waitlist"
              trackingName="Start Your AI Journey"
              trackingSection="Hero"
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-accent1 to-cta text-[#232946] hover:from-accent1/90 hover:to-cta/90 font-bold px-6 py-3 rounded-full shadow-lg"
              trackingProps={{
                ctaType: 'primary',
                destination: '/waitlist'
              }}
              icon={<ArrowRight className="h-5 w-5" />}
              iconPosition="right"
            >
              Start Your AI Journey
            </TrackedButton>
          </motion.div>
        </div>
        
        {/* Right Visual */}
        <motion.div
          className="w-full md:w-1/2 flex items-center justify-center"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="relative w-full max-w-md">
            <img
              src={HERO_IMAGE}
              alt="AI Technology"
              className="w-full h-auto max-h-[500px] rounded-lg shadow-xl object-contain transition-all duration-300 hover:scale-105"
              onError={(e) => {
                // Fallback in case the image fails to load
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYjJmIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1JSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSI+SW1hZ2Ugbm90IGZvdW5kPC90ZXh0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNjY2MiPkdQVEJ1aWxkZXJIZXJvLnBuZzwvdGV4dD4KPC9zdmc+'
              }}
            />
          </div>
        </motion.div>
      </div>
      
      {/* Optional Floating Shapes or Particles */}
      {/* You could add some floating circles or shapes with absolute positioning for extra flair */}
    </section>
  );
};

export default Hero;