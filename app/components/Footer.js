import styles from './Footer.module.css';

const Footer = () => {
  const gmapsUrl = "https://www.google.com/maps/search/?api=1&query=299+Cedar+St,+Simcoe,+ON,+N3Y+2J2";

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.openingHours}>
          <h2>Opening Hours</h2>
          <div className={styles.hoursGrid}>
            <div><strong>Sunday</strong><p>11:00 AM - 10:00 PM</p></div>
            <div><strong>Monday</strong><p>11:00 AM - 10:00 PM</p></div>
            <div><strong>Tuesday</strong><p>11:00 AM - 10:00 PM</p></div>
            <div><strong>Wednesday</strong><p>11:00 AM - 11:00 PM</p></div>
            <div><strong>Thursday</strong><p>11:00 AM - 11:00 PM</p></div>
            <div><strong>Friday</strong><p>11:00 AM - 12:00 AM</p></div>
            <div><strong>Saturday</strong><p>11:00 AM - 11:00 PM</p></div>
          </div>
        </div>
        <div className={styles.footerInfo}>
          <h3>Twin City Pizza</h3>
          <p>299 Cedar St, Simcoe, ON, N3Y 2J2</p>
          <p className={styles.phone}>+1 519-426-4226</p>
        </div>
      </div>

       <p className={styles.mapPrompt}>Click on the map below to open the full map</p>
      <div className={styles.mapContainer}>
        <a href={gmapsUrl} target="_blank" rel="noopener noreferrer" title="Click to view on Google Maps">
          <img 
            src="/images/map.png" /* This now points to your local image */
            alt="Map location of Twin City Pizza in Simcoe" 
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;