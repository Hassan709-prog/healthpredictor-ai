import { useState } from "react";
import { cn } from "@/lib/utils";

export type BodyPart = "Head" | "Chest" | "Abdomen" | "Arms" | "Legs" | null;

interface BodyMapProps {
  onSelect: (part: BodyPart) => void;
  selectedPart: BodyPart;
  className?: string;
}

export function BodyMap({ onSelect, selectedPart, className }: BodyMapProps) {
  const [hovered, setHovered] = useState<BodyPart>(null);

  const getFill = (part: BodyPart) => {
    if (selectedPart === part) return "var(--color-primary)";
    if (hovered === part) return "color-mix(in oklch, var(--color-primary) 50%, transparent)";
    return "var(--color-muted)";
  };

  const handleMouseEnter = (part: BodyPart) => setHovered(part);
  const handleMouseLeave = () => setHovered(null);
  const handleClick = (part: BodyPart) => {
    onSelect(selectedPart === part ? null : part);
  };

  return (
    <div className={cn("relative flex justify-center items-center w-full min-h-[400px]", className)}>
      <svg
        viewBox="0 0 200 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-[400px]"
      >
        {/* Head */}
        <g
          onMouseEnter={() => handleMouseEnter("Head")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Head")}
          className="cursor-pointer transition-colors duration-200"
        >
          <ellipse cx="100" cy="40" rx="30" ry="35" fill={getFill("Head")} stroke="var(--color-border)" strokeWidth="2" />
        </g>

        {/* Chest */}
        <g
          onMouseEnter={() => handleMouseEnter("Chest")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Chest")}
          className="cursor-pointer transition-colors duration-200"
        >
          <path d="M70 80 Q100 90 130 80 L135 150 Q100 160 65 150 Z" fill={getFill("Chest")} stroke="var(--color-border)" strokeWidth="2" />
        </g>

        {/* Abdomen */}
        <g
          onMouseEnter={() => handleMouseEnter("Abdomen")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Abdomen")}
          className="cursor-pointer transition-colors duration-200"
        >
          <path d="M65 150 Q100 160 135 150 L125 220 Q100 230 75 220 Z" fill={getFill("Abdomen")} stroke="var(--color-border)" strokeWidth="2" />
        </g>

        {/* Arms */}
        <g
          onMouseEnter={() => handleMouseEnter("Arms")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Arms")}
          className="cursor-pointer transition-colors duration-200"
        >
          {/* Left Arm */}
          <path d="M70 80 Q50 80 40 100 L20 200 L40 205 L60 120 Z" fill={getFill("Arms")} stroke="var(--color-border)" strokeWidth="2" />
          {/* Right Arm */}
          <path d="M130 80 Q150 80 160 100 L180 200 L160 205 L140 120 Z" fill={getFill("Arms")} stroke="var(--color-border)" strokeWidth="2" />
        </g>

        {/* Legs */}
        <g
          onMouseEnter={() => handleMouseEnter("Legs")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick("Legs")}
          className="cursor-pointer transition-colors duration-200"
        >
          {/* Left Leg */}
          <path d="M75 220 L60 380 L85 385 L95 225 Z" fill={getFill("Legs")} stroke="var(--color-border)" strokeWidth="2" />
          {/* Right Leg */}
          <path d="M125 220 L140 380 L115 385 L105 225 Z" fill={getFill("Legs")} stroke="var(--color-border)" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}
