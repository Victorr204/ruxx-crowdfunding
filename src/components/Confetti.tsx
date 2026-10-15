"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#DFA327", "#0E7C7B", "#CF6437", "#F5BB45", "#0A5F5E", "#FFF3D6"];

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rot: number;
  spin: number;
  wobble: number;
}

/** A small dependency-free confetti burst. */
export default function Confetti({ duration = 4200 }: { duration?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    const spawn = (initial: boolean): Piece => ({
      x: Math.random() * width,
      y: initial ? Math.random() * height : -20 - Math.random() * height * 0.4,
      vx: (Math.random() - 0.5) * 2.6,
      vy: 1.6 + Math.random() * 3.4,
      size: 6 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.24,
      wobble: Math.random() * Math.PI * 2,
    });

    const pieces: Piece[] = Array.from({ length: 150 }, () => spawn(true));

    let frame = 0;
    let raf = 0;
    const start = performance.now();

    const loop = (now: number) => {
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);

      for (const piece of pieces) {
        piece.wobble += 0.08;
        piece.x += piece.vx + Math.sin(piece.wobble) * 0.9;
        piece.y += piece.vy;
        piece.vy += 0.02;
        piece.rot += piece.spin;

        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rot);
        context.fillStyle = piece.color;
        context.globalAlpha = piece.y > height * 0.75 ? 0.35 : 1;
        context.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * 0.6);
        context.restore();

        if (piece.y > height + 30) Object.assign(piece, spawn(false));
      }

      frame += 1;
      if (now - start < duration && frame < 60 * 12) {
        raf = requestAnimationFrame(loop);
      } else {
        context.clearRect(0, 0, width, height);
      }
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [duration]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
