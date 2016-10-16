

const chai = require('chai'),
      chaiAsPromised = require('chai-as-promised'),
      expect = chai.expect,
      sinon = require('sinon'),
      sinonChai = require('sinon-chai'),
      user = require('../lib/middleware/user'),
      getCurrentUser = require('../lib/auth').getCurrentUser;

chai.use(chaiAsPromised);
chai.use(sinonChai);

// Some tests to make sure our (fake) user middleware is behaving as
// expected.

describe('user middleware', function () {

  beforeEach(function (done) {
    this.req = {};
    this.res = {};
    this.next = sinon.spy(() => { done(); });
    this.user = user();
    this.user(this.req, this.res, this.next);
  });

  it('should return a function', function () {
    expect(this.user).to.be.a('function');
  });

  it('should set req.user to an object', function () {
    expect(this.req.user).to.be.an('object');
  });

  it('should set various properties on req.user', function () {
    expect(this.req.user).to.have.all.keys(
      'id',
      'givenName',
      'surname',
      'email',
      'phone',
      'houseNumber',
      'street',
      'suburb',
      'state',
      'postcode',
      'country'
    );
  });

  it('should set req.user.email', function () {
    expect(this.req.user.email).to.match(/.*@.*/);
  });

  it('should call next', function () {
    expect(this.next).to.have.been.calledOnce;
  });


});

describe('getCurrentUser', function () {

  beforeEach(function () {
    this.currentUser = getCurrentUser();
  });

  it('should return a promise', function () {
    expect(this.currentUser).to.be.a('Promise');
  });

  it('should fetch user id 1', function () {
    return expect(this.currentUser).to.eventually.have.property('id', 1);
  });

});
