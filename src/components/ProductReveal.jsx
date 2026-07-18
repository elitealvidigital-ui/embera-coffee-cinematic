import { useRef } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { images } from "../media";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ProductReveal({ onAddToBag }) {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 72%",
        once: true,
      },
    });

    timeline
      .from(".reserve-kicker, .reserve-title, .reserve-summary", {
        autoAlpha: 0,
        y: 32,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      })
      .from(".reserve-media", { autoAlpha: 0, x: 52, duration: 1, ease: "power3.out" }, "<")
      .from(".roast-meter i", { scaleY: 0, transformOrigin: "bottom", stagger: 0.08, duration: 0.45 }, "-=0.4")
      .from(".reserve-actions", { autoAlpha: 0, y: 18, duration: 0.55 }, "-=0.3");
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="reserve" className="reserve-section section-band">
      <div className="reserve-inner content-shell">
        <div className="reserve-copy">
          <p className="section-kicker reserve-kicker">The signature reserve</p>
          <h2 className="reserve-title">Forest Reserve</h2>
          <p className="reserve-summary">
            A deliberate dark roast with a velvet body, grounded sweetness and a finish that lingers like cedar after rain.
          </p>

          <dl className="reserve-details">
            <div><dt>Format</dt><dd>Whole bean</dd></div>
            <div><dt>Weight</dt><dd>250g</dd></div>
            <div><dt>Profile</dt><dd>Dark roast</dd></div>
          </dl>

          <div className="roast-level" aria-label="Roast level four out of five">
            <div>
              <span>Roast intensity</span>
              <b>4 / 5</b>
            </div>
            <div className="roast-meter" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => <i key={index} className={index < 4 ? "is-filled" : ""} />)}
            </div>
          </div>

          <div className="reserve-actions">
            <button className="primary-button" type="button" onClick={onAddToBag}>
              <ShoppingBag aria-hidden="true" /> Add to bag <span>£19</span>
            </button>
            <a className="text-link" href="#taste">Explore the profile <ArrowRight aria-hidden="true" /></a>
          </div>
        </div>

        <figure className="reserve-media">
          <img src={images.master} alt="EMBERA Forest Reserve coffee pouch with a black ceramic cup" loading="lazy" />
          <figcaption>Single origin · Roasted with intent</figcaption>
        </figure>
      </div>
    </section>
  );
}
