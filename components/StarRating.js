import React from 'react';
import StarIcon from '@mui/icons-material/Star';

export default function StarRating() {
    return (
        <>
            {[...Array(5)].map(star => {
                return (
                    <StarIcon />
                )
            })}
        </>
    )
}