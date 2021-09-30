const express = require('express')
const cors = require('cors')
const amqp = require('amqplib')
const EventEmitter = require('events')

const app = express()
const eventEmitter = new EventEmitter()

app.use(cors())
app.use(express.json())
var channel, connection;

const connect = async () => {
  connection = await amqp.connect("amqp://localhost:5672")
  channel = await connection.createChannel()
  await channel.assertQueue("PRODUCT")
  await channel.assertQueue("PRODUCT_LIST")
}

connect().then(() => {
  channel.consume("PRODUCT_LIST", (data) => {
    let products = data.content.toString()
    products = JSON.parse(products)
    eventEmitter.emit('CONSUMED_PRODUCT', products);
    channel.ack(data)
  })
})

const asyncEmitter = () => {
  return new Promise((resolve, reject) => {
    eventEmitter.on('CONSUMED_PRODUCT', (data) => {
      resolve(data)
    });
  })
}

app.get('/products', async (req, res) => {
  channel.sendToQueue("PRODUCT", Buffer.from("All"))
  const data = await asyncEmitter()
  return res.json(data)
})

app.listen(3000, () => {
  console.log('main service running...');
})
