import { useRef, useState } from "react";
import { ArrowRight, Check, ShoppingBag } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { images } from "../media";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FinalCTA({ onAddToBag }) {
  const sectionRef = useRef(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  useGSAP(() => {
    gsap.from(".final-copy > *", {
      autoAlpha: 0,
      y: 34,
      duration: 0.78,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 62%", once: true },
    });
  }, { scope: sectionRef });

  const onSubmit = (event) => {
    event.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setStatus(valid ? "success" : "error");
  };

  return (
    <section ref={sectionRef} id="shop" className="final-section section-band">
      <img className="final-background" src={images.product} alt="EMBERA Forest Reserve coffee and steaming cup" loading="lazy" />
      <div className="final-overlay" aria-hidden="true" />
      <div className="final-copy content-shell">
        <p className="section-kicker section-kicker--light">The cup is ready</p>
        <h2>Your ritual<br />starts here.</h2>
        <p>Forest Reserve · Whole bean · 250g</p>
        <button className="primary-button primary-button--light" type="button" onClick={onAddToBag}>
          <ShoppingBag aria-hidden="true" /> Shop the reserve <span>£19</span>
        </button>

        <form className="newsletter-form" onSubmit={onSubmit} noValidate>
          <label htmlFor="newsletter-email">Notes from the roastery</label>
          <div>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="you@example.com"
              autoComplete="email"
              aria-describedby="newsletter-status"
            />
            <button className="icon-button" type="submit" aria-label="Join newsletter">
              {status === "success" ? <Check /> : <ArrowRight />}
            </button>
          </div>
          <p id="newsletter-status" role={status === "error" ? "alert" : "status"}>
            {status === "success" && "You are on the list. Welcome to EMBERA."}
            {status === "error" && "Enter a valid email address to continue."}
          </p>
        </form>
      </div>
    </section>
  );
}
