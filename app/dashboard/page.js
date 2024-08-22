'use client'

import React, {useState, useEffect} from "react";
import { db } from "@/firebaseConfig";
import {collection, getDocs} from 'firebase/firestore'

const Dashboard = () => {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        const fetchSongs = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, 'songs'));
            const songsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setSongs(songsData);
          } catch (error) {
            console.error("Error fetching songs: ", error);
          }
        };
    
        fetchSongs();
      }, []);

    return(
        <div>
            <h1>Song Recommendations</h1>
            <ul>
                {songs.map(song => (
                    <li key={song.id}>
                        <a href={song.link} target="_blank" rel="noopener noreferrer">{song.title}</a> by {song.channel}
                    </li>
                ))}
            </ul>
        </div>
    );
};
        
export default Dashboard;