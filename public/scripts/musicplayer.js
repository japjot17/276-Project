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
const songImages = document.getElementsByClassName('songImages')
const songAudio = document.getElementsByClassName('songAudio')
const imageDisk = document.getElementsByClassName('imageDisk')
var elements = document.querySelectorAll("iframe, src");
const song = []
const artists = []
const audios = []
const images = []
let currentSelectedSongIndex = 0 
prev.addEventListener('click', prevClick)
// playbutton.addEventListener('click', change)
next.addEventListener('click', nextClick)


for (const audioHTML of songAudio) {
  audios.push(`https://open.spotify.com/embed/track/${audioHTML.innerHTML}?utm_source=generator`)
  audioHTML.innerHTML = ""
}
if (audios.length){
 elements[0].src = audios[0]
}
var audio = new Audio()


// audio.volume = 0.3;
// audio.loop = false;
// audio.src = audios[1];

// console.log("audio", audios)
// console.log("e",  elements[0])
// function change () {
//     const isPlayButton = play_icons.classList.contains('fa-play')
//     if (isPlayButton) {
      
//       audio.play();
//         play_icons.classList.remove('fa-play')
//         play_icons.classList.add('fa-pause')
        
        
//     } else {
//       audio.pause();
//         play_icons.classList.remove('fa-pause')
//         play_icons.classList.add('fa-play')
       
//     }
//   }


// playbutton.onclick = function() {
//     disk[0].classList.toggle('disk-move')
// }

for(const songHTML of songName){

  song.push(songHTML.innerHTML)
}
for(const artistHTML of songArtist){
    artists.push(artistHTML.innerHTML)
  }

  for(const imagetHTML of songImages){
    images.push(imagetHTML.innerHTML)
    // disk[0].style.backgroundImage = 'url('+images[currentSelectedSongIndex]+')'
    imagetHTML.innerHTML = ""
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
    
    // disk[0].style.backgroundImage = 'url('+images[prevIndex]+')'
    elements[0].src = audios[prevIndex]
    --currentSelectedSongIndex;
  }
}
function nextClick() {
    let nextIndex = currentSelectedSongIndex + 1
  if(nextIndex < song.length){
    title.innerHTML = song[nextIndex]
    artist.innerHTML = artists[nextIndex]
    // disk[0].style.backgroundImage = 'url('+images[nextIndex]+')'
    elements[0].src = audios[nextIndex]
    ++currentSelectedSongIndex;
  }
}


