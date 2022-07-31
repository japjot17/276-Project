window.onload = function test() {
    refreshToken();
};

var user_id;
var spotify_uris = [];

var refreshToken = async () => {
    const response = await fetch("/token-api");
    try {
        const data = await response.json();
        apiToken = data.access_token;
        getUserData(apiToken);
        getTopArtists(apiToken);
        getTopTracks(apiToken);
    } catch (e) {
        console.log(e);
        window.location.replace("/login");
    }
};

const getUserData = async (apiToken) => {
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

const getTopArtists = async (apiToken) => {
    const result = await fetch(
        'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=5&offset=0',
        {
            method: "GET",
            headers: {Authorization: "Bearer " + apiToken},
        }
    );
    //const data = await result.text();
    const data = await result.json();
    if (data.error != undefined) {
        window.location.replace("/login");
    }

    // replace html elements with artist name
    //document.getElementById("test").innerHTML = data;
    document.getElementById("top-artist-1").innerHTML = "1. " + data.items[0].name;
    document.getElementById("top-artist-2").innerHTML = "2. " + data.items[1].name;
    document.getElementById("top-artist-3").innerHTML = "3. " + data.items[2].name;
    document.getElementById("top-artist-4").innerHTML = "4. " + data.items[3].name;
    document.getElementById("top-artist-5").innerHTML = "5. " + data.items[4].name;

    if (data.error != undefined) {
        console.log("Something went wrong getting data from Spotify API :(");
        window.localtion.replace("/login");
    }
}

const getTopTracks = async (apiToken) => {
    const result = await fetch(
        'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=5&offset=0',
        {
            method: "GET",
            headers: {Authorization: "Bearer " + apiToken},
        }
    )

    const data = await result.json();
    if (data.error != undefined) {
        window.location.replace("/login");
    }

    // replace html elements with track names
    document.getElementById("top-tracks-1").innerHTML = "1. " + data.items[0].name;
    document.getElementById("top-tracks-2").innerHTML = "2. " + data.items[1].name;
    document.getElementById("top-tracks-3").innerHTML = "3. " + data.items[2].name;
    document.getElementById("top-tracks-4").innerHTML = "4. " + data.items[3].name;
    document.getElementById("top-tracks-5").innerHTML = "5. " + data.items[4].name;

    if (data.error != undefined) {
        console.log("Something went wrong getting data from Spotify API :(");
        window.location.replace("/login");
    }

    for (let i = 0; i < data.items.length; i++) {
      spotify_uris.push("spotify:track:" + data.items[i].id);
    }
}

const createPlaylist = async () => {
    var playlistName = document.getElementById("playlist-name").value;
    if(playlistName == "") {
      document.getElementById("playlist-status-msg").innerHTML = "***Enter a name!***";
      return;
    }
    else {
      document.getElementById("playlist-status-msg").innerHTML = "Playlist created!";
    }
  
    const result = await fetch(
      `https://api.spotify.com/v1/users/${user_id}/playlists`,
      {
        method: "POST",
        headers: { Authorization: "Bearer " + apiToken },
        body: JSON.stringify({
          name: playlistName,
          description: "Personalized Year in Review playlist generated via Persongify",
          public: true,
        }),
      }
    );

  const data = await result.json();
  addTracksToPlaylist(data.id);
}

const addTracksToPlaylist = async (playlist_id) => {
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

    if (result != null) {
      document.getElementById("playlist-status-msg").innerHTML = "Playlist added!";
    } else {
      document.getElementById("playlist-status-msg").innerHTML = "Unsuccessful. Please try again.";
    }
  };