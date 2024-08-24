'use client'

import React, { useState, useEffect } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from "@/firebaseConfig";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Link } from "@nextui-org/react";
import Header from "@/components/Header";
import {useUser, SignedIn, SignedOut, SignInButtonk, useClerk, SignInButton} from '@clerk/nextjs';
import { useRouter } from "next/navigation";

const PlatformPage = () => {
    // state variable for variable songs
    const [globalSongs, setGlobalSongs] = useState([]);

    // add songs to globalSongs collection in firebase
    const fetchGlobalSongs = async () => {
        const querySnapshot = await getDocs(collection(db, "globalSongs"));
        const globalSongsList = querySnapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
        setGlobalSongs(globalSongsList);
    };

    useEffect(() => {
        fetchGlobalSongs(); // Fetch global songs initially when the component loads
    }, []); // Run once


    return (
        <div>
            <Header />
            <SignedIn>
            <h1 className="p-6 text-center mb-10 font-bold text-4xl">Global Song Platform</h1>
        <div
            className="flex flex-row flex-wrap overflow-x-auto"
            style={{
            width: '100%',
            height: '50%', 
            overflowX: 'auto', 
            padding: '20px',
            }}
        >
            {/* Retrieving data coming from songs */}
            {globalSongs.map((song) => (
            <Card
                key={song.firestoreId}
                className="w-72 m-7 border border-gray-200 rounded-md shadow-md p-4"
                style={{
                flex: '0 0 25%',
                marginRight: '20px', 
                }}
            >
                {/* Card configuration similar to songs users dashboard */}
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
            </SignedIn>
            <SignedOut>
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <div className="text-center mb-4">
            <p className="text-lg text-gray-600">You are not authenticated. Click below to sign up or log in.</p>
            <SignInButton mode="modal" forceRedirectUrl="/platform">
              <Button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded shadow-md mt-4">
                Sign up
              </Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
        </div>
    );
};

export default PlatformPage;