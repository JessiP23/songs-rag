'use client'

import Header from "@/components/Header";
import Image1 from '../images/home.jpg'
import Image2 from '../images/home1.jpg'
import Image from "next/image";
import MusicVideoIcon from '@mui/icons-material/MusicVideo'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import SpatialAudioOffIcon from '@mui/icons-material/SpatialAudioOff';
import StarRating from "@/components/StarRating";
import Footer from "@/components/Footer";
import { useUser, SignInButton, UserButton } from "@clerk/clerk-react";
import Link from "next/link";

// home page for allowing to authenticate before having access to the app itself. 
export default function Home() {
  const {isSignedIn, user} = useUser();
  return (
    <div className="flex flex-col items-center p-4 w-full min-h-screen">
  {/* Title and description of app */}
  <div className="flex flex-col md:flex-row mb-8 w-full max-w-6xl">
    {/* Frontend landing page for Rate My Song AI */}
    <div className="md:w-1/2 flex flex-col justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Rate My Song</h1>
      <p className="text-lg text-gray-600 mb-4">Discover new music and rate your favorite songs!</p>
      <p className="text-lg text-gray-600 mb-4">Join our community of music lovers</p>
      <p className="text-lg text-gray-600 mb-4">Rate your songs</p>
      {isSignedIn ? (
        <Link href="/dashboard">
          <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded shadow-md">
            Go to Dashboard
          </button>
        </Link>
      ) : (
        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
          <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded shadow-md">
            Sign up for free
          </button>
        </SignInButton>
      )}
    </div>
    {/* Spacing for images in the initial screen */}
    <div className="md:w-1/2 relative mt-8 md:mt-0">
      <Image src={Image1} className="w-full h-64 md:h-screen object-cover rounded-lg shadow-md" alt="" />
      <Image src={Image2} className="absolute bottom-4 left-4 w-full md:w-1/2 h-64 md:h-96 object-cover rounded-lg shadow-md" alt="" />
    </div>
  </div>

  {/* Star rating animation for better UI design */}
  <div className="text-center pt-12">
    <StarRating />
  </div>

  {/* Feature section */}
  <div className="mt-12">
    <h1 className="text-2xl text-center pb-8">Features</h1>
    {/* Feature list */}
    <div className="flex flex-wrap justify-center">
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-full md:w-72 m-4">
        <MusicVideoIcon sx={{ fontSize: '30px', marginBottom: '12px' }} />
        <p className="text-lg text-gray-600 text-center">Discover new music</p>
      </div>
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-full md:w-72 m-4">
        <StarHalfIcon sx={{ fontSize: '30px', marginBottom: '12px' }} />
        <p className="text-lg text-gray-600 text-center">Rate your favorite songs</p>
      </div>
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-full md:w-72 m-4">
        <SpatialAudioOffIcon sx={{ fontSize: '30px', marginBottom: '12px' }} />
        <p className="text-lg text-gray-600 text-center">Interact with music lovers</p>
      </div>
    </div>
  </div>

  <div className="mt-12">
    <Footer />
  </div>
</div>
  )
}