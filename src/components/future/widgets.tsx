"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "~/utils/cn";

export function TiltCard({
  children,
  className,
  glow = "cyan",
}: {
  children: React.ReactNode;
  className?: string;
  glow?: "cyan" | "magenta" | "lime" | "amber";
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    element.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 10}deg) translateZ(6px)`;
    element.style.setProperty("--spot-x", `${px * 100}%`);
    element.style.setProperty("--spot-y", `${py * 100}%`);
  }

  function onPointerLeave() {
    const element = ref.current;
    if (!element) return;
    element.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  }

  const glowClass = {
    cyan: "border-cyan-400/30 hover:border-cyan-300/70 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)]",
    magenta:
      "border-fuchsia-400/30 hover:border-fuchsia-300/70 hover:shadow-[0_0_30px_rgba(232,121,249,0.25)]",
    lime: "border-lime-400/30 hover:border-lime-300/70 hover:shadow-[0_0_30px_rgba(163,230,53,0.25)]",
    amber:
      "border-amber-400/30 hover:border-amber-300/70 hover:shadow-[0_0_30px_rgba(251,191,36,0.25)]",
  }[glow];

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn(
        "tilt-card relative rounded-xl border bg-slate-950/70 backdrop-blur-md transition-[border-color,box-shadow] duration-300 will-change-transform",
        glowClass,
        className,
      )}
    >
      {children}
    </div>
  );
}

export function GlitchText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={cn("glitch relative inline-block", className)} data-text={text}>
      {text}
    </span>
  );
}

export function Typewriter({
  text,
  speed = 35,
  className,
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    setShown(0);
    if (!text) return;
    const timer = window.setInterval(() => {
      setShown((current) => {
        if (current >= text.length) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, speed);
    return () => window.clearInterval(timer);
  }, [text, speed]);

  return (
    <span className={className}>
      {text.slice(0, shown)}
      <span className={cn("animate-pulse", shown >= text.length && "hidden")}>▌</span>
    </span>
  );
}

export function HoloCube({ labels }: { labels: string[] }) {
  const faces = ["front", "back", "left", "right", "top", "bottom"] as const;
  return (
    <div className="holo-scene mx-auto" aria-hidden>
      <div className="holo-cube">
        {faces.map((face, index) => (
          <div key={face} className={`holo-face holo-face-${face}`}>
            <span>{labels[index % Math.max(labels.length, 1)] ?? "∎"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SectionHeading({
  index,
  title,
  accent = "text-cyan-300",
}: {
  index: string;
  title: string;
  accent?: string;
}) {
  return (
    <h2 className="mb-5 flex items-center gap-3 font-mono text-sm uppercase tracking-[0.3em]">
      <span className={cn("opacity-70", accent)}>{index}</span>
      <GlitchText text={title} className={cn("text-lg font-bold tracking-[0.2em]", accent)} />
      <span className="h-px flex-1 bg-gradient-to-r from-cyan-400/60 to-transparent rtl:bg-gradient-to-l" />
    </h2>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
