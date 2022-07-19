const TOP_HITS_ID = "37i9dQZEVXbMda2apknTqH";

window.onload = function test() {
  refreshToken();
};

var refreshToken = async () => {
  const response = await fetch("/token-api");
  try {
    const data = await response.json();
    apiToken = data.access_token;
    getFeaturedPlaylists(15, apiToken);
  } catch (e) {
    console.log(e);
    window.location.replace("/login");
  }
};
const getFeaturedPlaylists = async (limit, apiToken) => {
  const result = await fetch(
    `https://api.spotify.com/v1/playlists/${TOP_HITS_ID}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + apiToken },
    }
  );
  const data = await result.json();
  if (data.error != undefined) {
    window.location.replace("/login");
  }
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
      window.open(data.tracks.items[i].track.external_urls.spotify);
    };
    overlay.appendChild(buttonHolder);
    playlistDisplay.appendChild(overlay);
    document.getElementById("wrapper").appendChild(playlistDisplay);
  }
}
