const express = require('express')
const app = express()
const port = 80

app.get('/helloworld', (req, res) => res.send('Hello World!'))

app.use(express.static('public'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))