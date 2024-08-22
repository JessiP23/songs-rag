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
            <h1 className="p-6 text-center">Song List</h1>
            <div
              className="flex flex-row overflow-x-auto"
              style={{
                width: '100%',
                height: '100%', 
                overflowX: 'auto', 
                padding: '20px',
                gap: '25px', 
              }}
            >
              {songs.map(song => (
                <Card key={song.id} className="w-72 m-7">
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
                    >
                      Listen Song
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          <div className="w-[30%] text-center font-bold">
            Number of songs: 
            <div className="text-3xl">
            {songs.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;