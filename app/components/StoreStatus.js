"use client";

import { useState, useEffect } from 'react';
import styles from './StoreStatus.module.css';
import { openingHours, formatTime } from '../../data/menu';

const StoreStatus = () => {
  const [status, setStatus] = useState({ message: '', subMessage: '', isVisible: false });

  // This function now closes the modal AND sets a flag so it won't appear again
  const handleAcknowledge = () => {
    setStatus(prev => ({ ...prev, isVisible: false }));
    // Use sessionStorage to remember that the user has seen the message
    sessionStorage.setItem('storeStatusAcknowledged', 'true');
  };

  useEffect(() => {
    // Check if the user has already seen and closed the message this session
    const hasAcknowledged = sessionStorage.getItem('storeStatusAcknowledged') === 'true';
    if (hasAcknowledged) {
      return; // Do nothing if the message has been acknowledged
    }

    const checkStoreStatus = () => {
      // (The time-checking logic remains the same)
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }));
      const dayOfWeek = now.getDay();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const todaysHours = openingHours[dayOfWeek];
      const getNextOpeningDayString = () => {
          for (let i = 1; i <= 7; i++) {
              const nextDayIndex = (dayOfWeek + i) % 7;
              const nextDayHours = openingHours[nextDayIndex];
              if (nextDayHours) {
                  return `We open again on ${nextDayHours.day} at ${formatTime(nextDayHours.open)}.`;
              }
          }
          return "Please check back for our next opening hours.";
      };
      if (!todaysHours) { setStatus({ message: "Sorry, we're closed today.", subMessage: getNextOpeningDayString(), isVisible: true }); return; }
      const openTimeInMinutes = todaysHours.open * 60;
      const closeTimeInMinutes = todaysHours.close === 24 ? 24 * 60 : todaysHours.close * 60;
      const isOpen = currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes;
      if (isOpen) {
        const isClosingSoon = (closeTimeInMinutes - currentTimeInMinutes <= 10);
        if (isClosingSoon) { setStatus({ message: 'Heads up! The store is closing in 10 minutes.', subMessage: 'You can still place a pre-order for our next opening time.', isVisible: true }); } 
        else { setStatus({ message: '', subMessage: '', isVisible: false }); }
      } else {
        if (currentTimeInMinutes < openTimeInMinutes) {
           setStatus({ message: "Sorry, we're currently closed.", subMessage: `You can place a pre-order now. We open today at ${formatTime(todaysHours.open)}.`, isVisible: true });
        } else {
          setStatus({ message: "Sorry, the store is currently closed.", subMessage: `You can place a pre-order now. ${getNextOpeningDayString()}`, isVisible: true });
        }
      }
    };

    checkStoreStatus();
    const interval = setInterval(checkStoreStatus, 60000); 
    return () => clearInterval(interval);
  }, []);

  if (!status.isVisible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.statusModal}>
        <h2>{status.message}</h2>
        <p>{status.subMessage}</p>
        <button onClick={handleAcknowledge} className={styles.closeButton}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default StoreStatus;