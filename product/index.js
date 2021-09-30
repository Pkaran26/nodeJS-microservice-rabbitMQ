const express = require('express')
const cors = require('cors')
const axios = require('axios')
const MsgQueue = require('./MSGQueue')
// const products = require('./products.json')

const app = express()
const msgQueue = new MsgQueue()

app.use(cors())
app.use(express.json())

setTimeout(() => {
  if (msgQueue && msgQueue.channel) {
    msgQueue.assertQueue("PRODUCT")
    msgQueue.assertQueue("PRODUCT_LIST")

    msgQueue.channel.consume("PRODUCT", async (data) => {
      const products = await getProducts()
      msgQueue.channel.sendToQueue(
        "PRODUCT_LIST",
        Buffer.from(JSON.stringify(products.data))
      )
      msgQueue.channel.ack(data)
    })
  }
}, 1000)

const getProducts = async () => {
  return axios.get('https://fakestoreapi.com/products')
    .catch((err) => { return err })
}


app.listen(3001, () => {
  console.log('product service running...');
})
