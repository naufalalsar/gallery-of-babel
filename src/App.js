import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RoomPage } from './page/room.js';
import { DisplayPage } from "./page/display.js";

function HomePage() {
  return (
    <body class="bg-black flex items-center justify-center min-h-screen text-white antialiased">

    <div class="w-full max-w-lg p-8 space-y-8">
        
        {/* Non-Clickable SVG Hexagon */}
        <div class="w-32 h-32 mx-auto">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                {/* <!-- Top Side --> */}
                <line x1="32" y1="20" x2="68" y2="20" class="hexagon-side" stroke-width="4" />
                {/* <!-- Bottom-Right Side --> */}
                <line x1="88" y1="52" x2="72" y2="78" class="hexagon-side" stroke-width="4" />
                {/* <!-- Bottom Side --> */}
                <line x1="68" y1="80" x2="32" y2="80" class="hexagon-side" stroke-width="4" />
                {/* <!-- Top-Left Side --> */}
                <line x1="12" y1="48" x2="28" y2="22" class="hexagon-side" stroke-width="4" />
            </svg>
        </div>

        {/* Text Section */}
        <div class="text-center">
            <h1 class="text-lg font-bold text-white-400 mb-6 leading-relaxed">Welcome to Gallery of Babel,</h1>
            <p class="text-xs text-gray-300 mb-6 leading-loose">
                Where every image, painting, picture, drawing, carving, and any 2 dimensional thing made by human, AI, living being, inanimate thing, no one, nobody, and nothing is displayed.
            </p>
            <p class="text-[10px] text-gray-500 break-words leading-relaxed">
                This gallery contains about 256^(3)^(1920*1080) + 256^(3)^(1080*1920) + 256^(3)^(1080*1350) + 256^(3)^(1080*1080) + 256^(3)^(1620*1080) + 256^(3)^(1440*1080) "image" which is even bigger than Planck volume of the universe.
            </p>
        </div>

        {/* Button Section */}
        <div class="text-center">
            <a href="/room" class="inline-block bg-black hover:bg-white hover:text-black text-white font-bold py-3 px-4 border-2 border-white transition-colors duration-300 ease-in-out">
                Browse
            </a>
        </div>
    </div>

</body>
  );
}

// --- Main App Component (The Router) ---
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room/:roomNumber?" element={<RoomPage />} />
      <Route path="/display/:displayId" element={<DisplayPage />} />
    </Routes>
  );
}

export default App;
