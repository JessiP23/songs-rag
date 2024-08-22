'use client'

import Header from "@/components/Header";
import Image1 from '../images/home.jpg'
import Image2 from '../images/home1.jpg'
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <div className="h-screen flex flex-col items-center p-4 w-full">
        {/* Title and description of app */}
        <div className="flex flex-row mb-4 w-full">
        <div className="w-[40vw] flex flex-col justify-center p-8">
          <h1 className="text-4xl font-bold mb-8">Rate My Song</h1>
          <p className="text-lg text-gray-600 mb-6">Discover new music and rate your favorite songs!</p>
          <p className="text-lg text-gray-600 mb-6">Join our community of music lovers</p>
          <p className="text-lg text-gray-600 mb-6">Rate your songs</p>
          <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded shadow-md">Sign up for free</button>
        </div>
          {/* spacing for images in initial screen */}
          <div className="w-[60vw] relative">
            <Image src={Image1} className="w-full h-screen object-cover rounded-lg shadow-md" />
            <Image src={Image2} className="absolute bottom-4 left-4 w-1/2 h-96 object-cover rounded-lg shadow-md" />
          </div>
        </div>
      </div>
      {/* feature section */}
      <div className="mt-[20%]">
      <h1 className="text-2xl text-center">Features</h1>  
        {/* feature list */}
        <div className="flex flex-wrap justify-center">
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md w-64 m-4">
            <i className="fas fa-music text-3xl text-gray-600" />
            <p className="text-lg text-gray-600">Discover new music</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md w-64 m-4">
            <i className="fas fa-star text-3xl text-gray-600" />
            <p className="text-lg text-gray-600">Rate your favorite songs</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md w-64 m-4">
            <i className="fas fa-chart-bar text-3xl text-gray-600" />
            <p className="text-lg text-gray-600">Explore music trends</p>
          </div>
        </div>
        </div>
    </div>
  )
}