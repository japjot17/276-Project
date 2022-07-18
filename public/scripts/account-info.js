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
  pfp.style.backgroundImage = `url(${data.images[0].url})`;
  document.getElementById("account-wrapper").appendChild(pfp);
}
