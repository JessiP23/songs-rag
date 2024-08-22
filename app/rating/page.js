import Header from '@/components/Header'
import React from 'react'

// Approach
// 
// In this page i am allow to add only songs from the users after achieving a chatbot response. They will have the feature to add to main platform or delete (from firebase) and from those songs users can look up to those songs for rating. 

// Once songs are appearing, they will have a rating button where users can click on it, select a start and add a comment, then this will update the rating system by using pinecone(if possible) or any other technology.
// 

export default function RatingSong () {
    return (
        <div>
            <Header />
            Rating Page For songs
        </div>
    )
}