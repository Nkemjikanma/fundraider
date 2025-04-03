"use client";
import { useRef } from "react";

export const SplashContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const elementsRef = useRef(
    [...Array(5)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      rotation: Math.random() * 360,
    })),
  );
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Fixed position decorative elements */}
      <div
        className="absolute rounded-[60%] opacity-50 mix-blend-multiply"
        style={{
          top: "-50px",
          left: "-30px",
          width: "200px",
          height: "200px",
          backgroundColor: "#FF3366",
          transform: "rotate(-15deg)",
          zIndex: 100,
        }}
      />
      <div
        className="absolute rounded-[70%] opacity-50 mix-blend-multiply"
        style={{
          bottom: "-40px",
          right: "-20px",
          width: "350px",
          height: "350px",
          backgroundColor: "#00FFCC",
          transform: "rotate(25deg)",
        }}
      />
      <div
        className="absolute rounded-full opacity-50 mix-blend-multiply"
        style={{
          top: "30%",
          left: "70%",
          width: "280px",
          height: "280px",
          backgroundColor: "#FFD700",
          transform: "rotate(45deg)",
        }}
      />
      <div
        className="absolute rounded-[65%] opacity-50 mix-blend-multiply"
        style={{
          top: "60%",
          left: "-30px",
          width: "320px",
          height: "320px",
          backgroundColor: "#FF9933",
          transform: "rotate(-30deg)",
        }}
      />

      {/* Random position elements */}
      {elementsRef.current.map((elem, i) => (
        <div
          key={`medium-${i}`}
          className="absolute rounded-full opacity-40 mix-blend-multiply"
          style={{
            top: elem.top,
            left: elem.left,
            width: "150px",
            height: "150px",
            backgroundColor: [
              "#FF0066",
              "#00FF99",
              "#FF6600",
              "#33CCFF",
              "#FF99CC",
              "#66FF33",
              "#FF3366",
              "#00FFFF",
            ][i % 8],
            transform: `rotate(${elem.rotation}deg)`,
          }}
        />
      ))}

      <div className="relative flex flex-col items-center justify-center z-10">{children}</div>
    </div>
  );
};
