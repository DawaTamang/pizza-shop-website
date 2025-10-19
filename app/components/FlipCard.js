import Image from 'next/image';
import styles from './FlipCard.module.css';

const FlipCard = ({ title, price, description, imageSrc, backContent }) => {
  return (
    <div className={styles.flipCard}>
      <div className={styles.flipCardInner}>
        <div className={styles.flipCardFront}>
          <Image src={imageSrc} alt={title} layout="fill" objectFit="cover" />
          <div className={styles.frontContent}>
            <h3>{title}</h3>
            {price && <p className={styles.price}>{price}</p>}
          </div>
        </div>
        <div className={styles.flipCardBack}>
          <div className={styles.backContent}>
            <h4>{title}</h4>
            <p>{description}</p>
            {backContent && <p className={styles.backExtra}>{backContent}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;