'use client'

import React, { useState, useEffect } from "react";
import { where, query, collection, deleteDoc, getDocs, doc, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Header from "@/components/Header";
import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Button } from "@nextui-org/react";
import { db } from "@/firebaseConfig";
import { useUser, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useClerk } from "@clerk/nextjs";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row w-full space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 overflow-x-auto bg-white rounded-lg shadow-lg">
          <h1 className="p-6 text-center mb-6 font-bold text-3xl text-gray-800 border-b border-gray-200">Song List</h1>
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
                className="w-full sm:w-80 md:w-72 lg:w-60 m-4 border border-gray-300 rounded-lg shadow-md p-4 bg-white"
                style={{
                  flex: '0 0 auto',
                  marginRight: '20px',
                }}
              >
                <CardHeader className="flex gap-3 items-center">
                  <div className="flex flex-col">
                    <p className="text-xl font-semibold text-gray-900">{song.title}</p>
                    <p className="text-sm text-gray-500">{song.channel}</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className="text-gray-700">{song.description}</p>
                </CardBody>
                <Divider />
                <CardFooter className="flex flex-col sm:flex-row sm:justify-between items-center">
                  <Link
                    isExternal
                    showAnchorIcon
                    href={song.link}
                    className="text-red-500 hover:text-red-700 mb-2 sm:mb-0"
                  >
                    Listen Song
                  </Link>
                  <div className="flex space-x-2">
                    <Button onClick={() => deleteSong(song.firestoreId)} className="text-red-600 hover:text-red-800">Delete</Button>
                    <Button onClick={() => addSongToGlobalPlatform(song)} className="text-blue-600 hover:text-blue-800">Add to Global Platform</Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">Analytics</h1>
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-600">Number of songs:</h2>
            <div className="text-4xl font-bold text-gray-900">{songs.length}</div>
          </div>
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-600">Number of comments:</h2>
            <div className="text-4xl font-bold text-gray-900">{commentCount}</div>
          </div>
          <div className="w-full h-64">
            <Line
              data={{
                labels: ['Songs', 'Comments'],
                datasets: [
                  {
                    label: 'Count',
                    data: [songs.length, commentCount],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                  },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
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
