//cid = 0f6749aefe004361b5c218e24c953814
//csec = 4940d82140ff4e47add12d60060cbcbc
//refresh-token = AQDn2G3IAhDEvSdQT08amw3G79I20BgRTSv7s9nALMt5vzsWK1nXw1-FnbhH1y34y5r67Kn7VVvseLbiiwvYatObqvEpiMXxiLBxHRWfhiUMn38W1gd_L4kxdJN0cc8yAck
//code = AQCmKczC1Zs1lRWNNALnus-p0jEi0Rh_aht9HrbgdO8TvUnP9bA7HrY5L8rfnhLTjW3kDIZ68YJ9jzh5XHkS1IOuCWSRoPS2F_XL_dkWJR5lV8mL-vlLFasHQ9vMzoLQVLPxI-xki1YqMZWX0_YIemY3dxaUy9kbBV7-WhCQVzDMykpVf4YzEkBcGyNmOrCs2IgJ1MzU-J9MZRvOa4I

var user_id = "22yveymmku7jub4aafyfdmlya";

function test() {
  refreshToken();
}

var refreshToken = async () => {
  const response = await fetch("http://localhost:5000/token-api");
  const data = await response.json();
  apiToken = data.access_token;
  getUserPlaylists(user_id, 7, apiToken);
  console.log("refreshed: " + apiToken);
};

const getUserPlaylists = async (user_id, limit, apiToken) => {
  console.log("using: " + apiToken);
  const result = await fetch(
    `https://api.spotify.com/v1/users/${user_id}/playlists?limit=${limit}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + apiToken },
    }
  );
  const data = await result.json();
  if(data.error != undefined) {
    window.location.replace("http://localhost:5000/home.html")
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
