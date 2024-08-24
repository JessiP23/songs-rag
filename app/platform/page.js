'use client'

import React, { useState, useEffect } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from "@/firebaseConfig";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Link } from "@nextui-org/react";
import Header from "@/components/Header";
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import CommentsSection from "@/components/comment";
import { Typography } from "@mui/material";


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
                <div className="p-6">
                    <h1 className="text-center mb-10 font-bold text-4xl">Global Song Platform</h1>
                    <div
                        className="flex flex-wrap justify-center"
                        style={{
                            width: '100%',
                            padding: '20px',
                            overflowX: 'auto',
                        }}
                    >
                        {/* Retrieving data coming from songs */}
                        {globalSongs.map((song) => (
                            <Card
                                key={song.firestoreId}
                                className="w-full sm:w-72 md:w-80 lg:w-96 m-4 border border-gray-200 rounded-md shadow-md"
                                style={{
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* distributing data */}
                                <CardHeader className="flex gap-3 p-4 bg-gray-100 border-b border-gray-300">
                                    {/* distribute data from firebase */}
                                    <div className="flex flex-col">
                                        <Typography variant="h6" className="text-2xl font-bold truncate" style={{ overflowWrap: 'break-word' }}>
                                            {song.title}
                                        </Typography>
                                        <Typography variant="body2" className="text-sm text-gray-600 truncate" style={{ overflowWrap: 'break-word' }}>
                                            {song.channel}
                                        </Typography>
                                    </div>
                                </CardHeader>
                                <Divider />
                                <CardBody className="p-4 flex flex-col overflow-auto">
                                    <div className="mb-4">
                                        <Link
                                            href={song.link}
                                            className="text-red-500"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Listen Song
                                        </Link>
                                    </div>
                                    <div className="bg-gray-50 border-t border-gray-200 p-2 rounded-md flex-grow">
                                        <Typography variant="h6" className="font-bold text-lg mb-2">Comments</Typography>
                                        <CommentsSection songId={song.firestoreId} />
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </SignedIn>
            {/* unauthorized users might show a page for logging into the app */}
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
