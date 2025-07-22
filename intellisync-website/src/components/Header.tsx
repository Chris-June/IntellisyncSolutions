import React, { useState, useEffect } from 'react';

import { Info, Package, DollarSign, Bot, Mail, Home as HomeIcon, Menu, X, ShoppingBag, BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-menu') && !target.closest('.menu-button')) {
        setIsMenuOpen(false);
      }
    };

    // Handle scroll for header shadow
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`sticky top-0 z-50 bg-gradient-to-br from-[#090d1f] via-[#1a1a2e] to-[#232946] shadow-md transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/assets/logo.png" alt="Intellisync Logo" className="h-10 w-auto" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center">
          <nav className="flex items-center gap-2 lg:gap-6 font-body text-base">
            <a href="/" className="flex items-center gap-2 text-gray-100 hover:text-accent1 transition-colors px-3 py-2">
              <HomeIcon className="w-5 h-5 text-accent1" />
              <span>Home</span>
            </a>
            <a href="/about" className="flex items-center gap-2 text-gray-100 hover:text-accent1 transition-colors px-3 py-2">
              <Info className="w-5 h-5 text-accent1" />
              <span>About</span>
            </a>
            <a href="/blog" className="flex items-center gap-2 text-gray-100 hover:text-accent1 transition-colors px-3 py-2">
              <BookOpen className="w-5 h-5 text-accent1" />
              <span>Blog</span>
            </a>
            <a href="/products" className="flex items-center gap-2 text-gray-100 hover:text-accent1 transition-colors px-3 py-2">
              <Package className="w-5 h-5 text-accent1" />
              <span>Products</span>
            </a>
            <a href="/pricing" className="flex items-center gap-2 text-gray-100 hover:text-accent1 transition-colors px-3 py-2">
              <DollarSign className="w-5 h-5 text-accent1" />
              <span>Pricing</span>
            </a>
            <a href="/gptbuilder" className="flex items-center gap-2 text-gray-100 hover:text-accent1 transition-colors px-3 py-2">
              <Bot className="w-5 h-5 text-accent1" />
              <span>GPTBuilder</span>
            </a>
            <a href="/store" className="flex items-center gap-2 text-gray-100 hover:text-accent1 transition-colors px-3 py-2">
              <ShoppingBag className="w-5 h-5 text-accent1" />
              <span>Store</span>
            </a>
          </nav>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="menu-button inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`mobile-menu lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            <HomeIcon className="w-5 h-5 text-accent1" /> Home
          </a>
          <a
            href="/about"
            className="flex items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            <Info className="w-5 h-5 text-accent1" /> About
          </a>
          <a
            href="/blog"
            className="flex items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            <BookOpen className="w-5 h-5 text-accent1" /> Blog
          </a>
          <a
            href="/products"
            className="flex items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            <Package className="w-5 h-5 text-accent1" /> Products
          </a>
          <a
            href="/pricing"
            className="flex items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            <DollarSign className="w-5 h-5 text-accent1" /> Pricing
          </a>
          <a
            href="/gptbuilder"
            className="flex items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            <Bot className="w-5 h-5 text-accent1" /> GPTBuilder
          </a>
          <a
            href="/store"
            className="flex items-center gap-2 text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            <ShoppingBag className="w-5 h-5 text-accent1" /> Store
          </a>
          <a
            href="/waitlist"
            className="mt-4 flex items-center justify-center gap-2 bg-accent1 hover:bg-accent1/90 text-white px-4 py-2 rounded-md text-base font-medium transition-colors"
          >
            <Mail className="w-5 h-5" /> Contact Us
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
