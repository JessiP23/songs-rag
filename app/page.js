'use client'
import Chatbot from "./chatbot/route";
import Dashboard from "./dashboard/route";

export default function Home() {
  return (
    <div>
      <Dashboard />
      <Chatbot />
    </div>
  )
}