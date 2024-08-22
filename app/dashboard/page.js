'use client'

import React, {useState, useEffect} from "react";
import { db } from "@/firebaseConfig";
import {collection, getDocs} from 'firebase/firestore'
import Header from "@/components/Header";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link} from "@nextui-org/react";

const CardComponent = () => {
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
                height: '20%', 
                overflowX: 'auto', 
                padding: '20px',
              }}
            >
              {songs.map(song => (
                <Card
                  key={song.id}
                  className="w-72 m-7 border border-gray-200 rounded-md shadow-md p-4"
                  style={{
                    flex: '0 0 25%', // Set the width of each card to 25%
                    marginRight: '20px', // Add some margin between cards
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