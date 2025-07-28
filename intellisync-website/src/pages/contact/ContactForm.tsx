import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the mailto link with form data
    const subject = encodeURIComponent(formData.subject || 'Contact Form Submission');
    const body = encodeURIComponent(
      `Name: ${formData.name}\n\n` +
      `Email: ${formData.email}\n\n` +
      `Message:\n${formData.message}`
    );
    
    // Open default email client
    window.location.href = `mailto:Chris@intellisync.ca?subject=${subject}&body=${body}`;
    
    // Update form state
    setSubmitStatus('success');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitStatus('idle'), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="bg-gradient-to-br from-[#1a1a2e] to-[#232946] p-8 md:p-10 rounded-2xl shadow-2xl border border-accent2/20"
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cta via-accent1 to-white bg-clip-text text-transparent mb-8 drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        >
          Send Us a Message
        </motion.h2>
        
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300">
            Thank you for your message! We'll get back to you soon.
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-lg text-error">
            There was an error sending your message. Please try again later.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-accent1/90">
                Full Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background/50 border border-accent2/30 rounded-xl focus:ring-2 focus:ring-accent1/50 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 hover:border-accent1/30 focus:shadow-lg focus:shadow-accent1/10"
                placeholder="Your name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-accent1/90">
                Email Address <span className="text-error">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-background/50 border border-accent2/30 rounded-xl focus:ring-2 focus:ring-accent1/50 focus:border-transparent text-white placeholder-gray-500 transition-all duration-300 hover:border-accent1/30 focus:shadow-lg focus:shadow-accent1/10"
                placeholder="your.email@example.com"
              />
            </div>
          </motion.div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
              Subject <span className="text-error">*</span>
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-background/50 border border-accent2/30 rounded-lg focus:ring-2 focus:ring-accent1/50 focus:border-transparent text-white appearance-none"
            >
              <option value="" disabled>Select a subject</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Sales">Sales</option>
              <option value="Support">Support</option>
              <option value="Partnership">Partnership</option>
              <option value="Careers">Careers</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
              Your Message <span className="text-error">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-background/50 border border-accent2/30 rounded-lg focus:ring-2 focus:ring-accent1/50 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 resize-none"
              placeholder="Don't make use guess. The more info the better."
            />
          </div>
          
          <motion.div 
            className="pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.5 }}
          >
            <button
              type="submit"
              disabled={submitStatus === 'submitting'}
              className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-accent1 to-accent2 hover:from-accent1/90 hover:to-accent2/90 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent1/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:shadow-accent1/20"
            >
              {submitStatus === 'submitting' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Message
                </>
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactForm;
