const express = require('express');
const router = express.Router();
const pool= require('../modules/pool');

// GET route start.
router.get('/', (req, res) => {
    const queryText = `SELECT owner.owner_id, owner.owner_first_name, owner.owner_last_name,
                      pet.pet_id, pet.pet_name, pet.pet_breed, pet.pet_color, pet.pet_is_checked_in
                      FROM pet
                      JOIN owner_pet ON pet.pet_id = owner_pet.owner_pet_pet_id
                      JOIN owner ON owner.owner_id = owner_pet.owner_pet_owner_id
                      ORDER BY pet.pet_is_checked_in desc, owner.owner_last_name;`;
    pool.query(queryText)
      .then((result) => {
        console.log('"/" Results of GET query for pet: ', result.rows);
        res.send(result.rows);
      })
      .catch((err) => {
        console.log('error making "/" GET for pet: ', err);
        res.sendStatus(500);
      });
});// End GET route.

router.get('/:id', (req, res) => {
const id = req.params.id;
const queryText = `SELECT * FROM pet
                  JOIN owner_pet ON pet.pet_id = owner_pet.owner_pet_pet_id
                  JOIN owner ON owner.owner_id = owner_pet.owner_pet_owner_id
                  WHERE owner.owner_id = $1;`;
pool.query(queryText, [id])
  .then((result) => {
    console.log('success in edit GET', result.rows);
    res.send(result.rows)
  })
  .catch((err) => {
    console.log('error in edit get', err);
    res.sendStatus(500);
  })
})//end edit get

// POST route start.
router.post('/', (req,res) => {
    const queryText = 'INSERT INTO pet (pet_name, pet_breed, pet_color) VALUES ($1, $2, $3)';
    pool.query(queryText, [req.body.pet_name, req.body.pet_breed, req.body.pet_color])
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

router.post('/pet_owner', (req, res) => {
  const queryText = `INSERT INTO owner_pet (owner_pet_owner_id, owner_pet_pet_id)
                    VALUES (($1), (SELECT pet_id FROM pet WHERE pet_name = $2));`;
  pool.query(queryText, [req.body.pet_owner, req.body.pet_name])
    .then((result) => {
      console.log('added pet to owner_pet', result);
      res.sendStatus(201);
    })
    .catch((err) => {
      console.log('error in pet_owner post', err);
      res.sendStatus(500);
    })
});

// Start PUT route.
router.put ('/:id', (req, res) => {
  console.log(req.body.answer, 'in put for checkedin');
    let queryText = `UPDATE pet SET  pet_is_checked_in = $1 WHERE pet_id = $2`;
    pool.query(queryText, [req.body.answer, req.params.id])
      .then((results) =>{
        console.log('LOGING REQ.BODY: ', req.body.answer);
        res.sendStatus(200);
      })
      .catch((err) =>{
        console.log('error making update pet status query:', err);
        res.sendStatus(500);
      });
});// End PUT route

// Start PUT route
router.put ('/update/:id', (req, res) => {
  console.log(req.params.id);
    let queryText = `UPDATE pet SET pet_name =$1, pet_breed =$2, pet_color=$3 WHERE pet_id = $4`;
    pool.query(queryText, [req.body.editName, req.body.editBreed, req.body.editColor, req.params.id])
    .then((results) =>{
      console.log('updated pet info: ', results);
      res.sendStatus(200);
    })
    .catch((err) =>{
      console.log('error updating pet info:', err);
      res.sendStatus(500);
    });
});// End PUT route

//Start DELETE route
router.delete ('/:id', (req, res) => {
  let queryText = `DELETE FROM pet WHERE pet_id = $1`;
  pool.query(queryText, [req.params.id])
  .then((results) =>{
    console.log('query delete results: ', results);
    res.send(results);
  })
  .catch((err) =>{
    console.log('error making delete query:', err);
    res.sendStatus(500);
  });
});// End DELETE route

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
})//end GET

module.exports = router;
