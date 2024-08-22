'use client'

import React, {useState, useEffect} from "react";
import axios from 'axios'

const Dashboard = () => {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        async function fetchSongs() {
            try {
                const response = await axios.get('/api/songs');
                setSongs(response.data);
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        }
        fetchSongs();
    }, [])

    return(
        <div>
            <h1>Top Songs</h1>
            <ul>
                {songs.map((song, index) => (
                    <li key={index}>
                        <a href={song.link} target="_blank" rel="noopener noreferrer">
                            {song.title} by {song.channel}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard;