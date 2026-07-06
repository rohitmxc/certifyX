import React from 'react';

const CHAR_MAP: Record<string, string[]> = {
  C: [
    "01110",
    "10001",
    "10000",
    "10000",
    "10000",
    "10001",
    "01110"
  ],
  E: [
    "11111",
    "10000",
    "10000",
    "11110",
    "10000",
    "10000",
    "11111"
  ],
  R: [
    "11110",
    "10001",
    "10001",
    "11110",
    "10100",
    "10010",
    "10001"
  ],
  T: [
    "11111",
    "00100",
    "00100",
    "00100",
    "00100",
    "00100",
    "00100"
  ],
  I: [
    "11111",
    "00100",
    "00100",
    "00100",
    "00100",
    "00100",
    "11111"
  ],
  F: [
    "11111",
    "10000",
    "10000",
    "11110",
    "10000",
    "10000",
    "10000"
  ],
  Y: [
    "10001",
    "10001",
    "10001",
    "01110",
    "00100",
    "00100",
    "00100"
  ],
  X: [
    "10001",
    "10001",
    "01010",
    "00100",
    "01010",
    "10001",
    "10001"
  ],
  " ": [
    "00000",
    "00000",
    "00000",
    "00000",
    "00000",
    "00000",
    "00000"
  ]
};

interface DotMatrixLogoProps {
  text?: string;
  dotSize?: number;
  gap?: number;
  color?: string;
  className?: string;
}

export const DotMatrixLogo: React.FC<DotMatrixLogoProps> = ({ 
  text = "CERTIFYX", 
  dotSize = 4, 
  gap = 1.5, 
  color = "#000000",
  className = "" 
}) => {
  const letters = text.toUpperCase().split("");
  
  // Calculate SVG dimensions
  const rows = 7;
  const colsPerLetter = 5;
  const letterWidth = (colsPerLetter * dotSize) + ((colsPerLetter - 1) * gap);
  const letterSpacing = dotSize * 2;
  const totalWidth = letters.length * letterWidth + (letters.length - 1) * letterSpacing;
  const totalHeight = (rows * dotSize) + ((rows - 1) * gap);

  return (
    <svg 
      width={totalWidth} 
      height={totalHeight} 
      viewBox={`0 0 ${totalWidth} ${totalHeight}`} 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes pulse-x {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          .animate-x {
            animation: pulse-x 2s infinite ease-in-out;
          }
        `}
      </style>
      {letters.map((letter, letterIndex) => {
        const matrix = CHAR_MAP[letter] || CHAR_MAP[" "];
        const offsetX = letterIndex * (letterWidth + letterSpacing);
        const isX = letter === 'X';
        const dotColor = isX ? "#ff0000" : color;
        const dotClass = isX ? "animate-x" : "";
        
        return matrix.map((row, rowIndex) => (
          <React.Fragment key={`l${letterIndex}-r${rowIndex}`}>
            {row.split("").map((dot, colIndex) => {
              if (dot === "1") {
                const cx = offsetX + (colIndex * (dotSize + gap)) + (dotSize / 2);
                const cy = (rowIndex * (dotSize + gap)) + (dotSize / 2);
                // For X, let's stagger the animation slightly based on row/col for a cool effect
                const animDelay = isX ? `${(rowIndex + colIndex) * 0.1}s` : "0s";

                return (
                  <circle 
                    key={`l${letterIndex}-r${rowIndex}-c${colIndex}`}
                    cx={cx} 
                    cy={cy} 
                    r={dotSize / 2} 
                    fill={dotColor} 
                    className={dotClass}
                    style={{ animationDelay: animDelay }}
                  />
                );
              }
              return null;
            })}
          </React.Fragment>
        ));
      })}
    </svg>
  );
};
