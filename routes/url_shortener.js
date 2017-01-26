const express = require('express'),
  moment = require('moment'),
  mysql = require('mysql'),
  {password} = require('../config'),
  router = express.Router();

// Connect to the mysql database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'url_user',
  password: password,
  database: 'url_shortener'
});

// Regular expression to check for links
const regx = /(http(s)?\:\/\/(www.)?.+)/;

// GET call /new/:link where link is the desired URL to be shortened
//    will return a number which represents the key of the stored URL in the database
router.get('/new/:link*', (req, res) => {
  let id;
  let link = req.params.link + req.params['0'];

  // Check that the link exists
  if (regx.test(link)) {
    // Insert the URL into the database
    connection.query('INSERT INTO urls SET ?', { url: link }, (error, results, fields) => {
      if (error) throw error;
    });
    // Fetch the stored key from the database
    connection.query('SELECT LAST_INSERT_ID() as id', (error, results, fields) => {
      if (error) throw error;
      id = results[0].id;

      // Send the original and short urls back to the user
      res.send({
        original_url: link,
        short_url: req.headers.host + '/' + id
      });
    });

  } else {
    // Show an error if the URL is invalid
    res.send({ error: 'Invalid URL format - use http://example.com or http://www.example.com instead' });
  }
});

router.get('/:id', (req, res) => {
  let link;
  let id = parseInt(req.params.id);
  let query = 'SELECT url AS link FROM urls WHERE id=' + id;

  // If the id supplied is a number, execute the query
  if (id) {
    connection.query(query, (error, results, fields) => {
      if (error) throw error;
      // Check to see if the id exists
      if (results[0]) {
        link = results[0].link;
        // Send the user to the website of the requested id
        res.redirect(link);
        // Send an error if it does not exist
      } else {
        res.send({ error: 'id does not exist' });
      }
    });
    // If the id supplied is not a number, then send an error
  } else {
    res.send({ error: 'Invalid id' });
  }
});

module.exports = router;