import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { images, journeyPhases, journeyVideo } from "../media";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const phaseStops = [0, 0.2, 0.37, 0.66, 0.84];
const masterFrameRate = 24;
const firstTransitionProgress = 9.85 / 28.458333;

function useMediaPreference(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export default function CinematicJourney() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const phaseRefs = useRef([]);
  const trackerRefs = useRef([]);
  const progressRef = useRef(null);
  const activePhaseRef = useRef(-1);
  const isMobile = useMediaPreference("(max-width: 760px)");
  const reducedMotion = useMediaPreference("(prefers-reduced-motion: reduce)");

  useGSAP(() => {
    if (reducedMotion) return undefined;

    const video = videoRef.current;
    const phaseElements = phaseRefs.current.filter(Boolean);
    const trackerElements = trackerRefs.current.filter(Boolean);
    const playhead = { value: 0 };
    let frameRequest = 0;
    let pendingProgress = 0;
    let lastFrame = -1;

    activePhaseRef.current = -1;
    gsap.set(phaseElements, { autoAlpha: 0, y: 24 });

    const showPhase = (nextIndex) => {
      if (nextIndex === activePhaseRef.current) return;
      phaseElements.forEach((element, index) => {
        gsap.killTweensOf(element);
        if (index === nextIndex) {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.58, ease: "power3.out", overwrite: true },
          );
        } else {
          gsap.to(element, {
            autoAlpha: 0,
            y: index < nextIndex ? -18 : 18,
            duration: 0.28,
            ease: "power2.out",
            overwrite: true,
          });
        }
      });
      trackerElements.forEach((element, index) => {
        element.dataset.active = index === nextIndex ? "true" : "false";
        element.dataset.passed = index < nextIndex ? "true" : "false";
      });
      activePhaseRef.current = nextIndex;
    };

    const seekVideo = (progress) => {
      if (!video || video.readyState < HTMLMediaElement.HAVE_METADATA) return;
      const duration = Number.isFinite(video.duration) ? video.duration : 10;
      const finalFrame = Math.max(1, Math.floor((duration - 0.08) * masterFrameRate));
      const nextFrame = Math.round(gsap.utils.clamp(0, 1, progress) * finalFrame);
      if (nextFrame === lastFrame) return;
      lastFrame = nextFrame;
      const target = nextFrame / masterFrameRate;
      if (Math.abs(video.currentTime - target) > 0.018) video.currentTime = target;
    };

    const renderProgress = (progress) => {
      const boundedProgress = gsap.utils.clamp(0, 1, progress);
      seekVideo(boundedProgress);

      let phaseIndex = 0;
      phaseStops.forEach((stop, index) => {
        if (boundedProgress >= stop) phaseIndex = index;
      });
      showPhase(phaseIndex);
      if (progressRef.current) progressRef.current.style.transform = `scaleY(${Math.max(boundedProgress, 0.015)})`;
      if (rootRef.current) {
        const flare = gsap.utils.clamp(
          0,
          1,
          1 - Math.abs(boundedProgress - firstTransitionProgress) / 0.018,
        );
        rootRef.current.style.setProperty("--journey-progress", boundedProgress.toFixed(4));
        rootRef.current.style.setProperty("--journey-flare", flare.toFixed(3));
      }
    };

    const scheduleRender = (progress) => {
      pendingProgress = progress;
      if (frameRequest) return;
      frameRequest = window.requestAnimationFrame(() => {
        renderProgress(pendingProgress);
        frameRequest = 0;
      });
    };

    const syncVideo = () => {
      lastFrame = -1;
      scheduleRender(pendingProgress);
    };

    video?.pause();
    video?.addEventListener("loadedmetadata", syncVideo);
    renderProgress(0);

    const tween = gsap.to(playhead, {
      value: 1,
      ease: "none",
      onUpdate: () => scheduleRender(playhead.value),
      scrollTrigger: {
        id: "embera-cinematic-journey",
        trigger: rootRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * (isMobile ? 3.2 : 4.6)}`,
        scrub: isMobile ? 0.4 : 0.55,
        pin: stageRef.current,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });

    return () => {
      window.cancelAnimationFrame(frameRequest);
      window.removeEventListener("load", refresh);
      video?.removeEventListener("loadedmetadata", syncVideo);
      tween.kill();
      activePhaseRef.current = -1;
    };
  }, { scope: rootRef, dependencies: [isMobile, reducedMotion], revertOnUpdate: true });

  const activeImage = reducedMotion ? images.product : images.origin;

  return (
    <section
      ref={rootRef}
      id="story"
      className={`cinematic-journey${reducedMotion ? " is-reduced" : ""}`}
      aria-label="From roast to ritual"
    >
      <div ref={stageRef} className="journey-stage">
        <img className="journey-fallback" src={activeImage} alt="EMBERA Forest Reserve coffee" />
        {!reducedMotion && (
          <video
            key={isMobile ? journeyVideo.mobile : journeyVideo.desktop}
            ref={videoRef}
            className="journey-video"
            muted
            playsInline
            preload="auto"
            poster={journeyVideo.poster}
            disablePictureInPicture
            aria-hidden="true"
          >
            <source src={isMobile ? journeyVideo.mobile : journeyVideo.desktop} type="video/mp4" />
          </video>
        )}

        <div className="journey-transition-flare" aria-hidden="true" />
        <div className="journey-shade" aria-hidden="true" />
        <div className="journey-grain" aria-hidden="true" />
        <div className="particle-field" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
        </div>

        <div className="journey-copy" aria-label="Coffee journey chapters">
          {journeyPhases.map((phase, index) => (
            <div
              key={phase.number}
              ref={(element) => { phaseRefs.current[index] = element; }}
              className={`phase-copy${reducedMotion && index === journeyPhases.length - 1 ? " is-reduced-active" : ""}`}
              aria-hidden={reducedMotion && index !== journeyPhases.length - 1}
            >
              <span>{phase.eyebrow}</span>
              {index === 0 ? <h1>{phase.title}</h1> : <h2>{phase.title}</h2>}
              {index === journeyPhases.length - 1 && (
                <a className="text-link text-link--light" href="#reserve">
                  Explore the reserve <ArrowDown aria-hidden="true" />
                </a>
              )}
            </div>
          ))}
        </div>

        <aside className="journey-tracker" aria-hidden="true">
          <div className="tracker-line"><i ref={progressRef} /></div>
          {journeyPhases.map((phase, index) => (
            <div
              key={phase.number}
              ref={(element) => { trackerRefs.current[index] = element; }}
              className="tracker-step"
              data-active={index === 0 ? "true" : "false"}
            >
              <b>{phase.number}</b>
              <span>{phase.label}</span>
            </div>
          ))}
        </aside>

        {!reducedMotion && (
          <div className="scroll-cue" aria-hidden="true">
            <span>Scroll to roast</span>
            <ArrowDown />
          </div>
        )}
      </div>
    </section>
  );
}
