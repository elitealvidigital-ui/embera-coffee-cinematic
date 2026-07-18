import { useRef } from "react";
import { Gauge, Scale, Timer } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { images } from "../media";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const method = [
  { icon: Scale, label: "Coffee", value: "18g" },
  { icon: Gauge, label: "Water", value: "270g" },
  { icon: Timer, label: "Time", value: "3:20" },
];

export default function Philosophy() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const timeline = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top 68%", once: true },
    });
    timeline
      .from(".intent-copy > *", { autoAlpha: 0, y: 32, duration: 0.75, stagger: 0.1, ease: "power3.out" })
      .from(".method-item", { autoAlpha: 0, y: 24, duration: 0.55, stagger: 0.08 }, "-=0.35")
      .from(".intent-image", { autoAlpha: 0, scale: 1.04, duration: 1, ease: "power3.out" }, "<");
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="intent" className="intent-section section-band">
      <div className="intent-grid content-shell">
        <div className="intent-image">
          <img src={images.extraction} alt="Espresso extraction from a matte black coffee machine" loading="lazy" />
        </div>
        <div className="intent-copy">
          <p className="section-kicker">Roasted with intent</p>
          <h2>Nothing rushed.<br />Nothing accidental.</h2>
          <p>
            Forest Reserve is built for the slower cup: measured carefully, brewed deliberately and allowed to reveal itself.
          </p>
          <div className="brew-method" aria-label="Suggested filter brew recipe">
            {method.map(({ icon: Icon, label, value }) => (
              <div className="method-item" key={label}>
                <Icon aria-hidden="true" />
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
