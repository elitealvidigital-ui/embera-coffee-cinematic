import { useCallback, useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import CinematicJourney from "./components/CinematicJourney";
import ProductReveal from "./components/ProductReveal";
import TastingNotes from "./components/TastingNotes";
import Philosophy from "./components/Philosophy";
import FinalCTA from "./components/FinalCTA";
import CartDrawer from "./components/CartDrawer";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [toast, setToast] = useState("");

  const closeCart = useCallback(() => setCartOpen(false), []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(""), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const addToBag = () => {
    setQuantity((current) => Math.max(1, current + 1));
    setCartOpen(true);
  };

  const checkout = () => {
    setCartOpen(false);
    setToast("Concept checkout confirmed. No payment was taken.");
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navigation cartCount={quantity} onCartOpen={() => setCartOpen(true)} />
      <main id="main-content">
        <CinematicJourney />
        <ProductReveal onAddToBag={addToBag} />
        <TastingNotes />
        <Philosophy />
        <FinalCTA onAddToBag={addToBag} />
      </main>
      <footer className="site-footer">
        <a className="footer-brand" href="#story">EMBERA <span>Coffee</span></a>
        <p>Roasted with intent. Brewed without hurry.</p>
        <nav aria-label="Footer navigation">
          <a href="#story">Story</a>
          <a href="#taste">Taste</a>
          <a href="#shop">Shop</a>
        </nav>
        <small>© 2026 EMBERA Coffee. Concept experience.</small>
      </footer>
      <CartDrawer
        open={cartOpen}
        quantity={quantity}
        onClose={closeCart}
        onQuantityChange={setQuantity}
        onCheckout={checkout}
      />
      <div className={`toast${toast ? " is-visible" : ""}`} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
