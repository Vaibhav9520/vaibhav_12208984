import React from 'react';
import { Link } from 'react-router-dom';
import { logger } from './LoggingMiddleware';

function Navigation() {
  const handleNavClick = (page) => {
    logger.log('NAVIGATION', { page });
  };

  return (
    <nav className="app-nav">
      <div className="nav-logo">
        <Link to="/" onClick={() => handleNavClick('home')}>
          URL Shortener
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/" onClick={() => handleNavClick('home')}>
          Shorten URLs
        </Link>
        <Link to="/stats" onClick={() => handleNavClick('stats')}>
          Statistics
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;