import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db, collection, addDoc } from "@/firebaseConfig";

const systemPrompt = `
You are a "Rate My Song" agent, tasked with helping users find the best songs according to their queries. Your goal is to provide users with the top 3 songs that best match their criteria.

Instructions:
Understand the Query: Listen carefully to the user's request. They might ask for recommendations based on genre, popularity, or specific attributes (e.g., catchy melody, great lyrics, popular on YouTube).

Process the Request: Use the information from the YouTube API to identify the top 3 songs that fit the user's criteria. Consider factors such as the number of views, likes, user comments, and overall popularity.

Rank the Songs: Prioritize songs with the highest engagement (views, likes) and relevance to the query. If multiple songs have similar metrics, consider the sentiment of user reviews and comments.

Provide Recommendations: Present the top 3 songs in order of their suitability. Include their titles, artists, YouTube link, and a brief summary of why they were chosen.

Example Scenarios:
Query: "I'm looking for the best pop songs."

Response: "Based on your query, here are the top 3 pop songs:
1. 'Song Title 1' by Artist 1 - 50M views, highly popular with catchy lyrics.
2. 'Song Title 2' by Artist 2 - 30M views, praised for its melody.
3. 'Song Title 3' by Artist 3 - 20M views, loved by fans for its upbeat tempo."
Query: "Which songs are trending right now?"

Response: "Here are the top 3 trending songs:
1. 'Trending Song 1' by Artist 1 - 100M views, currently trending due to its viral challenge.
2. 'Trending Song 2' by Artist 2 - 80M views, gaining popularity rapidly with fans.
3. 'Trending Song 3' by Artist 3 - 70M views, known for its powerful message."
By following these instructions, you will ensure that users receive the most relevant and popular songs based on their requests.
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
