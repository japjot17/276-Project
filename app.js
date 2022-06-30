const express = require('express');
const path = require('path');
const axios = require('axios');
const qs = require('qs');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();

// understand JSON
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// basic routing
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
  res
    .status(200)
    .send('Hello server is running')
    .end();
});

/************************* SPOTIFY OAUTH ROUTING *****************************/
var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = process.env.REDIRECT_URI;

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

app.get('/login', (req, res) => {
    
  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email';    // placeholder

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

app.get('/callback', (req, res, next) => {

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
 
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});