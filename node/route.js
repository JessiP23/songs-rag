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
            }
        }
    } else {
        console.log('No results found or an error occurred.');
    }
})();