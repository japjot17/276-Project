var apiToken =
  "BQDeQ-IP-ORQ0ukrZww_-o7ILThiEgCc5qxImNIK5OvcVLaf9_0GDT9R_2bZoJ82MwuAaeqGzvxyqWsvDjkq06d76jgKun8fFFasVsoZPvgK-d-tut8sLWnzqqPhyZ5vYij9mQqMnF-T6Z-mtNQLk_6t319lSJ6YqvHpsJCkSq84bsB9BqjpeEh36HbDn7x8rX-lGTwIB9Rm_7lv";
var playlist_id = "64RVqDV1d6MJUaecA0qLzh";

function test() {
  getPlaylist(playlist_id);
}

const getPlaylist = async (playlist_id) => {
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

function msToMinSec(duration_ms) {
  return (
    Math.floor(duration_ms / 60000) +
    "m " +
    ((duration_ms % 60000) / 1000).toFixed() +
    "s"
  );
}
