// Tests output of express.
//
// For...
// js-disabled agents - we'll use supertest/superagent.
// js-enabled agents  - we'll use zombie.
//   - these are SLOW
//   - loading react from a cdn each time in a test is not good
//
// I think we're better off doing proper acceptance tests (real
// browsers, selenium), so I'll keep js-enabled integration tests to a
// minimum or disable.

const chai = require('chai'),
      expect = chai.expect,
      Browser = require('zombie'),
      request = require('supertest'),
      cheerio = require('cheerio'),
      port = 3001,
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

  xcontext('when js is turned on', function () {

    before(function (done) {
      const timeout = 30*1000;
      this.timeout(timeout);
      this.server = app.listen(port);
      this.browser = new Browser({
        site: `http://localhost:${port}`,
        silent: true,  // get output from window.console.output if needed
        waitDuration: timeout
      });
      this.browser.visit('/', done);
    });

    it('should return 200', function () {
      expect(this.browser.statusCode).to.equal(200);
    });

    it('should have 1 hCard form', function () {
      this.browser.assert.element('.hcardForm');
    });

    it('should have 1 hCard preview area', function () {
      this.browser.assert.element('.hcardPreview');
    });

    after(function (done) {
      this.server.close(done);
    });

  });

});

describe('/submit', function () {

  // We assume that we start with a record for
  // Sam Fairfax, email: sam.fairfax@... etc
  // because FakeDao gives us this.

  context('when js is turned off', function () {

    beforeEach(function () {

      this.hCardData = () => ({
        givenName: 'Sam-changed', // changed
        surname: 'Fairfax-changed',
        email: 'sam.fairfax@fairfaxmedia.com.au',
        phone: '0292822833',
        houseNumber: '100',
        street: 'Harris Street',
        suburb: 'Pyrmont',
        state: 'NSW',
        postcode: '2009',
        country: 'Australia'
      });

      this.request = request(app)
        .post('/submit')
        .type('form');

    });

    it('should redirect to /', function (done) {
      this.request
        .send(this.hCardData())
        .expect(303)
        .expect(res => {
          expect(res.header['location']).to.equal('/');
        })
        .end(err => done(err));
    });

    xit('should save details', function (done) {
      // Not sure if worth having, maybe just check the output?
    });

    xit('should render changed details', function (done) {
      this.request
        .send(this.hCardData())
        .redirects(1)
        .expect(res => {
          let $ = cheerio.load(res.text);
          expect($('input#givenName').val()).to.equal('Sam-changed');
        })
        .end(err => done(err));
    });

  });

  xcontext('when js is turned on', function () {
    // TODO
  });

});
