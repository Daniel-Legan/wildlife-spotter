const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const {
    rejectUnauthenticated,
} = require('../modules/authentication-middleware');

/**
 * GET route template
 */
router.get('/', (req, res) => {
    // GET route code here
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
