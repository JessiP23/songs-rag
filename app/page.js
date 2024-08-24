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
    <div>
      <div className="h-screen flex flex-col items-center p-4 w-full">
        {/* Title and description of app */}
        <div className="flex flex-row mb-4 w-full">
          {/* frontend landing page for Rate My song ai */}
        <div className="w-[40vw] flex flex-col justify-center p-8">
          <h1 className="text-4xl font-bold mb-8">Rate My Song</h1>
          <p className="text-lg text-gray-600 mb-6">Discover new music and rate your favorite songs!</p>
          <p className="text-lg text-gray-600 mb-6">Join our community of music lovers</p>
          <p className="text-lg text-gray-600 mb-6">Rate your songs</p>
          {isSignedIn ? (
          <Link href="/dashboard">
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded shadow-md"
            >
              Go to Dashboard
            </button>
          </Link>
        ) : (
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <button
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded shadow-md"
            >
              Sign up for free
            </button>
          </SignInButton>
        )}
        </div>
        {/* spacing for images in initial screen */}
        <div className="w-[60vw] relative">
          <Image src={Image1} className="w-full h-screen object-cover rounded-lg shadow-md" alt="" />
          <Image src={Image2} className="absolute bottom-4 left-4 w-1/2 h-96 object-cover rounded-lg shadow-md" alt="" />
        </div>
      </div>
    </div>

    {/* star rating animation for better ui design. */}
      <div className="text-center pt-[20%]">
        <StarRating />
      </div>

      {/* feature section */}
      <div className="mt-[20%]">
        <h1 className="text-2xl text-center pb-12">Features</h1>  
        {/* feature list */}
        <div className="flex flex-wrap justify-center">
          <div className="flex flex-row items-center p-4 bg-white rounded-lg shadow-md w-72 m-4">
            <MusicVideoIcon sx={{ fontSize: '30px', marginRight: '16px' }} />
            <p className="text-lg text-gray-600">Discover new music</p>
          </div>
          <div className="flex flex-row items-center p-4 bg-white rounded-lg shadow-md w-72 m-4">
            <StarHalfIcon sx={{ fontSize: '30px', marginRight: '16px' }} />
            <p className="text-lg text-gray-600">Rate your favorite songs</p>
          </div>
          <div className="flex flex-row items-center p-4 bg-white rounded-lg shadow-md w-72 m-4">
            <SpatialAudioOffIcon sx={{ fontSize: '30px', marginRight: '16px' }} />
            <p className="text-lg text-gray-600">Interact with music lovers</p>
          </div>
        </div>
      </div>
      <div className="mt-[10%]">
      <Footer />
      </div>
    </div>
  )
}