const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const reposData = {};

// Home page route.
router.get('/:userName', function (req, res) {
    const user = req?.params?.userName;
    let checkHouer = diff_hours(reposData?.[user]?.addedDate) >= 1;
    if (reposData[user] && checkHouer) {
        let userData = { ...reposData[user] };
        delete userData.repositories;
        delete userData.addedDate;
        delete userData.addedDateRepositories;
        res.json(userData);
    } else {
        fetch('https://api.github.com/users/' + user)
            .then(function (resultado) {
                resultado.json().then(function (data) {
                    reposData[user] = data;
                    reposData[user].addedDate = new Date();
                    res.json(data);
                });
            }).catch(function (erro) {
                res.status(400).json('Falar com Prof.');
            });
    }
});
// Home page route.
router.get('/getlist', function (req, res) {
    res.json(reposData);
});

router.get('/:userName/repos', function (req, res) {
    const user = req?.params?.userName;
    let checkHouer = diff_hours(reposData?.[user]?.addedDateRepositories) >= 1;
    if (reposData[user]?.actualRepositories && checkHouer) {
        let userData = [...(reposData[user]?.actualRepositories || [])];
        delete userData.repositories;
        delete userData.addedDate;
        delete userData.addedDateRepositories;
        res.json(userData);
    } else {
        fetch('https://api.github.com/users/' + user + '/repos')
            .then(function (resultado) {
                resultado.json().then(function (data) {
                    if (!reposData[user]) reposData[user] = {};
                    reposData[user].actualRepositories = data;
                    reposData[user].addedDateRepositories = new Date();
                    res.json(data);
                });
            }).catch(function (erro) {
                res.status(400).json('Falar com Prof.');
            });
    }
});

function diff_hours(dt2, dt1) {
    if (!dt2 || !dt1) return;
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));
}

module.exports = router;