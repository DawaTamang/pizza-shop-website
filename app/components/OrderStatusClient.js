/*"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import styles from './ConfirmationClient.module.css'; // We can reuse the existing styles
import Link from 'next/link';

const OrderStatusClient = () => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const params = useParams(); // Hook to get URL parameters on the client
    const router = useRouter();

    useEffect(() => {
        const fetchOrder = async () => {
            const { orderId } = params;
            if (!orderId) {
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select(`*, order_items(*)`)
                    .eq('id', orderId)
                    .single();

                if (error || !data) {
                    throw new Error(error?.message || "Order not found");
                }
                setOrderDetails(data);
            } catch (error) {
                console.error("Failed to fetch order:", error);
                setOrderDetails(null); // Ensure orderDetails is null on error
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [params]);

    if (loading) {
        return <p className={styles.loadingMessage}>Loading your order confirmation...</p>;
    }

    if (!orderDetails) {
        return (
            <div className={styles.container}>
                <div className={styles.confirmationBox}>
                    <div className={styles.header}>
                        <h1>Order Not Found</h1>
                        <p>We couldn't find the details for this order. Please check the link or contact the store.</p>
                    </div>
                    <Link href="/" className={styles.returnButton}>Return to Homepage</Link>
                </div>
            </div>
        );
    }

    const { id, order_items, total, order_type, estimated_ready_time } = orderDetails;

    return (
        <div className={styles.container}>
            <div className={styles.confirmationBox}>
                <div className={styles.header}>
                    <span className={styles.checkIcon}>✔</span>
                    <h1>Thank You For Your Order!</h1>
                    <p>Your order has been received and is being prepared.</p>
                </div>
                <div className={styles.orderDetails}>
                    <div className={styles.detailItem}>
                        <span>Order Number</span>
                        <strong>{id.substring(0, 8).toUpperCase()}</strong>
                    </div>
                    <div className={styles.detailItem}>
                        <span>Estimated {order_type === 'pickup' ? 'Pickup' : 'Delivery'} Time</span>
                        <strong>{estimated_ready_time || "ASAP (Est. 20-30 mins)"}</strong>
                    </div>
                </div>
                <div className={styles.orderSummary}>
                    <h3>Order Summary</h3>
                    {order_items.map(item => (
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
                <Link href="/order" className={styles.returnButton}>Return to Menu</Link>
            </div>
        </div>
    );
};

export default OrderStatusClient;*/

"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import styles from './OrderStatusClient.module.css';
import Link from 'next/link';

const OrderStatusClient = () => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        const { orderId } = params;
        if (!orderId) {
            router.push('/');
            return;
        }

        // 1. Fetch the initial order data
        const fetchOrder = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select(`*, order_items(*)`)
                .eq('id', orderId)
                .single();

            if (error || !data) {
                console.error("Failed to fetch order:", error);
                setOrderDetails(null);
            } else {
                setOrderDetails(data);
            }
            setLoading(false);
        };

        fetchOrder();

        // 2. Set up a real-time subscription
        const channel = supabase.channel(`order-status-${orderId}`)
            .on('postgres_changes', 
                { 
                    event: 'UPDATE', 
                    schema: 'public', 
                    table: 'orders', 
                    filter: `id=eq.${orderId}` 
                }, 
                (payload) => {
                    console.log('Order status updated!', payload.new);
                    // When an update is received, update the state with the new order details
                    setOrderDetails(currentDetails => ({ ...currentDetails, ...payload.new }));
                }
            )
            .subscribe();

        // 3. Cleanup the subscription when the component is unmounted
        return () => {
            supabase.removeChannel(channel);
        };

    }, [params, router]);

    const renderStatusContent = () => {
        switch (orderDetails?.status) {
            case 'pending':
                return {
                    icon: '⏳',
                    title: 'Waiting for Confirmation',
                    message: 'Your order has been sent to the restaurant. We are waiting for them to accept it.'
                };
            case 'accepted':
            case 'preparing':
                 return {
                    icon: '✔',
                    title: 'Order Confirmed!',
                    message: 'The restaurant has accepted your order and is preparing it now.'
                };
            case 'ready':
                return {
                    icon: '🎉',
                    title: 'Your Order is Ready!',
                    message: `Your order is now ready for ${orderDetails.order_type}.`
                };
             case 'rejected':
                return {
                    icon: '❌',
                    title: 'Order Not Accepted',
                    message: 'Unfortunately, the restaurant was unable to accept your order at this time. You have not been charged. Please contact the store for more details.'
                };
            case 'completed':
                 return {
                    icon: '✅',
                    title: 'Order Completed!',
                    message: 'Thank you for your business!'
                };
            default:
                return {
                    icon: '❓',
                    title: 'Order Not Found',
                    message: "We couldn't find the details for this order. Please check the link or contact the store."
                };
        }
    };

    if (loading) {
        return <p className={styles.loadingMessage}>Loading your order status...</p>;
    }

    if (!orderDetails) {
         return (
            <div className={styles.container}>
                <div className={styles.confirmationBox}>
                    <div className={styles.header}>
                        <h1>Order Not Found</h1>
                        <p>We couldn't find the details for this order.</p>
                    </div>
                    <Link href="/" className={styles.returnButton}>Return to Homepage</Link>
                </div>
            </div>
        );
    }

    const { id, order_items, total, order_type, estimated_ready_time } = orderDetails;
    const statusContent = renderStatusContent();

    return (
        <div className={styles.container}>
            <div className={styles.confirmationBox}>
                <div className={`${styles.header} ${styles[orderDetails.status]}`}>
                    <span className={styles.statusIcon}>{statusContent.icon}</span>
                    <h1>{statusContent.title}</h1>
                    <p>{statusContent.message}</p>
                </div>

                <div className={styles.orderDetails}>
                    <div className={styles.detailItem}>
                        <span>Order Number</span>
                        <strong>{id.substring(0, 8).toUpperCase()}</strong>
                    </div>
                    <div className={styles.detailItem}>
                        <span>Estimated Time</span>
                        <strong>{estimated_ready_time || "Pending..."}</strong>
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