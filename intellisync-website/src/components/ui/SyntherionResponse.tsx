import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { buttonVariants, sizeVariants } from './Button';

// Define the types for our JSON response formats
type BaseResponse = {
  takeaway: string;
  reasoning?: string; // Optional reasoning field for all response types
  internal_link?: string;
  next_step?: string;
};

type StandardResponse = BaseResponse & {
  section: string;
  body: string;
  bullets?: string[];
};

type ProductResponse = BaseResponse & {
  product: string;
  what_it_is: string;
  why_it_matters: string;
  next_step: string;
};

type ServiceItem = {
  name: string;
  description: string;
};

type ServiceListResponse = BaseResponse & {
  section: string;
  body: string;
  services: ServiceItem[];
};

// Union type for all possible response formats
type SyntherionResponseData = StandardResponse | ProductResponse | ServiceListResponse;

// Helper to determine response type
const isProductResponse = (data: any): data is ProductResponse => {
  return data.product !== undefined;
};

const isServiceListResponse = (data: any): data is ServiceListResponse => {
  return data.services !== undefined;
};

interface SyntherionResponseProps {
  data: SyntherionResponseData;
  animate?: boolean;
}

const SyntherionResponse: React.FC<SyntherionResponseProps> = ({ data, animate = true }) => {
  // Determine which type of response we're dealing with
  if (isProductResponse(data)) {
    return (
      <ProductResponseView data={data} animate={animate} />
    );
  } else if (isServiceListResponse(data)) {
    return (
      <ServiceListResponseView data={data} animate={animate} />
    );
  } else {
    return (
      <StandardResponseView data={data as StandardResponse} animate={animate} />
    );
  }
};

// Component for standard responses
const StandardResponseView: React.FC<{ data: StandardResponse; animate: boolean }> = ({ data, animate }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const Component = animate ? motion.div : 'div';

  return (
    <Component
      className="rounded-xl shadow-lg overflow-hidden bg-gradient-to-br from-[#090d1f] via-[#1a1a2e] to-[#232946] text-white p-6"
      variants={animate ? container : undefined}
      initial={animate ? "hidden" : undefined}
      animate={animate ? "show" : undefined}
    >
      <motion.h2 
        className="text-2xl font-bold bg-gradient-to-r from-accent1 to-accent2 bg-clip-text text-transparent mb-4"
        variants={animate ? item : undefined}
      >
        {data.section}
      </motion.h2>
      
      <motion.p 
        className="text-gray-100 mb-4 leading-relaxed"
        variants={animate ? item : undefined}
      >
        {data.body}
      </motion.p>
      
      {data.reasoning && (
        <motion.div 
          className="italic text-gray-300 mb-4 pl-3 border-l-2 border-accent1/50"
          variants={animate ? item : undefined}
        >
          {data.reasoning}
        </motion.div>
      )}
      
      {data.bullets && data.bullets.length > 0 && (
        <motion.ul 
          className="space-y-2 mb-6"
          variants={animate ? item : undefined}
        >
          {data.bullets.map((bullet, index) => (
            <li key={index} className="flex items-start">
              <span className="text-accent1 mr-2">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </motion.ul>
      )}

      {data.next_step && (
        <motion.div 
          className="mt-6 p-4 bg-accent1/10 border border-accent1/20 rounded-lg"
          variants={animate ? item : undefined}
        >
          <h3 className="font-semibold text-accent1 mb-2">Next Step</h3>
          <p className="text-white">{data.next_step}</p>
        </motion.div>
      )}
      
      <motion.div 
        className="mt-4 bg-accent1/20 text-accent1 px-4 py-3 rounded-lg font-medium"
        variants={animate ? item : undefined}
      >
        Takeaway: {data.takeaway}
      </motion.div>

      {data.internal_link && (
        <motion.div className="mt-6" variants={animate ? item : undefined}>
          <a
            href={data.internal_link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants.default,
              sizeVariants.default,
              'font-bold rounded-md'
            )}
          >
            Click Here
          </a>
        </motion.div>
      )}
    </Component>
  );
};

// Component for product-specific responses
const ProductResponseView: React.FC<{ data: ProductResponse; animate: boolean }> = ({ data, animate }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const Component = animate ? motion.div : 'div';

  return (
    <Component
      className="rounded-xl shadow-lg overflow-hidden bg-gradient-to-br from-[#090d1f] via-[#1a1a2e] to-[#232946] text-white p-6"
      variants={animate ? container : undefined}
      initial={animate ? "hidden" : undefined}
      animate={animate ? "show" : undefined}
    >
      <motion.h2 
        className="text-2xl font-bold bg-gradient-to-r from-accent1 to-accent2 bg-clip-text text-transparent mb-6"
        variants={animate ? item : undefined}
      >
        {data.product}
      </motion.h2>
      
      <motion.div className="space-y-4" variants={animate ? item : undefined}>
        <div>
          <h3 className="text-lg font-semibold text-accent1 mb-1">What it is:</h3>
          <p className="text-gray-100">{data.what_it_is}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-accent1 mb-1">Why it matters:</h3>
          <p className="text-gray-100">{data.why_it_matters}</p>
        </div>
        
        {data.reasoning && (
          <div>
            <h3 className="text-lg font-semibold text-accent1 mb-1">Our take:</h3>
            <p className="text-gray-300 italic pl-3 border-l-2 border-accent1/50">{data.reasoning}</p>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-semibold text-accent1 mb-1">Next step:</h3>
          <p className="text-gray-100">{data.next_step}</p>
        </div>
      </motion.div>
      
      <motion.div 
        className="mt-6 bg-accent1/20 text-accent1 px-4 py-3 rounded-lg font-medium"
        variants={animate ? item : undefined}
      >
        Takeaway: {data.takeaway}
      </motion.div>
      
      {data.internal_link && (
        <motion.div className="mt-6" variants={animate ? item : undefined}>
          <a
            href={data.internal_link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants.default,
              sizeVariants.default,
              'font-bold rounded-md'
            )}
          >
            Read More Here
          </a>
        </motion.div>
      )}
    </Component>
  );
};

// Component for service list responses
const ServiceListResponseView: React.FC<{ data: ServiceListResponse; animate: boolean }> = ({ data, animate }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const Component = animate ? motion.div : 'div';

  return (
    <Component
      className="rounded-xl shadow-lg overflow-hidden bg-gradient-to-br from-[#090d1f] via-[#1a1a2e] to-[#232946] text-white p-6"
      variants={animate ? container : undefined}
      initial={animate ? "hidden" : undefined}
      animate={animate ? "show" : undefined}
    >
      <motion.h2 
        className="text-2xl font-bold bg-gradient-to-r from-accent1 to-accent2 bg-clip-text text-transparent mb-4"
        variants={animate ? item : undefined}
      >
        {data.section}
      </motion.h2>
      
      <motion.p 
        className="text-gray-100 mb-4 leading-relaxed"
        variants={animate ? item : undefined}
      >
        {data.body}
      </motion.p>
      
      {data.reasoning && (
        <motion.div 
          className="italic text-gray-300 mb-6 pl-3 border-l-2 border-accent1/50"
          variants={animate ? item : undefined}
        >
          {data.reasoning}
        </motion.div>
      )}
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        variants={animate ? item : undefined}
      >
        {data.services.map((service, index) => (
          <div 
            key={index} 
            className="bg-accent2/10 rounded-lg p-4 border border-accent2/20"
          >
            <h3 className="text-lg font-semibold text-accent1 mb-2">{service.name}</h3>
            <p className="text-gray-300">{service.description}</p>
          </div>
        ))}
      </motion.div>
      
      <motion.div 
        className="mt-4 bg-accent1/20 text-accent1 px-4 py-3 rounded-lg font-medium"
        variants={animate ? item : undefined}
      >
        Takeaway: {data.takeaway}
      </motion.div>

      {data.internal_link && (
        <motion.div className="mt-6" variants={animate ? item : undefined}>
          <a
            href={data.internal_link}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants.default,
              sizeVariants.default,
              'font-bold rounded-md'
            )}
          >
            Read More Here
          </a>
        </motion.div>
      )}
    </Component>
  );
};

export default SyntherionResponse;
