const express = require('express')
const cors = require('cors')
const MsgQueue = require('./MSGQueue')

const app = express()
const msgQueue = new MsgQueue()

app.use(cors())
app.use(express.json())

setTimeout(() => {
  if (msgQueue && msgQueue.channel) {
    msgQueue.assertQueue("PRODUCT")
    msgQueue.assertQueue("PRODUCT_LIST")
    msgQueue.consume("PRODUCT_LIST", "CONSUMED_PRODUCT")
  }
}, 1000)

app.get('/products', async (req, res) => {
  if (msgQueue && msgQueue.channel) {
    msgQueue.send("PRODUCT", Buffer.from("All"))
    const data = await msgQueue.emitListener("CONSUMED_PRODUCT")
    return res.json(data)
  } else {
    res.json({ error: 'queue no ready' })
  }
})

app.listen(3000, () => {
  console.log('main service running...');
})
