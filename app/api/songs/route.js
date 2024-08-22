import { NextResponse } from "next/server";
import { db, collection, getDocs } from "@/firebaseConfig";

export async function GET() {
    try {
        const querySnapshot = await getDocs(collection(db, 'songs'));
        const songs = querySnapshot.docs.map(doc => doc.data());

        return NextResponse.json(songs); 
    } catch (error) {
        return NextResponse.error(`Error fetching songs: ${error.message}`);
    }
}