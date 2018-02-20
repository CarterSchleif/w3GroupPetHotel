const express = require('express');
const router = express.Router();
const pool= require('../modules/pool');

// GET route start.

router.get('/', (req, res) => {

    const queryText = `SELECT owner.id, owner.first_name, owner.last_name, pet.id AS pet_id, pet.pet_name, pet.breed, pet.color, pet.is_checked_in
    FROM owner
    JOIN pet ON owner.id = pet.owner_id
    ORDER BY owner.last_name, pet.is_checked_in;`
    pool.query(queryText)
        .then((result) => {
            console.log('"/" Results of GET query for pet: ', result.rows);
            res.send(result.rows);
        })
        .catch((err) => {
            console.log('error making "/" GET for pet: ', err);
            res.sendStatus(500);
        });

});
// End GET route.

// POST route start.
router.post('/', (req,res) => {

    const queryText = 'INSERT INTO pet (pet_name, breed, color, owner_id) VALUES ($1, $2, $3, $4)';
    pool.query(queryText, [req.body.pet_name, req.body.breed, req.body.color, req.body.owner_id])//Start of initial post query
        .then((result) => {
            console.log('registed new pet');
            res.sendStatus(201);
        })
        .catch((err) => {
            console.log('Oh no!', err);
            res.sendStatus(500);
        })

});
//End POST route.

// Start PUT route.
router.put ('/:id', (req, res) => {
    let queryText = `UPDATE pet SET  is_checked_in = $1 WHERE id = $2`;
    pool.query(queryText, [req.body.is_checked_in, req.params.id])
        .then((results) =>{
            console.log('LOGING REQ.BODY.IS_CHECKED_IN: ', req.body.is_checked_in);
            if (req.body.is_checked_in == 'true') {
                let queryText = `INSERT INTO visits (pet_id) VALUES ($1)`
                             pool.query(queryText, [req.params.id])
                             .then((results) =>{
                                 console.log('IN INSERT NEW TIME TO VISITS');
                                 res.sendStatus(201);
                             })
                             .catch((err) =>{
                                 console.log('error making update pet status query:', err);
                                 res.sendStatus(500);
                             });
            }
            else if (req.body.is_checked_in == 'false') {
                let queryText = `SELECT visits.id FROM visits WHERE pet_id = $1 AND check_out_date is NULL;`
                             pool.query(queryText, [req.params.id])
                             .then((results) =>{

                                let queryText = `UPDATE visits SET check_out_date = now() WHERE pet_id = $1 AND visits.id = $2;`
                                pool.query(queryText, [req.params.id, results.rows[0].id])
                                    .then((results) =>{
                                        console.log('IN INSERT CHECKOUT TIME TO VISITS');
                                        res.sendStatus(201);
                                    })
                                    .catch((err) =>{
                                        console.log('error making update pet status query:', err);
                                        res.sendStatus(500);
                                    });


                             })
                             .catch((err) =>{
                                 console.log('error making update pet status query:', err);
                                 res.sendStatus(500);
                             });
            }

        })
        .catch((err) =>{
            console.log('error making update pet status query:', err);
            res.sendStatus(500);
        });
});
// End PUT route

// Start PUT route
router.put ('/update/:id', (req, res) => {
    let queryText = `UPDATE pet SET pet_name =$1, breed =$2, color=$3 WHERE id = $4`;
    pool.query(queryText, [req.body.pet_name, req.body.breed, req.body.color, req.params.id])
    .then((results) =>{
        console.log('updated pet info: ', results);
        res.send(results);
    })
    .catch((err) =>{
        console.log('error updating pet info:', err);
        res.sendStatus(500);
    });
});
// End PUT route

//Start DELETE route
router.delete ('/:id', (req, res) => {
    let queryText = `DELETE FROM pet WHERE id = $1`;
    pool.query(queryText, [req.params.id])
    .then((results) =>{
        console.log('query delete results: ', results);
        res.send(results);
    })
    .catch((err) =>{
        console.log('error making delete query:', err);
        res.sendStatus(500);
    });
});
// End DELETE route

// Start GET route.
router.get('/visits/:id', (req, res) => {
    const queryText =   `SELECT owner.id, owner.first_name, owner.last_name, pet.id AS pet_id, 
                        pet_name, pet.breed, pet.color, pet.is_checked_in, visits.check_in_date, 
                        visits.check_out_date 
                        FROM owner 
                        JOIN pet ON owner.id = pet.owner_id
                        JOIN visits ON pet.id = visits.pet_id
                        WHERE owner.id = ${req.params.id}
                        ORDER BY owner.last_name, visits.check_out_date DESC;`
    pool.query(queryText)
    .then((result) => {
        console.log('"/" GET results from query for visits: ', result.rows);
        res.send(result.rows);
        })
    .catch((err) => {
        console.log('Error on "/visits" GET', err);
        res.sendStatus(500);
        })
})

module.exports = router;