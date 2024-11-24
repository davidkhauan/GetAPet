const express = require ('express')
const cors = require ('cors')

const app = express()

app.use (express.json())

app.use (cors ({ credentials: true, origin: 'http://localhost:3000' }))

app.use (express.static ('public'))

const UserRoutes = require ('./routes/UserRoutes')
const PetRoutes = require ('./routes/PetRoutes')

app.use ('/users', UserRoutes)
app.use ('/pets', PetRoutes)

app.listen (5000)