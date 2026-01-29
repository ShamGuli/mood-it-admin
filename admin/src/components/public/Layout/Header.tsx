'use client';

import Link from 'next/link';
import { useState } from 'react';
import Navigation from './Navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="main-header">
      <div className="header-sticky">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            {/* Logo */}
            <Link href="/" className="navbar-brand">
              <img src="/images/logo.png" alt="Mood IT Logo" />
            </Link>

            {/* Desktop Navigation */}
            <div className="collapse navbar-collapse main-menu">
              <Navigation />
              
              {/* Header CTA Button */}
              <div className="header-btn">
                <Link href="/contact" className="btn-default">
                  Bizimlə əlaqə saxlayın
                </Link>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="navbar-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>

        {/* Mobile Responsive Menu */}
        {isMenuOpen && (
          <div className="responsive-menu">
            <Navigation />
          </div>
        )}
      </div>
    </header>
  );
}
