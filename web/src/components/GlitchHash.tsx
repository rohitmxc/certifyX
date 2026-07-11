"use client";

import React, { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

export function GlitchHash({ hash }: { hash: string }) {
  const [displayText, setDisplayText] = useState(hash);
  const [isDecoded, setIsDecoded] = useState(true);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const startGlitch = () => {
      let iteration = 0;
      setIsDecoded(false);
      
      clearInterval(interval);
      interval = setInterval(() => {
        setDisplayText(
          hash
            .split('')
            .map((char, index) => {
              if (index < iteration) {
                return hash[index];
              }
              if (char === '.') return '.';
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );
        
        if (iteration >= hash.length) {
          clearInterval(interval);
          setIsDecoded(true);
        }
        
        iteration += 1 / 3;
      }, 30);
    };

    // Start a random periodic glitch to avoid IntersectionObserver bugs on CSS transformed parents
    const scheduleNextGlitch = () => {
      const nextGlitchInMs = 3000 + Math.random() * 8000; // random interval between 3-11 seconds
      setTimeout(() => {
        startGlitch();
        scheduleNextGlitch();
      }, nextGlitchInMs);
    };

    // Initial glitch on mount
    setTimeout(() => {
      startGlitch();
      scheduleNextGlitch();
    }, Math.random() * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [hash]);

  return (
    <span 
      ref={spanRef}
      className={`tracking-wider font-bold transition-all duration-300 ${isDecoded ? 'text-pure-black' : 'text-outline'}`}
    >
      {displayText}
    </span>
  );
}
