"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface ThermometerProps {
	progress: number;
	goal: number;
	balance: number;
	loading: boolean;
}

export function Thermometer({
	goal,
	balance,
	loading = false,
	progress: externalProgress,
}: ThermometerProps) {
	const [time, setTime] = useState(0);
	const requestRef = useRef<number>(0);
	const [progress, setProgress] = useState(externalProgress || 0); // Default to 50% if not provided

	// Animation loop for flowing effect
	useEffect(() => {
		const animate = () => {
			setTime((prevTime) => prevTime + 0.01);
			requestRef.current = requestAnimationFrame(animate);
		};

		requestRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(requestRef.current);
	}, []);

	// Update progress when external progress changes
	useEffect(() => {
		if (externalProgress !== undefined) {
			setProgress(externalProgress);
		}
	}, [externalProgress]);

	// Calculate mercury height based on progress
	const mercuryHeight = Math.max(0, Math.min(220, (220 * progress) / 100));

	// Generate measurement lines
	const measurementLines = Array.from({ length: 11 }).map((_, i) => {
		const y = 42 + (220 - (220 / 10) * i);
		const width = i % 5 === 0 ? 10 : 5;

		return (
			<line
				key={i}
				x1={35 - width}
				y1={y}
				x2={45 + width}
				y2={y}
				stroke="#333"
				strokeWidth={i % 5 === 0 ? 2 : 1}
			/>
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
		<div className="relative flex flex-col items-center">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="relative"
			>
				<svg
					width="80"
					height="300"
					viewBox="0 0 80 300"
					style={{
						imageRendering: "pixelated",
					}}
					aria-label="Thermometer"
				>
					<defs>
						<linearGradient id="mercuryGradientTube" x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="0%" stopColor="#FF5E5B" />
							<stop offset="25%" stopColor="#FF9E5B" />
							<stop offset="50%" stopColor="#FFDB5B" />
							<stop offset="75%" stopColor="#8AFF5B" />
						</linearGradient>

						<linearGradient id="mercuryGradientBulb" x1="0%" y1="0%" x2="0%" y2="100%">
							<stop offset="75%" stopColor="#8AFF5B" />
							<stop offset="100%" stopColor="#5BD3FF" />
						</linearGradient>

						<clipPath id="tubePath">
							<rect x="33" y="41" width="15" height="212" rx="6" />
						</clipPath>
					</defs>

					{/* Background */}
					<rect x="0" y="0" width="80" height="300" fill="transparent" />

					{/* Thermometer tube background */}
					<rect
						x="32"
						y="40"
						width="16"
						height="220"
						rx="8"
						fill="#f0f0f0"
						stroke="#333"
						strokeWidth="2"
					/>

					{/* Measurement lines */}
					{measurementLines}

					{/* Percentage labels */}
					{percentagePositions.map(({ percent, y }) => (
						<text key={percent} x="15" y={y + 4} fontSize="10" textAnchor="end" fill="#333">
							{percent}
						</text>
					))}

					{/* Mercury in tube */}
					{mercuryHeight > 0 && (
						<rect
							x="33"
							y={260 - mercuryHeight}
							width="14"
							height={mercuryHeight}
							fill="url(#mercuryGradientTube)"
							clipPath="url(#tubePath)"
						/>
					)}

					{/* Bulb outline */}
					<circle cx="40" cy="260" r="20" fill="#f0f0f0" stroke="#333" strokeWidth="2" />

					{/* Mercury in bulb */}
					<circle
						cx="40"
						cy="260"
						r="19"
						fill={mercuryHeight > 0 ? "url(#mercuryGradientBulb)" : "#f0f0f0"}
					/>

					{/* Bubbles */}
					{bubbles}

					{/* Glass shine effect */}
					<ellipse cx="36" cy="250" rx="5" ry="8" fill="rgba(255, 255, 255, 0.3)" />
				</svg>

				{/* Current value indicator */}
				{progress > 0 && (
					<motion.div
						className="absolute right-0 w-3 h-3 bg-green-500"
						style={{
							top: `${Math.min(
								Math.max(
									260 - mercuryHeight, // Position aligned with mercury level
									20,
								),
								370,
							)}px`,
							clipPath: "polygon(0% 50%, 100% 0%, 100% 100%)", // Reversed triangle pointing left
						}}
						initial={{ x: -10, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ delay: 0.5 }}
					/>
				)}
			</motion.div>

			<button
				onClick={() => {
					setProgress((prev) => Math.min(prev + 10, 100));
				}}
				type="button"
				className="mt-4 px-3 py-1 bg-green-600 text-white rounded text-sm"
			>
				Increase
			</button>

			{loading && (
				<div className="absolute inset-0 flex items-center justify-center bg-white/50">
					<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
				</div>
			)}
		</div>
	);
}
