// src/components/VideoBackground.jsx
import { useEffect, useRef, useState } from "react";

/**
 * VideoBackground
 * Props:
 *  - videos: array of strings, e.g. ['/videos/clip1.mp4', '/videos/clip2.mp4']
 *  - duration: ms each clip stays visible (default 5000)
 *  - transitionMs: ms for crossfade (default 800)
 */
export default function VideoBackground({ videos = [], duration = 10000, transitionMs = 800 }) {
  const v0 = useRef(null);
  const v1 = useRef(null);
  const intervalRef = useRef(null);
  const [index, setIndex] = useState(0); // logical index into videos[]
  const [activeSlot, setActiveSlot] = useState(0); // 0 => v0 on top, 1 => v1 on top

  // Respect user reduced-motion preference
  const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Initialize the two video elements with initial sources
  useEffect(() => {
    if (!videos || videos.length === 0) return;

    // ensure elements exist
    const el0 = v0.current;
    const el1 = v1.current;
    if (!el0 || !el1) return;

    // set initial sources
    el0.src = videos[0];
    el0.muted = true;
    el0.loop = true;
    el0.playsInline = true;
    el0.style.opacity = "1";
    el0.style.transition = `opacity ${transitionMs}ms linear`;

    // if there is a second video, preload into the other slot
    if (videos.length > 1) {
      el1.src = videos[1 % videos.length];
      el1.muted = true;
      el1.loop = true;
      el1.playsInline = true;
      el1.style.opacity = "0";
      el1.style.transition = `opacity ${transitionMs}ms linear`;
    } else {
      // if only one video, keep second hidden
      el1.style.opacity = "0";
    }

    // try to autoplay the initial elements (muted should allow it)
    const tryPlay = async (el) => {
      try {
        await el.play();
      } catch (e) {
        console.log(e)
      }
    };
    tryPlay(el0);
    tryPlay(el1);

    // If user prefers reduced motion or only one video, don't start rotation
    if (prefersReduced || videos.length <= 1) return;

    // start interval to switch clips
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % videos.length);
      setActiveSlot((s) => 1 - s); // toggle which DOM slot is active
    }, duration);

    return () => {
      clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos, transitionMs, duration, prefersReduced]);

  // When index or activeSlot changes, update the hidden slot with next src and crossfade
  useEffect(() => {
    if (!videos || videos.length <= 1) return;
    const el0 = v0.current;
    const el1 = v1.current;
    if (!el0 || !el1) return;

    const topEl = activeSlot === 0 ? el0 : el1;
    const bottomEl = activeSlot === 0 ? el1 : el0;

    // compute srcs: top should be videos[index], bottom should be previous index
    const curSrc = videos[index];
    const prevIndex = (index - 1 + videos.length) % videos.length;
    const prevSrc = videos[prevIndex];

    // ensure topEl has the right src (set and play)
    if (topEl.getAttribute("src") !== curSrc) {
      topEl.src = curSrc;
      try { topEl.currentTime = 0; } catch (e){ console.log(e)}
      topEl.muted = true;
      topEl.loop = true;
      topEl.playsInline = true;
      topEl.play().catch(() => {});
    }

    // ensure bottomEl has prevSrc (so it can fade out correctly)
    if (bottomEl.getAttribute("src") !== prevSrc) {
      bottomEl.src = prevSrc;
      try { bottomEl.currentTime = 0; } catch (e){ console.log(e)}
      bottomEl.muted = true;
      bottomEl.loop = true;
      bottomEl.playsInline = true;
      bottomEl.play().catch(() => {});
    }

    // crossfade: top -> opacity 1, bottom -> opacity 0
    // using a small timeout ensures the browser has applied the src/play above
    requestAnimationFrame(() => {
      topEl.style.transition = `opacity ${transitionMs}ms linear`;
      bottomEl.style.transition = `opacity ${transitionMs}ms linear`;

      topEl.style.opacity = "1";
      bottomEl.style.opacity = "0";
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, activeSlot, videos, transitionMs]);

  // Clean up on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  // Render two videos stacked
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none " >
      <video
        ref={v0}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        // loop and src are set in effect
      />
      <video
        ref={v1}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
      />
      {/* Optional overlay to darken if needed (adjust in Hero) */}
    </div>
  );
}
