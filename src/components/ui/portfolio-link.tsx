import React, { useEffect, useState } from 'react';
import { cn } from './utils';

interface PortfolioLinkProps {
  className?: string;
  showAsButton?: boolean;
}

export const PortfolioLink: React.FC<PortfolioLinkProps> = ({ 
  className, 
  showAsButton = false 
}) => {
  const [portfolioLink, setPortfolioLink] = useState('');

  useEffect(() => {
    // Obter o link do CSS custom property
    const link = getComputedStyle(document.documentElement)
      .getPropertyValue('--portfolio-link')
      .replace(/"/g, '')
      .trim();
    setPortfolioLink(link);
  }, []);

  const handleClick = () => {
    if (portfolioLink && portfolioLink !== 'https://seu-portfolio.vercel.app') {
      window.open(portfolioLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (showAsButton) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium",
          "ring-offset-background transition-colors focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "h-10 px-4 py-2",
          className
        )}
        disabled={!portfolioLink || portfolioLink === 'https://seu-portfolio.vercel.app'}
      >
        🌐 Acessar Portfólio
      </button>
    );
  }

  return (
    <div className={cn("portfolio-link-display", className)} onClick={handleClick} />
  );
};

export default PortfolioLink;
