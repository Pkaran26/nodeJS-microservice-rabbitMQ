const amqp = require('amqplib')
let connection = null
let channel = null
const queues = ['category', 'product']

const sendToQueue = async (queueName, message) => {
  try {
    connection = await amqp.connect("amqp://localhost:5672")
    channel = await connection.createChannel()
    queues.map(async (queueName) => {
      await channel.assertQueue(queueName, { durable: false })
    })
    console.log('connected');

    channel.sendToQueue(queueName, Buffer.from(message))
    console.log('message: ', message);
    setTimeout(() => {
      connection.close()
    }, 1000)
  } catch (e) {
    console.log(e);
  }
}

module.exports = sendToQueue
// sendToQueue("tech", "this is test message")
