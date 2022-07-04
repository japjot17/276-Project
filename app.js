const express = require('express');
const path = require('path');
const axios = require('axios');
const qs = require('qs');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
// connect to postgreSQL
const { Pool } = require('pg');
const pool = new Pool({
  // localhost server
  // connectionString: 'schema://user:password@host/database'

  // heroku server
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

const app = express();

// understand JSON
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// basic routing
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
//   res
//     .status(200)
//     .send('Hello server is running')
//     .end();
    res.render('pages/start-page');
});

/********************** POSTGRES ACCOUNT SETUP *******************************/

app.get('/newUser', (req, res) => {
    res.render('pages/add-user');
})

app.get('/addUser', async (req, res) => {
    var userName = req.body.f_uname;
    var firstName = req.body.f_firstName;
    var lastName = req.body.f_lastName;
    var age = req.body.f_age;

    var query = `INSERT INTO userAcct (id, username, firstname, lastname, age) VALUES (DEFAULT, $1, $2, $3, $4)`;
    var values = [userName, firstName, lastName, age];

    var rows = await pool.query(query, values);
    if (rows) {
        console.log("successfully added user: ", userName);
        res.cookie('persongify_auth', rows);
        // res.render('pages/dashboard', rows);
    }
    else {
        res.redirect('pages/add-user');
    }
})

/************************* SPOTIFY OAUTH ROUTING *****************************/
var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = process.env.REDIRECT_URI;

app.get('/spotify-login', (req, res) => {
    
  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email user-library-modify user-library-read playlist-modify-private playlist-modify-public playlist-read-private user-top-read user-read-recently-played user-follow-read user-follow-modify';

  res.cookie('spotify_auth', state);
  
  res.redirect('https://accounts.spotify.com/authorize?' + 
      qs.stringify({
          response_type: 'code',
          client_id: client_id,
          scope: scope,
          redirect_uri: redirect_uri,
          state: state,
      }))
})

app.get('/spotify-callback', (req, res, next) => {

  // given from login redirect
  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
      res.send("STATE MISMATCH");
  } else {
      axios({
          method: 'post',
          url: 'https://accounts.spotify.com/api/token',
          data: qs.stringify({
              code: code,
              redirect_uri: redirect_uri,
              grant_type: 'authorization_code',
          }),
          headers: {
              'Authorization': 'Basic ' + new Buffer.from(client_id + ':' + client_secret).toString('base64'),
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          json: true
      })
          .then((response) => {
              if (response.status === 200) {
                  res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);   // placeholder
              } else {
                  res.send(response);
              }
          })
          .catch((error) => {
              console.log(error.response);
              res.send(error);
          })
  }
})

/************************* HELPER FUNCTIONS **********************************/

/**
 * generates a random string
 * @param {number} length 
 * @returns {string} the generated string
 */
 var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var checkAuthorizedUser = function() {

}
 
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});