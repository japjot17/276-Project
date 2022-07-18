window.onload = function test() {
  refreshToken();
};

var refreshToken = async () => {
  const response = await fetch("/token-api");
  try {
    const data = await response.json();
    apiToken = data.access_token;
    getFeaturedPlaylists(9, apiToken);
  } catch (e) {
    console.log(e);
    // window.location.replace("/login");
  }
};

const getFeaturedPlaylists = async (limit, apiToken) => {
  const result = await fetch(`https://api.spotify.com/v1/me`, {
    method: "GET",
    headers: { Authorization: "Bearer " + apiToken },
  });
  const data = await result.json();
  if (data.error != undefined) {
    // window.location.replace("/login");
  }
  console.log(data);
  addAccountToEndpoint(data);
};

function addAccountToEndpoint(data) {
  const pfp = document.createElement("div");
  pfp.setAttribute("class", "pfp");
  if (data.images[0] != undefined) {
    pfp.style.backgroundImage = `url(${data.images[0].url})`;
  } else {
    pfp.style.backgroundImage = `url(/media/generic-pfp.png)`;
  }
  document.getElementById("account-wrapper").appendChild(pfp);

  const dname = document.createElement("div");
  dname.setAttribute("class", "dname");
  dname.innerHTML = data.display_name;
  document.getElementById("account-wrapper").appendChild(dname);

  const country = document.createElement("div");
  country.setAttribute("class", "info");
  country.innerHTML = "Country: " + data.country;
  document.getElementById("details-wrapper").appendChild(country);

  const email = document.createElement("div");
  email.setAttribute("class", "info");
  email.innerHTML = "Email: " + data.email;
  document.getElementById("details-wrapper").appendChild(email);

  const spotifyButton = document.getElementById("spotify-button");
  spotifyButton.setAttribute("href", data.external_urls.spotify);
}
