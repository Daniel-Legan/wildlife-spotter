const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');

router.get('/:id', rejectUnauthenticated, (req, res) => {
    const placeId = req.params.id;
    const SQLText = `SELECT EXISTS(SELECT 1 FROM favorite WHERE user_id = $1 AND place_id = $2);`;

    pool
        .query(SQLText, [req.user.id, placeId])
        .then(result => {
            // result.rows[0] = { exists: true }
            res.send(result.rows[0]);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
});

router.post('/', rejectUnauthenticated, (req, res) => {
    const SQLText = `INSERT INTO favorite (user_id, place_id, address, lat, lng) VALUES ($1, $2, $3, $4, $5);`;

    pool
        .query(SQLText, [req.user.id, req.body.placeId, req.body.address, req.body.lat, req.body.lng])
        .then(() =>
            res.sendStatus(201)
        )
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
});

module.exports = router;
