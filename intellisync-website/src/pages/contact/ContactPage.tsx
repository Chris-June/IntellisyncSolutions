import React from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import SEO from '../../components/SEO';
import { getBreadcrumbSchema } from '../../utils/structuredData';

const ContactPage: React.FC = () => {
  // Create structured data for contact page
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' }
  ]);

  return (
    <>
      <SEO
        title="Contact Us | Intellisync Solutions"
        description="Get in touch with our team. We'd love to hear from you about your project or answer any questions you may have."
        canonicalUrl="/contact"
        keywords="contact, get in touch, support, inquiry, sales, partnership"
        structuredData={[breadcrumbSchema]}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#090d1f] via-[#1a1a2e] to-[#232946] pt-24 pb-16 md:pt-32 md:pb-24">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-extrabold bg-gradient-to-tr from-cta via-accent1 to-white bg-clip-text text-transparent mb-6 drop-shadow-lg"
          >
            Get In Touch
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-accent1 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            Have questions or want to discuss a project? We'd love to hear from you.
            Our team is here to help you bring your ideas to life.
          </motion.p>
        </motion.div>
      </section>

      {/* Contact Info Section */}
      <ContactInfo />

      {/* Contact Form Section */}
      <section className="py-16 bg-gradient-to-b from-[#232946] to-[#1a1a2e]">
        <ContactForm />
      </section>

      {/* Map Section */}
      <section className="relative h-96 w-full">
        <div className="absolute inset-0 bg-gradient-to-r from-accent1/10 to-accent2/10"></div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d46871.40819405873!2d-82.2229693!3d42.4053266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x883ab9a7a9e7a4f9%3A0x8f6c2c8c2e2e2e2e!2sChatham-Kent%2C%20ON%2C%20Canada!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className="relative z-10"
          title="Our Location in Chatham-Kent, Ontario"
        ></iframe>
      </section>

      <Footer />
    </>
  );
};

export default ContactPage;
