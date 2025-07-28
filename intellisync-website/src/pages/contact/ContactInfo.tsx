import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactInfo: React.FC = () => {
  const contactItems = [
    {
      icon: <MapPin className="w-6 h-6 text-accent1" />,
      title: 'Our Location',
      description: 'Chatham-Kent\nOntario, Canada',
      link: 'https://maps.google.com',
      linkText: 'View on Map'
    },
    {
      icon: <Phone className="w-5 h-5 text-accent1" />,
      title: 'Phone Number',
      description: 'Upon Request',
      link: '',
      linkText: ''
    },
    {
      icon: <Mail className="w-5 h-5 text-accent1" />,
      title: 'Email Address',
      description: 'Chris@intellisync.ca',
      link: 'mailto:Chris@intellisync.ca',
      linkText: 'Send Email'
    },
    {
      icon: <Clock className="w-5 h-5 text-accent1" />,
      title: 'Working Hours',
      description: 'Monday - Friday\n9:00 AM - 6:00 PM EST',
      subtitle: 'Weekends: Closed'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {contactItems.map((item, index) => (
          <div 
            key={index}
            className="bg-gradient-to-br from-[#1a1a2e] to-[#232946] p-6 rounded-xl border border-accent2/20 hover:border-accent1/30 transition-all duration-300 h-full flex flex-col"
          >
            <div className="w-12 h-12 rounded-lg bg-accent1/10 flex items-center justify-center mb-4">
              {item.icon}
            </div>
            <h3 className="text-xl font-header font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-gray-300 whitespace-pre-line mb-4 flex-grow">{item.description}</p>
            {item.subtitle && <p className="text-sm text-accent1 mb-4">{item.subtitle}</p>}
            {item.link && (
              <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent1 hover:text-accent1/80 text-sm font-medium inline-flex items-center mt-auto"
              >
                {item.linkText}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ContactInfo;
