const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
const bodyParser = require('body-parser');

// Start GET route.
router.get('/', (req, res) => {
    const queryText = 'SELECT * FROM owner';
    pool.query(queryText)
    .then((result) => {
        console.log('"/" Results of GET query for owner: ', result.rows);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('Error making "/" GET for pet: ', err);
            res.sendStatus(500);
        })
})
// End GET route.

// Start POST route.
router.post('/', (request, response) => {
    console.log(request.body, 'in owner post');
    const queryText = `INSERT INTO owner (owner_first_name, owner_last_name) VALUES($1, $2)`;
    pool.query(queryText,[request.body.first_name, request.body.last_name])
    .then((result) => {
        response.sendStatus(201);
        console.log('success in owner post');
    })
    .catch((error) => {
      console.log('error in owner post', error);
        response.sendStatus(500);
    })
})
// End POST route.

// Shouldn't require a PUT or DELETE route.

module.exports = router;
