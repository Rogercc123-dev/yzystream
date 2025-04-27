// DOM Elements
const playerContainer = document.getElementById('player-container');
const playerStatus = document.getElementById('player-status');
const postContainer = document.getElementById('post-container');
const postStatus = document.getElementById('post-status');

// Backend API Base URL (update for production)
const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://your-domain.com';

// Fetch Latest X Post
async function fetchXPost() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/x-post`);
        const data = await response.json();
        if (data.data && data.data.length > 0) {
            const tweet = data.data[0];
            let postHTML = `<p>${tweet.text}</p>`;
            // Handle images (placeholder)
            if (tweet.attachments && tweet.attachments.media_keys) {
                postHTML += `<img src="https://via.placeholder.com/600x400" alt="Tweet media">`;
            }
            // Handle URLs
            if (tweet.entities && tweet.entities.urls) {
                tweet.entities.urls.forEach(url => {
                    postHTML = postHTML.replace(url.url, `<a href="${url.expanded_url}" target="_blank">${url.display_url}</a>`);
                });
            }
            postContainer.innerHTML = `<div id="post-content">${postHTML}<small>Posted on ${new Date(tweet.created_at).toLocaleString()}</small></div>`;
        } else {
            postContainer.innerHTML = `<p>No recent posts found.</p>`;
        }
    } catch (error) {
        console.error('Error fetching X post:', error);
        postContainer.innerHTML = `<p>Failed to load post. Please try again later.</p>`;
    }
}

// Check for Live Streams
async function checkStreams() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/streams`);
        const { streamUrl, platform } = await response.json();
        if (streamUrl && platform) {
            playerContainer.innerHTML = `<iframe src="${streamUrl}" allowfullscreen></iframe>`;
            playerStatus.textContent = `Now streaming on ${platform}`;
        } else {
            playerContainer.innerHTML = `<p>No live streams found. Check back later!</p>`;
            playerStatus.textContent = 'No live streams available';
        }
    } catch (error) {
        console.error('Error checking streams:', error);
        playerContainer.innerHTML = `<p>Failed to load stream. Please try again later.</p>`;
        playerStatus.textContent = 'Stream check failed';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchXPost();
    checkStreams();
    setInterval(checkStreams, 30000); // Check every 30 seconds
});
