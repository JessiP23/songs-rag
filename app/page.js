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
          <div className="w-[40vw] flex flex-col justify-center p-4">
          <h1 className="text-3xl font-bold mb-4">Rate My Song</h1>
          <p className="text-lg text-gray-600 mb-4">Discover new music and rate your favorite songs!</p>
          <p className="text-sm text-gray-600 mb-4">Join our community of music lovers</p>
          <p className="text-sm text-gray-600 mb-4">Average rating: 4.5/5 stars</p>
          <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">Sign up for free</button>
          <div className="flex flex-row justify-center mb-4">
            <a href="#" className="mr-4">
              <i className="fab fa-facebook-f text-lg text-gray-600" />
            </a>
            <a href="#" className="mr-4">
              <i className="fab fa-twitter text-lg text-gray-600" />
            </a>
            <a href="#" className="mr-4">
              <i className="fab fa-instagram text-lg text-gray-600" />
            </a>
          </div>
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