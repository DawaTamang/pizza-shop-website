import CustomerLayout from "../components/CustomerLayout";
import OrderClient from '../components/OrderClient';
import { supabase } from '../../lib/supabaseClient';

async function getMenuData() {
    const { data, error } = await supabase.from('categories').select(`*, menu_items ( * )`);
    if (error) {
        console.error('Error fetching menu data:', error);
        return [];
    }
    const parsedData = data.map(category => ({
        ...category,
        menu_items: category.menu_items.map(item => {
            let newItem = { ...item };
            if (typeof newItem.price === 'string' && newItem.price.trim().startsWith('{')) {
                try { newItem.price = JSON.parse(newItem.price); } catch (e) { console.error("Failed to parse price JSON:", newItem.price, e); }
            }
            if (typeof newItem.customization === 'string' && newItem.customization.trim().startsWith('{')) {
                 try { newItem.customization = JSON.parse(newItem.customization); } catch (e) { console.error("Failed to parse customization JSON:", newItem.customization, e); }
            }
            return newItem;
        })
    }));
    const preferredOrder = [ "Store Deals", "Signature Pizza", "Combos", "Pickup Specials", "Alternate Pizza Crusts", "Sidekicks", "Dipping Sauces", "Drinks" ];
    return parsedData.sort((a, b) => preferredOrder.indexOf(a.name) - preferredOrder.indexOf(b.name));
}

export default async function OrderPage() {
    const menuData = await getMenuData();

    return (
        <CustomerLayout>
            <OrderClient serverMenuData={menuData} />
        </CustomerLayout>
    );
}