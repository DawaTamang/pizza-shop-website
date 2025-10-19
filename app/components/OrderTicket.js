"use client";

import { useState } from 'react';
import styles from './OrderTicket.module.css';

const OrderTicket = ({ order, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSelectingTime, setIsSelectingTime] = useState(false);
    const customer = order.customer_info;
    const createdAt = new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleUpdateStatus = async (newStatus, estimatedTime = null) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/update-order?orderId=${order.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    status: newStatus,
                    estimated_ready_time: estimatedTime
                }),
            });
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Failed to update order');
            }
            // The parent KDS component will handle the UI update via real-time subscription
        } catch (error) {
            alert(`Error updating order: ${error.message}`);
        } finally {
            setIsLoading(false);
            setIsSelectingTime(false);
        }
    };

    const handleTimeSelected = (time) => {
        handleUpdateStatus('accepted', `${time} min`);
    };

    const renderActions = () => {
        if (isLoading) { return <div className={styles.loadingSpinner}></div>; }
        switch (order.status) {
            case 'pending':
                return (
                    <div className={styles.actionsGrid}>
                        <button onClick={() => handleUpdateStatus('rejected')} className={styles.rejectButton}>Reject</button>
                        <button onClick={() => setIsSelectingTime(true)} className={styles.acceptButton}>Accept</button>
                    </div>
                );
            case 'accepted':
            case 'preparing':
                return <button onClick={() => handleUpdateStatus('ready')} className={styles.readyButton}>Mark as Ready</button>;
            case 'ready':
                return <button onClick={() => handleUpdateStatus('completed')} className={styles.completeButton}>Complete Order</button>;
            default: return null;
        }
    }

    return (
        <div className={`${styles.ticket} ${styles[order.status]}`}>
            {isSelectingTime && (
                <div className={styles.timeSelectorOverlay}>
                    <h4>Select Prep Time</h4>
                    <div className={styles.timeButtons}>
                        <button onClick={() => handleTimeSelected(10)}>10 min</button>
                        <button onClick={() => handleTimeSelected(15)}>15 min</button>
                        <button onClick={() => handleTimeSelected(20)}>20 min</button>
                        <button onClick={() => handleTimeSelected(25)}>25 min</button>
                        <button onClick={() => handleTimeSelected(30)}>30 min</button>
                        <button onClick={() => handleTimeSelected(45)}>45 min</button>
                    </div>
                    <button onClick={() => setIsSelectingTime(false)} className={styles.cancelButton}>Cancel</button>
                </div>
            )}
            <div className={styles.header}>
                <h3>#{order.id.substring(0, 6).toUpperCase()}</h3>
                <strong>{order.order_type?.toUpperCase()}</strong>
                <span className={styles.time}>{createdAt}</span>
            </div>
            <div className={styles.customerInfo}>
                <strong>{customer?.firstName} {customer?.lastName}</strong>
            </div>
            
            <ul className={styles.itemList}>
                {order.order_items?.map(item => (
                    <li key={item.id}>
                        <div className={styles.itemHeader}>
                            <span className={styles.quantity}>{item.quantity}x</span>
                            <span className={styles.itemName}>{item.item_name}</span>
                        </div>
                        {item.customizations && (
                            <div className={styles.customizations}>
                                {item.customizations.pizzas?.map((pizza, index) => (
                                    <div key={index} className={styles.customizationItem}>
                                        <strong>Pizza {index+1}:</strong> {pizza.toppings.join(', ') || 'No extra toppings'}.
                                        {pizza.instructions && <em className={styles.instruction}>"{pizza.instructions}"</em>}
                                    </div>
                                ))}
                                {item.customizations.panzerotti?.map((panzo, index) => (
                                     <div key={index} className={styles.customizationItem}>
                                        <strong>Panzo {index+1}:</strong> {panzo.toppings.join(', ') || 'No toppings'}.
                                    </div>
                                ))}
                                {item.customizations.wings?.map((wing, index) => (
                                    <div key={index} className={styles.customizationItem}><strong>Wings:</strong> {wing.sauce}</div>
                                ))}
                                {item.customizations.dips?.length > 0 && <div className={styles.customizationItem}><strong>Dips:</strong> {item.customizations.dips.join(', ')}</div>}
                                {item.customizations.pops?.length > 0 && <div className={styles.customizationItem}><strong>Pops:</strong> {item.customizations.pops.join(', ')}</div>}
                                {item.customizations.sideChoice && <div className={styles.customizationItem}><strong>Side Choice:</strong> {item.customizations.sideChoice}</div>}
                                {item.customizations.includedSides?.map(side => <div key={side} className={styles.customizationItem}><strong>Included:</strong> {side}</div>)}
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {order.notes && (
                <div className={styles.generalNotes}>
                    <strong>General Notes:</strong> {order.notes}
                </div>
            )}
            
            <div className={styles.actions}>
                {renderActions()}
            </div>
        </div>
    );
};

export default OrderTicket;

