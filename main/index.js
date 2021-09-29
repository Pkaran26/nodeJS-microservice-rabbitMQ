const express = require('express')
const cors = require('cors')
const sendToQueue = require('./publisher')

const app = express()
app.use(cors())

app.get('/category/:category', async (req, res) => {
  await sendToQueue("category", JSON.stringify({ category: req.params.category }))
  res.json({ 'message': 'category will be created' })
})

app.get('/product/:product/:category/:quantity/:price', async (req, res) => {
  const { product, category, quantity, price } = req.params
  await sendToQueue("product", JSON.stringify({
    product, category, quantity, price
  }))
  res.json({ 'message': 'product will be created' })
})

app.listen(3000, () => {
  console.log('main server running');
})
