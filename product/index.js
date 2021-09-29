const express = require('express')
const cors = require('cors')
const axios = require('axios')
const amqp = require('amqplib')
const app = express()
app.use(cors())
app.use(express.json())
var channel, connection;

const getProducts = async () => {
  return axios.get('https://fakestoreapi.com/products')
    .catch((err) => { return err })
}

const connect = async () => {
  connection = await amqp.connect("amqp://localhost:5672")
  channel = await connection.createChannel()
  await channel.assertQueue("PRODUCT", { durable: false })
  // await channel.assertQueue("PRODUCT_LIST", { durable: false })
}

connect().then(() => {
  channel.consume("PRODUCT", async (data) => {
    channel.ack(data)
    const products = await getProducts()
    channel.sendToQueue(
      "PRODUCT_LIST",
      Buffer.from(JSON.stringify(products.data))
    )
  })
}).catch((err) => {
  console.log(err);
})

app.get('/products', (req, res) => {
  let products = []
  channel.sendToQueue("PRODUCT", "All")

  res.json(products)
})

app.listen(3001, () => {
  console.log('product service running...');
})
