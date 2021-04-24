const express = require('express')
const app = express()

const routesReport = require('rowdy-logger').begin(app)

app.use(require('morgan')('tiny'))
app.use(require('cors')())
app.use(express.json())

const models = require('./models')

app.post('/users', (req, res) => {
  models.user.create({
    email: req.body.email,
    password: req.body.password
  })
  .then((user) => {
    res.json({ message: 'success', user})
  })
  .catch((error) => {
    res.status(400).json({ error: error.message })
  })
})

app.post('/users/login', (req, res) => {
  models.user.findOne({
    where: { email: req.body.email }
  }).then((foundUser) => {
    if (foundUser && foundUser.password === req.body.password) {
      res.json({ message: 'success', user: foundUser })
    } else {
      res.status(401).json({ message: 'login failed' })
    }
  }).catch((error) => {
    res.status(400).json({ error: error.message })
  })
})

app.get('/users/verify', (req, res) => {
  models.user.findOne({
    where: { id: req.headers.authorization }
  })
  .then((user) => {
    if (user) {
      res.json({ user })
    } else {
      res.status(404).json({ message: 'user not found' })
    }
  })
  .catch((error) => {
    res.json({ error })
  })
})

app.listen(3001, () => {
  routesReport.print()
})