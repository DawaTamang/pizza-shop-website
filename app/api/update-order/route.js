import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function PATCH(request) {
  // Get the orderId from the URL's query parameters (e.g., ?orderId=...)
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  const { status, estimated_ready_time } = await request.json();

  if (!orderId || !status) {
    return NextResponse.json({ success: false, error: 'Order ID and status are required' }, { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || ''
  );

  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ 
        status: status,
        ...(estimated_ready_time && { estimated_ready_time: estimated_ready_time })
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, updatedOrder: data });

  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}