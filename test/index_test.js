

const chai = require('chai'),
      expect = chai.expect,
      request = require('supertest'),
      app = require('../app');

describe('hCard builder page /', function () {

  context('when js is turned off', function () {

    it('should return 200', function (done) {
      request(app).get('/').expect(200, done);
    });

  });

});

