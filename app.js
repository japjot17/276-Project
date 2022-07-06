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
  // localhost server
  // connectionString: 'schema://user:password@host/database'

  // heroku server
  connectionString: "postgres://postgres:root@localhost",
  // ssl: {
  //   require: true,
  //   rejectUnauthorized: false,
  // },
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

var encryptSHA256 = function (plain) {
  return new shajs.sha256().update(plain).digest("hex");
};

var checkAuthorizedUser = function () {
  if (req.signedCookies.persongify_auth) return true;
  return false;
};

var isEmptyObject = function (obj) {
  console.log("testing empty object...");
  console.log("keys(obj) length: " + Object.keys(obj).length);
  return !Object.keys(obj).length;
}

// understand JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// work with cookies
var cookieSecret = generateRandomString(20);
app.use(cookieParser(cookieSecret));

/*****************************************************************************/

// basic routing
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  //   res
  //     .status(200)
  //     .send('Hello server is running')
  //     .end();
  res.render("pages/start-page");
});

/********************** POSTGRES ACCOUNT SETUP *******************************/

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
  if (rows) {
    res.cookie("persongify_auth", userName, { signed: true });
    res.send("successfully added user: " + userName);
    // res.render('pages/dashboard', rows);
  } else {
    res.redirect("/newUser");
  }
});

app.get("/login", (req, res) => {
  res.render("pages/user-login");
});

app.post("/verify-login", async (req, res) => {
  var chk_uname = req.body.f_uname;
  var chk_pwd = req.body.f_pwd;
  var chk_pwdSHA256 = encryptSHA256(chk_pwd);

  var query = `SELECT * FROM useracct WHERE username=$1 AND password=$2`;
  var values = [chk_uname, chk_pwdSHA256];

  var rows = await pool.query(query, values);
<<<<<<< HEAD
  if (notEmptyQueryCheck(rows)) {
=======
  if (!isEmptyObject(rows)) {
>>>>>>> faf1a0847720f3acf4320983fb8bc2f53c4cc380
    res.cookie("persongify_auth", chk_uname, { signed: true });
    res.send("successfully logged on user: " + chk_uname);
  } else {
    res.redirect("/login");
  }
});

//helper function to check if the query doesn't have any results
function notEmptyQueryCheck(rows) {
  if (rows != undefined && rows.rowCount != 0) {
    return true;
  } else {
    return false;
  }
}

/************************* SPOTIFY OAUTH ROUTING *****************************/
var client_id = process.env.CLIENT_ID || "0f6749aefe004361b5c218e24c953814";
var client_secret =
  process.env.CLIENT_SECRET || "4940d82140ff4e47add12d60060cbcbc";
var redirect_uri =
  process.env.REDIRECT_URI || "http://localhost:5000/spotify-callback";

app.get("/spotify-login", (req, res) => {
  var state = generateRandomString(16);
  var scope =
    "user-read-private user-read-email user-library-modify user-library-read playlist-modify-private playlist-modify-public playlist-read-private user-top-read user-read-recently-played user-follow-read user-follow-modify";

  // res.cookie('spotify_auth', state);

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
});

var newToken;

app.get("/spotify-callback", (req, res) => {
  // given from login redirect
  var code = req.query.code || null;
  var state = req.query.state || null;

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
          // res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`); // placeholder
          res.redirect("/home");
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

app.get("/token-api", (req, res) => {
  res.json(newToken);
});

app.get("/playlists", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/playlists.html"));
});

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/home.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log("Press Ctrl+C to quit.");
});
