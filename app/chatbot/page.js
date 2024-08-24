'use client'
import Header from "@/components/Header";
import { Box, Button, Stack, TextField, Avatar, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useUser } from '@clerk/nextjs';
import { db } from "@/firebaseConfig";
import { addDoc, collection, doc } from "firebase/firestore";

export default function Chatbot() {
  const { user, isLoaded } = useUser(); // Get the authenticated user from Clerk
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I am the Rate My Song support assistant. How can I help you today?"
    }
  ]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      // If user is not authenticated, redirect to the home page
      window.location.href = '/';
    }
  }, [isLoaded, user]);

  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' }
    ]);

    setMessage('');

    try {
      const response = await fetch('/api/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          query: message
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });

        return reader.read().then(processText);
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }

    // Add the song to the user's subcollection
    if (user) {
      const songData = {
        title: message, // or other song data from your chatbot
        timestamp: new Date() // Add a timestamp if needed
      };

      try {
        const userSongsRef = collection(doc(db, 'users', user.id), 'songs'); // Correct reference
        await addDoc(userSongsRef, songData);
        console.log('Song added to Firebase under user ID:', user.id);
      } catch (error) {
        console.error('Error adding song to Firebase:', error);
      }
    }
  };


  if (!isLoaded) {
    // Show a loading state while the user is being loaded
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Stack direction="column" width="500px" height="700px" border="1px solid black" p={2} spacing={3}>
          <Stack direction='row' alignItems='center' spacing={2}>
            {/* Display user icon and email */}
            {user && (
              <>
                <Avatar src={user.profileImageUrl} alt={user.fullName} />
                <Typography>{user.emailAddresses[0].emailAddress}</Typography>
              </>
            )}
          </Stack>
          <Stack direction='column' spacing={2} flexGrow={1} overflow='auto' maxHeight="100%">
            {messages.map((message, index) => (
              <Box key={index} display="flex" justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}>
                <Box bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'} color="white" borderRadius={16} p={3}>
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction='row' spacing={2}>
            <TextField label="Message" fullWidth value={message} onChange={(e) => {
              setMessage(e.target.value);
            }} />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    </div>
  );
}
