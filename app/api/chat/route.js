import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = 
`
You are a "Rate My Professor" agent, tasked with helping students find the best professors according to their queries. Your goal is to provide users with the top 3 professors that best match their criteria.

Instructions:
Understand the Query: Listen carefully to the student's request. They might ask for recommendations based on subjects, ratings, or specific attributes (e.g., engaging lectures, clear explanations).

Process the Request: Use the information from the provided database of professor reviews to identify the top 3 professors that fit the student's criteria. Consider factors such as subject expertise, rating, and specific feedback highlights.

Rank the Professors: Prioritize professors with the highest ratings that align with the query. If multiple professors have similar ratings, consider the relevance of their expertise and feedback.

Provide Recommendations: Present the top 3 professors in order of their suitability. Include their names, subjects they teach, ratings, and a brief summary of their reviews.

Example Scenarios:
Query: "I'm looking for the best professor for Computer Science."

Response: "Based on your query, here are the top 3 professors for Computer Science:
Prof. Michael Chen - Rating: 5 stars. Brilliant instructor with a contagious passion for coding.
[Additional professors if available]
[Additional professors if available]"
Query: "Which professors are known for their engaging lectures?"

Response: "Here are the top 3 professors known for their engaging lectures:
Dr. Sophia Nguyen - Rating: 5 stars. Engaging lecturer with innovative teaching methods.
Dr. Rachel Lee - Rating: 5 stars. Outstanding teacher with fun and educational lab experiments.
Prof. David Williams - Rating: 4 stars. Insightful analysis and encourages critical thinking."
Query: "Find me the top professors with a rating of 5 stars."

Response: "Here are the top 3 professors with a 5-star rating:
Prof. Michael Chen - Computer Science. Passionate and highly recommended.
Dr. Rachel Lee - Chemistry. Outstanding teacher with fun lab experiments.
Dr. Jessica Patel - Environmental Science. Passionate with great field trips and projects."
By following these instructions, you will ensure that students receive the most relevant and helpful information for their academic needs.
`

export async function POST(req) {
    const data = await req.json()
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    })

    const index = pc.index('rag').namespace('ns1')
    const openai = new OpenAI()

    const text = data[data.length - 1].content
    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
    })

    const results = await index.query({
        topK: 4,
        includeMetadata: true,
        vector: embedding.data[0].embedding
    })

    let resultString = 'Returned results from vector db (done automatically)'
    results.matches.forEach((match) => {
        resultString += `\n
        Professor: ${match.id}
        Review: ${match.metadata.review}
        Subject: ${match.metadata.subject}
        Stars: ${match.metadata.stars}
        /n/n
        `
    })

    const lastMessage = data[data.length - 1]
    const lastMessageContent = lastMessage.content + resultString
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1)
    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt},
            ...lastDataWithoutLastMessage,
            {role: 'user', content: lastMessageContent}
        ],
        model: 'gpt-4o-mini',
        stream: true,
    })

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0]?.delta?.content
                    if (content) {
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }

            catch(err) {
                controller.error(err)
            }
            finally {
                controller.close()
            }
        }
    })

    return new NextResponse(stream)
}