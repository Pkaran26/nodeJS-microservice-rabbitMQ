const amqp = require('amqplib')

const connect = async (queueName) => {
  try {
    const connection = await amqp.connect("amqp://localhost:5672")
    const channel = await connection.createChannel()
    const q = await channel.assertQueue(queueName, { durable: false })
    return {
      channel, q
    }
  } catch (e) {
    console.log(e)
    return null
  }
}

module.exports = connect
