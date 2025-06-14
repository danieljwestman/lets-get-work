
import React from "react";

export const FloatingBubbles = React.memo(() => {
  console.log("FloatingBubbles rendered");
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Spread bubbles across different areas of the screen */}
      
      {/* Top area bubbles */}
      <div className="absolute top-20 left-10 w-16 md:w-20 h-16 md:h-20 bg-gradient-to-r from-blue-300/40 to-blue-400/40 rounded-full shadow-xl animate-float-1"></div>
      <div className="absolute top-16 left-1/3 w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-pink-300/40 to-pink-400/40 rounded-full shadow-xl animate-float-3"></div>
      <div className="absolute top-24 right-1/4 w-6 md:w-8 h-6 md:h-8 bg-gradient-to-r from-yellow-300/50 to-yellow-400/50 rounded-full shadow-lg animate-float-4"></div>
      <div className="absolute top-10 right-20 w-9 md:w-11 h-9 md:h-11 bg-gradient-to-r from-emerald-300/40 to-emerald-400/40 rounded-full shadow-xl animate-float-1"></div>
      <div className="absolute top-1/8 right-1/6 w-4 md:w-5 h-4 md:h-5 bg-gradient-to-r from-lime-300/50 to-lime-400/50 rounded-full shadow-lg animate-float-7"></div>
      
      {/* Upper middle area bubbles */}
      <div className="absolute top-1/4 left-1/5 w-7 md:w-8 h-7 md:h-8 bg-gradient-to-r from-sky-300/40 to-sky-400/40 rounded-full shadow-xl animate-float-5"></div>
      <div className="absolute top-1/4 right-1/3 w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-indigo-300/50 to-indigo-400/50 rounded-full shadow-lg animate-float-6"></div>
      <div className="absolute top-1/3 left-2/5 w-8 md:w-10 h-8 md:h-10 bg-gradient-to-r from-teal-300/40 to-teal-400/40 rounded-full shadow-xl animate-float-2"></div>
      <div className="absolute top-1/3 right-1/5 w-12 md:w-14 h-12 md:h-14 bg-gradient-to-r from-violet-300/35 to-violet-400/35 rounded-full shadow-xl animate-float-4"></div>
      
      {/* Center area bubbles */}
      <div className="absolute top-1/2 left-1/6 w-6 md:w-7 h-6 md:h-7 bg-gradient-to-r from-orange-300/50 to-orange-400/50 rounded-full shadow-lg animate-float-3"></div>
      <div className="absolute top-1/2 left-3/5 w-9 md:w-11 h-9 md:h-11 bg-gradient-to-r from-rose-300/40 to-rose-400/40 rounded-full shadow-xl animate-float-8"></div>
      <div className="absolute top-1/2 right-1/6 w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-cyan-300/50 to-cyan-400/50 rounded-full shadow-lg animate-float-5"></div>
      
      {/* Lower middle area bubbles */}
      <div className="absolute top-2/3 left-1/4 w-11 md:w-13 h-11 md:h-13 bg-gradient-to-r from-fuchsia-300/35 to-fuchsia-400/35 rounded-full shadow-xl animate-float-6"></div>
      <div className="absolute top-2/3 right-2/5 w-7 md:w-9 h-7 md:h-9 bg-gradient-to-r from-amber-300/50 to-amber-400/50 rounded-full shadow-lg animate-float-1"></div>
      <div className="absolute top-2/3 right-10 w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-orange-300/50 to-orange-400/50 rounded-full shadow-lg animate-float-3"></div>
      
      {/* Bottom area bubbles */}
      <div className="absolute bottom-1/3 left-1/8 w-8 md:w-9 h-8 md:h-9 bg-gradient-to-r from-green-300/40 to-green-400/40 rounded-full shadow-xl animate-float-5"></div>
      <div className="absolute bottom-1/3 left-1/2 w-6 md:w-7 h-6 md:h-7 bg-gradient-to-r from-purple-300/50 to-purple-400/50 rounded-full shadow-lg animate-float-2"></div>
      <div className="absolute bottom-1/4 left-1/3 w-7 md:w-9 h-7 md:h-9 bg-gradient-to-r from-rose-300/40 to-rose-400/40 rounded-full shadow-xl animate-float-7"></div>
      <div className="absolute bottom-1/4 right-1/4 w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-blue-300/40 to-blue-400/40 rounded-full shadow-xl animate-float-4"></div>
      
      {/* Bottom edge bubbles */}
      <div className="absolute bottom-20 right-10 w-12 md:w-16 h-12 md:h-16 bg-gradient-to-r from-purple-300/40 to-purple-400/40 rounded-full shadow-xl animate-float-2"></div>
      <div className="absolute bottom-10 left-20 w-6 md:w-7 h-6 md:h-7 bg-gradient-to-r from-violet-300/50 to-violet-400/50 rounded-full shadow-lg animate-float-2"></div>
      <div className="absolute bottom-1/6 left-1/5 w-4 md:w-5 h-4 md:h-5 bg-gradient-to-r from-emerald-300/50 to-emerald-400/50 rounded-full shadow-lg animate-float-8"></div>
      <div className="absolute bottom-1/8 right-1/3 w-8 md:w-10 h-8 md:h-10 bg-gradient-to-r from-cyan-300/40 to-cyan-400/40 rounded-full shadow-xl animate-float-6"></div>
      
      {/* Additional scattered bubbles for better coverage */}
      <div className="absolute top-2/5 left-1/12 w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-indigo-300/50 to-indigo-400/50 rounded-full shadow-lg animate-float-1"></div>
      <div className="absolute top-3/5 right-1/12 w-7 md:w-8 h-7 md:h-8 bg-gradient-to-r from-pink-300/40 to-pink-400/40 rounded-full shadow-xl animate-float-3"></div>
      <div className="absolute bottom-2/5 left-2/3 w-6 md:w-7 h-6 md:h-7 bg-gradient-to-r from-yellow-300/50 to-yellow-400/50 rounded-full shadow-lg animate-float-7"></div>
      <div className="absolute top-1/6 left-1/2 w-4 md:w-5 h-4 md:h-5 bg-gradient-to-r from-teal-300/50 to-teal-400/50 rounded-full shadow-lg animate-float-4"></div>
    </div>
  );
});

FloatingBubbles.displayName = "FloatingBubbles";
