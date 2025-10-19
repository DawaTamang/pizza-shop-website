// This is your single source of truth for all menu items.

// 1. Define the raw data without IDs.
const rawMenuData = [
  {
    category: 'Store Deals',
    items: [
      { 
        name: 'Pick-up and Delivery Special', 
        price: 16.99, 
        description: 'A special large pizza with one free can of pop and one dipping sauce.',
        imageSrc: '/images/delivery-deal.jpg',
        customization: { type: 'pizza', pizzaCount: 1, includedToppings: 3, includedPops: 1, includedDips: 1, sizes: ['Large'] }
      },
      { 
        name: 'Party Size Pizza', 
        price: 26.99, 
        description: 'A massive 24-slice pizza with 3 toppings included.',
        imageSrc: '/images/pizza.jpg',
        customization: { type: 'pizza', pizzaCount: 1, includedToppings: 3, sizes: ['Party Size'] }
      },
    ],
  },
  {
    category: 'Signature Pizza',
    items: [
      { name: 'Greek Pie', price: { Medium: 15.99, Large: 18.99, 'X-Large': 21.99 }, description: 'Feta, black olives, red onions, tomatoes.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 0 } },
      { name: 'Vegetarian Pie', price: { Medium: 15.99, Large: 18.99, 'X-Large': 21.99 }, description: 'Mushrooms, green peppers, onions, olives, tomatoes.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 0 } },
      { name: 'Deluxe Pie', price: { Medium: 16.99, Large: 19.99, 'X-Large': 22.99 }, description: 'Pepperoni, mushrooms, green peppers, onions.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 0 } },
      { name: '4 Cheese Pizza Pie', price: { Medium: 15.99, Large: 18.99, 'X-Large': 21.99 }, description: 'Mozzarella, cheddar, feta, and parmesan.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 0 } },
      { name: 'The New Yorker Pie', price: { Medium: 16.99, Large: 19.99, 'X-Large': 22.99 }, description: 'Extra pepperoni and extra cheese.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 0 } },
      { name: 'Assyrian Pie', price: { Medium: 16.99, Large: 19.99, 'X-Large': 22.99 }, description: 'Ground beef, tomatoes, onions, hot peppers.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 0 } },
      { name: 'Cheeseburger Pie', price: { Medium: 16.99, Large: 19.99, 'X-Large': 22.99 }, description: 'Ground beef, cheddar, onions, tomatoes.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 0 } },
      { name: 'Hawaiian Pie', price: { Medium: 15.99, Large: 18.99, 'X-Large': 21.99 }, description: 'Ham and pineapple.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 0 } },
      { name: 'Meat Lovers Pie', price: { Medium: 17.99, Large: 20.99, 'X-Large': 23.99 }, description: 'Pepperoni, bacon, sausage, ham.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 0 } },
      { name: 'Canadian Pie', price: { Medium: 16.99, Large: 19.99, 'X-Large': 22.99 }, description: 'Pepperoni, mushrooms, bacon.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 0 } },
      { name: 'BBQ Chicken Pie', price: { Medium: 16.99, Large: 19.99, 'X-Large': 22.99 }, description: 'BBQ sauce base, chicken, red onions.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 0 } },
      { name: 'Spicy Chicken Pie', price: { Medium: 16.99, Large: 19.99, 'X-Large': 22.99 }, description: 'Spicy chicken, hot peppers, red onions.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 0 } },
      { name: 'Shawarma Chicken Pie', price: { Medium: 17.99, Large: 20.99, 'X-Large': 23.99 }, description: 'Shawarma chicken, garlic sauce, tomatoes, pickles.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 0 } },
    ],
  },
  {
    category: 'Combos',
    items: [
        { name: 'Twin City Classic', price: { Medium: 25.99, Large: 27.99, 'X-Large': 31.99 }, description: '2 pizzas with 3 toppings each, plus 2 free dipping sauces.', imageSrc: '/images/combo.jpg', customization: { type: 'combo', pizzaCount: 2, includedToppings: 3, includedDips: 2 } },
        { name: 'Triple Combo', price: { Medium: 34.99, Large: 37.99, 'X-Large': 43.99 }, description: '3 pizzas with 3 toppings each, plus 3 free dipping sauces.', imageSrc: '/images/combo.jpg', customization: { type: 'combo', pizzaCount: 3, includedToppings: 3, includedDips: 3 } },
        { name: 'Pizza & Wings Combo', price: { Medium: 26.99, Large: 28.99, 'X-Large': 31.99 }, description: '1 pizza with 3 toppings, 1lb wings, 1 dipping sauce, 1 cheese bread, and 2 pops.', imageSrc: '/images/combo.jpg', customization: { type: 'combo', pizzaCount: 1, includedToppings: 3, wingsCount: 1, includedDips: 1, includedSides: ['Cheese Bread'], includedPops: 2 } },
        { name: 'Family Feast', price: { Medium: 36.99, Large: 39.99, 'X-Large': 44.99 }, description: '2 pizzas with 3 toppings each, 1lb wings, 2 dipping sauces, 1 2L pop, and 1 cheese or cinnamon bread.', imageSrc: '/images/family-feast.jpg', customization: { type: 'combo', pizzaCount: 2, includedToppings: 3, wingsCount: 1, includedDips: 2, includedPops: 1, popType: '2L', sideChoices: ['Cheese Bread', 'Cinnamon Bread'] } },
        { name: 'Crazy Combo', price: { Medium: 33.99, Large: 35.99, 'X-Large': 37.99 }, description: '1 pizza with 3 toppings, 1lb wings, 1 potato wedges, 1 dipping sauce, and 3 can pops.', imageSrc: '/images/combo.jpg', customization: { type: 'combo', pizzaCount: 1, includedToppings: 3, wingsCount: 1, includedDips: 1, includedSides: ['Potato Wedges'], includedPops: 3 } },
        { name: 'Wings Combo', price: 23.99, description: '2lb wings, 1 cheese bread, and 2 can pops.', imageSrc: '/images/combo.jpg', customization: { type: 'combo', wingsCount: 2, includedSides: ['Cheese Bread'], includedPops: 2 } },
        { name: 'Panzerotti Combo', price: 27.99, description: '2 panzerotti with 3 toppings each, and 1lb wings.', imageSrc: '/images/combo.jpg', customization: { type: 'combo', panzerottiCount: 2, includedToppings: 3, wingsCount: 1 } },
        { name: 'Lasagna Combo', price: 25.99, description: '1 lasagna, 1 cheese bread, 1lb wings, and 2 pops.', imageSrc: '/images/combo.jpg', customization: { type: 'combo', wingsCount: 1, includedSides: ['Lasagna', 'Cheese Bread'], includedPops: 2 } },
    ]
  },
  {
    category: 'Pickup Specials',
    items: [
        { name: 'Small Pizza', price: 6.99, description: '1 topping included. Add extra toppings for $1.32 each.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 1, sizes: ['Small'] } },
        { name: 'Medium Pizza', price: 9.99, description: '1 topping included. Add extra toppings for $1.52 each.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 1, sizes: ['Medium'] } },
        { name: 'Large Pizza', price: 11.99, description: '1 topping included. Add extra toppings for $1.74 each.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 1, sizes: ['Large'] } },
        { name: 'X-Large Pizza', price: 13.99, description: '1 topping included. Add extra toppings for $1.99 each.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 1, sizes: ['X-Large'] } },
        // --- NEW ITEM ADDED HERE ---
        { 
          name: 'Panzerotti Special', 
          price: 12.99, 
          description: '3 toppings included and served with a free marinara sauce. Extra toppings are $1.52 each.', 
          imageSrc: '/images/sidekick.jpg', 
          customization: { type: 'panzerotti', panzerottiCount: 1, includedToppings: 3, includedSides: ['Marinara Sauce'] }
        },
    ]
  },
  {
    category: 'Alternate Pizza Crusts',
    items: [
        { name: 'Cauliflower Crust', price: 17.99, description: 'A healthy medium crust with 3 toppings.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 3, sizes: ['Medium'] } },
        { name: 'Gluten-Free Crust', price: 15.99, description: 'A delicious medium crust with 3 toppings.', imageSrc: '/images/pizza.jpg', customization: { type: 'pizza', pizzaCount: 1, includedToppings: 3, sizes: ['Medium'] } },
    ]
  },
  {
    category: 'Sidekicks',
    items: [
      { name: 'Beef Lasagna', price: 8.99, description: '', imageSrc: '/images/sidekick.jpg' },
      { name: 'Chicken Strips', price: 7.99, description: '', imageSrc: '/images/sidekick.jpg' },
      { name: '1lb Wings', price: 9.99, description: 'Choose your sauce.', imageSrc: '/images/sidekick.jpg', customization: { type: 'wings', wingsCount: 1 } },
      { name: 'Poutine', price: 8.99, description: '', imageSrc: '/images/sidekick.jpg' },
      { name: 'Chicken Poutine', price: 10.99, description: '', imageSrc: '/images/sidekick.jpg' },
      { name: 'Garlic Chicken Poutine', price: 11.99, description: '', imageSrc: '/images/sidekick.jpg' },
      { name: 'Fish and Chips', price: 10.99, description: '', imageSrc: '/images/sidekick.jpg' },
      { name: 'Potato Wedges', price: 5.99, description: '', imageSrc: '/images/sidekick.jpg' },
      { name: 'French Fries', price: 5.99, description: '', imageSrc: '/images/sidekick.jpg' },
      { name: 'Onion Rings', price: 6.99, description: '', imageSrc: '/images/sidekick.jpg' },
      { name: 'Garlic Bread', price: 4.99, description: '', imageSrc: '/images/sidekick.jpg' },
      { name: 'Cheesy Garlic Bread', price: 6.99, description: '', imageSrc: '/images/sidekick.jpg' },
      { name: 'Cinnamon Bread', price: 5.99, description: '', imageSrc: '/images/sweet.jpg' },
    ],
  },
  {
    category: 'Dipping Sauces',
    items: [
      { name: 'Ranch Sauce', price: 1.00, description: '', imageSrc: '' },
      { name: 'Marinara Sauce', price: 1.00, description: '', imageSrc: '' },
      { name: 'Garlic Sauce', price: 1.00, description: '', imageSrc: '' },
      { name: 'Spicy Sauce', price: 1.00, description: '', imageSrc: '' },
      { name: 'Blue Cheese Dip', price: 1.00, description: '', imageSrc: '' },
      { name: 'Chipotle Dip', price: 1.00, description: '', imageSrc: '' },
    ]
  },
  {
    category: 'Drinks',
    items: [
      { name: 'Water (500ml)', price: 1.11, description: '', imageSrc: '' },
      { name: 'Can Pop', price: 1.45, description: '', imageSrc: '' },
      { name: '2L Bottles', price: 3.99, description: '', imageSrc: '' },
    ]
  }
];

// 2. The function to auto-generate IDs.
const generateIdsForMenuData = (data) => {
  let idCounter = 1;
  return data.map(category => ({
    ...category,
    items: category.items.map(item => ({
      ...item,
      id: idCounter++
    }))
  }));
};

// 3. Export the final, processed data.
export const menuData = generateIdsForMenuData(rawMenuData);

// Helper to format time from 24-hour to AM/PM
export const formatTime = (hour) => {
    if (hour === 24) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    if (hour > 12) return `${hour - 12}:00 PM`;
    return `${hour}:00 AM`;
};

// Central object for all store hours
export const openingHours = {
  0: { day: 'Sunday', open: 11, close: 22 },
  1: { day: 'Monday', open: 11, close: 22 },
  2: { day: 'Tuesday', open: 11, close: 22 },
  3: { day: 'Wednesday', open: 11, close: 23 },
  4: { day: 'Thursday', open: 11, close: 23 },
  5: { day: 'Friday', open: 11, close: 24 },
  6: { day: 'Saturday', open: 11, close: 23 },
};

