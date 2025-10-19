"use client";

import { createContext, useState, useContext, useMemo } from 'react';

const CartContext = createContext();

const TAX_RATE = 0.13;
const DELIVERY_FEE = 3.99;
const PROMO_CODES = {
    SAVE10: 0.10, // 10% discount
    PIZZA5: 5.00, // $5 off
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('pickup');
  const [tip, setTip] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const applyPromoCode = (code) => {
    const upperCaseCode = code.toUpperCase();
    if (PROMO_CODES[upperCaseCode]) {
        const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        let discountAmount = 0;
        if (PROMO_CODES[upperCaseCode] < 1) {
            discountAmount = subtotal * PROMO_CODES[upperCaseCode];
        } else {
            discountAmount = PROMO_CODES[upperCaseCode];
        }
        setDiscount(discountAmount);
        setPromoCode(upperCaseCode);
        return true;
    }
    setDiscount(0);
    setPromoCode('');
    return false;
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const uniqueId = item.cartItemId || item.id;
      const existingItem = prevCart.find(cartItem => (cartItem.cartItemId || cartItem.id) === uniqueId);
      if (existingItem) {
        return prevCart.map(cartItem =>
          (cartItem.cartItemId || cartItem.id) === uniqueId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      if (!item.quantity) {
          return [...prevCart, { ...item, quantity: 1 }];
      }
      return [...prevCart, item];
    });
  };

  const removeFromCart = (uniqueId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(cartItem => (cartItem.cartItemId || cartItem.id) === uniqueId);
      if (!existingItem) return prevCart;
      if (existingItem.quantity === 1) {
        return prevCart.filter(cartItem => (cartItem.cartItemId || cartItem.id) !== uniqueId);
      }
      return prevCart.map(cartItem =>
        (cartItem.cartItemId || cartItem.id) === uniqueId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
    });
  };
  
  const clearCart = () => {
    setCart([]);
    setTip(0);
    setDiscount(0);
    setPromoCode('');
  };

  const cartValues = useMemo(() => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const taxAmount = (subtotal - discount) * TAX_RATE;
    const finalDeliveryFee = orderType === 'delivery' ? DELIVERY_FEE : 0;
    const total = subtotal - discount + taxAmount + finalDeliveryFee + tip;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    return { subtotal, taxAmount, deliveryFee: finalDeliveryFee, total, totalItems, discount };
  }, [cart, orderType, tip, discount]);

  return (
    <CartContext.Provider value={{ 
        cart, addToCart, removeFromCart, clearCart,
        orderType, setOrderType,
        tip, setTip,
        promoCode, applyPromoCode,
        ...cartValues 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);