const amqp = require('amqplib')
const EventEmitter = require('events')

class MsgQueue {
  connection = null
  channel = null
  amqpUrl = "amqp://localhost:5672"
  eventEmitter = null

  constructor() {
    this.eventEmitter = new EventEmitter()
    this.connect()
  }

  async connect() {
    this.connection = await amqp.connect(this.amqpUrl)
    this.channel = await this.connection.createChannel()
  }

  disconnect() {
    connection.close()
  }

  async assertQueue(queueName = [], options = {}) {
    return queueName.map(async (e) => {
      return await this.channel.assertQueue(e, options)
        .catch((err) => { return err })
    })
  }

  send(queue, payload) {
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)))
  }

  consume(queue, emitterName = null, handler = null, responseQueue = null) {
    this.channel.consume(queue, async (data) => {
      let payload = JSON.parse(data.content.toString())
      if (handler && responseQueue) {
        const result = await handler(queue, payload)
          .catch(err => { return err })
        this.send(responseQueue, result)
      } else {
        this.eventEmitter.emit(emitterName, payload);
      }
      this.channel.ack(data)
    })
  }

  emitListener(emitterName) {
    const _vm = this
    return new Promise((resolve, reject) => {
      _vm.eventEmitter.on(emitterName, (data) => {
        if (data) return resolve(data)
        reject(null)
      });
    })
  }
}

module.exports = MsgQueue
