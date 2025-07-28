import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Button } from '../../components/ui/Button';

export type PromotionCardProps = {
  title: string;
  description: string;
  image?: string;
  ctaText?: string;
  index?: number;
};

const PromotionCard: React.FC<PromotionCardProps> = ({ title, description, image, ctaText = 'Learn More', index = 0 }) => {
  // Card animation variants with proper typing
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.16, 1, 0.3, 1], // Cubic bezier array for easeOutExpo
        delay: i * 0.1 // Staggered delay based on index
      } 
    })
  };
  
  return (
    <motion.div 
      className="bg-gradient-to-br from-[#1a1a2e]/90 to-[#090d1f]/90 rounded-xl overflow-hidden shadow-xl border border-accent1/20 hover:border-accent1/50 transition-all duration-300 flex flex-col h-full"
      variants={cardVariants}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      {image && image !== '' && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
            onError={(e) => {
              // Hide the image container if the image fails to load
              const target = e.target as HTMLImageElement;
              target.parentElement?.classList.add('hidden');
            }}
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-accent1 mb-6 flex-1">{description}</p>
        <Button className="w-full mt-auto bg-accent1 text-[#232946] hover:bg-accent1/90 font-bold">
          {ctaText}
        </Button>
      </div>
    </motion.div>
  );
};

export default PromotionCard;
