// components/SongActions.js
import React, { useState } from 'react';
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import {useUser} from '@clerk/nextjs'

const SongActions = ({ songId, initialLikes, initialDislikes, initialComments }) => {
    const { user } = useUser();
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [userLiked, setUserLiked] = useState(false);
    const [userDisliked, setUserDisliked] = useState(false);
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');

    const handleLike = async () => {
        try {
            const songRef = doc(db, 'globalSongs', songId);
    
            // Check if document exists before attempting to update
            const songDoc = await getDoc(songRef);
            if (!songDoc.exists()) {
                console.error('Document does not exist.');
                return;
            }
    
            // Update likes
            await updateDoc(songRef, {
                likes: increment(userLiked ? -1 : 1)
            });
    
            setLikes(likes + (userLiked ? -1 : 1));
            setUserLiked(!userLiked);
    
            if (userDisliked) {
                await updateDoc(songRef, {
                    dislikes: increment(-1)
                });
                setDislikes(dislikes - 1);
                setUserDisliked(false);
            }
        } catch (error) {
            console.error('Error updating likes:', error);
        }
    };
    
    const handleDislike = async () => {
        try {
            const songRef = doc(db, 'globalSongs', songId);
    
            // Check if document exists before attempting to update
            const songDoc = await getDoc(songRef);
            if (!songDoc.exists()) {
                console.error('Document does not exist.');
                return;
            }
    
            // Update dislikes
            await updateDoc(songRef, {
                dislikes: increment(userDisliked ? -1 : 1)
            });
    
            setDislikes(dislikes + (userDisliked ? -1 : 1));
            setUserDisliked(!userDisliked);
    
            if (userLiked) {
                await updateDoc(songRef, {
                    likes: increment(-1)
                });
                setLikes(likes - 1);
                setUserLiked(false);
            }
        } catch (error) {
            console.error('Error updating dislikes:', error);
        }
    };

    const handleAddComment = async () => {
        try {
            const songRef = doc(db, 'globalSongs', songId);
            
            // Update comments
            await updateDoc(songRef, {
                comments: [...comments, { userId: 'current-user-id', comment: newComment, timestamp: new Date().toISOString() }]
            });
    
            setComments([...comments, { userId: 'current-user-id', comment: newComment, timestamp: new Date().toISOString() }]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <button onClick={handleLike} className={`px-4 py-2 ${userLiked ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    {userLiked ? 'Unlike' : 'Like'} ({likes})
                </button>
                <button onClick={handleDislike} className={`px-4 py-2 ${userDisliked ? 'bg-red-500' : 'bg-gray-300'}`}>
                    {userDisliked ? 'Undo Dislike' : 'Dislike'} ({dislikes})
                </button>
            </div>
            <div>
                <textarea 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)} 
                    placeholder="Add a comment"
                    className="w-full p-2 border rounded"
                />
                <button onClick={handleAddComment} className="px-4 py-2 mt-2 bg-green-500 text-white">
                    Add Comment
                </button>
            </div>

        </div>
    );
};

export default SongActions;
