"use client";

import { motion } from "framer-motion";

export default function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main Grid */}
      <motion.div
        className="absolute inset-[-20%]"
        animate={{
          x: [-25, 25, -25],
          y: [-15, 15, -15],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Secondary Grid */}
      <motion.div
        className="absolute inset-[-20%]"
        animate={{
          x: [20, -20, 20],
          y: [15, -15, 15],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "140px 140px",
        }}
      />

      {/* Scan Line */}
      <motion.div
        className="absolute inset-x-0 h-40"
        animate={{
          y: ["-20%", "120%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(59,130,246,.08), transparent)",
          filter: "blur(18px)",
        }}
      />

      {/* Blue Glow */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full"
        animate={{
          x: ["15%", "55%", "15%"],
          y: ["20%", "30%", "20%"],
          scale: [1, 1.25, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,.18), transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Top Light */}
      <motion.div
        className="absolute left-1/2 top-0 h-80 w-[900px] -translate-x-1/2"
        animate={{
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle at top, rgba(96,165,250,.22), transparent 75%)",
          filter: "blur(45px)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle, transparent 35%, rgba(0,0,0,.45) 100%)",
        }}
      />
    </div>
  );
}
