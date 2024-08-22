'use client'

import Header from "@/components/Header";
import Image1 from '../images/home.jpg'
import Image2 from '../images/home1.jpg'
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="h-screen flex flex-col items-center p-4 w-full">
        {/* Title and description of app */}
        <div className="flex flex-row mb-4 w-full">
          <div className="w-[40vw] flex flex-col justify-center p-4">
            <h1 className="text-3xl font-bold mb-4">Rate My Song</h1>
            <p className="text-lg text-gray-600 mb-4">Discover new music and rate your favorite songs!</p>
          </div>
          {/* spacing for images in initial screen */}
          <div className="w-[60vw] relative">
            <Image src={Image1} className="w-full h-screen object-cover rounded-lg shadow-md" />
            <Image src={Image2} className="absolute bottom-4 left-4 w-1/2 h-96 object-cover rounded-lg shadow-md" />
          </div>
        </div>
      </div>
      {/* feature section */}
      <div className="flex flex-wrap justify-center mb-4">
        {/* feature list */}
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
  )
}