const bearerToken = 'AAAAAAAAAAAAAAAAAAAAAO7gygEAAAAAvlFqidFP2LEDedgb7L78%2Bfa2uNE%3DpWuOeRzLaGVc6DLLxo39IELbGN9vjgDOWzAI8yao20frCQ3fiF'; // Replace with your X API Bearer Token
const username = 'kanyewest'; // Kanye West's X handle
const postContainer = document.getElementById('post-container');
const postStatus = document.getElementById('post-status');
const postContent = document.getElementById('post-content');
const postText = document.getElementById('post-text');
const postDate = document.getElementById('post-date');

async function fetchLatestPost() {
    try {
        // Step 1: Get user ID from username
        const userResponse = await fetch(`https://api.x.com/2/users/by/username/${username}`, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data. Account may be deactivated.');
        }

        const userData = await userResponse.json();
        const userId = userData.data.id;

        // Step 2: Fetch the user's latest post
        const tweetsResponse = await fetch(`https://api.x.com/2/users/${userId}/tweets?max_results=1&tweet.fields=created_at`, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        if (!tweetsResponse.ok) {
            throw new Error('Failed to fetch posts.');
        }

        const tweetsData = await tweetsResponse.json();
        if (tweetsData.data && tweetsData.data.length > 0) {
            const latestPost = tweetsData.data[0];
            postStatus.style.display = 'none';
            postContent.style.display = 'block';
            postText.textContent = latestPost.text;
            postDate.textContent = new Date(latestPost.created_at).toLocaleString();
        } else {
            postStatus.textContent = 'No posts found.';
        }
    } catch (error) {
        console.error('Error fetching post:', error);
        postStatus.textContent = 'Unable to load post. Account may be deactivated.';
    }
}

// Call the function to fetch the post when the page loads
fetchLatestPost();
