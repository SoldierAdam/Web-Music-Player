const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const play = document.querySelector("#controls #play");
const prev = document.querySelector("#controls #prev");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");


const player = new MusicPlayer(musicList);

const musicName = player.getMusic();

window.addEventListener("load",() => {
    let music = player.getMusic();
    displayMusic(music);
    displayMusicList(player.musicList);
    isPlaying();
});

const displayMusic = (music) => {
    title.innerText = music.getName();
    image.src = "img/" + music.img;
    audio.src = "mp3/" + music.file;
}

play.addEventListener("click",() => {
    const isMusicPlay = container.classList.contains("playing");
    isMusicPlay ? pauseMusic() : playMusic();
});

prev.addEventListener("click", () => { prevMusic(); });

next.addEventListener("click", () => { nextMusic(); });

const nextMusic = () => {
    player.next();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlaying();
}

const prevMusic = () => {
    player.previous();
    let music = player.getMusic();
    displayMusic(music);
    playMusic();
    isPlaying();
}

const pauseMusic =() => {
    container.classList.remove("playing");
    play.querySelector("i").classList = "fa-solid fa-play";
    audio.pause();
}

const playMusic = () => {
    container.classList.add("playing");
    play.querySelector("i").classList = "fa-solid fa-pause"
    audio.play();
}

const calculateTime = (seconds) => {
    const minute = Math.floor(seconds / 60); 
    const second = Math.floor(seconds % 60);
    const updateSecond = second < 10 ? `0${second}` : `${second}`;
    const result = `${minute}:${updateSecond}`;
    return result;
}

audio.addEventListener("loadedmetadata", () => {
    duration.textContent = calculateTime(audio.duration);
    progressBar.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    progressBar.value = Math.floor(audio.currentTime);
    currentTime.textContent = calculateTime(progressBar.value);
});

progressBar.addEventListener("input", () => {
    currentTime.textContent = calculateTime(progressBar.value);
    audio.currentTime = progressBar.value;
});

let muteState = "voiced";

volumeBar.addEventListener("input", (e) => {
    const value = e.target.value;
    audio.volume = value / 100;
    if(value == 0){
        audio.muted = true;
        muteState = "muted";
        volume.classList = "fa-solid fa-volume-xmark";
    }else if(value > 0 && value < 50){
        volume.classList = "fa-solid fa-volume-low";
        audio.muted = false;
    }else if(value > 0){
        audio.muted = false;
        muteState = "voiced";
        volume.classList = "fa-solid fa-volume-high";
    }
});

volume.addEventListener("click", () => {
    if(muteState === "voiced"){
        audio.muted = true;
        muteState = "muted";
        volume.classList = "fa-solid fa-volume-xmark";
        volumeBar.value=0;
    }else{
        audio.muted = false;
        muteState = "voiced";
        volume.classList = "fa-solid fa-volume-high";
        volumeBar.value=100;
    }
});

const displayMusicList = (list) => {
    for(let i=0; i<list.length; i++){
        let liTag = `
            <li li-index="${i}" onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-items-center">
                <span>${list[i].getName()}</span>
                <span id="music-${i}" class="badge bg-primary rounded-pill"></span>
                <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
            </li>
        `;

        ul.insertAdjacentHTML("beforeend",liTag);

        let liDuration = ul.querySelector(`#music-${i}`);
        let liAudioTag = ul.querySelector(`.music-${i}`);

        liAudioTag.addEventListener("loadeddata", () =>{
            liDuration.innerText = calculateTime(liAudioTag.duration);
        });
    }
}

const selectedMusic = (li) => {
   player.index = li.getAttribute("li-index");
   displayMusic(player.getMusic());
   playMusic();
   isPlaying();
}

const isPlaying = () => {
    for(let li of ul.querySelectorAll("li")){
        if(li.classList.contains("playing")){
            li.classList.remove("playing");
        }if(li.getAttribute("li-index") == player.index){
            li.classList.add("playing");
        }
    }
}

audio.addEventListener("ended", () => {
    nextMusic();
    playMusic();
});