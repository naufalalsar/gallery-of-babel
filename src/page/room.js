import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// Placeholder for generateDisplayList function
// In a real application, this would come from '../service/page-helper'
const generateDisplayList = (pageNumber) => {
  // Example: For page 1, returns [1, 2, 3, 4]
  // For page 2, returns [5, 6, 7, 8], etc.
  const base = (pageNumber - 1) * 4;
  return [base + 1, base + 2, base + 3, base + 4];
};

// SVG line component, now manages its own stroke hover state
const HexagonLine = ({ x1, y1, x2, y2, onClick, onHoverChange, displayId }) => {
  const [isHoveredLocally, setIsHoveredLocally] = useState(false); // New local state for this line's hover

  return (
    <g
      onClick={onClick}
      onMouseEnter={() => {
        setIsHoveredLocally(true);       // Set this line's hover state to true
        onHoverChange(displayId);        // Report this line's displayId to parent
      }}
      onMouseLeave={() => {
        setIsHoveredLocally(false);      // Set this line's hover state to false
        onHoverChange(null);             // Report no line is specifically hovered (for central text)
      }}
      style={{ cursor: 'pointer' }}
    >
      {/* Invisible rectangle to make the hover area larger and more reliable */}
      <rect
        x={Math.min(parseFloat(x1), parseFloat(x2)) - 5}
        y={Math.min(parseFloat(y1), parseFloat(y2)) - 5}
        width={Math.abs(parseFloat(x2) - parseFloat(x1)) + 10}
        height={Math.abs(parseFloat(y2) - parseFloat(y1)) + 10}
        fill="transparent"
      />
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        strokeWidth="4"
        // Stroke color now depends on this line's local hover state
        style={{
          transition: 'stroke 0.3s ease-in-out',
          stroke: isHoveredLocally ? 'white' : 'gray', // Only this line turns white
        }}
        onClick={onClick} // Keep onClick for line click functionality
      />
    </g>
  );
};

export function RoomPage() {
  const { roomNumber } = useParams();
  const navigate = useNavigate();

  // Helper function to get a valid initial page number, defaulting to 1
  const getInitialPage = () => {
    const num = parseInt(roomNumber, 10);
    // If roomNumber is a number and is 1 or greater, use it. Otherwise, default to 1.
    // Ensure it's never 0 or less.
    return !isNaN(num) && num >= 1 ? num : 1;
  };

  const [pageNumber, setPageNumber] = useState(getInitialPage());
  // State to track which specific display ID is currently hovered for the central text
  const [hoveredDisplayId, setHoveredDisplayId] = useState(null);

  const displayIds = generateDisplayList(pageNumber);

  // Effect to update the input if the URL changes (e.g., browser back/forward)
  useEffect(() => {
    setPageNumber(getInitialPage());
  }, [roomNumber]);

  // Handler to prevent the input value from going below 1
  const handlePageChange = (e) => {
    const value = e.target.value;
    // Allow the user to clear the input, otherwise only accept numbers >= 1
    const parsedValue = parseInt(value, 10);

    // Only update if value is empty (allowing user to clear) or if it's a number >= 1
    if (value === '' || (!isNaN(parsedValue) && parsedValue >= 1)) {
      setPageNumber(value);
    }
  };

  // Handler to reset the value to 1 if the input is left empty or invalid
  const handleBlur = () => {
    const parsedValue = parseInt(pageNumber, 10);
    if (pageNumber === '' || isNaN(parsedValue) || parsedValue < 1) {
      setPageNumber(1);
    }
  };

  // This function navigates to the correct display page
  const handleSideClick = (displayIndex) => {
    const displayId = displayIds[displayIndex];
    navigate(`/display/${displayId}`);
  };

  // Inferred center coordinates for the hexagon, where the text will appear
  const hexagonCenterX = 50;
  const hexagonCenterY = 50;

  return (
    <div className="bg-black flex items-center justify-center min-h-screen text-white antialiased">
      <div className="w-1/2 max-w-xs text-white">
        <div className="mb-6 text-center">
          <label htmlFor="pageNumberInput" className="block mb-2 text-sm font-medium text-white-400">Room Number</label>
          <textarea // Changed from <input> to <textarea>
            id="pageNumberInput"
            value={pageNumber}
            onChange={handlePageChange}
            onBlur={handleBlur} // Resets to 1 if left empty or invalid
            rows="1" // Initial number of rows
            className="block w-full bg-black text-white text-center font-bold py-3 px-4 border-2 border-white transition-colors duration-300 ease-in-out hover:bg-white hover:text-black focus:bg-white focus:text-black focus:outline-none focus:ring-0 resize-y" // Added resize-y class
          />
        </div>

        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Main group for the hexagon content */}
          <g>
            {/* Render Hexagon Lines. Each line now handles its own stroke color. */}
            {/* onHoverChange is still passed to update the central text. */}
            <HexagonLine onClick={() => handleSideClick(0)} x1="32" y1="20" x2="68" y2="20" displayId={displayIds[0]} onHoverChange={setHoveredDisplayId} />
            <HexagonLine onClick={() => handleSideClick(1)} x1="88" y1="52" x2="72" y2="78" displayId={displayIds[1]} onHoverChange={setHoveredDisplayId} />
            <HexagonLine onClick={() => handleSideClick(2)} x1="68" y1="80" x2="32" y2="80" displayId={displayIds[2]} onHoverChange={setHoveredDisplayId} />
            <HexagonLine onClick={() => handleSideClick(3)} x1="12" y1="48" x2="28" y2="22" displayId={displayIds[3]} onHoverChange={setHoveredDisplayId} />

            {/* Text displayed inside the hexagon when any line is hovered */}
            {hoveredDisplayId !== null && (
              <text
                x={hexagonCenterX}
                y={hexagonCenterY}
                fill="white"
                fontSize="3" // Adjust font size as needed for visibility
                textAnchor="middle" // Centers the text horizontally
                dominantBaseline="middle" // Centers the text vertically
              >
                {/* Use tspan for multi-line text */}
                <tspan x={hexagonCenterX} dy="-0.6em">See Display</tspan>
                <tspan x={hexagonCenterX} dy="1.5em">{hoveredDisplayId}</tspan>
              </text>
            )}
          </g>
        </svg>

        <div className="text-center mt-8">
            <a href="/" className="inline-block bg-black hover:bg-white hover:text-black text-white font-bold py-3 px-4 border-2 border-white transition-colors duration-300 ease-in-out">
                Go Back
            </a>
        </div>
      </div>
    </div>
  );
}

export default RoomPage;
