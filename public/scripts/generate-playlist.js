var apiToken;
var user_id;
var track_ids = [];

window.onload = function test() {
  refreshToken();
};

var refreshToken = async () => {
  const response = await fetch("/token-api");
  const data = await response.json();
  apiToken = data.access_token;
  getUserData();
};

const getUserData = async () => {
  const result = await fetch(`https://api.spotify.com/v1/me`, {
    method: "GET",
    headers: { Authorization: "Bearer " + apiToken },
  });
  const data = await result.json();
  if (data.error != undefined) {
    window.location.replace("/login");
  }
  user_id = data.id;
};

function addTracks() {
  const audiotest = document.getElementsByClassName("songAudio");
  for (let i = 0; i < audiotest.length; i++) {
    track_ids.push(audiotest[i].attributes.src.value);
  }

  createPlaylist();
}

//Creates a new playlist
//Playlist id is stored in data.id when api call is made
const createPlaylist = async () => {
  var today = new Date();
  var date =
    today.getMonth() + "/" + today.getDate() + "/" + today.getFullYear();
  var playlistName = "Generated playlist (" + date + ")";

  const result = await fetch(
    `https://api.spotify.com/v1/users/${user_id}/playlists`,
    {
      method: "POST",
      headers: { Authorization: "Bearer " + apiToken },
      body: JSON.stringify({
        name: playlistName,
        description: "Playlist generated via Persongify",
        public: false,
      }),
    }
  );

  const data = await result.json();

  addTracksToPlaylist(data.id);
};

const addTracksToPlaylist = async (playlist_id) => {
  var spotify_uris = [];
  for (let i = 0; i < track_ids.length; i++) {
    spotify_uris.push("spotify:track:" + track_ids[i]);
  }

  if (spotify_uris.length == 0) {
    return;
  }

  const result = await fetch(
    `https://api.spotify.com/v1/playlists/${playlist_id}/tracks `,
    {
      method: "POST",
      headers: { Authorization: "Bearer " + apiToken },
      body: JSON.stringify({
        uris: spotify_uris,
      }),
    }
  );

  var successP = document.createElement("p");
  if (result != null) {
    successP.innerHTML = "Playlist added!";
  } else {
    successP.innerHTML = "Unsuccessful. Please try again.";
  }
  document.getElementById("save-playlist-button").remove();
  document.getElementById("recommendation-header").appendChild(successP);
};
