const playbutton = document.getElementById('play-button')
const disk = document.getElementsByClassName('disk')
const play_icons = document.getElementById("play-icon")
const musicsound = document.getElementById("music")
const title = document.getElementById('SongName')
const artist = document.getElementById('artists')
const prev = document.getElementById('prev')
const next = document.getElementById('next')
const songName = document.getElementsByClassName('songName')
const songArtist = document.getElementsByClassName('songArtists')
const song = []
const artists = []
prev.addEventListener('click', prevClick)
playbutton.addEventListener('click', change)
next.addEventListener('click', nextClick)
function change () {
    const isPlayButton = play_icons.classList.contains('fa-play')
    if (isPlayButton) {
        play_icons.classList.remove('fa-play')
        play_icons.classList.add('fa-pause')
        
    } else {
        play_icons.classList.remove('fa-pause')
        play_icons.classList.add('fa-play')
    }
  }


playbutton.onclick = function() {
    disk[0].classList.toggle('disk-move')
}
let currentSelectedSongIndex = 0 
for(const songHTML of songName){
  song.push(songHTML.innerHTML)
}
for(const artistHTML of songArtist){
    artists.push(artistHTML.innerHTML)
  }
if (!song.length) {
    title.innerHTML = "Song Name"
}else {
    title.innerHTML = song[0]
}
if (!artists.length){
    artist.innerHTML = "Artist"
}else {
    artist.innerHTML = artists[0]
}
function prevClick() {
    let prevIndex = currentSelectedSongIndex - 1
  if(prevIndex >= 0){
    title.innerHTML = song[prevIndex]
    artist.innerHTML = artists[prevIndex]
    --currentSelectedSongIndex;
  }
}
function nextClick() {
    let nextIndex = currentSelectedSongIndex + 1
  if(nextIndex < song.length){
    title.innerHTML = song[nextIndex]
    artist.innerHTML = artists[nextIndex]
    ++currentSelectedSongIndex;
  }
}
/*
next.addEventListener('click', singer);
title.innerHTML = songName[0]
function singer() {
    
    console.log(songName)
    songNum++
    songNum %= songName.length
    title.innerHTML = songName[songNum]
}
*/

