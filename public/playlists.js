//temporary user_id
var user_id = "22yveymmku7jub4aafyfdmlya";

function test() {
  refreshToken();
}

var refreshToken = async () => {
  const response = await fetch("http://localhost:5000/token-api");
  const data = await response.json();
  apiToken = data.access_token;
  getUserPlaylists(user_id, 7, apiToken);
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
    window.location.replace("http://localhost:5000/home");
  }
  console.log(data);
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

// function getToken() {}

function msToMinSec(duration_ms) {
  return (
    Math.floor(duration_ms / 60000) +
    "m " +
    ((duration_ms % 60000) / 1000).toFixed() +
    "s"
  );
}
