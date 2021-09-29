const express = require('express')
const cors = require('cors')
const amqp = require('amqplib')
const app = express()
app.use(cors())
app.use(express.json())
var channel, connection;

const connect = async () => {
  connection = await amqp.connect("amqp://localhost:5672")
  channel = await connection.createChannel()
  await channel.assertQueue("PRODUCT", { durable: false })
  await channel.assertQueue("PRODUCT_LIST", { durable: false })
}
connect()

app.get('/products', (req, res) => {
  let products = []
  channel.sendToQueue("PRODUCT", Buffer.from("All"))
  channel.consume("PRODUCT_LIST", (data) => {
    products = data.content.toString()
    res.json(JSON.parse(products))
    channel.ack(data)
  })

})

app.listen(3000, () => {
  console.log('main service running...');
})
