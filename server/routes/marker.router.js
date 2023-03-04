const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');

router.get('/', rejectUnauthenticated, (req, res) => {
    const SQLText = `SELECT * FROM marker WHERE user_id = $1;`;

    pool
        .query(SQLText, [req.user.id])
        .then(result => {
            res.send(result.rows);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
});

router.post('/', rejectUnauthenticated, (req, res) => {
    const SQLText = `INSERT INTO marker (user_id, animal_id, lat, lng, description) VALUES ($1, $2, $3, $4, $5);`;

    pool
        .query(SQLText, [req.user.id, req.body.newMarkerData.animalId, req.body.newMarkerData.lat, req.body.newMarkerData.lng, req.body.newMarkerData.description])
        .then(() =>
            res.sendStatus(201)
        )
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
});

module.exports = router;
