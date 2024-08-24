'use client'

import React, { useState, useEffect } from "react";
import { where, query, collection, deleteDoc, getDocs, doc, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Header from "@/components/Header";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Button } from "@nextui-org/react";
import { db } from "@/firebaseConfig";
import { useUser, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useClerk } from "@clerk/nextjs";

const CardComponent = () => {
  const [songs, setSongs] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const { user } = useUser();
  const router = useRouter();
  const { signOut } = useClerk();

  const fetchSongs = async () => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.id);
      const userSongsRef = collection(userDocRef, 'songs');
      const q = query(userSongsRef);
      const querySnapshot = await getDocs(q);
      const songsList = querySnapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));
      setSongs(songsList);
      await fetchUserCommentsCount(); // Fetch comments count for the user
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const fetchUserCommentsCount = async () => {
    if (!user) return;

    try {
      const globalSongsRef = collection(db, 'globalSongs');
      const querySnapshot = await getDocs(globalSongsRef);
      const globalSongsList = querySnapshot.docs.map(doc => ({ firestoreId: doc.id, ...doc.data() }));

      let count = 0;

      for (const song of globalSongsList) {
        const commentsRef = collection(doc(db, 'globalSongs', song.firestoreId), 'comments');
        const commentsSnapshot = await getDocs(commentsRef);

        commentsSnapshot.forEach(commentDoc => {
          const commentData = commentDoc.data();
          if (commentData.userId === user.id) {
            count += 1;
          }
        });
      }

      setCommentCount(count);
    } catch (error) {
      console.error("Error fetching user comments count:", error);
    }
  };

  const addSong = async (newSong) => {
    try {
      const userDocRef = doc(db, 'users', user.id);
      const userSongsRef = collection(userDocRef, 'songs');
      await addDoc(userSongsRef, newSong);
      fetchSongs();
    } catch (error) {
      console.error("Error adding song:", error);
    }
  };

  const deleteSong = async (firestoreId) => {
    try {
      const userDocRef = doc(db, 'users', user.id);
      const songDocRef = doc(userDocRef, 'songs', firestoreId);
      await deleteDoc(songDocRef);
      fetchSongs();
    } catch (error) {
      console.error("Error deleting song:", error);
    }
  };

  const addSongToGlobalPlatform = async (song) => {
    try {
      await addDoc(collection(db, 'globalSongs'), { ...song, userId: user.id, likes: 0, dislikes: 0, comments: [] });
      console.log(`Song added to global platform: ${song.title}`);
    } catch (error) {
      console.error("Error adding song to global platform:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  useEffect(() => {
    fetchSongs();
  }, [user]);

  return (
    <div>
      <Header />
      <SignedIn>
        <div>
          <div className="flex flex-row w-full">
            <div className="flex-1 overflow-x-auto">
              <h1 className="p-6 text-center mb-10 font-bold text-4xl">Song List</h1>
              <div
                className="flex flex-row flex-wrap overflow-x-auto"
                style={{
                  width: '100%',
                  height: '400px',
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
                      <Button onClick={() => addSongToGlobalPlatform(song)} className="cursor-pointer">Add to Global Platform</Button>
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
              <h1 className="p-6 text-xl mt-12">Number of comments:</h1>
              <div className="text-5xl">
                {commentCount}
              </div>
            </div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <div className="text-center mb-4">
            <p className="text-lg text-gray-600">You are not authenticated. Click below to sign up or log in.</p>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
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

export default CardComponent;
