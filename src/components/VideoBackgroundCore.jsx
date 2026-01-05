// src/components/VideoBackgroundCore.jsx
import { useEffect, useRef, useState } from "react";
import { getVideos } from "../services/authService";
import { getDisplayImageUrl } from "../Utils/ImageUtils";

export default function VideoBackgroundCore({
  variant, // "mobile" | "desktop"
  duration = 10000,
  transitionMs = 800,
}) {
  const v0 = useRef(null);
  const v1 = useRef(null);
  const intervalRef = useRef(null);

  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const [activeSlot, setActiveSlot] = useState(0);

  // 1️⃣ Fetch + filtro por TYPE (no por URL)
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await getVideos();
        // <-- aquí estaba el problema: si `res` es el array directo, res.data es undefined
        const raw = res?.data ?? res ?? [];
        // raw ahora contendrá el array si el backend devuelve [] o [{...}, {...}]
        console.log("VideoBackgroundCore: raw response from API:", raw);

        const filtered = raw
          .filter((v) => v?.type === variant && v?.url)
          .map((v) => getDisplayImageUrl(v.url));

        console.log("VideoBackgroundCore: filtered videos for", variant, filtered);

        setVideos(filtered);
        setIndex(0);
        setActiveSlot(0);
      } catch (err) {
        console.error("VideoBackgroundCore: error fetching videos", err);
      }
    };

    fetchVideos();
  }, [variant]);

  // 2️⃣ Setup inicial + manejo de interval de forma segura
  useEffect(() => {
    // si no hay videos, no hacemos nada
    if (!videos || videos.length === 0) return;

    // limpiamos interval previo si existe
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const el0 = v0.current;
    const el1 = v1.current;
    if (!el0 || !el1) return;

    const setup = (el, src, opacity) => {
      if (!el) return;
      try {
        el.pause();
      } catch {"error"}
      el.src = src;
      el.muted = true;
      el.loop = true;
      el.playsInline = true;
      el.preload = "auto";
      el.style.opacity = opacity;
      el.style.transition = `opacity ${transitionMs}ms linear`;
      try { el.load(); } catch {"error"}
      el.play().catch(() => {}); // silenciamos rechazos (AbortError es común)
    };

    setup(el0, videos[0], "1");
    if (videos.length > 1) {
      setup(el1, videos[1], "0");
    } else {
      // asegurar que el slot secundario esté oculto
      el1.style.opacity = "0";
      el1.src = "";
    }

    // solo creamos el interval si tenemos más de 1 video
    if (videos.length > 1) {
      intervalRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % videos.length);
        setActiveSlot((s) => 1 - s);
      }, duration);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [videos, duration, transitionMs]);

  // 3️⃣ Crossfade
  useEffect(() => {
    if (!videos || videos.length <= 1) return;

    const top = activeSlot === 0 ? v0.current : v1.current;
    const bottom = activeSlot === 0 ? v1.current : v0.current;

    if (!top || !bottom) return;

    try {
      top.pause();
    } catch {"error"}
    top.src = videos[index];
    try { top.load(); } catch {"error"}
    top.play().catch(() => {});

    // crossfade visual
    requestAnimationFrame(() => {
      top.style.transition = `opacity ${transitionMs}ms linear`;
      bottom.style.transition = `opacity ${transitionMs}ms linear`;
      top.style.opacity = "1";
      bottom.style.opacity = "0";
    });
  }, [index, activeSlot, videos, transitionMs]);

  // cleanup general
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <video ref={v0} className="absolute inset-0  object-cover" />
      <video ref={v1} className="absolute inset-0 object-cover" />
    </div>
  );
}
