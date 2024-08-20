 const { google } = require('googleapis');

const apiKey = 'AIzaSyAZwzHCOwjwMgZYcpaQMGhkFJ5ShNtQ3EU';
 
const youtube = google.youtube({
    version: 'v3',
    auth: apiKey,
});

// Function to search for videos on a specific channel
async function searchVideosOnChannel(channelId, query = 'music') {
    try {
        const response = await youtube.search.list({
            part: 'snippet',
            channelId: channelId,
            q: query,
            type: 'video',
            order: 'date', // Order by date to get the most recent videos
            maxResults: 10, // Adjust as needed
        });
        return response.data.items;
    } catch (error) {
        console.error('An error occurred:', error);
        return null;
    }
}

// Function to get video URLs from the search results
function getVideoUrls(videos) {
    return videos.map(video => `https://www.youtube.com/watch?v=${video.id.videoId}`);
}

// Function to display channel info and video URLs
async function displayChannelMusicVideos(channelName, channelId) {
    console.log(`Searching for music videos on the channel: ${channelName}`);
    
    const searchResults = await searchVideosOnChannel(channelId);

    if (searchResults) {
        const videoUrls = getVideoUrls(searchResults);
        console.log('Music Video URLs:');
        videoUrls.forEach(url => console.log(url));
    } else {
        console.log('No videos found or an error occurred.');
    }
}

// Example usage
const channelName = 'Infinite Stream'; // Replace with the name of the channel
const channelId = 'UCtc1GMMAS-X9gZO-yjSceQg'; // Replace with the channel ID

displayChannelMusicVideos(channelName, channelId);



/**

 const { google } = require('googleapis');

const apiKey = 'AIzaSyAZwzHCOwjwMgZYcpaQMGhkFJ5ShNtQ3EU';
 
const youtube = google.youtube({
    version: 'v3',
    auth: apiKey,
});

async function searchChannelsByKeyword(query) {
    try {
        const response = await youtube.search.list({
            q: query,
            part: 'snippet',
            type: 'channel',
            maxResults: 5,
        });
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error);
        return null;
    }
}

async function getChannelDetails(channelId) {
    try {
        const response = await youtube.channels.list({
            part: 'snippet,statistics',
            id: channelId,
        });
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error);
        return null;
    }
}

async function getChannelVideos(channelId) {
    try {
        const response = await youtube.search.list({
            channelId: channelId,
            part: 'snippet',
            order: 'date',
            maxResults: 5,
            type: 'video',
        });
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error);
        return null;
    }
}

async function getVideoDetails(videoId) {
    try {
        const response = await youtube.videos.list({
            part: 'snippet,contentDetails,statistics',
            id: videoId,
        });
        return response.data;
    } catch (error) {
        console.error('An error occurred:', error);
        return null;
    }
}

(async () => {
    const searchQuery = 'Infinite Stream'; // Replace with the artist name
    const searchResults = await searchChannelsByKeyword(searchQuery);

    if (searchResults && searchResults.items.length > 0) {
        for (const item of searchResults.items) {
            const channelId = item.id.channelId;
            const channelDetails = await getChannelDetails(channelId);

            if (channelDetails && channelDetails.items.length > 0) {
                const channel = channelDetails.items[0];
                console.log(`Title: ${channel.snippet.title}`);
                console.log(`Channel ID: ${channel.id}`);
                console.log(`Description: ${channel.snippet.description}`);
                console.log(`Subscriber Count: ${channel.statistics.subscriberCount}`);
                console.log(`Published At: ${channel.snippet.publishedAt}`);
                console.log(`Thumbnail: ${channel.snippet.thumbnails.default.url}`);
                console.log('--------------------------');

                // Get and display videos (songs) from the channel
                const videos = await getChannelVideos(channelId);
                if (videos && videos.items.length > 0) {
                    console.log('Latest Songs:');
                    for (const video of videos.items) {
                        console.log(`Title: ${video.snippet.title}`);
                        console.log(`Video URL: https://www.youtube.com/watch?v=${video.id.videoId}`);
                        console.log('--------------------------');
                    }
                } else {
                    console.log('No videos found for this channel.');
                }
            }
        }
    } else {
        console.log('No results found or an error occurred.');
    }
})();

 */