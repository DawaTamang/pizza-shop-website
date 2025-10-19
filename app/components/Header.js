"use client";

import { useState, useEffect } from 'react'; // Import useEffect
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartAnimating, setIsCartAnimating] = useState(false); // State for the animation

  // This effect runs whenever 'totalItems' changes
  useEffect(() => {
    if (totalItems === 0) {
      return; // Don't animate on initial load or when cart is cleared
    }
    
    // Trigger the animation
    setIsCartAnimating(true);

    // Remove the animation class after 300ms so it can be triggered again
    const timer = setTimeout(() => {
      setIsCartAnimating(false);
    }, 300);

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, [totalItems]);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" onClick={closeMenu} className={styles.logoBlock}>
          <Image src="/images/logo.png" alt="Twin City Pizza Logo" width={60} height={60} className={styles.logoImage} />
          <div className={styles.logoText}>
            <span className={styles.tagline}>Simcoe's Best</span>
            <span className={styles.phone}>519-426-4226</span>
          </div>
        </Link>

        <div className={`${styles.navContainer} ${isMenuOpen ? styles.navOpen : ''}`}>
          <nav className={styles.nav}>
            <Link href="/#store-deals" onClick={closeMenu}>Store Deals</Link>
            <Link href="/#signature-pizza" onClick={closeMenu}>Signature Pizza</Link>
            <Link href="/#combos" onClick={closeMenu}>Combos</Link>
            <Link href="/#pickup-specials" onClick={closeMenu}>Pickup Specials</Link>
            <Link href="/#sidekicks" onClick={closeMenu}>Sidekicks</Link>
          </nav>
          <div className={styles.actions}>
            <Link href="/order" className={styles.orderButton} onClick={closeMenu}>
              Order Online
            </Link>
            {/* Apply the animation class conditionally */}
            <Link href="/checkout" className={`${styles.cartLink} ${isCartAnimating ? styles.bump : ''}`} onClick={closeMenu}>
              🛒
              {totalItems > 0 && <span className={styles.cartCount}>{totalItems}</span>}
            </Link>
          </div>
        </div>

        <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
          <span className={styles.hamburgerBar}></span>
        </button>
      </div>
    </header>
  );
};

export default Header;