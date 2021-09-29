const { connect } = require('../subscriber')
const { readFile, writeFile } = require('../file')

const addProduct = async (payload) => {
  payload = JSON.parse(payload)
  const data = await readFile("product")
    .catch(err => { return err })

  let arr = JSON.parse(data)
  arr = [...arr, payload]
  arr = JSON.stringify(arr)

  console.log(arr);

  return await writeFile("product", arr)
    .catch(err => { return err })
}

const productQueue = async () => {
  const channel = await connect()
  try {
    channel.consume("product", async (msg) => {
      const res = await addProduct(msg.content.toString())
      console.log(res ? 'product added' : 'try again');
    }, { noAck: true })
  } catch (e) {
    console.log(e);
  }
}

module.exports = productQueue
