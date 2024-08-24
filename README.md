#Music Dashboard App

##Overview

Rate my song along with a music dashboard app built with Next.js, Firebase, Clerk, Pinecone, OpenAI, Node.js, and Youtube API. This app allows users to log in, track their favorite songs, and interact with a chatbot AI to discover songs from their favorite artists by using Youtube API. Users can upload these songs to a global platform, where they can browse, listen, and comment on songs shared by others. 

##Features

- **User Authentication:** Secure login and account management powered by Clerk.
- **Personal Dashboard:** Users can upload songs from its personal dashboard to the global platform and keep track of the number of comments made on the global platform. 
- **Chatbot AI Integration:** Users can find new songs from their artists with the support of AI and Pinecone, which suggests songs on their based input.
- **Song Management:** Songs generated via chatbot are automatically added to the user's dashboard
- **Global Platform:** Users can upload the dashboard songs to a global platform, which makes accessible to all users for listening and commenting 
- **Comments System:** Users can leave comments on any song within the global platform


## Tech Stack

- **Frontend:** Next.js, Tailwind, @mui/icons
- **Backend:** Node.js
- **Authentication:** Clerk
- **Database & Storage:** Firebase
- **AI & Natural Language Processing:** OpenAI API (chatbot) & Pinecone


## Getting started

### Prerequisites

Ensure you have installed the following tools on your development machine:

- Node.js (v16.x or later)
- npm
- Firebase CLI
- Clerk CLI
- Next.js

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/JessiP23/songs-rag.git
cd songs-rag
```