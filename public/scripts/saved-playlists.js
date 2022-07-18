var apiToken;

window.onload = function test() {
  refreshToken();
  //   updateSpotify();
};

var refreshToken = async () => {
  const response = await fetch("/token-api");
  try {
    const data = await response.json();
    apiToken = data.access_token;
    updateSpotify();
  } catch (e) {
    window.location.replace("/login");
  }
};

function updateSpotify() {
  getSpotifyPlaylists(12);
}

function updateSaved() {
  addSavedPlaylistsToEndpoint(12);
}

const getSpotifyPlaylists = async (limit) => {
  const result = await fetch(`https://api.spotify.com/v1/me/playlists`, {
    method: "GET",
    headers: { Authorization: "Bearer " + apiToken },
  });
  const data = await result.json();
  if (data.error != undefined) {
    window.location.replace("/login");
  }
  addSpotifyPlaylistsToEndpoint(limit, data);
};

function addSpotifyPlaylistsToEndpoint(limit, data) {
  console.log(data);
  //Reset the page
  deleteChildren();

  var lowlimit = Math.min(limit, data.limit);
  for (let i = 0; i < lowlimit; i++) {
    const overlay = document.createElement("div");
    overlay.setAttribute("class", "overlay");
    const playlistDisplay = document.createElement("div");
    playlistDisplay.setAttribute("class", "playlist");
    const overlayButton = document.createElement("button");
    overlayButton.setAttribute("class", "btn btn-success");
    const buttonHolder = document.createElement("div");
    buttonHolder.setAttribute("class", "btn-container");
    playlistDisplay.style.backgroundImage = `url(${data.items[i].images[0].url})`;

    buttonHolder.appendChild(overlayButton);
    overlay.innerHTML = data.items[i].name;
    overlayButton.innerHTML = "Preview";
    overlayButton.onclick = function () {
      window.open(data.items[i].external_urls.spotify);
    };
    overlay.appendChild(buttonHolder);
    playlistDisplay.appendChild(overlay);
    document.getElementById("playlist-wrapper").appendChild(playlistDisplay);

    document
      .getElementById("saved-button")
      .setAttribute("class", "btn btn-dark");
    document
      .getElementById("spotify-button")
      .setAttribute("class", "btn btn-success");
  }
}

function addSavedPlaylistsToEndpoint(limit) {
  deleteChildren();

  document
    .getElementById("saved-button")
    .setAttribute("class", "btn btn-success");
  document
    .getElementById("spotify-button")
    .setAttribute("class", "btn btn-dark");
}

function deleteChildren() {
  const parent = document.getElementById("playlist-wrapper");
  child = parent.lastElementChild;
  while (child) {
    parent.removeChild(child);
    child = parent.lastElementChild;
  }
}
