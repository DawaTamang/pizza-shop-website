import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const orderData = await request.json();

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
  );

  try {
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_info: {
          firstName: orderData.customer.firstName,
          lastName: orderData.customer.lastName,
          email: orderData.customer.email,
          phone: orderData.customer.phone
        },
        order_type: orderData.type,
        payment_method: orderData.payment,
        subtotal: orderData.summary.subtotal,
        tax: orderData.summary.taxAmount,
        tip: orderData.summary.tip,
        total: orderData.summary.total,
        status: 'pending',
        notes: orderData.notes, // Save the notes
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      item_name: item.name,
      quantity: item.quantity,
      price_at_order: item.price,
      customizations: item.customizations,
    }));
    
    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (error) {
    console.error('Error saving order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
