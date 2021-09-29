const fs = require('fs')

const writeFile = (arr) => {
  return new Promise((resolve, reject) => {
    fs.writeFile('./data.json', JSON.stringify(arr), function(err) {
      if (err) return reject(false)
      resolve(true)
    });
  })
}

const readFile = (category) => {
  return new Promise((resolve, reject) => {
    fs.readFile('./data.json', async function(err, data) {
      if (err) return reject(false)
      let arr = JSON.parse(data)
      arr = [...arr, category]

      const res = await writeFile(arr)
        .catch(err => { return err })
      return resolve(res)
    });
  })
}

module.exports = {
  readFile
}
