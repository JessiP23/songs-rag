'use client'
import Header from "@/components/Header";
import { Box, Button, Stack, TextField, Avatar, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useUser, SignedIn, SignedOut, SignInButton, useClerk } from '@clerk/nextjs';
import { db } from "@/firebaseConfig";
import { addDoc, collection, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Chatbot() {
  const { user, isLoaded } = useUser(); // Get the authenticated user from Clerk
  const router = useRouter();
  const {signOut} = useClerk();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I am the Rate My Song support assistant. How can I help you today?"
    }
  ]);
  const [message, setMessage] = useState('');


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
            <SignedIn>
                <Box
                    width="100vw"
                    height="100vh"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    bgcolor="background.default"
                    p={2}
                >
                    <Stack
                        direction="column"
                        width="100%"
                        maxWidth="600px"
                        height="80vh"
                        border="1px solid #ddd"
                        borderRadius={4}
                        overflow="hidden"
                        spacing={3}
                        bgcolor="background.paper"
                    >
                        <Stack
                            direction='row'
                            alignItems='center'
                            spacing={2}
                            p={2}
                            bgcolor="primary.main"
                            color="white"
                        >
                            {/* Display user icon and email */}
                            {user && (
                                <>
                                    <Avatar src={user.profileImageUrl} alt={user.fullName} />
                                    <Typography variant="h6">{user.emailAddresses[0].emailAddress}</Typography>
                                </>
                            )}
                        </Stack>
                        <Stack
                            direction='column'
                            spacing={2}
                            flexGrow={1}
                            overflow='auto'
                            p={2}
                        >
                            {messages.map((message, index) => (
                                <Box
                                    key={index}
                                    display="flex"
                                    justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
                                >
                                    <Box
                                        bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                                        color="white"
                                        borderRadius={16}
                                        p={2}
                                        maxWidth="75%"
                                    >
                                        {message.content}
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                        <Stack
                            direction='row'
                            spacing={2}
                            p={2}
                            bgcolor="background.paper"
                        >
                            <TextField
                                label="Message"
                                fullWidth
                                variant="outlined"
                                size="small"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={sendMessage}
                                sx={{ height: '100%' }}
                            >
                                Send
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </SignedIn>
            <SignedOut>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="100vh"
                    p={4}
                >
                    <Typography variant="h6" color="textSecondary" align="center">
                        You are not authenticated. Click below to sign up or log in.
                    </Typography>
                    <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                        >
                            Sign up
                        </Button>
                    </SignInButton>
                </Box>
            </SignedOut>
    </div>
  );
}
