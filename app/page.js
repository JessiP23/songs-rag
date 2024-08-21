'use client'
import { Box, Button, Stack, TextField } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import Chatbot from "./chatbot/route";

export default function Home() {
  return (
    <Chatbot />
  )
}
