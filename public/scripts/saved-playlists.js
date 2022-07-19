var apiToken;

window.onload = function test() {
  refreshToken();
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
  //Reset the page
  //   deleteChildren();
  //   document.getElementById("saved-button").setAttribute("class", "btn btn-dark");
  //   document
  //     .getElementById("spotify-button")
  //     .setAttribute("class", "btn btn-success");

  if (data.total == 0) {
    return;
  }
  var lowlimit = Math.min(limit, data.limit);
  for (let i = 0; i < lowlimit; i++) {
    if (data.items[i] == undefined) {
      return;
    }
    const overlay = document.createElement("div");
    overlay.setAttribute("class", "overlay");
    const playlistDisplay = document.createElement("div");
    playlistDisplay.setAttribute("class", "playlist");
    const overlayButton = document.createElement("button");
    overlayButton.setAttribute("class", "btn btn-success");
    const buttonHolder = document.createElement("div");
    buttonHolder.setAttribute("class", "btn-container");
    if (data.items[i].images[0] != undefined) {
      playlistDisplay.style.backgroundImage = `url(${data.items[i].images[0].url})`;
    } else {
      playlistDisplay.style.backgroundImage = `url(/media/generic-pfp.png)`;
    }

    buttonHolder.appendChild(overlayButton);
    overlay.innerHTML = data.items[i].name;
    overlayButton.innerHTML = "Preview";
    overlayButton.onclick = function () {
      window.open(data.items[i].external_urls.spotify);
    };
    overlay.appendChild(buttonHolder);
    playlistDisplay.appendChild(overlay);
    document.getElementById("playlist-wrapper").appendChild(playlistDisplay);
  }
}

// function addSavedPlaylistsToEndpoint(limit) {
//   deleteChildren();

//   document
//     .getElementById("saved-button")
//     .setAttribute("class", "btn btn-success");
//   document
//     .getElementById("spotify-button")
//     .setAttribute("class", "btn btn-dark");
// }

function deleteChildren() {
  const parent = document.getElementById("playlist-wrapper");
  child = parent.lastElementChild;
  while (child) {
    parent.removeChild(child);
    child = parent.lastElementChild;
  }
}
