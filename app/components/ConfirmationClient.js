"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './ConfirmationClient.module.css';
import Link from 'next/link';

const CustomizationDetails = ({ customizations }) => {
    // This is the same helper component from your checkout page
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


const ConfirmationClient = () => {
    const [orderDetails, setOrderDetails] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Retrieve order details from session storage
        const savedOrder = sessionStorage.getItem('orderDetails');
        if (savedOrder) {
            setOrderDetails(JSON.parse(savedOrder));
            // Optional: clear the storage after displaying the details
            // sessionStorage.removeItem('orderDetails'); 
        } else {
            // If there are no order details, redirect back to the home page
            router.push('/');
        }
    }, [router]);

    if (!orderDetails) {
        // You can show a loading spinner here while the page checks for data
        return <p>Loading your order confirmation...</p>;
    }

    const { orderNumber, readyTime, items, summary, customer, type } = orderDetails;

    return (
        <div className={styles.container}>
            <div className={styles.confirmationBox}>
                <div className={styles.header}>
                    <span className={styles.checkIcon}>✔</span>
                    <h1>Thank You For Your Order!</h1>
                    <p>Your order has been placed successfully.</p>
                </div>

                <div className={styles.orderDetails}>
                    <div className={styles.detailItem}>
                        <span>Order Number</span>
                        <strong>#{orderNumber}</strong>
                    </div>
                    <div className={styles.detailItem}>
                        <span>Estimated {type === 'pickup' ? 'Pickup' : 'Delivery'} Time</span>
                        <strong>{readyTime}</strong>
                    </div>
                </div>

                <div className={styles.orderSummary}>
                    <h3>Order Summary</h3>
                    {items.map(item => (
                        <div key={item.cartItemId || item.id} className={styles.summaryItem}>
                            <div className={styles.itemInfo}>
                                <span className={styles.quantity}>{item.quantity}x</span>
                                <span className={styles.itemName}>{item.name}</span>
                            </div>
                            <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className={styles.totalLine}>
                        <span>Total Paid</span>
                        <strong>${summary.total.toFixed(2)}</strong>
                    </div>
                </div>

                <Link href="/order" className={styles.returnButton}>
                    Return to Menu
                </Link>
            </div>
        </div>
    );
};

export default ConfirmationClient;