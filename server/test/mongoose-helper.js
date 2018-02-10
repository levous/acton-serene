var mongoose = require('mongoose')
var dotenv = require('dotenv').config();

exports.connectDatabase = (done) => {
  mongoose.connect(process.env.TEST_DB_URI)
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error'))
  db.once('open', function() {
    console.log('We are connected to test database!')
    console.log('(Configured as process.env.TEST_DB_URI)')
    done()
  })
}

exports.resetDatabase = (done) => {
  mongoose.connection.removeAllListeners('open')
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(done)
  })
}
