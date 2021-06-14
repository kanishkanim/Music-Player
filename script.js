
let playingSong = document.getElementById("playing-song");
let playButton = document.getElementById("play-button");
let pauseButton = document.getElementById("pause-button");
let endTime = document.getElementById("end-time");
let currentTime = document.getElementById("current-time");
let currentSeconds = 0;
let currentMinutes = 0;
let endMinutes = 0;
let endSeconds = 0;
let timeSlider = document.getElementById("time-slider");
let volumeSlider = document.getElementById("volume-slider");
let nextSongButton = document.getElementById("play-next-song");
let prevSongButton = document.getElementById("play-prev-song");
let loaderButton = document.getElementById("song-loader");
let activeTab = 0;
if(!window.localStorage.playlists)
window.localStorage.playlists = JSON.stringify({
    "super30": [1,2,3,4]
});

let audioInterval;
let playingElement;

function calculateCurrentTime() {
    currentMinutes = Math.floor(playingSong.currentTime / 60);
    currentSeconds = Math.ceil(playingSong.currentTime - (currentMinutes * 60));
    if(currentSeconds === endSeconds && currentMinutes === endMinutes) {
        currentSeconds = 0;
        currentMinutes = 0;
        clearInterval(audioInterval);
    }
    let minutes = (currentMinutes / 10) < 1 ? ("0" + currentMinutes) : currentMinutes;
    let seconds = (currentSeconds / 10) < 1 ? ("0" + currentSeconds) : currentSeconds;
    let finalTIme = minutes + ":" + seconds;
    currentTime.innerText = finalTIme;
}

timeSlider.addEventListener("change", () => {
    playingSong.currentTime = timeSlider.value;
    calculateCurrentTime();
});

volumeSlider.addEventListener("change", () => {
    playingSong.volume = (volumeSlider.value/100);
});

playingSong.addEventListener("canplaythrough", () => {
    calculateEndTime();
    timeSlider.setAttribute("max", Math.ceil(playingSong.duration));
    loaderButton.classList.add("not-active");
    playSong();
})

function calculateEndTime() {
    endMinutes = Math.floor(playingSong.duration / 60);
    endSeconds = Math.ceil(playingSong.duration - (endMinutes * 60));
    let minutes = (endMinutes / 10) < 1 ? ("0" + endMinutes) : endMinutes;
    let seconds = (endSeconds / 10) < 1 ? ("0" + endSeconds) : endSeconds;
    let finalTIme = minutes + ":" + seconds;
    endTime.innerText = finalTIme;
}

function playSong() {
    if(playingSong.getAttribute("src") === "") return;
    if(playingElement.getAttribute("id") == (songs.length - 1)) {
        nextSongButton.style.cursor = "not-allowed";
    } else {
        nextSongButton.style.cursor = "pointer";
    }
    if(playingElement.getAttribute("id") == 0) {
        prevSongButton.style.cursor = "not-allowed";
    } else {
        prevSongButton.style.cursor = "pointer";
    }
    playButton.style.cursor = "pointer";
    playingSong.play();
    playButton.classList.add("not-active");
    pauseButton.classList.remove("not-active");
    audioInterval = setInterval(() => {
        timeSlider.value = playingSong.currentTime;
        calculateCurrentTime();
    }, 1000);
}

function pauseSong() {
    playingSong.pause();
    playButton.classList.remove("not-active");
    pauseButton.classList.add("not-active");
    clearInterval(audioInterval);
}

function updateData() {
    for(let i = 0; i < songs.length; i++) {
        let songsTable = document.getElementById("songs-listing");
        let prevHtml = songsTable.innerHTML;
        let html = `<tr class="song" id="${songs[i].Id}" onClick="updatePlaySong(this)">
                        <td>${songs[i].Name}</td>
                        <td>${songs[i].Artist}</td>
                        <td></td>
                    </tr>`;
        songsTable.innerHTML = prevHtml + html;
    }
}

updateData();

function updatePlaySong(element) {
    playButton.classList.add("not-active");
    pauseButton.classList.add("not-active");
    loaderButton.classList.remove("not-active");
    if(playingElement) {
        playingElement.getElementsByTagName("td")[2].innerHTML = '';
    }
    let tds = element.getElementsByTagName("td")
    tds[2].innerHTML = '<img id="song-gif" src="https://cdn.dribbble.com/users/104605/screenshots/2921771/untitled.gif"></img>';
    let songId = element.getAttribute('id');
    playingSong.setAttribute('src', songs[songId].Url);
    currentSeconds = 0;
    currentMinutes = 0;
    playingElement = element;
}

function playNextSong() {
    if(playingElement && playingElement.getAttribute("id") != (songs.length - 1)) {
        let nextElement = playingElement.nextSibling;
        updatePlaySong(nextElement);
    }
}

function playPrevSong() {
    if(playingElement && playingElement.getAttribute("id") != 0) {
        let prevElement = playingElement.previousSibling;
        updatePlaySong(prevElement);
    }
}

function searchMusic(element) {
    let searchText = element.value;
    for(let i = 0; i < songs.length; i++) {
        if(songs[i].Name.indexOf(searchText) !== -1 || songs[i].Artist.indexOf(searchText) !== -1) {
            document.getElementById(i).style.display = "table-row";
        } else {
            document.getElementById(i).style.display = "none";
        }
    }
}

function highlight(element) {
    let navbarItems = document.getElementsByClassName("navbar-items");
    for(let i = 0; i< navbarItems.length; i++) {
        navbarItems[i].style.backgroundColor = null;
    }
    element.style.backgroundColor = "rgb(54,54,58)";
    activeTab = element.getAttribute("id").split("-")[1];
    if(activeTab == 1) {
        document.getElementById("playlist-list").style.display = "block";
    } else {
        document.getElementById("playlist-list").style.display = "none";
    }
}

highlight(document.getElementById("nav-0"));

function showPlaylistInput() {
    document.getElementById("new-playlist-name").style.display = " block";
    document.getElementById("new-playlist-name").focus();
}

function generatePlaylist() {
    let html = "";
    for(let i = 0; i < Object.keys(JSON.parse(window.localStorage.playlists)).length; i++) {
        html += `<li class="playlist-items">${Object.keys(JSON.parse(window.localStorage.playlists))[i]}</li>`
    }
    document.getElementById("playlist-list").innerHTML = html;
}

generatePlaylist();

document.getElementById("new-playlist-name").addEventListener("keyup", function(event) {
    if(event.keyCode === 13 && event.target.value != "") {
        let playlists = JSON.parse(window.localStorage.playlists);
        playlists[event.target.value] = [];
        window.localStorage.playlists = JSON.stringify(playlists);
        event.target.value = "";
        event.target.style.display = "none";
        generatePlaylist();
    } else if(event.keyCode === 13 && event.target.value == "") {
        event.target.style.display = "none";
    }
})