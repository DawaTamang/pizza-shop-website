"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import styles from './OrderStatusClient.module.css'; // Reuse the existing styles
import Link from 'next/link';

const OrderStatusClient = () => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        const { orderId } = params;
        if (!orderId) {
            // If no orderId in URL, redirect to home
            router.push('/');
            return;
        }

        // 1. Fetch the initial order data
        const fetchOrder = async () => {
            setLoading(true); // Start loading
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select(`*, order_items(*)`) // Fetch items too
                    .eq('id', orderId)
                    .single();

                if (error || !data) {
                    throw new Error(error?.message || "Order not found");
                }
                setOrderDetails(data);
            } catch (error) {
                console.error("Failed to fetch order:", error);
                setOrderDetails(null); // Set to null if fetch fails
            } finally {
                setLoading(false); // Stop loading regardless of outcome
            }
        };

        fetchOrder();

        // 2. Set up a real-time subscription to listen for updates to THIS order
        const channel = supabase.channel(`order-status-${orderId}`)
            .on('postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${orderId}` // Only listen for changes to this specific order ID
                },
                (payload) => {
                    console.log('Order status updated via realtime!', payload.new);
                    // When an update is received, update the local state with the new order details
                    // We merge payload.new into existing details to preserve order_items if they weren't sent
                    setOrderDetails(currentDetails => ({ ...currentDetails, ...payload.new }));
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`Realtime subscribed for order ${orderId}`);
                }
                if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                    console.error(`Realtime subscription error for order ${orderId}: ${status}`);
                    // Optionally, you could try to refetch or notify the user
                }
            });

        // 3. Cleanup the subscription when the component is unmounted or orderId changes
        return () => {
            console.log(`Removing channel for order ${orderId}`);
            supabase.removeChannel(channel);
        };

    }, [params, router]); // Re-run effect if params change

    // Function to render the correct status message and icon based on order status
    const renderStatusContent = () => {
        switch (orderDetails?.status) {
            case 'pending':
                return { icon: '⏳', title: 'Waiting for Confirmation', message: 'Your order has been sent. Waiting for the restaurant to accept...' };
            case 'accepted':
            case 'preparing':
                 return { icon: '🧑‍🍳', title: 'Order Confirmed!', message: 'The restaurant is preparing your order.' };
            case 'ready':
                return { icon: '🎉', title: 'Your Order is Ready!', message: `Ready for ${orderDetails.order_type === 'pickup' ? 'pickup' : 'delivery'}!` };
             case 'rejected':
                return { icon: '❌', title: 'Order Not Accepted', message: 'Unfortunately, the restaurant could not accept your order. You have not been charged.' };
            case 'completed':
                 return { icon: '✅', title: 'Order Completed!', message: 'Thank you for your order!' };
            default: // Handles null or unexpected status
                return { icon: '❓', title: 'Order Status Unknown', message: "Checking order details..." };
        }
    };

    // --- Render Logic ---

    if (loading) {
        return <p className={styles.loadingMessage}>Loading your order status...</p>;
    }

    // Handle case where order fetch failed or returned no data
    if (!orderDetails) {
         return (
            <div className={styles.container}>
                <div className={styles.confirmationBox}>
                    <div className={`${styles.header} ${styles.rejected}`}>
                        <span className={styles.statusIcon}>❌</span>
                        <h1>Order Not Found</h1>
                        <p>We couldn't find details for this order. Please check the link or contact the store.</p>
                    </div>
                    <Link href="/" className={styles.returnButton}>Return to Homepage</Link>
                </div>
            </div>
        );
    }

    // If order details are available, render the status page
    const { id, order_items, total, order_type, estimated_ready_time, status } = orderDetails;
    const statusContent = renderStatusContent();

    return (
        <div className={styles.container}>
            <div className={styles.confirmationBox}>
                <div className={`${styles.header} ${styles[status] || styles.pending}`}>
                    <span className={styles.statusIcon}>{statusContent.icon}</span>
                    <h1>{statusContent.title}</h1>
                    <p>{statusContent.message}</p>
                </div>

                <div className={styles.orderDetails}>
                    <div className={styles.detailItem}>
                        <span>Order Number</span>
                        <strong>#{id.substring(0, 8).toUpperCase()}</strong>
                    </div>
                    <div className={styles.detailItem}>
                        <span>Est. Ready Time</span>
                        <strong>{estimated_ready_time || (status === 'pending' ? 'Waiting...' : 'ASAP')}</strong>
                    </div>
                </div>

                <div className={styles.orderSummary}>
                    <h3>Your Order</h3>
                    {order_items?.map(item => (
                        <div key={item.id} className={styles.summaryItem}>
                            <div className={styles.itemInfo}>
                                <span className={styles.quantity}>{item.quantity}x</span>
                                <span className={styles.itemName}>{item.item_name}</span>
                            </div>
                            <span className={styles.itemPrice}>${(item.price_at_order * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className={styles.totalLine}>
                        <span>Total Paid</span>
                        <strong>${parseFloat(total).toFixed(2)}</strong>
                    </div>
                </div>
                <Link href="/order" className={styles.returnButton}>
                    Place Another Order
                </Link>
            </div>
        </div>
    );
};

export default OrderStatusClient;