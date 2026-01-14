import React from "react";

export default function Home() {
  const lines = Array.from({ length: 3 });
  return (
    <>
      <div className="relative w-full h-3 overflow-hidden rounded-md bg-gradient-to-r from-[#0b0b0f] to-[#322f75]">
        {lines.map((_, i) => (
          <span
            key={i}
            className="absolute top-0 h-1 w-40
              bg-gradient-to-r from-white/40 to-transparent
              animate-[sweep_6s_linear_infinite]"
            style={{
              top: `${i * 20 + 10}px`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      <style jsx>{`
        @keyframes sweep {
          from {
            left: -150%;
          }
          to {
            left: 150%;
          }
        }
      `}</style>
    </>
  );
}



 

  
