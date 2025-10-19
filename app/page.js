import CustomerLayout from "./components/CustomerLayout";
import FlipCard from './components/FlipCard';
import styles from './page.module.css';
import { menuData } from '../data/menu';

const getCategory = (categoryName) => {
  return menuData.find(category => category.category === categoryName);
};

export default function Home() {
  const deals = getCategory('Store Deals');
  const pizzas = getCategory('Signature Pizza');
  const combos = getCategory('Combos');
  const pickupSpecials = getCategory('Pickup Specials');
  const alternateCrusts = getCategory('Alternate Pizza Crusts');
  const sidekicks = getCategory('Sidekicks');

  return (
    <CustomerLayout>
      <div className="container">
        {deals && (
          <section id="store-deals">
            <h1>{deals.category}</h1>
            <div className={styles.cardGrid}>
              {deals.items.map(item => {
                const displayPrice = typeof item.price === 'object' ? item.price[Object.keys(item.price)[0]] : item.price;
                return <FlipCard key={item.id} title={item.name} price={`$${displayPrice.toFixed(2)}`} imageSrc={item.imageSrc} description={item.description} />
              })}
            </div>
          </section>
        )}
        {pizzas && (
          <section id="signature-pizza">
            <h1>{pizzas.category}</h1>
            <div className={styles.cardGrid}>
              {pizzas.items.map(item => {
                const displayPrice = typeof item.price === 'object' ? item.price[Object.keys(item.price)[0]] : item.price;
                return <FlipCard key={item.id} title={item.name} price={`From $${displayPrice.toFixed(2)}`} imageSrc={item.imageSrc} description={item.description} />
              })}
            </div>
          </section>
        )}
        {combos && (
          <section id="combos">
            <h1>{combos.category}</h1>
            <div className={styles.cardGrid}>
              {combos.items.map(item => {
                const displayPrice = typeof item.price === 'object' ? item.price[Object.keys(item.price)[0]] : item.price;
                return <FlipCard key={item.id} title={item.name} price={`From $${displayPrice.toFixed(2)}`} imageSrc={item.imageSrc} description={item.description} />
              })}
            </div>
          </section>
        )}
        {pickupSpecials && (
          <section id="pickup-specials">
            <h1>{pickupSpecials.category}</h1>
            <div className={styles.cardGrid}>
              {pickupSpecials.items.map(item => {
                const displayPrice = typeof item.price === 'object' ? item.price[Object.keys(item.price)[0]] : item.price;
                return <FlipCard key={item.id} title={item.name} price={`$${displayPrice.toFixed(2)}`} imageSrc={item.imageSrc} description={item.description} />
              })}
            </div>
          </section>
        )}
        {alternateCrusts && (
          <section id="alternate-pizza-crusts">
            <h1>{alternateCrusts.category}</h1>
            <div className={styles.cardGrid}>
              {alternateCrusts.items.map(item => {
                const displayPrice = typeof item.price === 'object' ? item.price[Object.keys(item.price)[0]] : item.price;
                return <FlipCard key={item.id} title={item.name} price={`$${displayPrice.toFixed(2)}`} imageSrc={item.imageSrc} description={item.description} />
              })}
            </div>
          </section>
        )}
        {sidekicks && (
          <section id="sidekicks">
            <h1>{sidekicks.category}</h1>
            <div className={styles.cardGrid}>
              {sidekicks.items.map(item => {
                const displayPrice = typeof item.price === 'object' ? item.price[Object.keys(item.price)[0]] : item.price;
                return <FlipCard key={item.id} title={item.name} price={`$${displayPrice.toFixed(2)}`} imageSrc={item.imageSrc} description={item.description} />
              })}
            </div>
          </section>
        )}
      </div>
    </CustomerLayout>
  );
}