// var clientID = "0f6749aefe004361b5c218e24c953814";
// var clientSecret = "4940d82140ff4e47add12d60060cbcbc";
// var redirect_uri = "http://localhost:5000/playlists.html";

var apiToken =
  "BQDKnH82PW8wm341YLWaoYRIyXQ34g8G6KaphYWYTyDnNKPZCKUYILXXDnwAmvdv_kVUx0lfJMUzQ42J6QWEv5Mbxdpsygf1ATD_456JRuUBXv7HNrbN7qkP-8o88jaBYN_bEs3QszoiLFslmTSMOhirthCvjEncxl6jP0st2Mf1b9_LvdxT12mCxX3PVs3XzLzVhQ7wTVy-3ya6MUWMZRxl5HUS-g";
var playlist_id = "64RVqDV1d6MJUaecA0qLzh";
var user_id = "22yveymmku7jub4aafyfdmlya";

function test() {
  // getPlaylistTracks(playlist_id);
  getUserPlaylists(user_id, 6);
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
    const playlistDisplay = document.createElement("div");
    playlistDisplay.setAttribute("class", "playlist");
    if (data.items[i].images[1] != null) {
      playlistDisplay.style.backgroundImage = `url(${data.items[i].images[1].url})`;
    } else {
      playlistDisplay.style.backgroundImage = `url(${data.items[i].images[0].url})`;
    }
    playlistDisplay.innerHTML = data.items[i].name;
    document.getElementById("wrapper").appendChild(playlistDisplay);
    console.log("Name: " + data.items[i].name);
  }
};

const getPlaylistTracks = async (playlist_id) => {
  const result = await fetch(
    `https://api.spotify.com/v1/playlists/${playlist_id}?market=CA`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + apiToken },
    }
  );
  const data = await result.json();
  console.log(data);

  for (let i = 0; i < data.tracks.items.length; i++) {
    if (data.tracks.items[i].track != null) {
      console.log(
        "Duration: " + msToMinSec(data.tracks.items[i].track.duration_ms)
      );
      console.log("Track #" + i);
      console.log("Name: " + data.tracks.items[i].track.name);
      console.log("Artist: " + data.tracks.items[i].track.artists[0].name);
      console.log("\n");
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
