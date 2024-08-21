const express = require('express')
const logger = require('morgan')
const app = express()
const createError = require('http-errors')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger('tiny'))
app.use('/api', require('./api/routerIndex'))
app.all('/api/**', async (req, res, next) => {
    next(createError(404))
})
app.use((err, req, res, next) => {
    res.status(err?.status || 500).json({
        ok: false,
        statusText: err?.message || 'Unknown Error.'
    })
})

module.exports = app