

function nextSong() {
    alert("Next song functionality coming soon!");
}

function prevSong() {
    alert("Previous song functionality coming soon!");
}

document.querySelectorAll(".suggested-item").forEach(item => {
    item.addEventListener("click", () => {
        document.getElementById("popup-title").innerText = item.dataset.title;
        document.getElementById("popup-artist").innerText = item.dataset.artist;
        document.getElementById("popup-img").src = item.dataset.img;
        document.getElementById("popup-audio").src = item.dataset.audio;
        document.getElementById("popup-audio").play();
        document.getElementById("music-popup").style.display = "block";
    });
});

// Playlist functionality
document.getElementById("create-playlist").addEventListener("click", function() {
    const playlistContainer = document.getElementById("playlist-container");
    const playlistName = prompt("Enter playlist name:");
    if (playlistName) {
        const newPlaylist = document.createElement("div");
        newPlaylist.classList.add("playlist");
        newPlaylist.innerHTML = `<p>${playlistName}</p>`;
        playlistContainer.appendChild(newPlaylist);
    }
});

document.getElementById("delete-playlist").addEventListener("click", function() {
    const playlistContainer = document.getElementById("playlist-container");
    if (playlistContainer.children.length > 0) {
        playlistContainer.removeChild(playlistContainer.lastChild);
    } else {
        alert("No playlists to delete.");
    }
});
// Load liked songs from localStorage
// Load liked songs from localStorage
let likedSongs = JSON.parse(localStorage.getItem("likedSongs")) || [];

// Function to update Liked Songs section
function updateLikedSongs() {
    const likedContainer = document.getElementById("liked-container");
    const likedSection = document.getElementById("liked-section");

    likedContainer.innerHTML = ""; // Clear old content

    if (likedSongs.length === 0) {
        likedSection.style.display = "none"; // Hide if no liked songs
        return;
    } else {
        likedSection.style.display = "block"; // Show if there are liked songs
    }

    likedSongs.forEach(song => {
        const songDiv = document.createElement("div");
        songDiv.classList.add("liked-item");
        songDiv.innerHTML = `
            <img src="${song.img}" alt="${song.title}">
            <p>${song.title} - ${song.artist}</p>
        `;
        likedContainer.appendChild(songDiv);
    });

    // Save to localStorage
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));
}

// Function to handle song click (Open popup & check if liked)
document.querySelectorAll(".suggested-item").forEach(item => {
    item.addEventListener("click", () => {
        const title = item.dataset.title;
        const artist = item.dataset.artist;
        const img = item.dataset.img;
        const audio = item.dataset.audio;

        document.getElementById("popup-title").innerText = title;
        document.getElementById("popup-artist").innerText = artist;
        document.getElementById("popup-img").src = img;
        document.getElementById("popup-audio").src = audio;
        document.getElementById("popup-audio").play();
        document.getElementById("music-popup").style.display = "block";

        // Update like button UI
        updateLikeButton(title, artist);
    });
});

// Function to update like button UI
function updateLikeButton(title, artist) {
    const likeButton = document.getElementById("like-button");
    const likeIcon = document.getElementById("like-icon");

    const isLiked = likedSongs.some(song => song.title === title && song.artist === artist);
    if (isLiked) {
        likeButton.classList.add("liked");
        likeIcon.innerText = "❤️";
    } else {
        likeButton.classList.remove("liked");
        likeIcon.innerText = "🤍";
    }
}

// Handle like button click
document.getElementById("like-button").addEventListener("click", function () {
    const title = document.getElementById("popup-title").innerText;
    const artist = document.getElementById("popup-artist").innerText;
    const img = document.getElementById("popup-img").src;
    const audio = document.getElementById("popup-audio").src;

    const song = { title, artist, img, audio };
    const songIndex = likedSongs.findIndex(s => s.title === title && s.artist === artist);

    if (songIndex === -1) {
        likedSongs.push(song);
    } else {
        likedSongs.splice(songIndex, 1);
    }

    updateLikeButton(title, artist);
    updateLikedSongs();
});

// Load liked songs on page load
window.onload = function () {
    updateLikedSongs();
};
document.querySelector(".search-bar").addEventListener("input", function (e) {
    const searchQuery = e.target.value.toLowerCase();
    const allSongs = document.querySelectorAll(".suggested-item, .liked-item");
    const allPlaylists = document.querySelectorAll(".playlist p");

    // Filter songs (Suggested + Liked)
    allSongs.forEach(song => {
        const songText = song.innerText.toLowerCase();
        if (songText.includes(searchQuery)) {
            song.style.display = "block";
        } else {
            song.style.display = "none";
        }
    });

    // Filter Playlists
    allPlaylists.forEach(playlist => {
        const playlistName = playlist.innerText.toLowerCase();
        if (playlistName.includes(searchQuery)) {
            playlist.parentElement.style.display = "block";
        } else {
            playlist.parentElement.style.display = "none";
        }
    });
});