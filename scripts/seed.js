// This script will read your local data and upload it to your Supabase database.

const { createClient } = require('@supabase/supabase-js');
const { menuData } = require('../data/menu');
const { toppings, wingSauces, dippingSauces, canPops, twoLiterPops } = require('../data/options');

// Manually enter your Supabase credentials here for the script
const SUPABASE_URL = 'https://xzgcbseiwwqjqpbbeoey.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6Z2Nic2Vpd3dxanFwYmJlb2V5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDY4NjM5MiwiZXhwIjoyMDc2MjYyMzkyfQ.lgpyrZXhJE_adfLp0r5Cto8aIpUuYWW7Tv_Q-JAaLjY';

// IMPORTANT: Use your SERVICE_ROLE key for this script. You can find it in your Supabase
// dashboard under Settings > API > Project API Keys (it's the 'secret' one).
// This key has the power to write data and should ONLY be used in secure, server-side scripts like this one.
// DO NOT expose this key in your frontend application.

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function seedDatabase() {
  console.log('Starting to seed database...');

  // 1. Seed Categories
  console.log('Seeding categories...');
  const categories = [...new Set(menuData.map(data => data.category))];
  const { data: insertedCategories, error: categoryError } = await supabase
    .from('categories')
    .insert(categories.map(name => ({ name })))
    .select();

  if (categoryError) {
    console.error('Error seeding categories:', categoryError.message);
    return;
  }
  console.log('✅ Categories seeded successfully!');
  
  // Create a map for easy lookup
  const categoryMap = insertedCategories.reduce((map, cat) => {
    map[cat.name] = cat.id;
    return map;
  }, {});

  // 2. Seed Menu Items
  console.log('Seeding menu items...');
  const menuItemsToInsert = menuData.flatMap(category => 
    category.items.map(item => ({
      name: item.name,
      description: item.description,
      image_src: item.imageSrc,
      price: typeof item.price === 'number' ? item.price : JSON.stringify(item.price),
      customization: item.customization ? JSON.stringify(item.customization) : null,
      category_id: categoryMap[category.category]
    }))
  );

  const { error: menuError } = await supabase.from('menu_items').insert(menuItemsToInsert);
  if (menuError) {
    console.error('Error seeding menu items:', menuError.message);
    return;
  }
  console.log('✅ Menu items seeded successfully!');

  // 3. Seed Options (Toppings, Sauces, etc.)
  console.log('Seeding options...');
  const optionsToInsert = [
    ...toppings.map(t => ({ type: 'topping', name: t.name, is_premium: t.premium })),
    ...wingSauces.map(name => ({ type: 'wing_sauce', name, is_premium: false })),
    ...dippingSauces.map(name => ({ type: 'dip', name, is_premium: false })),
    ...canPops.map(name => ({ type: 'can_pop', name, is_premium: false })),
    ...twoLiterPops.map(name => ({ type: '2l_pop', name, is_premium: false })),
  ];
  
  const { error: optionsError } = await supabase.from('options').insert(optionsToInsert);
  if (optionsError) {
    console.error('Error seeding options:', optionsError.message);
    return;
  }
  console.log('✅ Options seeded successfully!');

  console.log('🎉 Database seeding complete!');
}

seedDatabase();