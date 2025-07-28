import React from 'react';
import { Facebook, Twitter, Linkedin, Info, Package, DollarSign, Percent, Bot, Mail, Home, MapPin, Phone, Calendar, Shield, FileText, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';


const Footer: React.FC = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-[#090d1f] via-[#1a1a2e] to-[#232946] text-white py-12 px-8 border-t border-accent2/30 shadow-lg"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Company Info */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <img src="/assets/logo.png" alt="Intellisync Logo" className="h-10 w-auto" />
            <h3 className="text-xl font-header font-bold bg-gradient-to-r from-accent1 to-accent2 bg-clip-text text-transparent">Intellisync Solutions</h3>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Empowering businesses with innovative AI solutions that drive growth and efficiency.
          </p>
          <div className="flex gap-4 mt-2">
            <motion.a 
              whileHover={{ scale: 1.1 }}
              href="#" 
              aria-label="Facebook" 
              className="bg-[#232946] p-2 rounded-full hover:bg-accent1/20 transition-colors"
            >
              <Facebook size={18} className="text-accent1" />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.1 }}
              href="#" 
              aria-label="Twitter" 
              className="bg-[#232946] p-2 rounded-full hover:bg-accent1/20 transition-colors"
            >
              <Twitter size={18} className="text-accent1" />
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.1 }}
              href="#" 
              aria-label="LinkedIn" 
              className="bg-[#232946] p-2 rounded-full hover:bg-accent1/20 transition-colors"
            >
              <Linkedin size={18} className="text-accent1" />
            </motion.a>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-header font-semibold mb-2 flex items-center gap-2">
            <Package size={18} className="text-accent1" /> Quick Links
          </h3>
          <nav className="grid grid-cols-1 gap-3 font-body text-sm">
            <a href="/" className="flex items-center gap-2 hover:text-accent1 transition-colors group">
              <Home size={16} className="text-accent1 group-hover:translate-x-1 transition-transform" /> Home
            </a>
            <a href="/about" className="flex items-center gap-2 hover:text-accent1 transition-colors group">
              <Info size={16} className="text-accent1 group-hover:translate-x-1 transition-transform" /> About
            </a>
            <a href="/products" className="flex items-center gap-2 hover:text-accent1 transition-colors group">
              <Package size={16} className="text-accent1 group-hover:translate-x-1 transition-transform" /> Products
            </a>
            <a href="/pricing" className="flex items-center gap-2 hover:text-accent1 transition-colors group">
              <DollarSign size={16} className="text-accent1 group-hover:translate-x-1 transition-transform" /> Pricing
            </a>
            <a href="/promotions" className="flex items-center gap-2 hover:text-accent1 transition-colors group">
              <Percent size={16} className="text-accent1 group-hover:translate-x-1 transition-transform" /> Promotions
            </a>
            <a href="/gptbuilder" className="flex items-center gap-2 hover:text-accent1 transition-colors group">
              <Bot size={16} className="text-accent1 group-hover:translate-x-1 transition-transform" /> GPTBuilder
            </a>
            <a href="/store" className="flex items-center gap-2 hover:text-accent1 transition-colors group">
              <ShoppingBag size={16} className="text-accent1 group-hover:translate-x-1 transition-transform" /> Store
            </a>
            <a href="/faq" className="flex items-center gap-2 hover:text-accent1 transition-colors group">
              <Info size={16} className="text-accent1 group-hover:translate-x-1 transition-transform" /> FAQ
            </a>
            <a href="/blog" className="flex items-center gap-2 hover:text-accent1 transition-colors group">
              <FileText size={16} className="text-accent1 group-hover:translate-x-1 transition-transform" /> Blog
            </a>
            <a href="/contact" className="flex items-center gap-2 hover:text-accent1 transition-colors group">
              <Mail size={16} className="text-accent1 group-hover:translate-x-1 transition-transform" /> Contact
            </a>
            <a href="/waitlist" className="flex items-center gap-2 hover:text-accent1 transition-colors group">
              <Mail size={16} className="text-accent1 group-hover:translate-x-1 transition-transform" /> Join Waitlist
            </a>
          </nav>
        </div>
        
        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-header font-semibold mb-2 flex items-center gap-2">
            <Mail size={18} className="text-accent1" /> Contact Us
          </h3>
          <div className="flex flex-col gap-3 text-sm">
            <a href="mailto:chris.june@intellisync.ca" className="flex items-center gap-2 hover:text-accent1 transition-colors group">
              <Mail size={16} className="text-accent1 group-hover:translate-x-1 transition-transform" /> chris.june@intellisync.ca
            </a>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-accent1" /> Chatham-Kent, Ontario
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-accent1" /> Contact on request
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-accent1" /> Mon-Fri: 9am - 5pm EST
            </div>
          </div>
        </div>
        
        {/* Legal */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-header font-semibold mb-2 flex items-center gap-2">
            <Shield size={18} className="text-accent1" /> Legal
          </h3>
          <div className="flex flex-col gap-3 text-sm">
            <a href="/privacy" className="flex items-center gap-2 hover:text-accent1 transition-colors group">
              <Shield size={16} className="text-accent1 group-hover:translate-x-1 transition-transform" /> Privacy Policy
            </a>
            <a href="/terms" className="flex items-center gap-2 hover:text-accent1 transition-colors group">
              <FileText size={16} className="text-accent1 group-hover:translate-x-1 transition-transform" /> Terms of Service
            </a>
            <a href="/disclaimer" className="flex items-center gap-2 hover:text-accent1 transition-colors group">
              <Info size={16} className="text-accent1 group-hover:translate-x-1 transition-transform" /> Disclaimer
            </a>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-accent2/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-xs text-accent1 transition-colors">
            &copy; {new Date().getFullYear()} Intellisync Solutions. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1 text-accent1 transition-colors">
            <Shield size={14} className="text-accent1" /> 
            Zero tracking by design. Your data stays yours.
          </p>
        </div>

      </div>
      {/* Centered Designed by section */}
      <div className="max-w-7xl mx-auto mt-4 text-center">
        <p className="text-xs text-accent1">
          Designed with <span className="text-accent1">❤</span> by Intellisync Solutions
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
