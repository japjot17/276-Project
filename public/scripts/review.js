window.onload = function test() {
    refreshToken();
};

var refreshToken = async () => {
    const response = await fetch("/token-api");
    try {
        const data = await response.json();
        apiToken = data.access_token;
        getTopArtists(apiToken);
        getTopTracks(apiToken);
    } catch (e) {
        console.log(e);
        window.location.replace("/login");
    }
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
        window.localtion.replace("/login");
    }
}