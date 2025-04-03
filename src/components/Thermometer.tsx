"use client";

import { fundraisers } from "@/lib/constants";
import { useBalance } from "@/lib/hooks/useBalance";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { formatEther } from "viem";

interface ThermometerProps {
  fundraiserId?: string;
  // progress: number;
  // goal: number;
  // balance: number;
}

export function Thermometer({ fundraiserId }: ThermometerProps) {
  // const [progress, setProgress] = useState(externalProgress);
  const [time, setTime] = useState(0);
  const requestRef = useRef<number>(0);
  const fundraiser = fundraisers[0];

  const {
    data: balanceData,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useBalance(fundraiser.fundraiserAddress.address);
  const raised = balanceData ? balanceData.balance : "0";
  const progress = (Number(raised) / fundraiser.goal) * 100;

  // Animation loop for flowing effect
  useEffect(() => {
    const animate = () => {
      setTime((prevTime) => prevTime + 0.01);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Calculate mercury height based on progress
  const mercuryHeight = Math.max(0, Math.min(260, (260 * progress) / 100));

  // Generate measurement lines
  const measurementLines = Array.from({ length: 11 }).map((_, i) => {
    const y = 42 + (220 - (220 / 10) * i);
    const width = i % 5 === 0 ? 10 : 5;

    return (
      <line key={i} x1={35 - width} y1={y} x2={45 + width} y2={y} stroke="#333" strokeWidth={i % 5 === 0 ? 2 : 1} />
    );
  });

  // Generate bubbles for animation
  const bubbles = Array.from({ length: 5 }).map((_, i) => {
    const size = 2 + Math.sin(time + i) * 1;
    const xOffset = Math.sin(time * 2 + i * 5) * 4;
    const yOffset = mercuryHeight > 0 ? (time * 10 + i * 50) % mercuryHeight : 0;

    return (
      <circle
        key={i}
        cx={40 + xOffset}
        cy={260 - yOffset}
        r={size}
        fill="rgba(255, 255, 255, 0.6)"
        style={{
          display: mercuryHeight > 0 ? "block" : "none",
        }}
      />
    );
  });

  // Percentage values for display
  const percentagePositions = [0, 25, 50, 75, 100].map((percent) => ({
    percent,
    y: 40 + (220 - (220 * percent) / 100),
  }));

  return (
    <div className="relative flex flex-col justify-start h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-full flex items-center"
      >
        <svg
          width="100"
          height="350"
          viewBox="25 37 20 260"
          style={{
            imageRendering: "pixelated",
          }}
          aria-label="Fundraider Thermometer"
          aria-labelledby="Fundraider Thermometer"
          role="img"
        >
          <defs>
            <linearGradient id="mercuryGradientTube" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="75%" stopColor="#8AFF5B" />
              <stop offset="100%" stopColor="#5BD3FF" />
              <stop offset="50%" stopColor="#FFDB5B" />
              <stop offset="75%" stopColor="#8AFF5B" />
            </linearGradient>

            <linearGradient id="mercuryGradientBulb" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="25%" stopColor="#FF9E5B" />

              <stop offset="0%" stopColor="#FF5E5B" />
            </linearGradient>

            <clipPath id="tubePath">
              <rect x="32" y="41" width="16" height="212" rx="6" />
            </clipPath>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width="100" height="260" fill="transparent" />

          {/* Thermometer tube background */}
          <rect x="31" y="40" width="18" height="220" rx="8" fill="#f0f0f0" stroke="#333" strokeWidth="2" />

          {/* Measurement lines */}
          {measurementLines}

          {/* Percentage labels */}
          {percentagePositions.map(({ percent, y }) => (
            <text key={percent} x="17" y={y + 5} fontSize="10" textAnchor="end" fill="#333">
              {percent}
            </text>
          ))}

          {/* Mercury in tube */}
          {mercuryHeight > 0 && (
            <rect
              x="29"
              y={260 - mercuryHeight}
              width="23"
              height={mercuryHeight}
              fill="url(#mercuryGradientTube)"
              clipPath="url(#tubePath)"
            />
          )}

          {/* Bulb outline */}
          <circle cx="40" cy="260" r="20" fill="#f0f0f0" stroke="#333" strokeWidth="2" />

          {/* Mercury in bulb */}
          <circle cx="40" cy="260" r="19" fill={mercuryHeight > 0 ? "url(#mercuryGradientBulb)" : "#f0f0f0"} />

          {/* Bubbles */}
          {bubbles}

          {/* Glass shine effect */}
          <ellipse cx="36" cy="250" rx="5" ry="8" fill="rgba(255, 255, 255, 0.3)" />
        </svg>

        {/* Current value indicator */}
        {progress > 0.0 && (
          <motion.div
            className="absolute right-6 flex items-center bg-green-500"
            style={{
              top: `${Math.min(
                Math.max(
                  260 - mercuryHeight, // Align with current progress percentage
                  1, // Minimum position (top of thermometer)
                ),
                370, // Maximum position (bottom of thermometer)
              )}px`,
              clipPath: "polygon(0% 50%, 100% 0%, 100% 100%)",
            }}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="bg-teal-500 text-white px-2 py-2 rounded" />
          </motion.div>
        )}
      </motion.div>

      {/* <button
        type="button"
        onClick={() => setProgress((currentProgress) => currentProgress + 10)}
      >
        increase
      </button> */}

      {/* {loading && (
				<div className="absolute inset-0 flex items-center justify-center bg-white/50">
					<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
				</div>
			)} */}
    </div>
  );
}
