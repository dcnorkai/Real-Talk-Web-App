const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.json({mssg: 'Welcome to the app'})
})

router.get('/hello', (req, res) => {
    res.json({mssg: 'Hello world!'})
})

module.exports = router