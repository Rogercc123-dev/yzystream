const albums = [
    "The College Dropout", "Late Registration", "Graduation",
    "808s & Heartbreak", "My Beautiful Dark Twisted Fantasy",
    "Yeezus", "The Life of Pablo", "Ye", "Jesus Is King",
    "Donda", "Donda 2", "Vultures 1"
];

const songs = [
    "Through the Wire", "Jesus Walks", "All Falls Down",
    "Gold Digger", "Stronger", "Can't Tell Me Nothing",
    "Heartless", "Runaway", "Power", "Ultralight Beam",
    "Father Stretch My Hands Pt. 1", "Bound 2"
];

const fanArtImg = document.getElementById('fan-art');
const galleryButton = document.getElementById('gallery-button');
const submissionForm = document.getElementById('submission-form');
const submissionTitle = document.getElementById('art-title');
const submissionArtist = document.getElementById('art-artist');
const submissionFile = document.getElementById('art-file');
const submissionSubmit = document.getElementById('submission-submit');
const submissionStatus = document.getElementById('submission-status');
const albumForm = document.getElementById('album-form');
const albumRanking = document.getElementById('album-ranking');
const albumSubmit = document.getElementById('album-submit');
const albumLeaderboard = document.getElementById('album-leaderboard');
const albumStatus = document.getElementById('album-status');
const songForm = document.getElementById('song-form');
const songRanking = document.getElementById('song-ranking');
const songSubmit = document.getElementById('song-submit');
const songLeaderboard = document.getElementById('song-leaderboard');
const songStatus = document.getElementById('song-status');

let fanArtImages = [];

// Fan Art Gallery
async function fetchFanArtImages() {
    try {
        const response = await fetch('/api/fan-art');
        if (!response.ok) throw new Error('Failed to fetch fan art');
        fanArtImages = await response.json();
        if (fanArtImages.length === 0) {
            fanArtImg.src = 'images/placeholder.jpg';
            fanArtImg.alt = 'No Fan Art Available';
        } else {
            showRandomFanArt();
        }
    } catch (error) {
        console.error('Error fetching fan art:', error);
        fanArtImg.src = 'images/placeholder.jpg';
        fanArtImg.alt = 'No Fan Art Available';
    }
}

function showRandomFanArt() {
    if (fanArtImages.length === 0) return;
    const randomIndex = Math.floor(Math.random() * fanArtImages.length);
    const image = fanArtImages[randomIndex];
    fanArtImg.src = image.src;
    fanArtImg.alt = image.alt;
}

async function submitFanArt() {
    const title = submissionTitle.value.trim();
    const artist = submissionArtist.value.trim();
    const file = submissionFile.files[0];

    if (!title || !file) {
        submissionStatus.textContent = 'Please provide a title and image.';
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist || 'Anonymous');
    formData.append('file', file);

    try {
        submissionSubmit.disabled = true;
        submissionStatus.textContent = 'Uploading...';
        const response = await fetch('/api/fan-art', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to upload fan art');
        }
        submissionStatus.textContent = 'Art submitted! Awaiting moderation.';
        submissionForm.reset();
        await fetchFanArtImages(); // Refresh gallery
    } catch (error) {
        console.error('Error submitting fan art:', error);
        submissionStatus.textContent = error.message;
    } finally {
        submissionSubmit.disabled = false;
    }
}

galleryButton.addEventListener('click', showRandomFanArt);
submissionSubmit.addEventListener('click', submitFanArt);

// Voting Logic
function createRankingForm(container, items, name) {
    container.innerHTML = Array.from({ length: 12 }, (_, i) => `
        <div>
            <label>${i + 1}: </label>
            <select name="${name}-${i}" required>
                <option value="">Select ${name}</option>
                ${items.map(item => `<option value="${item}">${item}</option>`).join('')}
            </select>
        </div>
    `).join('');
}

function getRankings(container, name) {
    const selects = container.querySelectorAll(`select[name^="${name}-"]`);
    const rankings = [];
    selects.forEach(select => {
        if (select.value) rankings.push(select.value);
    });
    return rankings;
}

function validateRankings(rankings) {
    const unique = new Set(rankings);
    return rankings.length === unique.size && rankings.length <= 12;
}

async function submitVotes(type, rankings) {
    try {
        const response = await fetch(`/api/vote/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rankings, userId: getUserId() })
        });
        if (!response.ok) throw new Error(`Failed to submit ${type} votes`);
        localStorage.setItem(`voted-${type}`, 'true');
        updateFormVisibility(type);
        fetchLeaderboard(type);
    } catch (error) {
        console.error(`Error submitting ${type} votes:`, error);
        document.getElementById(`${type}-status`).textContent = `Error submitting votes. Try again.`;
    }
}

async function fetchLeaderboard(type) {
    try {
        const response = await fetch(`/api/leaderboard/${type}`);
        if (!response.ok) throw new Error(`Failed to fetch ${type} leaderboard`);
        const data = await response.json();
        const leaderboard = document.getElementById(`${type}-leaderboard`);
        leaderboard.innerHTML = data
            .sort((a, b) => b.points - a.points)
            .map(item => `<div>${item.name}: ${item.points} points</div>`)
            .join('');
    } catch (error) {
        console.error(`Error fetching ${type} leaderboard:`, error);
        document.getElementById(`${type}-status`).textContent = `Error loading leaderboard.`;
    }
}

function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }
    return userId;
}

function updateFormVisibility(type) {
    const hasVoted = localStorage.getItem(`voted-${type}`) === 'true';
    document.getElementById(`${type}-form`).style.display = hasVoted ? 'none' : 'block';
    document.getElementById(`${type}-status`).style.display = hasVoted ? 'none' : 'block';
}

// Initialize
function init() {
    fetchFanArtImages();
    createRankingForm(albumRanking, albums, 'album');
    createRankingForm(songRanking, songs, 'song');
    updateFormVisibility('album');
    updateFormVisibility('song');
    fetchLeaderboard('album');
    fetchLeaderboard('song');
    albumStatus.textContent = '';
    songStatus.textContent = '';
}

init();
