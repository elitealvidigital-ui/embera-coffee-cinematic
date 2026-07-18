import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { images } from "../media";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const notes = [
  {
    name: "Dark chocolate",
    number: "01",
    description: "A deep cocoa foundation gives the cup its weight and quiet bitterness.",
    color: "#8d5a3d",
  },
  {
    name: "Caramel",
    number: "02",
    description: "Round sweetness softens the roast and carries a warm, syrupy finish.",
    color: "#c27b3a",
  },
  {
    name: "Cedar",
    number: "03",
    description: "A dry aromatic edge adds structure, length and a forest-dark signature.",
    color: "#49624b",
  },
];

export default function TastingNotes() {
  const sectionRef = useRef(null);
  const detailRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const activateNote = (index) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    gsap.fromTo(detailRef.current, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" });
  };

  useGSAP(() => {
    gsap.from(".taste-heading > *", {
      autoAlpha: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.75,
      ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
    });
    gsap.from(".note-option", {
      autoAlpha: 0,
      x: 36,
      stagger: 0.1,
      duration: 0.65,
      ease: "power3.out",
      scrollTrigger: { trigger: ".note-options", start: "top 78%", once: true },
    });
  }, { scope: sectionRef });

  const activeNote = notes[activeIndex];

  return (
    <section ref={sectionRef} id="taste" className="taste-section section-band">
      <div className="taste-visual" aria-hidden="true">
        <img src={images.roast} alt="" loading="lazy" />
      </div>
      <div className="taste-inner content-shell">
        <div className="taste-heading">
          <p className="section-kicker section-kicker--light">Read the cup</p>
          <h2>Three notes.<br />One long finish.</h2>
          <p>Move through the profile to discover how Forest Reserve unfolds.</p>
        </div>

        <div className="taste-interface">
          <div className="note-options" role="tablist" aria-label="Tasting notes">
            {notes.map((note, index) => (
              <button
                key={note.name}
                className={`note-option${index === activeIndex ? " is-active" : ""}`}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-controls="note-detail"
                onClick={() => activateNote(index)}
                onMouseEnter={() => activateNote(index)}
                onFocus={() => activateNote(index)}
              >
                <span>{note.number}</span>
                <strong>{note.name}</strong>
                <i style={{ backgroundColor: note.color }} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div
            ref={detailRef}
            id="note-detail"
            className="note-detail"
            role="tabpanel"
            aria-live="polite"
            style={{ "--note-color": activeNote.color }}
          >
            <span>{activeNote.number}</span>
            <h3>{activeNote.name}</h3>
            <p>{activeNote.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
