const express = require('express');
const router = express.Router();
const pool= require('../modules/pool');

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
router.post('/', (req, res) => {
    const queryText = `INSERT INTO owners (first_name, last_name) VALUES($1, $2)`;
    pool.query(queryText,[req.body.first_name, req.body.last_name])
    .then((result) => {
        res.sendStatus(201);
    })
    .catch((err) => {
        res.sendStatus(500);
    })
})
// End POST route.

// Shouldn't require a PUT or DELETE route.

module.exports = router;
