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
const songAudio = document.querySelectorAll('songAudio')
const imageDisk = document.getElementsByClassName('imageDisk')

const song = []
const artists = []
const audios = []
const images = []
let currentSelectedSongIndex = 0 
prev.addEventListener('click', prevClick)
playbutton.addEventListener('click', change)
next.addEventListener('click', nextClick)

var tracks = new Audio(songAudio)
tracks.src = audios[currentSelectedSongIndex]

function change () {
    const isPlayButton = play_icons.classList.contains('fa-play')
    if (isPlayButton) {
      tracks.play()
      
        play_icons.classList.remove('fa-play')
        play_icons.classList.add('fa-pause')
        
        
    } else {
      tracks.pause()
        play_icons.classList.remove('fa-pause')
        play_icons.classList.add('fa-play')
       
    }
  }


playbutton.onclick = function() {
    disk[0].classList.toggle('disk-move')
}

for(const songHTML of songName){

  song.push(songHTML.innerHTML)
}
for(const artistHTML of songArtist){
    artists.push(artistHTML.innerHTML)
  }
  for(const imagetHTML of songImages){
    images.push(imagetHTML.innerHTML)
    disk[0].style.backgroundImage = 'url('+images[currentSelectedSongIndex]+')'
    imagetHTML.innerHTML = ""
  }
  console.log("image", images)
  console.log("song", song)
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
    disk[0].style.backgroundImage = 'url('+images[prevIndex]+')'
    tracks.src = audios[prevIndex]
    --currentSelectedSongIndex;
  }
}
function nextClick() {
    let nextIndex = currentSelectedSongIndex + 1
  if(nextIndex < song.length){
    title.innerHTML = song[nextIndex]
    artist.innerHTML = artists[nextIndex]
    disk[0].style.backgroundImage = 'url('+images[nextIndex]+')'
    tracks.src = audios[nextIndex]
    ++currentSelectedSongIndex;
  }
}


