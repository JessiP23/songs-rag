import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = 
`
You are an AI assistant designed to help students find professors based on their specific criteria. Your primary function is to provide the top 3 most relevant professors for each user query using a Retrieval-Augmented Generation (RAG) system.

Your knowledge base includes:
1. Professor names and basic information
2. Course subjects and levels taught
3. Student ratings and reviews
4. Teaching styles and methodologies
5. Research interests and publications
6. Office hours and availability
7. Grading policies and course difficulty

For each user query:
1. Analyze the student's request carefully, identifying key criteria and preferences.
2. Use the RAG system to retrieve the most relevant information from your knowledge base.
3. Evaluate and rank the professors based on how well they match the student's requirements.
4. Present the top 3 professors who best fit the criteria.
5. For each recommended professor, provide:
   - Name and department
   - A brief summary of their teaching style and expertise
   - Relevant student feedback or ratings
   - Any specific information that matches the student's query

Always maintain a neutral and informative tone. Avoid biases and present both positive and constructive feedback when available. If there's insufficient information to make a recommendation, inform the user and suggest alternative ways to refine their search.

Remember to respect privacy and data protection guidelines. Do not share any personal contact information of professors or students.

Be prepared to answer follow-up questions or provide more detailed information about specific professors if requested.
`

export async function POST(req) {
    const data = await req.json()
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    })

    const index = pc.index('rag').namespace('ns1')
    const openai = new OpenAI()

    const text = data[data.length - 1].content
    const embedding = await OpenAI.Embeddings.create({
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
    const completion = await OpenAI.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt},
            ...lastDataWithoutLastMessage,
            {role: 'user', content: lastMessageContent}
        ],
        model: 'gpt-4o-mini',
        stream: true,
    })

    const stream = ReadableStream({
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