var app = require('../../../server-app');
var request = require("supertest-as-promised")
var expect = require('chai').expect
var mongooseHelper = require('../../mongoose-helper')

describe('my api', function() {

  before(function (done) {
		console.log("*************** BEFORE " + __filename)
    mongooseHelper.connectDatabase(done);
  })

  after(done => {
    console.log("*************** AFTER " + __filename)
    mongooseHelper.resetDatabase(done)
  })

//TODO: getting a 500 error.  Not sure why.  Aborting for now.
// when using path "/hmm" it works

  it('returns hello world', function() {
    this.timeout(5000);
    return request(app)
      .get("/")
      .expect(200)
      .then(function (res) {
        console.log(res.body)
        return expect(res.text).to.equal("kittens r cute!");
      })
  })
})
