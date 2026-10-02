"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number };

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    const stars: Star[] = [];
    const STAR_COUNT = 260;
    const DEPTH = 1200;
    const pointer = { x: 0, y: 0 };

    function resize() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function spawn(star: Star, randomDepth: boolean) {
      star.x = (Math.random() - 0.5) * width * 2.4;
      star.y = (Math.random() - 0.5) * height * 2.4;
      star.z = randomDepth ? Math.random() * DEPTH : DEPTH;
    }

    resize();
    for (let index = 0; index < STAR_COUNT; index += 1) {
      const star = { x: 0, y: 0, z: 0 };
      spawn(star, true);
      stars.push(star);
    }

    function onPointerMove(event: PointerEvent) {
      pointer.x = (event.clientX / width - 0.5) * 40;
      pointer.y = (event.clientY / height - 0.5) * 40;
    }

    function tick() {
      if (!context) return;
      context.fillStyle = "rgba(2, 4, 10, 0.45)";
      context.fillRect(0, 0, width, height);
      const centerX = width / 2 - pointer.x;
      const centerY = height / 2 - pointer.y;
      for (const star of stars) {
        star.z -= 2.4;
        if (star.z <= 1) spawn(star, false);
        const scale = 420 / star.z;
        const sx = centerX + star.x * (scale / 10);
        const sy = centerY + star.y * (scale / 10);
        if (sx < 0 || sx > width || sy < 0 || sy > height) continue;
        const depthRatio = 1 - star.z / DEPTH;
        const size = Math.max(0.4, depthRatio * 2.4);
        const hue = 185 + depthRatio * 70;
        context.beginPath();
        context.fillStyle = `hsla(${hue}, 95%, ${55 + depthRatio * 35}%, ${0.35 + depthRatio * 0.65})`;
        context.arc(sx, sy, size, 0, Math.PI * 2);
        context.fill();
      }
      frame = window.requestAnimationFrame(tick);
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      frame = window.requestAnimationFrame(tick);
    }
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
