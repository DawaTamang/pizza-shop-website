import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { name } = await request.json();
  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '');
  try {
    const { data, error } = await supabaseAdmin.from('categories').insert({ name }).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, category: data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}