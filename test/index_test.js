

const chai = require('chai'),
      expect = chai.expect,
      request = require('superagent'),
      url = 'http://localhost:3001';

describe('hCard builder page /', function () {

  context('when js is turned off', function () {

    it('should return 200', function () {
      return request.get(url).then(res => {
        expect(res.status).to.equal(200);
      });
    });

  });

});

