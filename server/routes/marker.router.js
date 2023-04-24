const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');

router.get('/', rejectUnauthenticated, (req, res) => {
    const SQLText = `   
                        SELECT marker.*
                        FROM marker
                        JOIN animal ON animal.id = marker.animal_id
                        WHERE marker.user_id = $1;
                    `;

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

router.get('/animals', rejectUnauthenticated, (req, res) => {
    const SQLText = `SELECT * from animal ORDER BY animal ASC;`;

    pool
        .query(SQLText)
        .then(result => {
            res.send(result.rows);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
});

router.delete('/:id', rejectUnauthenticated, (req, res) => {
    const markerId = req.params.id;
    const SQLText = `DELETE FROM marker WHERE user_id = $1 AND id = $2;`;

    pool
        .query(SQLText, [req.user.id, markerId])
        .then(() =>
            res.sendStatus(201)
        )
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
});

router.put('/:id', (req, res) => {
    const SQLText = `UPDATE marker SET description = $1, time = NOW() WHERE id = $2 AND user_id = $3;`;
    pool
        .query(SQLText, [req.body.description, req.params.id, req.user.id])
        .then(() =>
            res.sendStatus(201)
        )
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        })
});

module.exports = router;
