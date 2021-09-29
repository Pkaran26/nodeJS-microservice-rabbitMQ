const { connect } = require('../subscriber')
const { readFile, writeFile } = require('../file')

const addCategory = async (payload) => {
  payload = JSON.parse(payload)
  const data = await readFile("category")
    .catch(err => { return err })

  let arr = JSON.parse(data)
  arr = [...arr, payload.category]
  arr = JSON.stringify(arr)

  return await writeFile("category", arr)
    .catch(err => { return err })
}

const categoryQueue = async () => {
  const channel = await connect()
  try {
    channel.consume("category", async (msg) => {
      const res = await addCategory(msg.content.toString())
      console.log(res ? 'category added' : 'try again');
    }, { noAck: true })

  } catch (e) {
    console.log(e);
  }
}

module.exports = categoryQueue
