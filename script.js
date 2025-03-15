

let currentSongIndex = 0; // Track current song index
let songsList = []; // Array to store songs dynamically

// Function to load songs into an array
function loadSongsList() {
    songsList = Array.from(document.querySelectorAll(".suggested-item")).map((item, index) => ({
        index: index,
        title: item.dataset.title,
        artist: item.dataset.artist,
        img: item.dataset.img,
        audio: item.dataset.audio
    }));
}

// Function to play a song
function playSong(index) {
    if (songsList.length === 0) return;

    currentSongIndex = index;
    const song = songsList[index];

    document.getElementById("popup-title").innerText = song.title;
    document.getElementById("popup-artist").innerText = song.artist;
    document.getElementById("popup-img").src = song.img;
    document.getElementById("popup-audio").src = song.audio;
    document.getElementById("popup-audio").play();
    document.getElementById("music-popup").style.display = "block";
}

// Function to play next song
function nextSong() {
    if (songsList.length === 0) return;

    currentSongIndex = (currentSongIndex + 1) % songsList.length;
    playSong(currentSongIndex);
}

// Function to play previous song
function prevSong() {
    if (songsList.length === 0) return;

    currentSongIndex = (currentSongIndex - 1 + songsList.length) % songsList.length;
    playSong(currentSongIndex);
}

// Initialize songs list when the page loads
window.onload = function () {
    loadSongsList();
    updateLikedSongs(); // Keep existing liked songs logic
};

// Add event listeners to suggested songs
document.querySelectorAll(".suggested-item").forEach((item, index) => {
    item.addEventListener("click", () => {
        loadSongsList(); // Reload songs list in case it's updated
        playSong(index);
    });
});


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

    allPlaylists.forEach(playlist => {
        const playlistName = playlist.innerText.toLowerCase();
        if (playlistName.includes(searchQuery)) {
            playlist.parentElement.style.display = "block";
        } else {
            playlist.parentElement.style.display = "none";
        }
    });
});
const overlay = document.getElementById("overlay");
const mainContent = document.getElementById("main-content");

document.getElementById("register").addEventListener("click", function() {
    openPopup("register-popup");
});

function openPopup(id) {
    document.getElementById(id).style.display = "block";
    if (overlay) overlay.style.display = "block";
    if (mainContent) mainContent.classList.add("blur");
}

function closePopup(id) {
    document.getElementById(id).style.display = "none";
    if (overlay) overlay.style.display = "none";
    if (mainContent) mainContent.classList.remove("blur");
}
function closeAllPopups() {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.style.display = "none";
    });
    document.getElementById("overlay").style.display = "none";
    document.getElementById("main-content").classList.remove("blur"); // Remove blur
}

document.getElementById("register-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let valid = true;

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    document.getElementById("username-error").style.display = username ? "none" : "block";
    document.getElementById("password-error").style.display = password ? "none" : "block";

    if (!username || !password) {
        valid = false;
    }

    if (valid) {
        if (username === "user1" && password === "0") {
            alert("Login successful!");
            closeAllPopups();
        } else {
            document.getElementById("error-message").style.display = "block";
        }
    }
});

// Signup Form Validation
document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault();
    let valid = true;

    const newUsername = document.getElementById("new-username").value.trim();
    const email = document.getElementById("email").value.trim();
    const newPassword = document.getElementById("new-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    document.getElementById("new-username-error").style.display = newUsername ? "none" : "block";
    document.getElementById("email-error").style.display = email.includes("@") ? "none" : "block";
    document.getElementById("new-password-error").style.display = newPassword ? "none" : "block";
    document.getElementById("confirm-password-error").style.display = (newPassword === confirmPassword && confirmPassword) ? "none" : "block";

    if (!newUsername || !email.includes("@") || !newPassword || newPassword !== confirmPassword) {
        valid = false;
    }

    if (valid) {
        alert("Signup successful!");
        closeAllPopups();
    }
});