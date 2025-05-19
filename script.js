const audio = new Audio();
let isPlaying = false;

const playPauseBtn = document.getElementById("playPauseBtn");
playPauseBtn.addEventListener("click", togglePlayPause);

const tracks = [
    {
        src: "C:/Users/pak/Desktop/CODE ALPHA/Music Player/mp3/_Sooraj_Dooba_Hain_____Arijit_singh_Aditi_Singh_Sharma___T-SERIES(128k).m4a",
        albumArt: "https://i.ytimg.com/vi/d1ldnvNoAE4/hqdefault.jpg",
        trackTitle: "Sooraj Dooba Hain",
        bandName: "Arijit singh",
        duration: "4:20"
    },
  
    {
        src: "C:/Users/pak/Desktop/CODE ALPHA/Music Player/mp3/Be_Intehaan___Atif___Sunidhi___Saif_Ali_Khan___Deepika_Padukone___Race_2(256k).mp3",
        albumArt: "https://i.ytimg.com/vi/RfgJis56cfo/hqdefault.jpg",
        trackTitle: "Be Intehaan",
        bandName: "Atif Aslam",
        duration: "3:29"
    },
    {
        src: "C:/Users/pak/Desktop/CODE ALPHA/Music Player/mp3/Bekhayali_Full_Song___Kabir_Singh___Shahid_K,Kiara_A_Sandeep_Reddy_Vanga___Sachet-Parampara___Irshad(128k).m4a",
        albumArt: "https://i.ytimg.com/vi/Xj04y_U-v-4/hqdefault.jpg",
        trackTitle: "Bekhayali",
        bandName: "Irshad Kamil",
        duration: "3:27"
    },
    {
        src: "C:/Users/pak/Desktop/CODE ALPHA/Music Player/mp3/Dil (Full Video) Raghav's Version _ Ek Villain Returns _ John, Disha, Arjun, Tara _ Kaushik-Guddu (2).mp3",
        albumArt: "https://i.ytimg.com/vi/W_ZX2gSIqmw/hqdefault.jpg",
        trackTitle: "Dil",
        bandName: "Raghav Chaitanya",
        duration: "3:27"
    },
    
    {
        src: "C:/Users/pak/Desktop/CODE ALPHA/Music Player/mp3/Kesariya_-_Film_Version___Brahmāstra___Ranbir___Alia___Pritam___Arijit___Amitabh(128k).m4a",
        albumArt: "https://i.ytimg.com/vi/532toSHe57E/hqdefault.jpg",
        trackTitle: "Kesaryia",
        bandName: "Arjit Singh",
        duration: "3:27"
    },
   
];

let currentTrackIndex = 0;

function loadTrack(trackIndex) {
    const track = tracks[trackIndex];
    audio.src = track.src;
    document.getElementById("albumArt").src = track.albumArt;
    document.getElementById("trackTitle").textContent = track.trackTitle;
    document.getElementById("bandName").textContent = track.bandName;
    document.getElementById("trackTime").textContent = track.duration;
}

loadTrack(currentTrackIndex);


audio.addEventListener("timeupdate", () => {
    const currentTime = formatTime(audio.currentTime);
    document.getElementById("currentTime").textContent = currentTime;
    document.getElementById("seekSlider").value = audio.currentTime;

    if (audio.buffered.length > 0) {
        const buffered = audio.buffered.end(0);
        const bufferPercent = (buffered / audio.duration) * 100;
        document.getElementById("bufferingIndicator").style.width = `${bufferPercent}%`;
    }

    // Update the seek indicator width based on the current time percentage
    const currentPercent = (audio.currentTime / audio.duration) * 100;
    document.getElementById("seekIndicator").style.width = `${currentPercent}%`;
});

function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Event listener for seek slider
const seekSlider = document.getElementById("seekSlider");
seekSlider.addEventListener("input", handleSeek);

function handleSeek() {
    const seekTime = parseFloat(seekSlider.value);
    audio.currentTime = seekTime;
}

// Event listener for updating the total duration when metadata is loaded
audio.addEventListener("loadedmetadata", () => {
    seekSlider.max = audio.duration;
    const totalDuration = formatTime(audio.duration);
    document.getElementById("trackTime").textContent = totalDuration;
});

// Function to toggle play and pause
function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}

// Event listeners for play and pause
audio.addEventListener("pause", () => {
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
});

audio.addEventListener("play", () => {
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

// Event listener for track ending
audio.addEventListener("ended", playNextOrLoop);

function playNextOrLoop() {
    if (isLooping) {
        // If looping is enabled, replay the current track
        audio.currentTime = 0;
        audio.play();
    } else {
        if (isShuffled) {
            playNextTrackInShuffle();
        } else {
            playNextSequentialTrack();
        }
    }
}

// Functions to play next track (either in shuffle or sequential)
function playNextTrackInShuffle() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    audio.play();
}

function playNextSequentialTrack() {
    if (currentTrackIndex === tracks.length - 1) {
        currentTrackIndex = 0;
    } else {
        currentTrackIndex++;
    }
    loadTrack(currentTrackIndex);
    audio.play();
}

// Event listeners for next and previous buttons
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

nextBtn.addEventListener("click", playNextTrack);
prevBtn.addEventListener("click", playPreviousTrack);

function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    audio.play();
    isPlaying = true;
}

function playPreviousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    audio.play();
    isPlaying = true;
}

// Event listeners for loop and shuffle buttons
const shuffleBtn = document.getElementById("shuffleBtn");
const loopBtn = document.getElementById("loopBtn");

let isShuffled = false;
let isLooping = false;

shuffleBtn.addEventListener("click", toggleShuffle);
loopBtn.addEventListener("click", toggleLoop);

function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle("active", isShuffled);
    
    if (isShuffled) {
        shuffleTracks();
    }
}

function shuffleTracks() {
    // Fisher-Yates shuffle algorithm
    for (let i = tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
    }
}

function toggleLoop() {
    isLooping = !isLooping;
    loopBtn.classList.toggle("active", isLooping);
    audio.loop = isLooping;
}

// Volume control functionality
const muteBtn = document.getElementById("muteBtn");
const volumeSlider = document.getElementById("volumeSlider");
const volumeIndicator = document.getElementById("volumeIndicator");
const volumeBar = document.getElementById("volume-bar"); // Assuming #volume-bar exists

let isMuted = false;
let savedVolume = 1; // Store the volume before muting

muteBtn.addEventListener("click", toggleMute);
volumeSlider.addEventListener("input", setVolume);

function toggleMute() {
    isMuted = !isMuted;
    if (isMuted) {
        savedVolume = audio.volume;
        audio.volume = 0;
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        volumeBar.classList.add("muted"); // Add muted class
    } else {
        audio.volume = savedVolume;
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        volumeBar.classList.remove("muted"); // Remove muted class
    }
    volumeSlider.value = isMuted ? 0 : savedVolume;
    muteBtn.classList.toggle("active", isMuted);

    // Update volume indicator width
    updateVolumeIndicator();
}

function setVolume() {
    if (!isMuted) {
        audio.volume = volumeSlider.value;
        savedVolume = volumeSlider.value;
    }

    // Update volume indicator width
    updateVolumeIndicator();
}

// Function to update the volume indicator width
function updateVolumeIndicator() {
    const volumePercentage = audio.volume * 100;
    volumeIndicator.style.width = `${volumePercentage}%`;
}

// Initialize the volume indicator width on load
updateVolumeIndicator();

// Like button functionality
const likeBtn = document.getElementById("likeBtn");
let isLiked = false;

likeBtn.addEventListener("click", function() {
    if (isLiked) {
        likeBtn.classList.remove("liked");
        likeBtn.innerHTML = '<i class="far fa-heart"></i>';
    } else {
        likeBtn.classList.add("liked");
        likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
    }
    isLiked = !isLiked;
});
