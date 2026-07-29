"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface MosaicTransitionProps {
  images: string[];
  interval?: number;
  rows?: number;
  cols?: number;
}

export default function MosaicTransition({
  images,
  interval = 7000,
  rows = 8,
  cols = 14,
}: MosaicTransitionProps) {
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevious(current);
      setCurrent((current + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [current, images.length, interval]);

  const tiles = useMemo(() => {
    const arr = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        arr.push({
          id: `${row}-${col}`,
          row,
          col,
          delay: Math.random() * 0.8,
        });
      }
    }

    return arr;
  }, [current, rows, cols]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Previous image */}
      <motion.div
        key={previous}
        className="absolute inset-0"
        animate={{
          scale: 1.08,
          filter: "blur(8px)",
          opacity: 0,
        }}
        transition={{
          duration: 1.8,
          ease: "easeInOut",
        }}
        style={{
          backgroundImage: `url(${images[previous]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Current Image */}
      <motion.div
        key={`bg-${current}`}
        className="absolute inset-0"
        initial={{
          scale: 1,
        }}
        animate={{
          scale: 1.08,
        }}
        transition={{
          duration: interval / 1000,
          ease: "linear",
        }}
        style={{
          backgroundImage: `url(${images[current]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Mosaic Reveal */}
      <AnimatePresence mode="wait">
        <div
          key={current}
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${cols},1fr)`,
            gridTemplateRows: `repeat(${rows},1fr)`,
          }}
        >
          {tiles.map((tile) => (
            <motion.div
              key={tile.id}
              initial={{
                opacity: 1,
                scale: 1,
              }}
              animate={{
                opacity: 0,
                scale: 0.75,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.8,
                delay: tile.delay,
                ease: "easeInOut",
              }}
              style={{
                backgroundImage: `url(${images[previous]})`,
                backgroundSize: `${cols * 100}% ${rows * 100}%`,
                backgroundPosition: `${
                  (tile.col / (cols - 1)) * 100
                }% ${(tile.row / (rows - 1)) * 100}%`,
              }}
            />
          ))}
        </div>
      </AnimatePresence>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Blue Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-blue-950/30" />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,.18),transparent_65%)]" />
    </div>
  );
}
