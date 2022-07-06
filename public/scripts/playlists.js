function test() {
  refreshToken();
}

var refreshToken = async () => {
  const response = await fetch("/token-api");
  try {
    const data = await response.json();
    apiToken = data.access_token;
    // getUserPlaylists(user_id, 7, apiToken);
    getFeaturedPlaylists(9, apiToken);
  } catch (e) {
    console.log(e);
    window.location.replace("/home");
  }
};

const getFeaturedPlaylists = async (limit, apiToken) => {
  const result = await fetch(
    `https://api.spotify.com/v1/browse/featured-playlists?limit=${limit}  `,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + apiToken },
    }
  );
  const data = await result.json();
  if (data.error != undefined) {
    window.location.replace("/home");
  }
  addPlaylistToEndpoint(data);
};

const getUserPlaylists = async (user_id, limit, apiToken) => {
  const result = await fetch(
    `https://api.spotify.com/v1/users/${user_id}/playlists?limit=${limit}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + apiToken },
    }
  );
  const data = await result.json();
  if (data.error != undefined) {
    window.location.replace("/home");
  }
  for (let i = 0; i < data.items.length; i++) {
    const overlay = document.createElement("div");
    overlay.setAttribute("class", "overlay");
    const playlistDisplay = document.createElement("div");
    playlistDisplay.setAttribute("class", "playlist");
    const overlayButton = document.createElement("button");
    overlayButton.setAttribute("class", "btn btn-success");
    const buttonHolder = document.createElement("div");
    buttonHolder.setAttribute("class", "btn-container");
    if (data.items[i].images[1] != null) {
      //get 300x300 img
      playlistDisplay.style.backgroundImage = `url(${data.items[i].images[1].url})`;
    } else {
      //if none available, get default image
      playlistDisplay.style.backgroundImage = `url(${data.items[i].images[0].url})`;
    }
    buttonHolder.appendChild(overlayButton);
    overlay.innerHTML = data.items[i].name;
    overlayButton.innerHTML = "Do something";
    overlay.appendChild(buttonHolder);
    playlistDisplay.appendChild(overlay);
    document.getElementById("wrapper").appendChild(playlistDisplay);
  }
};

function addPlaylistToEndpoint(data) {
  for (let i = 0; i < data.playlists.items.length; i++) {
    const overlay = document.createElement("div");
    overlay.setAttribute("class", "overlay");
    const playlistDisplay = document.createElement("div");
    playlistDisplay.setAttribute("class", "playlist");
    const overlayButton = document.createElement("button");
    overlayButton.setAttribute("class", "btn btn-success");
    const buttonHolder = document.createElement("div");
    buttonHolder.setAttribute("class", "btn-container");
    if (data.playlists.items[i].images[1] != null) {
      //get 300x300 img
      playlistDisplay.style.backgroundImage = `url(${data.playlists.items[i].images[1].url})`;
    } else {
      //if none available, get default image
      playlistDisplay.style.backgroundImage = `url(${data.playlists.items[i].images[0].url})`;
    }
    buttonHolder.appendChild(overlayButton);
    overlay.innerHTML = data.playlists.items[i].name;
    overlayButton.innerHTML = "Do something";
    overlay.appendChild(buttonHolder);
    playlistDisplay.appendChild(overlay);
    document.getElementById("wrapper").appendChild(playlistDisplay);
  }
}

// function getToken() {}

function msToMinSec(duration_ms) {
  return (
    Math.floor(duration_ms / 60000) +
    "m " +
    ((duration_ms % 60000) / 1000).toFixed() +
    "s"
  );
}
