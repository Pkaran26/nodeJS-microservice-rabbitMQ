const express = require('express')
const cors = require('cors')
const MsgQueue = require('./MSGQueue')
const productHandler = require('./product')

const app = express()
const msgQueue = new MsgQueue()

app.use(cors())
app.use(express.json())

setTimeout(() => {
  if (msgQueue && msgQueue.channel) {
    msgQueue.assertQueue(["PRODUCT", "PRODUCT_DETAIL", "PRODUCT_LIST", "PRODUCT_DETAIL_OBJ"])
    msgQueue.consume("PRODUCT", null, productHandler, "PRODUCT_LIST")
    msgQueue.consume("PRODUCT_DETAIL", null, productHandler, "PRODUCT_DETAIL_OBJ")
  }
}, 1000)

app.listen(3001, () => {
  console.log('product service running...');
})
