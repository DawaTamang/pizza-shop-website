"use client";

import { useState, useMemo } from 'react';
import styles from './CustomizationModal.module.css';
import { useCart } from '../../context/CartContext';
import { menuData } from '../../data/menu';
import { toppings as allToppings, toppingPrices, wingSauces, dippingSauces, canPops, twoLiterPops } from '../../data/options';

// --- Reusable Selector Components ---
const ToppingSelector = ({ title, includedCount, onSelectionChange, selectedToppings, size, isPanzerotti = false }) => {
    const [showWarning, setShowWarning] = useState(false);
    const toppingPrice = isPanzerotti ? toppingPrices['Medium'] : toppingPrices[size];

    const currentToppingWeight = selectedToppings.reduce((count, toppingName) => {
        const topping = allToppings.find(t => t.name === toppingName);
        return count + (topping?.premium ? 2 : 1);
    }, 0);

    const handleCheckboxChange = (topping, isChecked) => {
        const newToppings = isChecked ? [...selectedToppings, topping.name] : selectedToppings.filter(t => t !== topping.name);
        onSelectionChange(newToppings);
        
        const newWeight = newToppings.reduce((c, t) => c + (allToppings.find(top => top.name === t)?.premium ? 2 : 1), 0);
        setShowWarning(newWeight > includedCount);
    };

    return (
        <details className={styles.details} open>
            <summary className={styles.summary}>{title} <span className={styles.req}>Required</span></summary>
            {showWarning && <p className={styles.warning}>You've selected more than {includedCount} included toppings. Extra toppings will be charged.</p>}
            <div className={styles.toppingGrid}>
                {allToppings.map(topping => {
                    const weight = topping.premium ? 2 : 1;
                    const price = (toppingPrice * weight).toFixed(2);
                    const isChecked = selectedToppings.includes(topping.name);
                    const isIncluded = currentToppingWeight < includedCount || (isChecked && currentToppingWeight <= includedCount);

                    return (
                        <div key={topping.name} className={styles.toppingItem}>
                            <input type="checkbox" id={`${title}-${topping.name}`} checked={isChecked} onChange={e => handleCheckboxChange(topping, e.target.checked)} />
                            <label htmlFor={`${title}-${topping.name}`}>{topping.name} {topping.premium && <span className={styles.premiumTag}>(Counts as 2)</span>}</label>
                            {!isIncluded && <span>+${price}</span>}
                        </div>
                    );
                })}
            </div>
        </details>
    );
};

const OptionSelector = ({ title, options, max, onSelectionChange, selectedOptions }) => {
    const handleCheckboxChange = (option, isChecked) => {
        const newOptions = isChecked ? [...selectedOptions, option] : selectedOptions.filter(o => o !== option);
        onSelectionChange(newOptions);
    };

    return (
        <details className={styles.details} open>
            <summary className={styles.summary}>{title} <span className={styles.req}>({selectedOptions.length}/{max})</span></summary>
            <div className={styles.toppingGrid}>
                {options.map(option => {
                    const isChecked = selectedOptions.includes(option);
                    const isDisabled = !isChecked && selectedOptions.length >= max;
                    return (
                        <div key={option} className={styles.toppingItem}>
                            <input type="checkbox" id={`${title}-${option}`} checked={isChecked} disabled={isDisabled} onChange={e => handleCheckboxChange(option, e.target.checked)} />
                            <label htmlFor={`${title}-${option}`}>{option}</label>
                        </div>
                    );
                })}
            </div>
        </details>
    );
};

const RadioSelector = ({ title, options, onSelectionChange, selectedOption }) => (
    <details className={styles.details} open>
        <summary className={styles.summary}>{title} <span className={styles.req}>Required</span></summary>
        <div className={styles.radioGrid}>
            {options.map(option => (
                <label key={option} className={selectedOption === option ? styles.activeRadio : ''}>
                    <input type="radio" name={title} value={option} checked={selectedOption === option} onChange={e => onSelectionChange(e.target.value)} />
                    {option}
                </label>
            ))}
        </div>
    </details>
);

// --- Main Modal Component ---
export default function CustomizationModal({ item, onClose }) {
    const { addToCart } = useCart();
    const availableSizes = item.customization?.sizes || Object.keys(item.price);
    const [selectedSize, setSelectedSize] = useState(availableSizes[0]);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const canPopItem = menuData.find(c => c.category === 'Drinks')?.items.find(i => i.name === 'Can Pop');
    const ranchSauceItem = menuData.find(c => c.category === 'Dipping Sauces')?.items.find(i => i.name === 'Ranch Sauce');
    
    const [customizations, setCustomizations] = useState({
        pizzas: Array(item.customization?.pizzaCount || 0).fill({ toppings: [], instructions: '' }),
        panzerotti: Array(item.customization?.panzerottiCount || 0).fill({ toppings: [] }),
        wings: Array(item.customization?.wingsCount || 0).fill({ sauce: wingSauces[0] }),
        dips: [],
        pops: [],
        sideChoice: item.customization?.sideChoices ? item.customization.sideChoices[0] : null,
    });

    const updatePizza = (index, newPizzaData) => { const newPizzas = [...customizations.pizzas]; newPizzas[index] = { ...newPizzas[index], ...newPizzaData }; setCustomizations({ ...customizations, pizzas: newPizzas }); };
    const updatePanzerotti = (index, newToppings) => { const newPanzos = [...customizations.panzerotti]; newPanzos[index] = { toppings: newToppings }; setCustomizations({ ...customizations, panzerotti: newPanzos }); };
    const updateWings = (index, newSauce) => { const newWings = [...customizations.wings]; newWings[index] = { sauce: newSauce }; setCustomizations({ ...customizations, wings: newWings }); };

    const totalPrice = useMemo(() => {
        const basePrice = typeof item.price === 'object' ? item.price[selectedSize] : item.price;
        let extraCost = 0;
        const processToppings = (items, included, size) => { items.forEach(p => { const weight = p.toppings.reduce((c, t) => c + (allToppings.find(top => top.name === t)?.premium ? 2 : 1), 0); if (weight > included) { const extraWeight = weight - included; extraCost += extraWeight * toppingPrices[size]; } }); };
        processToppings(customizations.pizzas, item.customization.includedToppings, selectedSize);
        processToppings(customizations.panzerotti, item.customization.includedToppings, 'Medium');
        return (basePrice + extraCost) * quantity;
    }, [item, selectedSize, quantity, customizations]);

    const handleAddToCart = () => {
        setIsLoading(true);
        setTimeout(() => {
            const customizedItem = { ...item, cartItemId: crypto.randomUUID(), name: `${item.name}${availableSizes.length > 1 ? ` - ${selectedSize}` : ''}`, price: totalPrice / quantity, quantity: quantity, customizations: { ...customizations, includedSides: item.customization.includedSides }, };
            addToCart(customizedItem);
            setIsLoading(false);
            onClose();
        }, 1000);
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>&times;</button>
                <div className={styles.modalHeader}>
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                </div>
                
                <div className={styles.scrollingContent}>
                    {availableSizes.length > 1 && (<div className={styles.optionSection}><h4>Select Size</h4><div className={styles.sizeSelector}>{availableSizes.map(size => (<label key={size} className={selectedSize === size ? styles.activeSize : ''}><input type="radio" name="size" value={size} checked={selectedSize === size} onChange={() => setSelectedSize(size)} />{size}</label>))}</div></div>)}
                    {customizations.pizzas.map((pizza, index) => (<div key={`pizza-${index}`} className={styles.optionSection}><ToppingSelector title={`Pizza ${index + 1} Toppings`} includedCount={item.customization.includedToppings} onSelectionChange={newTops => updatePizza(index, { toppings: newTops })} selectedToppings={pizza.toppings} size={selectedSize} /><textarea className={styles.instructions} placeholder={`Special Instructions for Pizza ${index+1}? (e.g., well done)`} onChange={e => updatePizza(index, {instructions: e.target.value})} /></div>))}
                    
                    {/* Corrected Line */}
                    {customizations.panzerotti.map((panzo, index) => (<div key={`panzo-${index}`} className={styles.optionSection}><ToppingSelector title={`Panzerotti ${index + 1} Toppings`} includedCount={item.customization.includedToppings} onSelectionChange={newTops => updatePanzerotti(index, newTops)} selectedToppings={panzo.toppings} size="Medium" isPanzerotti={true}/></div>))}
                    
                    {customizations.wings.map((wing, index) => (<div key={`wing-${index}`} className={styles.optionSection}><RadioSelector title={`Wing Sauce (${index+1} of ${customizations.wings.length})`} options={wingSauces} selectedOption={wing.sauce} onSelectionChange={newSauce => updateWings(index, newSauce)} /></div>))}
                    {item.customization?.includedDips > 0 && (<div className={styles.optionSection}><OptionSelector title="Choose Your Dips" options={dippingSauces} max={item.customization.includedDips} selectedOptions={customizations.dips} onSelectionChange={newDips => setCustomizations({...customizations, dips: newDips})} /></div>)}
                    {item.customization?.includedPops > 0 && (<div className={styles.optionSection}><OptionSelector title="Choose Your Pops" options={item.customization.popType === '2L' ? twoLiterPops : canPops} max={item.customization.includedPops} selectedOptions={customizations.pops} onSelectionChange={newPops => setCustomizations({...customizations, pops: newPops})} /></div>)}
                    {item.customization?.sideChoices && (<div className={styles.optionSection}><RadioSelector title="Choose Your Side" options={item.customization.sideChoices} selectedOption={customizations.sideChoice} onSelectionChange={newSide => setCustomizations({...customizations, sideChoice: newSide})} /></div>)}
                </div>

                <div className={styles.modalFooter}>
                    <div className={styles.upsellSection}>
                        <h4>Complete Your Meal?</h4>
                        <div className={styles.upsellButtons}>
                            {canPopItem && (<button className={styles.upsellButton} onClick={() => addToCart(canPopItem)}>Add Can Pop <span>+${canPopItem.price.toFixed(2)}</span></button>)}
                            {ranchSauceItem && (<button className={styles.upsellButton} onClick={() => addToCart(ranchSauceItem)}>Add Ranch Sauce <span>+${ranchSauceItem.price.toFixed(2)}</span></button>)}
                        </div>
                    </div>
                    <div className={styles.footerControls}>
                        <div className={styles.quantityControl}>
                            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={isLoading}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(q => q + 1)} disabled={isLoading}>+</button>
                        </div>
                        <button className={styles.addToCartButton} onClick={handleAddToCart} disabled={isLoading}>
                            {isLoading ? <span className={styles.spinner}></span> : `Add to Cart - $${totalPrice.toFixed(2)}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}