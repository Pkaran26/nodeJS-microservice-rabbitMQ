const express = require('express')
const cors = require('cors')
const categories = require('./data/category.json')
const products = require('./data/product.json')
const categoryQueue = require('./queue/category')
const productQueue = require('./queue/product')

const app = express()
app.use(cors())

app.get('/categories', async (req, res) => {
  res.json(categories)
})

app.get('/products', async (req, res) => {
  res.json(products)
})

app.listen(3001, () => {
  console.log('main server running');
})

categoryQueue()
productQueue()
