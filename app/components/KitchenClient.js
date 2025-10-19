"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from './KitchenClient.module.css';
import OrderTicket from './OrderTicket';

const KitchenClient = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleOrderUpdate = (updatedOrder) => {
      setOrders(currentOrders => 
        currentOrders.map(o => o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o)
      );
  };

  useEffect(() => {
    const checkUserAndFetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      const { data: initialOrders, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .in('status', ['pending', 'accepted', 'preparing', 'ready'])
        .order('created_at', { ascending: true });
      
      if (error) console.error("Error fetching initial orders:", error);
      else setOrders(initialOrders);
      setLoading(false);
    };

    checkUserAndFetchOrders();

    const channel = supabase
      .channel('realtime_orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Change received!', payload);
          
          if (payload.eventType === 'INSERT') {
            new Audio('/sounds/notification.mp3').play();
            supabase.from('orders').select('*, order_items(*)').eq('id', payload.new.id).single()
              .then(({ data }) => {
                if(data) setOrders(currentOrders => {
                    if (currentOrders.some(o => o.id === data.id)) return currentOrders;
                    return [...currentOrders, data]
                });
              });
          }
          
          if (payload.eventType === 'UPDATE') {
             supabase.from('orders').select('*, order_items(*)').eq('id', payload.new.id).single()
              .then(({ data }) => {
                if(data) handleOrderUpdate(data);
              });
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return <p className={styles.loading}>Loading Kitchen Display...</p>;
  }
  
  const newOrders = orders.filter(o => o.status === 'pending');
  const inProgressOrders = orders.filter(o => o.status === 'accepted' || o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  return (
    <div className={styles.kdsContainer}>
      <header className={styles.header}>
        <h1>Kitchen Display System</h1>
        <button onClick={handleSignOut} className={styles.signOutButton}>Sign Out</button>
      </header>
      <div className={styles.columnsWrapper}>
          <div className={styles.column}>
            <h2>New Orders ({newOrders.length})</h2>
            <div className={styles.ticketContainer}>
                {newOrders.map(order => <OrderTicket key={order.id} order={order} onUpdate={handleOrderUpdate} />)}
            </div>
          </div>
          <div className={styles.column}>
            <h2>In Progress ({inProgressOrders.length})</h2>
            <div className={styles.ticketContainer}>
                {inProgressOrders.map(order => <OrderTicket key={order.id} order={order} onUpdate={handleOrderUpdate} />)}
            </div>
          </div>
          <div className={styles.column}>
            <h2>Ready ({readyOrders.length})</h2>
            <div className={styles.ticketContainer}>
                {readyOrders.map(order => <OrderTicket key={order.id} order={order} onUpdate={handleOrderUpdate} />)}
            </div>
          </div>
      </div>
    </div>
  );
};

export default KitchenClient;
