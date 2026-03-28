"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicButton() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [entered, setEntered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  /* Stagger the entrance so the button arrives after the hero settles */
  useEffect(() => {
    const enterTimer = setTimeout(() => setEntered(true), 1800);
    const tooltipIn = setTimeout(() => setShowTooltip(true), 2400);
    const tooltipOut = setTimeout(() => setShowTooltip(false), 6000);
    return () => {
      clearTimeout(enterTimer);
      clearTimeout(tooltipIn);
      clearTimeout(tooltipOut);
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
    setShowTooltip(false);
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/John_Denver_Rocky_Mountain_High.wav"
        onEnded={() => setPlaying(false)}
      />

      {/* Wrapper keeps the tooltip + button grouped in the corner */}
      <div
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {/* Tooltip label */}
        <span
          className="font-label text-[10px] uppercase tracking-[0.25em] text-on-surface bg-surface-variant/70 backdrop-blur-xl border border-outline/20 px-4 py-2 whitespace-nowrap pointer-events-none"
          style={{
            opacity: showTooltip ? 1 : 0,
            transform: showTooltip ? "translateX(0)" : "translateX(8px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          ♪ Rocky Mountain High
        </span>

        {/* Play / Pause button */}
        <button
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          className={`relative flex items-center justify-center w-12 h-12 rounded-full bg-surface-variant/60 backdrop-blur-xl border border-outline/30 text-primary hover:bg-surface-variant/80 transition-all cursor-pointer ${playing ? "animate-pulse" : ""}`}
        >
          {/* Ping ring on entrance */}
          {entered && !playing && (
            <span className="absolute inset-0 rounded-full border border-primary/60 animate-ping pointer-events-none" />
          )}
          <span className="material-symbols-outlined text-xl relative">
            {playing ? "pause" : "music_note"}
          </span>
        </button>
      </div>
    </>
  );
}
