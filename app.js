const express = require("express");
const path = require("path");
const axios = require("axios");
const qs = require("qs");
const shajs = require("sha.js");
const cookieParser = require("cookie-parser");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// connect to postgreSQL
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
   require: true,
   rejectUnauthorized: false,
 },
});

/************************* HELPER FUNCTIONS **********************************/
const app = express();

/**
 * generates a random string
 * @param {number} length
 * @returns {string} the generated string
 */
var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/**
 * encrypts a string using SHA-256 authentication
 * @param {string} plain 
 * @returns {string} SHA-256 encrypted string
 */
var encryptSHA256 = function (plain) {
  return new shajs.sha256().update(plain).digest("hex");
};

/**
 * checks if the persongify_auth signed cookie exists and user is logged in
 * @param {object} req 
 * @returns true if cookie exists, false otherwise
 */
var checkAuthorizedUser = function (req) {
  console.log(
    "req.signedCookies['persongify_auth']: ",
    req.signedCookies["persongify_auth"]
  );
  if (req.signedCookies["persongify_auth"]) return true;
  return false;
};

/**
 * helper function to check if the query doesn't have any results
 * @param {json} rows 
 * @returns true if the rows contain results, false otherwise
 */
function notEmptyQueryCheck(rows) {
  if (rows != undefined && rows.rowCount != 0) {
    return true;
  } else {
    return false;
  }
}

// understand JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// work with cookies
var cookieSecret = generateRandomString(20);
app.use(cookieParser(cookieSecret));

/*****************************************************************************/
// TODO: refactor routes into separate files (modularize)
// maybe look for express router mounting, module.export, etc

// basic routing
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  app.locals.signedIn = false;
  app.locals.username = undefined;
  app.locals.redir = "/home";
  res.clearCookie("persongify_auth", { signed: true });
  res.clearCookie("spotify_auth", { signed: true });
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  res.render("pages/home");
});

/********************** POSTGRES ACCOUNT SETUP *******************************/
// TODO: change route names to hyphenated alternatives for consistency
// will require adjusting all navbar links
// e.g. new-user, add-user
app.get("/newUser", (req, res) => {
  res.render("pages/user-add");
});

app.post("/addUser", async (req, res) => {
  var userName = req.body.f_uname;
  var firstName = req.body.f_firstName;
  var lastName = req.body.f_lastName;
  var age = req.body.f_age;

  var pwd = req.body.f_pwd;
  var pwdSHA256 = encryptSHA256(pwd);

  var query = `INSERT INTO useracct (id, username, firstname, lastname, age, password) VALUES (DEFAULT, $1, $2, $3, $4, $5)`;
  var values = [userName, firstName, lastName, age, pwdSHA256];

  var rows = await pool.query(query, values);
  if (notEmptyQueryCheck(rows)) {
    res.cookie("persongify_auth", userName, { signed: true });
    console.log("successfully added user: " + userName);
    app.locals.signedIn = true;
    app.locals.username = userName;
    let url = app.locals.redir;
    app.locals.redir = "/home";
    res.redirect(302, url);
  } else {
    res.redirect(303, "/newUser");
  }
});

app.get("/login", (req, res) => {
  res.status(303);
  res.render("pages/user-login");
});

app.post("/verify-login", async (req, res) => {
  var chk_uname = req.body.f_uname;
  var chk_pwd = req.body.f_pwd;
  var chk_pwdSHA256 = encryptSHA256(chk_pwd);

  var query = `SELECT * FROM useracct WHERE username=$1 AND password=$2`;
  var values = [chk_uname, chk_pwdSHA256];

  var rows = await pool.query(query, values);
  if (notEmptyQueryCheck(rows)) {
    res.cookie("persongify_auth", chk_uname, { signed: true });
    console.log("successfully logged on user: " + chk_uname);
    app.locals.signedIn = true;
    app.locals.username = chk_uname;
    let url = "/spotify-login";     // when user logs in, must also go thru spotify
    app.locals.redir = "/home";
    res.redirect(302, url);
  } else {
    res.redirect(303, "/login");
  }
});

app.get("/logout", (req, res) => {
  app.locals.signedIn = false;
  app.locals.username = undefined;
  app.locals.redir = "/home";
  res.clearCookie("persongify_auth", { signed: true });
  res.clearCookie("spotify_auth", { signed: true });
  res.redirect(302, "/home");
});

/************************* SPOTIFY OAUTH ROUTING *****************************/
var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = process.env.REDIRECT_URI;

app.get("/spotify-login", (req, res) => {
  if (!checkAuthorizedUser(req)) {
    app.locals.redir = req.originalUrl;
    res.redirect(303, "/login");
  } else {
    var state = generateRandomString(16);
    var scope =
      "user-read-private user-read-email user-library-modify user-library-read playlist-modify-private playlist-modify-public playlist-read-private user-top-read user-read-recently-played user-follow-read user-follow-modify";

    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        qs.stringify({
          response_type: "code",
          client_id: client_id,
          scope: scope,
          redirect_uri: redirect_uri,
          state: state,
        })
    );
  }
});

var newToken;

app.get("/spotify-callback", (req, res) => {
  // given from login redirect
  var code = req.query.code || null;
  var state = req.query.state || null;
  console.log("code: " + code);
  console.log("state: " + state);
  if (state === null) {
    res.send("STATE MISMATCH");
  } else {
    axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: qs.stringify({
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      }),
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: true,
    })
    .then((response) => {
      if (response.status === 200) {
        res.cookie("spotify_auth", state, { signed: true });
        newToken = response.data;
        let url = app.locals.redir;
        app.locals.redir = "/home";
        res.redirect(302, url);
      } else {
        res.send(response);
      }
    })
    .catch((error) => {
      console.log(error.response);
      res.send(error);
    });
  }
});

/********************* [END] SPOTIFY OAUTH ROUTING ***************************/

app.get("/token-api", (req, res) => {
  res.json(newToken);
});

/*************************** SPOTIFY TRENDING ********************************/
app.get("/trending", (req, res) => {
  if (checkAuthorizedUser(req)) {
    res.render("pages/trending");
  } else {
    app.locals.redir = req.originalUrl;
    res.redirect(303, "/login");
  }
});
/************************ [END] SPOTIFY TRENDING *****************************/

/******************** SPOTIFY PLAYLIST GENERATOR *****************************/
//generating recommendations
var songs = [];
var artists = [];
var audios = [];
var images = [];
var genre;
var SpotifyWebApi = require("spotify-web-api-node");

var spotifyApi = new SpotifyWebApi({
  clientId: client_id,
  clientSecret: client_secret,
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  function (data) {
    console.log("The access token expires in " + data.body["expires_in"]);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body["access_token"]);
  },
  function (err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);

app.get("/play_some_song", (req, res) => {
  spotifyApi.play().then(
    function () {
      console.log("Playback started");
    },
    function (err) {
      // if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
      console.log("Something went wrong!", err);
    }
  );
});

app.post("/songs", function (req, res) {
  var id = [];

  console.log(req.body);

  var limit = req.body.limit;
  genre = req.body.genre;
  var dance = req.body.danceability;
  var energy = req.body.energy;
  var acoustic = req.body.acousticness;
  var seed_artist = req.body.seed_artist;
  var seed_song = req.body.seed_song;
  var artist_id;
  // res.json({
  //   limit,
  //   genre,
  //   dance,
  //   energy
  // })

  // return
  spotifyApi
    .searchArtists(seed_artist)
    .then(function (data) {
      let artists = data.body.artists.items;
      console.log(artists[0].id);
      return artists[0].id;
    })
    .then(function (id) {
      artist_id = id;
      console.log(artist_id);
      return spotifyApi.searchTracks(seed_song);
    })

    .then(function (data) {
      var songs = data.body.tracks.items;
      return songs[0].id;
    })

    .then(function (song_id) {
      console.log(song_id);
      return spotifyApi.getRecommendations({
        limit: limit,
        seed_genres: genre,
        seed_artists: artist_id,
        seed_tracks: song_id,
        target_danceability: dance,
        target_energy: energy,
        target_acousticness: acoustic,
      });
    })
    .then(function (data) {
      console.log("working");

      let recommendations = data.body.tracks;

      for (let i = 0; i < recommendations.length; i++) {
        songs.push(recommendations[i].name);
        artists.push(recommendations[i].artists[0].name);
        audios.push(recommendations[i].id);
        images.push(recommendations[i].album.images[0].url);
        console.log(recommendations);
      }

      //res.json({ songs, artists, audios, images})
      res.redirect("/songs");
    })
    .catch(function (error) {
      console.error(error);
    });
});

app.get("/songs", function (req, res) {
  // for (let i = 0; i < songs.length; i++) {
  //   console.log(artists[i]);
  // }

  if (checkAuthorizedUser(req)) {
    res.render("pages/songs", { songs, artists, audios, images, genre });
  } else {
    app.locals.redir = req.originalUrl;
    res.redirect(303, "/login");
  }
});
/******************** [END] SPOTIFY PLAYLIST GENERATOR ***********************/

app.get("/account", function (req, res) {
  if (checkAuthorizedUser(req)) {
    res.render("pages/account-info");
  } else {
    redir = req.originalUrl;
    res.redirect(303, "/login");
  }
});

/*********************** SPOTIFY DISTANCE GENERATOR **************************/
app.get("/new-distance-playlist", (req, res) => {
  if (checkAuthorizedUser(req)) {
    res.render("pages/distance-form");
  } else {
    app.locals.redir = req.originalUrl;
    res.redirect(303, "/login");
  }
});

const DIST_MATRIX_API_KEY = process.env.DIST_MATRIX_API_KEY;
app.post("/distance-playlist", (req, res) => {
  if (checkAuthorizedUser(req)) {
    // distance matrix req params
    var lang = "en";
    var mode = req.body.f_travel_mode;
    var orig_loc = `${req.body.f_orig_city} ${req.body.f_orig_province}`;
    var dest_loc = `${req.body.f_dest_city} ${req.body.f_dest_province}`;
    // uri-encoded orig + dest addresses
    var enc_orig_loc = encodeURI(orig_loc);
    var enc_dest_loc = encodeURI(dest_loc);

    var config = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${enc_orig_loc}&destinations=${enc_dest_loc}&language=${lang}&mode=${mode}&key=${DIST_MATRIX_API_KEY}`,
      headers: {},
    };
    axios(config)
      .then((response) => {
        // const results = response.data;
        // res.send(JSON.stringify(results));
        console.log("successful distance calculation");
        const results = {
          orig_address: response.data.origin_addresses,
          dest_address: response.data.destination_addresses,
          dist_mat_results: response.data.rows,
          travel_mode: mode,
        };
        res.render("pages/distance-gen", results);
      })
      .catch((error) => {
        console.log(error.response);
        res.send(error);
      });
  } else {
    app.locals.redir = req.originalUrl;
    res.redirect(303, "/login");
  }
});
/******************** [END] SPOTIFY DISTANCE GENERATOR ***********************/

/*********************** SPOTIFY YEAR IN REVIEW **************************/
app.get("/review", function (req, res){
  if (checkAuthorizedUser(req)) {
    res.render("pages/review");
  } else {
    app.locals.redir = req.originalUrl;
    res.redirect(303, "login");
  }
});
/******************** [END] SPOTIFY YEAR IN REVIEW ***********************/

app.get("/playlists", function (req, res) {
  if (checkAuthorizedUser(req)) {
    res.render("pages/saved-playlists");
  } else {
    app.locals.redir = req.originalUrl;
    res.redirect(303, "/login");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});

// for testing
module.exports = app;
