import { useEffect, useRef } from "react";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { images } from "../media";

export default function CartDrawer({ open, quantity, onClose, onQuantityChange, onCheckout }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div className={`cart-layer${open ? " is-open" : ""}`} aria-hidden={!open}>
      <button className="cart-scrim" type="button" aria-label="Close bag" onClick={onClose} tabIndex={open ? 0 : -1} />
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <div className="cart-header">
          <div>
            <span>Your selection</span>
            <h2 id="cart-title">The bag</h2>
          </div>
          <button ref={closeRef} className="icon-button" type="button" aria-label="Close bag" onClick={onClose}>
            <X />
          </button>
        </div>

        {quantity > 0 ? (
          <>
            <div className="cart-product">
              <img src={images.master} alt="EMBERA Forest Reserve coffee" />
              <div>
                <span>Dark roast · 250g</span>
                <h3>Forest Reserve</h3>
                <strong>£19</strong>
              </div>
            </div>
            <div className="quantity-row">
              <span>Quantity</span>
              <div className="quantity-control">
                <button type="button" aria-label="Decrease quantity" onClick={() => onQuantityChange(Math.max(0, quantity - 1))}>
                  <Minus />
                </button>
                <output aria-live="polite">{quantity}</output>
                <button type="button" aria-label="Increase quantity" onClick={() => onQuantityChange(quantity + 1)}>
                  <Plus />
                </button>
              </div>
            </div>
            <div className="cart-total">
              <span>Subtotal</span>
              <strong>£{quantity * 19}</strong>
            </div>
            <button className="primary-button checkout-button" type="button" onClick={onCheckout}>
              Continue to checkout
            </button>
            <p className="cart-note">Concept checkout. No payment will be taken.</p>
          </>
        ) : (
          <div className="empty-bag">
            <ShoppingBag aria-hidden="true" />
            <h3>Your bag is waiting.</h3>
            <p>Forest Reserve is one scroll away.</p>
            <button className="secondary-button" type="button" onClick={onClose}>Continue exploring</button>
          </div>
        )}
      </aside>
    </div>
  );
}
