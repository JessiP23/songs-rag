import React, { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';

export default function StarRating() {

    const [rating, setRating] = useState(null);
    const [rateColor, setColor] = useState(null);

    return (
        <>
            {[...Array(5)].map((star, index) => {
                const currentRate = index + 1
                return (
                    <>
                        <label>
                            <StarIcon sx={{ fontSize: '80px', margin: '8px'}} />
                        </label>
                        
                    </>
                )
            })}
        </>
    )
}