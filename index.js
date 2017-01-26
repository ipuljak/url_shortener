// Server requirements
const express = require('express'),
  bodyparser = require('body-parser'),
  methodOverride = require('method-override'),
  cors = require('cors'),
  app = express();

// Routes requirements
const url_shortener = require('./routes/url_shortener');

// Server setup
app.use(cors());
app.use(bodyparser.json({ type: '*/*' }));
app.use(methodOverride('_method'));

// Server routes
app.use('/', url_shortener);

// Server port listen
app.listen(5002, process.env.IP, () => {
  console.log('URL Shortener server started on port 5002.');
});