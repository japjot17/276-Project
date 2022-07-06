window.onload = function test() {
  refreshToken();
};

var refreshToken = async () => {
  const response = await fetch("/token-api");
  try {
    const data = await response.json();
    apiToken = data.access_token;
    getFeaturedPlaylists(9, apiToken);
  } catch (e) {
    console.log(e);
    window.location.replace("/login");
  }
};
var top_hits_url = "37i9dQZEVXbMda2apknTqH";
const getFeaturedPlaylists = async (limit, apiToken) => {
  const result = await fetch(
    `https://api.spotify.com/v1/playlists/${top_hits_url}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + apiToken },
    }
  );
  const data = await result.json();
  if (data.error != undefined) {
    window.location.replace("/login");
  }
  console.log(data);
  addPlaylistToEndpoint(data, limit);
};

function addPlaylistToEndpoint(data, limit) {
  let lowLimit = Math.min(limit, data.tracks.items.length);
  for (let i = 0; i < lowLimit; i++) {
    const overlay = document.createElement("div");
    overlay.setAttribute("class", "overlay");
    const playlistDisplay = document.createElement("div");
    playlistDisplay.setAttribute("class", "playlist");
    const overlayButton = document.createElement("button");
    overlayButton.setAttribute("class", "btn btn-success");
    const buttonHolder = document.createElement("div");
    buttonHolder.setAttribute("class", "btn-container");
    if (data.tracks.items[i].track.album.images[1] == undefined) {
      //get 300x300 img
      playlistDisplay.style.backgroundImage = `url(${data.tracks.items[i].track.album.images[1].url})`;
    } else {
      //if none available, get default image
      playlistDisplay.style.backgroundImage = `url(${data.tracks.items[i].track.album.images[0].url})`;
    }
    buttonHolder.appendChild(overlayButton);
    overlay.innerHTML = data.tracks.items[i].track.name;
    overlayButton.innerHTML = "Preview";
    overlayButton.onclick = function () {
      location.href = data.tracks.items[i].track.external_urls.spotify;
    };
    overlay.appendChild(buttonHolder);
    playlistDisplay.appendChild(overlay);
    document.getElementById("wrapper").appendChild(playlistDisplay);
  }
}

function msToMinSec(duration_ms) {
  return (
    Math.floor(duration_ms / 60000) +
    "m " +
    ((duration_ms % 60000) / 1000).toFixed() +
    "s"
  );
}
