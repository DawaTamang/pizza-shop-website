import Header from "./Header";
import Footer from "./Footer";
import StoreStatus from "./StoreStatus";

// This component contains the layout for all your CUSTOMER-FACING pages.
export default function CustomerLayout({ children }) {
  return (
    <>
      <Header />
      <StoreStatus />
      <main>{children}</main>
      <Footer />
    </>
  );
}