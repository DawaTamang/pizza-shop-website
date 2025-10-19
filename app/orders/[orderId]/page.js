/*import CustomerLayout from "../../components/CustomerLayout";
import OrderStatusClient from '../../components/OrderStatusClient';

export default function OrderStatusPage() {
    return (
        <CustomerLayout>
            <OrderStatusClient />
        </CustomerLayout>
    );
}*/

import OrderStatusClient from '../../components/OrderStatusClient';

export default function OrderStatusPage() {
    // This server page now just renders the client component
    // which will handle all the real-time logic.
    return <OrderStatusClient />;
}