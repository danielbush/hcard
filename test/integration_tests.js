// Tests output of express.
//
// TODO: for js-enabled agents, we will have to use something like wd, zombie?

const chai = require('chai'),
      expect = chai.expect,
      request = require('supertest'),
      cheerio = require('cheerio'),
      app = require('../app');

describe('hCard builder page /', function () {

  context('when js is turned off', function () {

    beforeEach(function () {
      this.request = request(app).get('/');
    });

    it('should return 200', function (done) {
      this.request.expect(200, done);
    });

    it('should have 1 hCard form', function (done) {
      this.request
        .expect(res => {
          let $ = cheerio.load(res.text);
          expect($('.hcardForm').length).to.equal(1);
        })
        .end(err => done(err));
    });

    it('should have 1 hCard preview area', function (done) {
      this.request
        .expect(res => {
          let $ = cheerio.load(res.text);
          expect($('.hcardPreview').length).to.equal(1);
        })
        .end(err => done(err));
    });

  });

});

