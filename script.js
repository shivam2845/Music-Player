const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const progress = document.getElementById("progress");
const current = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const volume = document.getElementById("volume");

const songs = [
    {
        title: "Sunny",
        artist: "Bensound",
        src: "https://www.bensound.com/bensound-music/bensound-sunny.mp3",
        img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=0c8e9f3f0f6f9fa3b3f5c8ef5e6c6b2d"
    },
    {
        title: "Adventure",
        artist: "Bensound",
        src: "https://www.bensound.com/bensound-music/bensound-adventure.mp3",
        img: "https://images.unsplash.com/photo-1495435229349-e86db7bfa013?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=6f86e6a5d6b1f7b0c6a5e1a2f0b9a8c7"
    },
    {
        title: "Energy",
        artist: "Bensound",
        src: "https://www.bensound.com/bensound-music/bensound-energy.mp3",
        img: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3e2a7b8c1d9b6b8c9a2d3f4b5c6a7d8e"
    }
];

let index = 0;
let isSeeking = false;

// Load Song safely
function loadSong(i){
    // stop current playback and remove listeners to avoid race conditions
    audio.pause();
    audio.removeAttribute('src');
    audio.load();

    // set meta
    document.getElementById("title").innerText = songs[i].title;
    document.getElementById("artist").innerText = songs[i].artist;
    document.getElementById("albumArt").src = songs[i].img;

    // assign new source
    audio.src = songs[i].src;
    audio.load();

    // once ready, play (handle autoplay restrictions)
    audio.oncanplay = () => {
        audio.play().then(()=> {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(err => {
            // autoplay prevented; keep play icon
            console.log('Autoplay prevented or play interrupted:', err);
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        });
    };
}

// Play / Pause
playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().then(()=> playBtn.innerHTML = '<i class="fas fa-pause"></i>')
        .catch(err => console.log('Play prevented:', err));
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

// Update progress and times
audio.addEventListener('timeupdate', () => {
    if (!isSeeking && audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
    }
    current.innerText = formatTime(audio.currentTime);
    duration.innerText = formatTime(audio.duration);
});

// Seek handlers
progress.addEventListener('input', () => { isSeeking = true; });
progress.addEventListener('change', () => {
    if (audio.duration) {
        audio.currentTime = (progress.value * audio.duration) / 100;
    }
    isSeeking = false;
});

// Volume
volume.addEventListener('input', () => {
    audio.volume = volume.value;
});

// Next / Prev
document.getElementById('next').addEventListener('click', () => {
    index = (index + 1) % songs.length;
    loadSong(index);
});
document.getElementById('prev').addEventListener('click', () => {
    index = (index - 1 + songs.length) % songs.length;
    loadSong(index);
});

// Auto next when song ends
audio.addEventListener('ended', () => {
    index = (index + 1) % songs.length;
    loadSong(index);
});

// Utilities
function formatTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Initialize
loadSong(index);
