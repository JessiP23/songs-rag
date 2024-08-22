'use client'

import React, { useState, useEffect } from "react";
import { collection, deleteDoc, getDocs, doc } from 'firebase/firestore';
import Header from "@/components/Header";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Button } from "@nextui-org/react";
import { db } from "@/firebaseConfig";

const CardComponent = () => {
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    const querySnapshot = await getDocs(collection(db, "songs"));
    const songsList = querySnapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
    setSongs(songsList);
  };

  // Example: Function to add a song, not inside useEffect
  const addSong = async (newSong) => {
    try {
      await addDoc(collection(db, 'songs'), newSong);
      fetchSongs(); // Refresh the list after adding a song
    } catch (error) {
      console.error("Error adding song:", error);
    }
  };

  // Example: Function to delete a song
  const deleteSong = async (firestoreId) => {
    try {
      const songDocRef = doc(db, 'songs', firestoreId);
      await deleteDoc(songDocRef);
      fetchSongs(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  useEffect(() => {
    fetchSongs(); // Fetch songs initially when the component loads
  }, []); // Empty dependency array means it runs only once

  return (
    <div>
      <Header />
      <div>
        <div className="flex flex-row w-full">
          <div className="flex-1 overflow-x-auto">
            <h1 className="p-6 text-center mb-10 font-bold text-4xl">Song List</h1>
            <div
              className="flex flex-row flex-wrap overflow-x-auto"
              style={{
                width: '100%',
                height: '50%', 
                overflowX: 'auto', 
                padding: '20px',
              }}
            >
              {songs.map((song) => (
                <Card
                  key={song.firestoreId}
                  className="w-72 m-7 border border-gray-200 rounded-md shadow-md p-4"
                  style={{
                    flex: '0 0 25%',
                    marginRight: '20px', 
                  }}
                >
                  <CardHeader className="flex gap-3">
                    <div className="flex flex-col">
                      <p className="text-2xl text-bold">{song.title}</p>
                      <p className="text-small text-default-500">{song.channel}</p>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <p>{song.description}</p>
                  </CardBody>
                  <Divider />
                  <CardFooter>
                    <Link
                      isExternal
                      showAnchorIcon
                      href={song.link}
                      className="text-red-500"
                    >
                      Listen Song
                    </Link>
                    <Button onClick={() => deleteSong(song.firestoreId)} className="cursor-pointer">Delete</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          <div className="w-[30%] text-center font-bold">
            <h1 className="p-6 text-xl mt-12">Number of songs:</h1>
            <div className="text-5xl">
            {songs.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
