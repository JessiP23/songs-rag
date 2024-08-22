'use client'

import React, {useState, useEffect} from "react";
import { db } from "@/firebaseConfig";
import {collection, getDocs} from 'firebase/firestore'
import Header from "@/components/Header";
import CardComponent from "@/components/Card";
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";

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
          <Header />
          <div>
            <div className="flex flex-row w-full">
              <div className="flex-1 overflow-x-auto">
                <h1>Song Recommendations</h1>
                <div className="flex flex-row">
                  {songs.map(song => (
                    <Card key={song.id} className="max-w-[400px] mr-4">
                      <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                          <p className="text-md">{song.title}</p>
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
              <div className="w-60 text-right">
                Number of songs: {songs.length}
              </div>
            </div>
          </div>
        </div>
    );
};
        
export default Dashboard;