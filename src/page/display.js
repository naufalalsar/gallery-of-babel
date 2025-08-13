import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateImage } from '../service/image-generator';
import { generateArtworkDetails } from '../service/text-generator';

export function DisplayPage() {
  const { displayId } = useParams();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDisplayData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Parse displayId from URL, defaulting to 1 if not a valid number or less than 1
        const seed = displayId ? parseInt(displayId, 10) : 1;
        if (isNaN(seed) || seed < 1) {
          setError("Invalid Display ID. Please use a number greater than 0.");
          setIsLoading(false);
          setImageUrl(null);
          setMetadata(null);
          return;
        }

        // Generate image client-side using the Canvas API
        const imageData = await generateImage(seed);
        setImageUrl(imageData); // This will be a Data URL (Base64 string)

        // Generate metadata (artist, title, description) using the updated text generator
        const artMetadata = generateArtworkDetails(seed);
        setMetadata(artMetadata);

      } catch (err) {
        console.error("Failed to fetch display data:", err);
        setError("Failed to load display content. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisplayData();
  }, [displayId]); // Re-run this effect whenever the displayId in the URL changes

  // Function to calculate the room number based on displayId
  const calculateRoomNumber = (currentDisplayId) => {
    // The generateDisplayList function works like this:
    // For page 1, displays [1, 2, 3, 4]
    // For page 2, displays [5, 6, 7, 8]
    // ... and so on.
    // Each page covers 4 display IDs.
    // To find the page number for a given displayId:
    // (displayId - 1) / 4 gives us the zero-based page index.
    // Adding 1 converts it to a one-based page number.
    const roomNumber = Math.floor((parseInt(currentDisplayId, 10) - 1) / 4) + 1;
    return roomNumber;
  };

  const handleGoBack = () => {
    if (displayId) {
      const roomNumber = calculateRoomNumber(displayId);
      navigate(`/room/${roomNumber}`); // Navigate to the specific room page
    } else {
      navigate('/'); // Fallback to home if no displayId
    }
  };

  const handleDownload = () => {
    if (imageUrl && metadata && displayId) {
      // 1. Download the image
      const imageLink = document.createElement('a');
      imageLink.href = imageUrl;
      imageLink.download = `${metadata.title}.png`;
      document.body.appendChild(imageLink);
      imageLink.click();
      document.body.removeChild(imageLink);

      // 2. Prepare and download the description text file
      const descriptionContent = `Title : ${metadata.title}\nArtist Name : ${metadata.artistName}\nDescription : ${metadata.description}\nDisplay Number : ${displayId}`;
      const textBlob = new Blob([descriptionContent], { type: 'text/plain' });
      const textLink = document.createElement('a');
      textLink.href = URL.createObjectURL(textBlob);
      textLink.download = `artwork_details_${displayId}.txt`;
      document.body.appendChild(textLink);
      textLink.click();
      document.body.removeChild(textLink);
      URL.revokeObjectURL(textLink.href); // Clean up the object URL
    }
  };

  return (
    <div className="bg-black flex flex-col items-center justify-center min-h-screen text-white antialiased p-4">
      <div className="w-full max-w-2xl rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-center mb-6">Display {displayId}</h1>

        {isLoading && (
          <div className="text-center text-lg">Loading display content...</div>
        )}

        {error && (
          <div className="text-center text-red-500 text-lg mb-4">{error}</div>
        )}

        {/* Display content only when not loading and no errors */}
        {!isLoading && !error && (
          <div className="flex flex-col items-center">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={`Generated artwork for Display ${displayId}`}
                // Removed rounded-md to eliminate border smoothing
                className="w-full h-auto mb-6"
                // Fallback for image loading errors
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop if fallback also fails
                  e.target.src = "https://placehold.co/600x400/555/eee?text=Image+Load+Error";
                }}
              />
            )}

            {metadata && (
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">{metadata.title}</h2>
                <p className="text-gray-400 mb-2">By: {metadata.artistName}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{metadata.description}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-center flex justify-center space-x-4"> {/* Added flex and space-x-4 for button layout */}
        <button
          onClick={handleGoBack} // Call the handleGoBack function
          className="inline-block bg-black hover:bg-white hover:text-black text-white font-bold py-3 px-4 border-2 border-white transition-colors duration-300 ease-in-out rounded-lg"
        >
          Go Back
        </button>
        <button
          onClick={handleDownload} // New download button
          className="inline-block bg-black hover:bg-white hover:text-black text-white font-bold py-3 px-4 border-2 border-white transition-colors duration-300 ease-in-out rounded-lg"
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default DisplayPage;