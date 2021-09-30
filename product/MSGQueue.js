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

  async assertQueue(queue, options = {}) {
    return await this.channel.assertQueue(queue, options)
  }

  send(queue, payload) {
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)))
  }

  consume(queue, emitterName) {
    this.channel.consume(queue, (data) => {
      let payload = JSON.parse(data.content.toString())
      this.eventEmitter.emit(emitterName, payload);
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
