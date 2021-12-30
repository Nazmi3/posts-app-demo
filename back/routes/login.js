var express = require('express');
var router = express.Router();
var UserManager = require('../managers/UserManager');

/* GET users listing. */
router.post('/', function (req, res) {
    console.log(req.body)
    console.log('r1')
    var username = req.body.username
    var password = req.body.password
    var user = UserManager.getByCredentials({username: username, password: password})
    if (user) res.send({
        isadmin: user.type === 'administrator',
        token: user.token
    })
    else res.status(401).send("Wrong username/password")
});

module.exports = router;

