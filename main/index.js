const express = require('express')
const cors = require('cors')
const sendToQueue = require('./publisher')
const app = express()

app.use(cors())

app.get('/category/:category', async (req, res) => {
  await sendToQueue("category", JSON.stringify({ category: req.params.category }))
  res.json({ 'message': 'category will be created' })
})

app.listen(3000, () => {
  console.log('main server running');
})
