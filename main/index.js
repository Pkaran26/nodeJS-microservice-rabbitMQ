const express = require('express')
const cors = require('cors')
const MsgQueue = require('./MSGQueue')

const app = express()
const msgQueue = new MsgQueue()

app.use(cors())
app.use(express.json())

setTimeout(() => {
  if (msgQueue && msgQueue.channel) {
    msgQueue.assertQueue(["PRODUCT", "PRODUCT_DETAIL", "PRODUCT_LIST", "PRODUCT_DETAIL_OBJ"])
    msgQueue.consume("PRODUCT_LIST", "CONSUMED_PRODUCT", null, null)
    msgQueue.consume("PRODUCT_DETAIL_OBJ", "CONSUMED_PRODUCT_DETAIL", null, null)
  }
}, 1000)

app.get('/products', async (req, res) => {
  if (msgQueue && msgQueue.channel) {
    msgQueue.send("PRODUCT", Buffer.from("All"))
    const data = await msgQueue.emitListener("CONSUMED_PRODUCT")
    return res.json(data)
  } else {
    res.json({ error: 'queue does not ready' })
  }
})

app.get('/products/:id', async (req, res) => {
  if (msgQueue && msgQueue.channel) {

    msgQueue.send("PRODUCT_DETAIL", { id: req.params.id })
    const data = await msgQueue.emitListener("CONSUMED_PRODUCT_DETAIL")
    return res.json(data)
  } else {
    res.json({ error: 'queue does not ready' })
  }
})

app.listen(3000, () => {
  console.log('main service running...');
})
