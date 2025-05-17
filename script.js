// Music Data
const musicData = {
    recommendedSongs: [
        {
            title: "Kol Waad",
            artist: "Wael Jassar",
            img: "Media/kolwaad.jpg",
            audio: "Media/Wael Jassar - Koul Waad [ Official Video Clip ] _ وائل جسار - كل وعد.mp3"
        },
        {
            title: "Habebe Leh",
            artist: "Tula8te",
            img: "Media/tul8ate.jpeg",
            audio: "Media/habebe-leh.mp3"
        },
        {
            title: "Tamali Ma'ak",
            artist: "Amr Diab",
            img: "Media/tamalli ma3ak.jpg",
            audio: "Media/tamali-maaak.mp3"
        },
        {
            title: "Men Nazra",
            artist: "Nancy Ajram",
            img: "Media/mnnazra.jpg",
            audio: "Media/yesterday.mp3"
        },
        {
            title: "Shababek",
            artist: "Mounir",
            img: "Media/Mounir.jpg",
            audio: "Media/ya-habibi.mp3"
        },
        {
            title: "Ya Malak",
            artist: "Amer Mounib",
            img: "Media/yamalak.jpg",
            audio: "Media/el-donia-helwa.mp3"
        },
        {
            title: "Nour el ein",
            artist: "Amr Diab",
            img: "Media/amrdiab.jpeg",
            audio: "Media/ahla-haga-feeki.mp3"
        }
    ],

    popularArtists: [
        {
            name: "Amr Diab",
            description: "Egyptian Superstar",
            img: "Media/amrdiab.jpeg"
        },
        {
            name: "Tamer Hosny",
            description: "Egyptian Artist",
            img: "Media/tamerhosny.jpg"
        },
        {
            name: "Tamer Ashour",
            description: "Egyptian Singer",
            img: "Media/tamerashour.jpeg"
        },
        {
            name: "Assala Nasri",
            description: "Syrian Singer",
            img: "Media/asala.jpg"
        },
        {
            name: "Mohamed Mounir",
            description: "The King",
            img: "Media/Mounir.jpg"
        },
        {
            name: "Sherine",
            description: "Egyptian Diva",
            img: "Media/sherine.jpeg"
        },
        {
            name: "Hamza Namira",
            description: "Egyptian Singer",
            img: "Media/HamzaNamira.jpeg"
        }
    ],

    newReleases: [
        {
            title: "Yeah",
            artist: "Tamer Ashour",
            img: "Media/yeah.jpg",
            audio: "Media/yeah.mp3"
        },
        {
            title: "Roma",
            artist: "Cairokee",
            img: "Media/roma.jpeg",
            audio: "Media/roma.mp3"
        },
        {
            title: "El Sekka Shemal",
            artist: "Cairokee",
            img: "Media/elseka-shemal.jpg",
            audio: "Media/el-sekka-shemal.mp3"
        }
    ]
};

// App State
let currentUser = null;
let currentSongIndex = 0;
let songs = [];
let likedSongs = [];
let playlists = [];
let isPlaying = false;

// DOM Elements
const authSection = document.getElementById('auth-section');
const userSection = document.getElementById('user-section');
const authButton = document.getElementById('auth-button');
const logoutButton = document.getElementById('logout-button');
const playlistActions = document.getElementById('playlist-actions');
const likedSection = document.getElementById('liked-section');
const playlistContainer = document.getElementById('playlist-container');
const likedContainer = document.getElementById('liked-container');
const searchInput = document.getElementById('search-input');
const nowPlayingBar = document.getElementById('now-playing-bar');
const suggestedSongsContainer = document.getElementById('suggested-songs');
const popularArtistsContainer = document.getElementById('popular-artists');
const newReleasesContainer = document.getElementById('new-releases');
const audioElement = document.getElementById('now-playing-audio');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadMusicData();
    
    const savedUser = localStorage.getItem('musicPlayerUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForUser();
    }
    
    setupEventListeners();
    
    if (currentUser && currentUser.username === 'nour') {
        loadSamplePlaylists();
        loadLikedSongs();
    }
    
    gatherAllSongs();
    initSwipe();
});

// Load all music data into the UI
function loadMusicData() {
    suggestedSongsContainer.innerHTML = '';
    popularArtistsContainer.innerHTML = '';
    newReleasesContainer.innerHTML = '';
    
    // Load recommended songs
    musicData.recommendedSongs.forEach(song => {
        const card = createSongCard(song);
        card.addEventListener('click', () => playSong(song));
        suggestedSongsContainer.appendChild(card);
    });

    // Load popular artists
    musicData.popularArtists.forEach(artist => {
        popularArtistsContainer.appendChild(createArtistCard(artist));
    });

    // Load new releases
    musicData.newReleases.forEach(album => {
        const card = createAlbumCard(album);
        card.addEventListener('click', () => playSong(album));
        newReleasesContainer.appendChild(card);
    });
}

// Create a song card element
function createSongCard(song) {
    const card = document.createElement('div');
    card.className = 'card suggested-item swipe-item';
    card.dataset.title = song.title;
    card.dataset.artist = song.artist;
    
    card.innerHTML = `
        <img src="${song.img}" alt="${song.title}" class="card-img">
        <div class="card-body">
            <h4 class="card-title">${song.title}</h4>
            <p class="card-subtitle">${song.artist}</p>
        </div>
    `;
    
    return card;
}

// Create an artist card element
function createArtistCard(artist) {
    const card = document.createElement('div');
    card.className = 'card artist-item swipe-item';
    
    card.innerHTML = `
        <img src="${artist.img}" alt="${artist.name}" class="card-img">
        <div class="card-body">
            <h4 class="card-title">${artist.name}</h4>
            <p class="card-subtitle">${artist.description}</p>
        </div>
    `;
    
    return card;
}

// Create an album card element
function createAlbumCard(album) {
    const card = document.createElement('div');
    card.className = 'card album-item swipe-item';
    card.dataset.title = album.title;
    card.dataset.artist = album.artist;
    
    card.innerHTML = `
        <img src="${album.img}" alt="${album.title}" class="card-img">
        <div class="card-body">
            <h4 class="card-title">${album.title}</h4>
            <p class="card-subtitle">${album.artist}</p>
        </div>
    `;
    
    return card;
}

// Initialize swipe functionality for mobile
function initSwipe() {
    const swipeContainers = document.querySelectorAll('.swipe-container');
    swipeContainers.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });

        // Touch events for mobile
        container.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('touchend', () => {
            isDown = false;
        });

        container.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
    });
}

// Set up all event listeners
function setupEventListeners() {
    // Auth button click
    authButton.addEventListener('click', function() {
        openPopup('register-popup');
    });
    
    // Logout button click
    logoutButton.addEventListener('click', function() {
        currentUser = null;
        localStorage.removeItem('musicPlayerUser');
        localStorage.removeItem('nourLikedSongs');
        localStorage.removeItem('nourPlaylists');
        updateUIForUser();
        closeAllPopups();
    });
    
    // Login form submission
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });
    
    // Signup form submission
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handleSignup();
    });
    
    // Create playlist button
    document.getElementById('create-playlist').addEventListener('click', function() {
        if (currentUser) {
            document.getElementById('playlist-popup-title').textContent = 'Create New Playlist';
            document.getElementById('playlist-submit-btn').textContent = 'Create';
            document.getElementById('playlist-name').value = '';
            document.getElementById('playlist-name-error').style.display = 'none';
            openPopup('playlist-popup');
        }
    });
    
    // Playlist form submission
    document.getElementById('playlist-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const playlistName = document.getElementById('playlist-name').value.trim();
        
        if (!playlistName) {
            document.getElementById('playlist-name-error').style.display = 'block';
            return;
        }
        
        if (currentUser) {
            playlists.push({
                id: Date.now().toString(),
                name: playlistName,
                songs: []
            });
            
            localStorage.setItem('nourPlaylists', JSON.stringify(playlists));
            renderPlaylists();
            closePopup('playlist-popup');
        }
    });
    
    // Player controls
    document.getElementById('now-playing-prev').addEventListener('click', prevSong);
    document.getElementById('now-playing-next').addEventListener('click', nextSong);
    document.getElementById('now-playing-play').addEventListener('click', playCurrentSong);
    document.getElementById('now-playing-pause').addEventListener('click', pauseCurrentSong);
    document.getElementById('now-playing-like').addEventListener('click', toggleLike);
    
    // Progress bar
    const progressBar = document.getElementById('progress-bar');
    progressBar.addEventListener('input', function() {
        const seekTime = (audioElement.duration / 100) * this.value;
        audioElement.currentTime = seekTime;
    });
    
    // Volume control
    const volumeControl = document.getElementById('volume-control');
    volumeControl.addEventListener('input', function() {
        audioElement.volume = this.value;
        updateVolumeIcon(this.value);
    });
    
    // Volume button (mute toggle)
    document.getElementById('volume-button').addEventListener('click', function() {
        if (audioElement.volume > 0) {
            audioElement.volume = 0;
            volumeControl.value = 0;
            updateVolumeIcon(0);
        } else {
            audioElement.volume = 0.7;
            volumeControl.value = 0.7;
            updateVolumeIcon(0.7);
        }
    });
    
    // Audio element events
    audioElement.addEventListener('play', () => {
        isPlaying = true;
        document.getElementById('now-playing-play').style.display = 'none';
        document.getElementById('now-playing-pause').style.display = 'flex';
    });
    
    audioElement.addEventListener('pause', () => {
        isPlaying = false;
        document.getElementById('now-playing-play').style.display = 'flex';
        document.getElementById('now-playing-pause').style.display = 'none';
    });
    
    audioElement.addEventListener('timeupdate', updateProgressBar);
    
    audioElement.addEventListener('loadedmetadata', function() {
        document.getElementById('time-total').textContent = formatTime(audioElement.duration);
    });
    
    audioElement.addEventListener('ended', nextSong);
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const allCards = document.querySelectorAll('.card');
        
        if (searchTerm.length === 0) {
            allCards.forEach(card => card.style.display = 'block');
            document.querySelectorAll('section').forEach(section => {
                section.style.display = 'block';
            });
            return;
        }
        
        let hasMatches = false;
        allCards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const artist = card.querySelector('.card-subtitle')?.textContent.toLowerCase() || '';
            const matches = title.includes(searchTerm) || artist.includes(searchTerm);
            
            card.style.display = matches ? 'block' : 'none';
            if (matches) hasMatches = true;
        });
        
        updateSectionVisibility(searchTerm);
    });

    // Initialize volume
    audioElement.volume = 0.7;
    volumeControl.value = 0.7;
    updateVolumeIcon(0.7);
}

// Update section visibility based on search results
function updateSectionVisibility(searchTerm) {
    const sections = {
        'playlist-section': '#playlist-container .card',
        'suggested-section': '#suggested-songs .card',
        'popular-artists-section': '#popular-artists .card',
        'popular-albums-section': '#new-releases .card',
        'liked-section': '#liked-container .card'
    };
    
    Object.entries(sections).forEach(([sectionId, selector]) => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const hasVisibleCards = section.querySelectorAll(`${selector}[style="display: block"]`).length > 0 || 
                              (searchTerm.length === 0 && section.querySelectorAll(selector).length > 0);
        
        section.style.display = hasVisibleCards ? 'block' : 'none';
    });
}

// Update progress bar and time display
function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const currentTime = document.getElementById('time-current');
    
    if (!isNaN(audioElement.duration)) {
        progressBar.value = (audioElement.currentTime / audioElement.duration) * 100;
        currentTime.textContent = formatTime(audioElement.currentTime);
    }
}

// Format time as mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update volume icon based on volume level
function updateVolumeIcon(volume) {
    const volumeIcon = document.querySelector('#volume-button i');
    
    if (volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Play a specific song
function playSong(song) {
    currentSongIndex = songs.findIndex(s => 
        s.title === song.title && s.artist === song.artist
    );
    
    document.getElementById('now-playing-title').textContent = song.title;
    document.getElementById('now-playing-artist').textContent = song.artist;
    document.getElementById('now-playing-img').src = song.img;
    
    audioElement.src = song.audio;
    nowPlayingBar.style.display = 'flex';
    
    const isLiked = likedSongs.some(s => 
        s.title === song.title && s.artist === song.artist
    );
    
    const likeButton = document.getElementById('now-playing-like');
    if (isLiked) {
        likeButton.innerHTML = '<i class="fas fa-heart"></i>';
        likeButton.classList.add('liked');
    } else {
        likeButton.innerHTML = '<i class="far fa-heart"></i>';
        likeButton.classList.remove('liked');
    }
    
    playCurrentSong();
}

// Play the current song
function playCurrentSong() {
    audioElement.play().catch(e => console.log('Auto-play prevented:', e));
}

// Pause the current song
function pauseCurrentSong() {
    audioElement.pause();
}

// Toggle like status of current song
function toggleLike() {
    if (!currentUser) {
        openPopup('register-popup');
        return;
    }
    
    const currentSong = songs[currentSongIndex];
    const isLiked = likedSongs.some(song => 
        song.title === currentSong.title && song.artist === currentSong.artist
    );
    
    const likeButton = document.getElementById('now-playing-like');
    if (isLiked) {
        likedSongs = likedSongs.filter(song => 
            !(song.title === currentSong.title && song.artist === currentSong.artist)
        );
        likeButton.innerHTML = '<i class="far fa-heart"></i>';
        likeButton.classList.remove('liked');
    } else {
        likedSongs.push(currentSong);
        likeButton.innerHTML = '<i class="fas fa-heart"></i>';
        likeButton.classList.add('liked');
    }
    
    if (currentUser.username === 'nour') {
        localStorage.setItem('nourLikedSongs', JSON.stringify(likedSongs));
    }
    
    renderLikedSongs();
}

// Play previous song
function prevSong() {
    currentSongIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1;
    playSong(songs[currentSongIndex]);
}

// Play next song
function nextSong() {
    currentSongIndex = currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0;
    playSong(songs[currentSongIndex]);
}

// Gather all songs from the data
function gatherAllSongs() {
    songs = [...musicData.recommendedSongs, ...musicData.newReleases];
}

// Update UI based on user login state
function updateUIForUser() {
    if (currentUser) {
        authSection.classList.add('hidden');
        userSection.classList.remove('hidden');
        document.getElementById('username-display').textContent = currentUser.username;
        document.getElementById('user-avatar').textContent = currentUser.username.charAt(0).toUpperCase();
        
        playlistActions.classList.remove('hidden');
        likedSection.classList.remove('hidden');
    } else {
        authSection.classList.remove('hidden');
        userSection.classList.add('hidden');
        
        playlistActions.classList.add('hidden');
        likedSection.classList.add('hidden');
        
        playlistContainer.innerHTML = '';
        likedContainer.innerHTML = '';
    }
}

// Load sample playlists for demo user
function loadSamplePlaylists() {
    if (currentUser && currentUser.username === 'nour') {
        const savedPlaylists = localStorage.getItem('nourPlaylists');
        
        if (savedPlaylists) {
            playlists = JSON.parse(savedPlaylists);
        } else {
            playlists = [
                { id: '1', name: 'Favorites', songs: [] },
                { id: '2', name: 'Workout Mix', songs: [] }
            ];
            localStorage.setItem('nourPlaylists', JSON.stringify(playlists));
        }
        
        renderPlaylists();
    }
}

// Load liked songs from storage
function loadLikedSongs() {
    if (currentUser && currentUser.username === 'nour') {
        const savedLikedSongs = localStorage.getItem('nourLikedSongs');
        if (savedLikedSongs) {
            likedSongs = JSON.parse(savedLikedSongs);
            renderLikedSongs();
        }
    }
}

// Render playlists to the UI
function renderPlaylists() {
    playlistContainer.innerHTML = '';
    
    if (playlists.length === 0) {
        playlistContainer.innerHTML = '<p>No playlists yet. Create one!</p>';
        return;
    }
    
    playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.className = 'card';
        playlistElement.innerHTML = `
            <img src="Media/playlist-placeholder.jpg" alt="${playlist.name}" class="card-img">
            <div class="card-body">
                <h4 class="card-title">${playlist.name}</h4>
                <p class="card-subtitle">${playlist.songs.length} songs</p>
            </div>
        `;
        playlistContainer.appendChild(playlistElement);
    });
}

// Render liked songs to the UI
function renderLikedSongs() {
    likedContainer.innerHTML = '';
    
    if (likedSongs.length === 0) {
        likedContainer.innerHTML = '<p>No liked songs yet. Like some songs!</p>';
        return;
    }
    
    likedSongs.forEach(song => {
        const songElement = document.createElement('div');
        songElement.className = 'card liked-song';
        songElement.innerHTML = `
            <img src="${song.img}" alt="${song.title}" class="card-img">
            <div class="card-body">
                <h4 class="card-title">${song.title}</h4>
                <p class="card-subtitle">${song.artist}</p>
            </div>
        `;
        songElement.addEventListener('click', () => playSong(song));
        likedContainer.appendChild(songElement);
    });
}

// Handle login form submission
function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    let isValid = true;
    
    document.getElementById('username-error').style.display = 'none';
    document.getElementById('password-error').style.display = 'none';
    document.getElementById('login-error-message').style.display = 'none';
    
    if (!username) {
        document.getElementById('username-error').style.display = 'block';
        isValid = false;
    }
    
    if (!password) {
        document.getElementById('password-error').style.display = 'block';
        isValid = false;
    }
    
    if (!isValid) return;
    
    if (username === 'nour' && password === '1234') {
        currentUser = { username: 'nour', email: 'nour@example.com' };
        localStorage.setItem('musicPlayerUser', JSON.stringify(currentUser));
        updateUIForUser();
        loadSamplePlaylists();
        loadLikedSongs();
        closePopup('register-popup');
    } else {
        document.getElementById('login-error-message').style.display = 'block';
    }
}

// Handle signup form submission
function handleSignup() {
    const username = document.getElementById('new-username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('new-password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    let isValid = true;
    
    document.getElementById('new-username-error').style.display = 'none';
    document.getElementById('email-error').style.display = 'none';
    document.getElementById('new-password-error').style.display = 'none';
    document.getElementById('confirm-password-error').style.display = 'none';
    
    if (!username) {
        document.getElementById('new-username-error').style.display = 'block';
        isValid = false;
    }
    
    if (!email || !email.includes('@')) {
        document.getElementById('email-error').style.display = 'block';
        isValid = false;
    }
    
    if (!password) {
        document.getElementById('new-password-error').style.display = 'block';
        isValid = false;
    }
    
    if (password !== confirmPassword) {
        document.getElementById('confirm-password-error').style.display = 'block';
        isValid = false;
    }
    
    if (!isValid) return;
    
    alert('Account created successfully! Please login.');
    switchToLogin();
}

// Open a popup
function openPopup(id) {
    document.getElementById(id).style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

// Close a popup
function closePopup(id) {
    document.getElementById(id).style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// Close all popups
function closeAllPopups() {
    document.querySelectorAll('.popup').forEach(popup => {
        popup.style.display = 'none';
    });
    document.getElementById('overlay').style.display = 'none';
}

// Switch to signup form
function switchToSignup() {
    closePopup('register-popup');
    document.getElementById('new-username').value = '';
    document.getElementById('email').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    document.getElementById('new-username-error').style.display = 'none';
    document.getElementById('email-error').style.display = 'none';
    document.getElementById('new-password-error').style.display = 'none';
    document.getElementById('confirm-password-error').style.display = 'none';
    openPopup('signup-popup');
}

// Switch to login form
function switchToLogin() {
    closePopup('signup-popup');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('username-error').style.display = 'none';
    document.getElementById('password-error').style.display = 'none';
    document.getElementById('login-error-message').style.display = 'none';
    openPopup('register-popup');
}