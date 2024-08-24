import React, { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';

// feature of stars with css animation for frontend page for better visibility

export default function StarRating() {
  const [rateColor, setColor] = useState(null);

  // animation for hovering onto the stars
  const handleMouseEnter = (index) => {
    setColor(index + 1);
  };

  // comign back to normal when the mouse does not hover

  const handleMouseLeave = () => {
    setColor(null);
  };

  // array of stars

  return (
    <>
      {[...Array(5)].map((star, index) => {
        const currentRate = index + 1;
        const isHovered = rateColor === currentRate;

        return (
          <label
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {/* rotation animation */}
            <StarIcon
              sx={{
                fontSize: '80px',
                margin: '8px',
                transition: 'all 0.5s ease-in-out',
                transform: isHovered ? 'rotate(90deg) scale(1.2)' : 'none',
                color: isHovered ? 'yellow' : 'inherit',
              }}
            />
          </label>
        );
      })}
    </>
  );
}