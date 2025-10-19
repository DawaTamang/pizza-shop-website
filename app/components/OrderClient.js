"use client";

import { useState, useMemo } from 'react';
import styles from './OrderClient.module.css';
import { openingHours, formatTime } from '../../data/menu'; // Keep this for now
import { useCart } from '../../context/CartContext';
import Link from 'next/link';
import CustomizationModal from './CustomizationModal';

// Note: The menuData is now passed in as a prop named `serverMenuData`
const OrderClient = ({ serverMenuData }) => {
  const { addToCart, totalItems } = useCart();
  const [selectedCategory, setSelectedCategory] = useState(serverMenuData[0]?.name || '');
  const [customizingItem, setCustomizingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // The rest of the component remains the same, but uses `serverMenuData`
  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }));
  const dayOfWeek = today.getDay();
  const todaysHours = openingHours[dayOfWeek];
  const hoursString = todaysHours ? `${formatTime(todaysHours.open)} - ${formatTime(todaysHours.close)}` : "Closed Today";

  const displayedMenu = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    if (lowerCaseSearchTerm.trim() !== '') {
      return serverMenuData.map(category => ({
        ...category,
        items: category.menu_items.filter(item => 
          item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          (item.description && item.description.toLowerCase().includes(lowerCaseSearchTerm))
        ),
      })).filter(category => category.items.length > 0);
    }
    const category = serverMenuData.find(cat => cat.name === selectedCategory);
    return category ? [{...category, items: category.menu_items}] : [];
  }, [searchTerm, selectedCategory, serverMenuData]);

  const handleAddClick = (item) => {
    if (item.customization) {
      setCustomizingItem(item);
    } else {
      addToCart(item);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {customizingItem && <CustomizationModal item={customizingItem} onClose={() => setCustomizingItem(null)} />}

      <header className={styles.pageHeader}>
        <h1>Restaurant Full Menu</h1>
        <p>{hoursString}</p>
      </header>
      
      <div className={styles.stickyNavWrapper}>
        {!searchTerm && (
          <>
            <h3 className={styles.filterLabel}>Filter by Category</h3>
            <nav className={styles.categoryNavbar}>
              {serverMenuData.map(({ name }) => (
                <button
                  key={name}
                  className={selectedCategory === name ? styles.activeCategory : styles.categoryButton}
                  onClick={() => setSelectedCategory(name)}
                >
                  {name}
                </button>
              ))}
            </nav>
          </>
        )}
         <div className={styles.searchContainer}>
            <input 
              type="text" 
              placeholder="Search Your Favourite..." 
              className={styles.searchBar}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <main>
        {searchTerm ? (
          <h2 className={styles.menuSectionTitle}>Search Results for "{searchTerm}"</h2>
        ) : (
          <h2 className={styles.menuSectionTitle}>{selectedCategory}</h2>
        )}
        
        {displayedMenu.length > 0 ? (
          displayedMenu.map(category => (
            <div key={category.name}>
              {searchTerm && displayedMenu.length > 1 && <h3 className={styles.searchCategoryTitle}>{category.name}</h3>}
              <div className={styles.menuGrid}>
                {category.items.map((item) => {
                  const displayPrice = typeof item.price === 'object' ? item.price[Object.keys(item.price)[0]] : item.price;
                  return (
                    <div key={item.id} className={styles.menuItemCard}>
                      <div className={styles.cardContent}>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <div className={styles.cardFooter}>
                          <span>{typeof item.price === 'object' ? 'From ' : ''}${parseFloat(displayPrice).toFixed(2)}</span>
                          <button onClick={() => handleAddClick(item)}>
                            {item.customization ? 'Customize' : 'Add'}
                          </button>
                        </div>
                      </div>
                      {item.image_src && (
                        <div className={styles.cardImageContainer}>
                          <img src={item.image_src} alt={item.name} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noResults}>No items found. Try a different search term or clear the search bar.</p>
        )}
      </main>

      <Link href="/checkout" className={styles.floatingCartButton}>
        🛒&nbsp; Cart ({totalItems})
      </Link>
    </div>
  );
};

export default OrderClient;