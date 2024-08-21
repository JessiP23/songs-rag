'use client'
import { Box, Button, Stack, TextField } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
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
