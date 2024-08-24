// components/CommentsSection.js
import React, { useState, useEffect } from 'react';
import { doc, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import {useUser} from '@clerk/nextjs'


const CommentsSection = ({ songId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { user } = useUser();

    useEffect(() => {
        const q = query(collection(db, 'globalSongs', songId, 'comments'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsList = snapshot.docs.map(doc => doc.data());
            setComments(commentsList);
        });

        return () => unsubscribe();
    }, [songId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const commentData = {
            userId: user.id, // Replace with actual user ID from authentication
            comment: newComment,
            timestamp: new Date()
        };
        await addDoc(collection(db, 'globalSongs', songId, 'comments'), commentData);
        setNewComment('');
    };

    return (
        <div>
            <div>
                <h3>Comments:</h3>
                {comments.map((comment, index) => (
                    <div key={index} className="border-b py-2">
                        <p><strong>{comment.userId}</strong>: {comment.comment}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="mt-4">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="border p-2 w-full"
                />
                <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2">Submit</button>
            </form>
        </div>
    );
};

export default CommentsSection;
