const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const { join } = require('path')

module.exports = (dev) => {
  if(dev) {
    return open({
      filename: join(__dirname, '../../src/database.sqlite'),
      driver: sqlite3.Database,
    })
  } else {
    return open({
      filename: join(__dirname, '../../dist/database.sqlite'),
      driver: sqlite3.Database,
    })
  }
}

