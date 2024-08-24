import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db, collection, addDoc } from "@/firebaseConfig";

// Prompt for the chatbot
const systemPrompt = `
Rate My Song Agent

I'm a music expert tasked with helping users find songs that match their queries. My goal is to provide users with a list of songs that fit their criteria, regardless of their popularity or ranking.

Understand the Query

Listen carefully to the user's request. They might ask for songs based on:

Genre (e.g., pop, rock, hip-hop)
Artist or band
Specific attributes (e.g., catchy melody, great lyrics, popular on YouTube)
Mood or atmosphere (e.g., relaxing, energetic, romantic)
Era or decade (e.g., 80s, 90s, 2000s)
Process the Request

Use the information from various music APIs (e.g., YouTube API, Spotify API, MusicBrainz API) to identify songs that fit the user's criteria. Consider factors such as:

Song title and artist
Genre and style
Lyrics and melody
Release date and era
Popularity and user engagement (e.g., views, likes, comments)
Retrieve Songs

Retrieve a list of songs that match the user's query, without prioritizing popularity or ranking. The list should include:

Song title
Artist or band
YouTube link (if available)
Brief summary of the song (e.g., genre, release date, notable features)
Provide Recommendations

Present the list of songs that match the user's query, in a clear and organized format. For example:

Query: "I'm looking for songs by The Beatles."

Response: "Here are some songs by The Beatles:

'Hey Jude' - A classic ballad with a iconic 'na-na-na' refrain.
'Yesterday' - A melancholic acoustic ballad with a beautiful melody.
'Let It Be' - A uplifting song with a powerful piano riff.
... (and so on)
Query: "I want songs with a relaxing atmosphere."

Response: "Here are some relaxing songs:

'Weightless' by Marconi Union - A soothing ambient track with a calming effect.
'River Flows in You' by Yiruma - A peaceful piano piece with a gentle flow.
'Sleep' by Max Richter - A calming orchestral piece with a slow tempo.
... (and so on)
`;

// Function to fetch YouTube data
async function fetchYoutubeData(query) {
    try {
        // youtube api
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${process.env.YOUTUBE_API_KEY}`);
        const rawText = await response.text();
        if (rawText) {
            // json raw data
            const data = JSON.parse(rawText);
            // iterate the array
            if (Array.isArray(data.items)) {
                // calculating and analyzing from the response given by the chatbot id, title, link of the video, and the channel
                return data.items.map(item => ({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                    channel: item.snippet.channelTitle,
                }));
            } else {
                throw new Error('Failed to fetch YouTube data or no items found');
            }
        } else {
            throw new Error('No data received from YouTube API');
        }
    } catch (error) {
        throw new Error('Error fetching YouTube data: ' + error.message);
    }
}

// Function to handle POST request
export async function POST(req) {
    // Expecting userId and query in the request body
    const { userId, query } = await req.json(); 


    // debugging userId 
    //console.log('Received request:', {userId, query});

    
    if (!userId || !query) {
        return new NextResponse('Missing user ID or query', { status: 400 });
    }

    const openai = new OpenAI();

    // Fetch YouTube data based on the query
    // initialize songs to be an object of individual songs
    let songs = [];
    try {
        songs = await fetchYoutubeData(query);
    } catch (error) {
        console.error('Error fetching songs:', error);
    }

    // Store songs in Firebase with user information
    //const songsCollection = collection(db, 'songs');

    // update songs to userid for each user have their own set of songs

    // for loop to add individual songs to the corresponding user
    for (const song of songs) {
        try {
            // collection songs and users
             // Subcollection path: /users/{userId}/songs from firebase 
            const userSongsCollection = collection(db, 'users', userId, 'songs');
            // Store the song under the user's subcollection.

            // example of firebase data  /users/user_2kqI7e0bL6EFeDQwKxBdWPETHEN/songs/bQWTlPXcHXmT2Jb7V1WR
            await addDoc(userSongsCollection, song); 
        } catch (error) {
            console.error('Error adding song to Firebase:', error);
        }
    }

    // Generate response from OpenAI
    const songsResponse = {
        message: 'Here are the top songs based on your query:',
        songs
    };

    // completion chat response OpenAI

    const completion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query + JSON.stringify(songsResponse) }
        ],
        model: 'gpt-4o-mini',
        stream: true,
    });

    // Stream OpenAI response
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        const text = encoder.encode(content);
                        controller.enqueue(text);
                    }
                }
            } catch (err) {
                controller.error(err);
            } finally {
                controller.close();
            }
        }
    });

    return new NextResponse(stream);
}
