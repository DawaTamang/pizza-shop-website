import "./globals.css";
import { CartProvider } from "../context/CartContext";

export const metadata = {
  title: "Twin City Pizza",
  description: "The best pizza in Simcoe!",
};

// This is now the ONLY file with <html> and <body>.
// It does NOT contain the Header or Footer directly.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}