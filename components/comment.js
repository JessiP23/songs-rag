// components/CommentsSection.js
import React, { useState, useEffect } from 'react';
import { doc, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import {useUser} from '@clerk/nextjs'

// component that handles the comments made by the user in the global platform.

const CommentsSection = ({ songId }) => {
    // comments change over time
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { user } = useUser();

    // those comments come from the globalSongs collection
    useEffect(() => {
        // properties of the comment
        const q = query(collection(db, 'globalSongs', songId, 'comments'), orderBy('timestamp', 'desc'));

        // list the comments
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsList = snapshot.docs.map(doc => doc.data());
            setComments(commentsList);
        });

        return () => unsubscribe();
    }, [songId]);

    // submit the comments to the globalSongs collection witht he songId
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const commentData = {
            userId: user.id, // the userId is the user.id
            comment: newComment,
            timestamp: new Date()
        };
        // globalSongs collection
        await addDoc(collection(db, 'globalSongs', songId, 'comments'), commentData);
        setNewComment('');
    };

    // publish all comments submitted by the user.
    return (
        <div>
            <div>
                <h3>Comments:</h3>
                {comments.map((comment, index) => (
                    <div key={index} className="border-b py-2">
                        {/* break properties of the comment */}
                        <p><strong>{comment.userId}</strong>: {comment.comment}</p>
                    </div>
                ))}
            </div>
            {/* submit comments  */}
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