import React, {useState, useEffect} from "react";

const Dashboard = () => {
    const [songs, setSongs] = useState([]);
    const [ratings, setRatings] = useState({});

    const handleRating = (songId, rating) => {
        fetch('/api/ratings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ songId, rating }),
        }).then(response => {
            if (response.ok) {
                setRatings(prevRatings => ({ ...prevRatings, [songId]: rating }));
            }
        });
    };

    return(
        <div>
            <h1>Rate your songs</h1>
            {songs.map(song => (
                <div key={song.id}>
                    <h2>{song.title}</h2>
                    <p>Artist: {song.channel} </p>
                    <p><a href={song.link} target="_blank" rel="noopener noreferrer">Watch on Youtube</a></p>
                    <div>
                        <button onClick={() => handleRating(song.id, 'like')}>Like</button>
                        <button onClick={() => handleRating(song.id, 'dislike')}>Dislike</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Dashboard;