const connect = require('./subscriber')
const { readFile } = require('./file')
const express = require('express')
const cors = require('cors')
const data = require('./data.json')
const app = express()

app.use(cors())

app.get('/categories', async (req, res) => {
  res.json(data)
})

app.listen(3001, () => {
  console.log('main server running');
})

const addCategory = async (payload) => {
  payload = JSON.parse(payload)
  return await readFile(payload.category)
    .catch(err => { return err })
}

const receiveQueue = async (queueName) => {
  try {
    const { channel } = await connect()
    channel.consume(queueName, async (msg) => {
      const res = await addCategory(msg.content.toString())
      console.log(res ? 'category added' : 'try again');
    }, { noAck: true })
  } catch (e) {

  }
}

receiveQueue("category")
