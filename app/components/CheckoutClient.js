"use client";

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import styles from './CheckoutClient.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { openingHours } from '../../data/menu';

// Helper component to display customization details in the cart
const CustomizationDetails = ({ customizations }) => {
    if (!customizations) return null;
    return (
        <ul className={styles.customizationList}>
            {customizations.pizzas?.map((pizza, index) => ( <li key={`pizza-${index}`}><strong>Pizza {index + 1}:</strong> {pizza.toppings.join(', ') || 'Plain'}. <em>{pizza.instructions}</em></li> ))}
            {customizations.panzerotti?.map((panzo, index) => ( <li key={`panzo-${index}`}><strong>Panzerotti {index + 1}:</strong> {panzo.toppings.join(', ') || 'Plain'}.</li> ))}
            {customizations.wings?.map((wing, index) => ( <li key={`wings-${index}`}><strong>Wings ({index + 1}):</strong> {wing.sauce} Sauce</li> ))}
            {customizations.dips?.length > 0 && <li><strong>Dips:</strong> {customizations.dips.join(', ')}</li>}
            {customizations.pops?.length > 0 && <li><strong>Pops:</strong> {customizations.pops.join(', ')}</li>}
            {customizations.sideChoice && <li><strong>Side:</strong> {customizations.sideChoice}</li>}
            {customizations.includedSides?.map(side => <li key={side}><strong>Side:</strong> {side}</li>)}
        </ul>
    );
};

const CheckoutClient = () => {
    const { 
        cart, addToCart, removeFromCart, clearCart,
        orderType, setOrderType,
        tip, setTip,
        promoCode, applyPromoCode,
        subtotal, taxAmount, deliveryFee, total, discount
    } = useCart();
    
    const router = useRouter();
    const [customerInfo, setCustomerInfo] = useState({ firstName: '', lastName: '', email: '', phone: '' });
    const [notes, setNotes] = useState('');
    const [promoInput, setPromoInput] = useState('');
    const [customTip, setCustomTip] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const handleInfoChange = (e) => { const { name, value } = e.target; setCustomerInfo(prev => ({ ...prev, [name]: value })); };
    const handleApplyPromo = () => { if (!applyPromoCode(promoInput)) { alert("Invalid promo code."); } };
    const handleTipSelection = (percentage) => { const tipAmount = subtotal * percentage; setTip(tipAmount); setCustomTip(tipAmount.toFixed(2)); };
    const handleCustomTipChange = (e) => { const value = e.target.value; setCustomTip(value); const tipAmount = parseFloat(value) || 0; setTip(tipAmount); };

    const isStoreClosedNow = () => {
        const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }));
        const dayOfWeek = now.getDay();
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
        const todaysHours = openingHours[dayOfWeek];
        if (!todaysHours) return true;
        const openTimeInMinutes = todaysHours.open * 60;
        const closeTimeInMinutes = todaysHours.close === 24 ? 24 * 60 : todaysHours.close * 60;
        return currentTimeInMinutes < openTimeInMinutes || currentTimeInMinutes >= closeTimeInMinutes;
    };

    const proceedWithOrder = async () => {
        setIsPlacingOrder(true);
        const orderDetails = { customer: customerInfo, items: cart, summary: { subtotal, taxAmount, deliveryFee, total, discount, tip }, type: orderType, notes: notes, payment: "Pay at Store" };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderDetails),
            });
            const result = await response.json();

            if (result.success) {
                clearCart();
                router.push(`/orders/${result.orderId}`);
            } else {
                alert('There was an error placing your order. Please try again.');
                console.error('API Error:', result.error);
            }
        } catch (error) {
            alert('There was a network error. Please try again.');
            console.error('Fetch Error:', error);
        } finally {
            setIsPlacingOrder(false);
            setShowConfirmation(false);
        }
    };

    const handlePlaceOrder = () => {
        if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone) {
             alert("Please fill out all 'Who is Ordering?' fields.");
             return;
        }
        if (isStoreClosedNow()) {
            setShowConfirmation(true);
        } else {
            proceedWithOrder();
        }
    };

    if (cart.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyCart}>
                    <span className={styles.emptyCartIcon}>🛒</span>
                    <h2>Your Cart is Empty</h2>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <Link href="/order" className={styles.orderButton}>Start Ordering</Link>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            {showConfirmation && (
                <div className={styles.confirmationOverlay}>
                    <div className={styles.confirmationModal}>
                        <h3>Confirm Pre-Order</h3>
                        <p>The store is currently closed. Have you scheduled your order for a future time within our opening hours?</p>
                        <div className={styles.confirmationActions}>
                            <button onClick={() => setShowConfirmation(false)} className={styles.noButton}>No, let me check</button>
                            <button onClick={proceedWithOrder} className={styles.yesButton} disabled={isPlacingOrder}>
                                {isPlacingOrder ? 'Placing...' : 'Yes, Place Pre-Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className={styles.checkoutGrid}>
                <div className={styles.leftColumn}>
                    <div className={styles.card}>
                        <h3>Your Order</h3>
                        {cart.map(item => (
                            <div key={item.cartItemId || item.id} className={styles.cartItem}>
                                <div className={styles.itemInfo}>
                                    <span className={styles.quantity}>{item.quantity} x</span>
                                    <div className={styles.itemDetails}>
                                        <span className={styles.itemName}>{item.name}</span>
                                        <CustomizationDetails customizations={item.customizations} />
                                    </div>
                                </div>
                                <div className={styles.itemControls}>
                                    <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                                    <button onClick={() => removeFromCart(item.cartItemId || item.id)} className={styles.quantityBtn}>－</button>
                                    <button onClick={() => addToCart(item)} className={styles.quantityBtn}>＋</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.card}>
                        <h3>Who is Ordering?</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}><label>First Name</label><input type="text" name="firstName" onChange={handleInfoChange} /></div>
                            <div className={styles.formGroup}><label>Last Name</label><input type="text" name="lastName" onChange={handleInfoChange} /></div>
                            <div className={styles.formGroup}><label>Email</label><input type="email" name="email" onChange={handleInfoChange} /></div>
                            <div className={styles.formGroup}><label>Phone</label><input type="tel" name="phone" placeholder="( ___ ) ___-____" onChange={handleInfoChange} /></div>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <h3>How Do You Want It?</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}><label>Order Type</label><select value={orderType} onChange={(e) => setOrderType(e.target.value)}><option value="pickup">Pickup</option><option value="delivery">Delivery</option></select></div>
                            <div className={styles.formGroup}><label>Time</label><select><option>ASAP (When Open)</option><option>Schedule for later</option></select></div>
                        </div>
                    </div>
                    <div className={styles.card}>
                        <h3>Notes</h3>
                        <textarea placeholder="Add any special instructions..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                    </div>
                </div>
                <div className={styles.rightColumn}>
                    <div className={styles.card}>
                        <h3>Order Summary</h3>
                        <div className={styles.summaryLine}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                        <div className={styles.summaryLine}>
                            <span>Have a Promo Code?</span>
                            <div className={styles.promoGroup}>
                                <input type="text" placeholder="Promo Code" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} />
                                <button onClick={handleApplyPromo}>Apply</button>
                            </div>
                        </div>
                        {discount > 0 && <div className={`${styles.summaryLine} ${styles.successText}`}><span>Promo "{promoCode}"</span><span>-${discount.toFixed(2)}</span></div>}
                        <div className={styles.summaryLine}><span>HST Tax (13.00%)</span><span>${taxAmount.toFixed(2)}</span></div>
                        {deliveryFee > 0 && <div className={styles.summaryLine}><span>Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>}
                        <div className={styles.tipSection}>
                            <h4>Select a Tip:</h4>
                            <div className={styles.tipButtons}>
                                <button onClick={() => handleTipSelection(0.10)}>10%</button>
                                <button onClick={() => handleTipSelection(0.15)}>15%</button>
                                <button onClick={() => handleTipSelection(0.20)}>20%</button>
                                <input type="number" placeholder="Custom Tip" value={customTip} onChange={handleCustomTipChange} />
                            </div>
                        </div>
                        {tip > 0 && <div className={styles.summaryLine}><span>Tip Amount</span><span>${tip.toFixed(2)}</span></div>}
                        <hr className={styles.divider} />
                        <div className={`${styles.summaryLine} ${styles.totalLine}`}><span>Total</span><span>${total.toFixed(2)}</span></div>
                        <button className={styles.orderButton} onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutClient;

