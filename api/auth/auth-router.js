const router = require('express').Router();
const User = require('../users/users-model.js');
const { generateToken } = require('./generateToken.js');

const bcrypt = require('bcryptjs');


const { BCRYPT_ROUNDS } = require('../../config/index');

router.post('/register', async (req, res, next) => {
    try {
        let { username, password } = req.body

        let existingUser = username ? await User.findBy({ username }).first() : null

        if (!username || !password) {
            res.status(400).json({ message: "username and password required" })


        } else if (existingUser) {

            res.status(400).json({ message: "username taken" })
        } else {
            const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS)
            const newUser = await User.add({ username, password: hash });
            res.status(201).json(newUser)
        }

    } catch (err) {
        next(err)
    }

});

router.post('/login', (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        res.status(401).json({ message: "username and password required" })
        return;
    }

    let { username, password } = req.body;

    User.findBy({ username })
        .then(([user]) => {

            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user);
                res.status(200).json({ message: `welcome, ${user.username}`, token })
            } else if (!username || !password) {
                res.status(400).json({ message: "username and password required" })

            } else {
                next({ status: 401, message: 'invalid credentials' })
            }
        })

});

module.exports = router;
