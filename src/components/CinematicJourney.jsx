import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { images, journeyClips, journeyPhases } from "../media";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const phaseStops = [0, 0.2, 0.4, 0.66, 0.84];

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
  const videoRefs = useRef([]);
  const phaseRefs = useRef([]);
  const trackerRefs = useRef([]);
  const progressRef = useRef(null);
  const activePhaseRef = useRef(-1);
  const isMobile = useMediaPreference("(max-width: 760px)");
  const reducedMotion = useMediaPreference("(prefers-reduced-motion: reduce)");

  useGSAP(() => {
    if (reducedMotion) return undefined;

    const videos = videoRefs.current.filter(Boolean);
    const phaseElements = phaseRefs.current.filter(Boolean);
    const trackerElements = trackerRefs.current.filter(Boolean);
    const playhead = { value: 0 };
    let frameRequest = 0;
    let pendingProgress = 0;

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

    const seekVideo = (video, localProgress) => {
      if (!video || video.readyState < 1) return;
      const duration = Number.isFinite(video.duration) ? video.duration : 10;
      const target = Math.min(Math.max(localProgress * (duration - 0.06), 0.01), duration - 0.06);
      if (Math.abs(video.currentTime - target) > 0.035) video.currentTime = target;
    };

    const ensureVideo = (index) => {
      const video = videos[index];
      if (!video) return;
      if (video.preload !== "auto") {
        video.preload = "auto";
        if (video.readyState === 0) video.load();
      }
    };

    const renderProgress = (progress) => {
      const scaled = Math.min(progress * videos.length, videos.length - 0.0001);
      const clipIndex = Math.min(Math.floor(scaled), videos.length - 1);
      const localProgress = progress >= 1 ? 1 : scaled - clipIndex;
      const crossfadeStart = 0.965;

      ensureVideo(clipIndex);
      ensureVideo(Math.min(clipIndex + 1, videos.length - 1));
      seekVideo(videos[clipIndex], localProgress);

      videos.forEach((video) => {
        video.style.opacity = "0";
        video.style.visibility = "hidden";
      });

      const currentVideo = videos[clipIndex];
      if (currentVideo) {
        currentVideo.style.opacity = "1";
        currentVideo.style.visibility = "visible";
      }

      if (clipIndex < videos.length - 1 && localProgress > crossfadeStart) {
        const mix = (localProgress - crossfadeStart) / (1 - crossfadeStart);
        const nextVideo = videos[clipIndex + 1];
        seekVideo(nextVideo, 0);
        currentVideo.style.opacity = String(1 - mix);
        nextVideo.style.opacity = String(mix);
        nextVideo.style.visibility = "visible";
      }

      let phaseIndex = 0;
      phaseStops.forEach((stop, index) => {
        if (progress >= stop) phaseIndex = index;
      });
      showPhase(phaseIndex);
      if (progressRef.current) progressRef.current.style.transform = `scaleY(${Math.max(progress, 0.015)})`;
      rootRef.current?.style.setProperty("--journey-progress", progress.toFixed(4));
    };

    const scheduleRender = (progress) => {
      pendingProgress = progress;
      if (frameRequest) return;
      frameRequest = window.requestAnimationFrame(() => {
        renderProgress(pendingProgress);
        frameRequest = 0;
      });
    };

    renderProgress(0);

    const tween = gsap.to(playhead, {
      value: 1,
      ease: "none",
      onUpdate: () => scheduleRender(playhead.value),
      scrollTrigger: {
        id: "embera-cinematic-journey",
        trigger: rootRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * (isMobile ? 3.4 : 5.25)}`,
        scrub: isMobile ? 0.75 : 1.15,
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
      tween.kill();
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
        {!reducedMotion && journeyClips.map((clip, index) => (
          <video
            key={clip.desktop}
            ref={(element) => { videoRefs.current[index] = element; }}
            className="journey-video"
            muted
            playsInline
            preload={index === 0 ? "auto" : index === 1 ? "metadata" : "none"}
            poster={clip.poster}
            aria-hidden="true"
          >
            <source src={isMobile ? clip.mobile : clip.desktop} type="video/mp4" />
          </video>
        ))}

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
