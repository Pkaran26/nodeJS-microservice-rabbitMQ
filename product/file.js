const fs = require('fs')

const writeFile = (filename, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(`./data/${filename}.json`, data, function(err) {
      if (err) return reject(false)
      resolve(true)
    });
  })
}

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(`./data/${filename}.json`, async function(err, data) {
      if (err) return reject(false)
      resolve(data)
    });
  })
}

module.exports = {
  readFile,
  writeFile
}
