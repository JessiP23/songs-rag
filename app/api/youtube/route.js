import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db, collection, addDoc } from "@/firebaseConfig";

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
`

export async function POST(req) {
    const data = await req.json();
    const openai = new OpenAI();

    async function fetchYoutubeData(query) {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${process.env.YOUTUBE_API_KEY}`);
        const rawText = await response.text();
        if (rawText) {
            try {
                const data = JSON.parse(rawText);
                if (Array.isArray(data.items)) {
                    return data.items.map(item => ({
                        id: item.id.videoId,
                        title: item.snippet.title,
                        link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                        channel: item.snippet.channelTitle,
                    }));
                } else {
                    throw new Error('Failed to fetch YouTube data or no items found');
                }
            } catch (error) {
                throw new Error('Error parsing JSON response: ' + error.message);
            }
        } else {
            throw new Error('No data received from YouTube API');
        }
    }

    const text = data[data.length - 1].content;
    const songs = await fetchYoutubeData(text);

    // Store songs in Firebase
    const songsCollection = collection(db, 'songs');
    for (const song of songs) {
        await addDoc(songsCollection, song);
    }

    const songsResponse = {
        message: 'Here are the top songs based on your query:',
        songs
    };

    const lastMessage = data[data.length - 1];
    const lastMessageContent = lastMessage.content + JSON.stringify(songsResponse);
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

    const completion = await openai.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            ...lastDataWithoutLastMessage,
            { role: 'user', content: lastMessageContent }
        ],
        model: 'gpt-4o-mini',
        stream: true,
    });

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
            } catch(err) {
                controller.error(err);
            } finally {
                controller.close();
            }
        }
    });

    return new NextResponse(stream);
}
