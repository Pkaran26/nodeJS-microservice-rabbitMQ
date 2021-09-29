const amqp = require('amqplib')
const queues = ['category', 'product']

const connect = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672")
    const channel = await connection.createChannel()
    queues.map(async (queueName) => {
      await channel.assertQueue(queueName, { durable: false })
    })
    return channel
  } catch (e) {
    console.log(e)
    return null
  }
}

module.exports = { connect }
