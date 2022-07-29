window.onload = function test() {
    refreshToken();
};

var refreshToken = async () => {
    const response = await fetch("/token-api");
    try {
        const data = await response.json();
        apiToken = data.access_token;
        getTopArtists(apiToken);
    } catch (e) {
        console.log(e);
        window.location.replace("/login");
    }
};

const getTopArtists = async (apiToken) => {
    const result = await fetch(
        'https://api.spotify.com/v1/me/top/artist?time_range=medium_term&limit=5&offset=0',
        {
            method: "GET",
            headers: {Authorization: "Bearer " + apiToken},
            // Perhaps the error is called by not having "Content-Type: application/json" in the header?
            //https://developer.spotify.com/documentation/web-api/reference/#/operations/get-users-top-artists-and-tracks
        }
    );
    const data = await result.text();   // if I can figure out how to add the content type header then change this to result.json();
    if (data.error != undefined) {
        window.location.replace("/login");
      }
    document.getElementById("test").innerHTML = data;   // fails around here
    if (data.error != undefined) {
        console.log("Something went wrong getting data from Spotify API :(");
        window.localtion.replace("/login");
    }
}