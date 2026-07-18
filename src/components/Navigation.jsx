import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";

const links = [
  ["Story", "#story"],
  ["Roast", "#reserve"],
  ["Taste", "#taste"],
  ["Intent", "#intent"],
];

export default function Navigation({ cartCount, onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <a className="brand-lockup" href="#story" aria-label="EMBERA Coffee home">
        <span className="brand-seal" aria-hidden="true">E</span>
        <span>
          <strong>EMBERA</strong>
          <small>Coffee</small>
        </span>
      </a>

      <nav className={`primary-nav${menuOpen ? " is-open" : ""}`} aria-label="Primary navigation">
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}>
            {label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <button
          className="icon-button menu-button"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <button className="bag-button" type="button" onClick={onCartOpen}>
          <ShoppingBag aria-hidden="true" />
          <span>Bag</span>
          <b aria-label={`${cartCount} items in bag`}>{cartCount}</b>
        </button>
      </div>
    </header>
  );
}
