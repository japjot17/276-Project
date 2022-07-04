//cid = 0f6749aefe004361b5c218e24c953814
//csec = 4940d82140ff4e47add12d60060cbcbc
//refresh-token = AQDn2G3IAhDEvSdQT08amw3G79I20BgRTSv7s9nALMt5vzsWK1nXw1-FnbhH1y34y5r67Kn7VVvseLbiiwvYatObqvEpiMXxiLBxHRWfhiUMn38W1gd_L4kxdJN0cc8yAck
//code = AQCmKczC1Zs1lRWNNALnus-p0jEi0Rh_aht9HrbgdO8TvUnP9bA7HrY5L8rfnhLTjW3kDIZ68YJ9jzh5XHkS1IOuCWSRoPS2F_XL_dkWJR5lV8mL-vlLFasHQ9vMzoLQVLPxI-xki1YqMZWX0_YIemY3dxaUy9kbBV7-WhCQVzDMykpVf4YzEkBcGyNmOrCs2IgJ1MzU-J9MZRvOa4I

var apiToken =
  "BQDvrJn-w-9fWIKEawV5nV3dMNAKeMyJpCwCTnwPK7QEh84tDJxA3JWXWN6StxBvtPs-SW-GF8lx6M-Sc7R7Ef0HldMQmgKDANNhq_LCHxBRKh6i-tlnu-ARYGnTbiewfHtOtLjfyB8rUPYyMJnPz_z0DYbLQ74CV1IDxPY-sLgjv41awtm2uQZmdBbntJxJdH-hD2frSGEIwZpHbTYSBlFNjEjomQ";
var playlist_id = "64RVqDV1d6MJUaecA0qLzh";
var user_id = "22yveymmku7jub4aafyfdmlya";

function test() {
  getUserPlaylists(user_id, 15);
}

const getUserPlaylists = async (user_id, limit) => {
  const result = await fetch(
    `https://api.spotify.com/v1/users/${user_id}/playlists?limit=${limit}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + apiToken },
    }
  );
  const data = await result.json();
  console.log(data);
  for (let i = 0; i < data.items.length; i++) {
    if (data.items[i].name != "") {
      const overlay = document.createElement("div");
      overlay.setAttribute("class", "overlay");
      const playlistDisplay = document.createElement("div");
      playlistDisplay.setAttribute("class", "playlist");
      if (data.items[i].images[1] != null) {
        //get 300x300 img
        playlistDisplay.style.backgroundImage = `url(${data.items[i].images[1].url})`;
      } else {
        //if none available, get default image
        playlistDisplay.style.backgroundImage = `url(${data.items[i].images[0].url})`;
      }
      overlay.innerHTML = data.items[i].name;
      playlistDisplay.appendChild(overlay);
      document.getElementById("wrapper").appendChild(playlistDisplay);
    }
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
