import React, { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';

export default function StarRating() {
  const [rating, setRating] = useState(null);
  const [rateColor, setColor] = useState(null);

  const handleMouseEnter = (index) => {
    setColor(index + 1);
  };

  const handleMouseLeave = () => {
    setColor(null);
  };

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