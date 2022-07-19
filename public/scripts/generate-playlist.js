var apiToken;
var user_id;
var track_ids = [];

window.onload = function test() {
    // for(let i = 0; i < audiotest.length; i++) {
        //     console.log(audiotest[i].attributes.src.value);
        // }
        
    refreshToken();
}

var refreshToken = async () => {
    const response = await fetch("http://localhost:5000/token-api");
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
    const audiotest = document.getElementsByClassName('songAudio');
    for(let i = 0; i < audiotest.length; i++) {
        track_ids.push(audiotest[i].attributes.src.value);
    }

    createPlaylist();
}

const createPlaylist = async() => {
    const result = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
        method: "POST",
        headers: { Authorization: "Bearer " + apiToken },
        body: JSON.stringify({
                name: "test",
                description: "creating playlist",
                public: false,
            })
    });

    const data = await result.json();

    addTracksToPlaylist(data.id);
}

const addTracksToPlaylist = async(playlist_id) => {
    var spotify_uris = [];
    for(let i = 0; i < track_ids.length; i++) {
        spotify_uris.push("spotify:track:" + track_ids[i]);
    }

    if(spotify_uris.length == 0) { return; }

    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks `, {
        method: "POST",
        headers: { Authorization: "Bearer " + apiToken },
        body: JSON.stringify({
                uris: spotify_uris,
            })
    });
}