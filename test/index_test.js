

const chai = require('chai'),
      chaiAsPromised = require('chai-as-promised'),
      expect = chai.expect,
      sinon = require('sinon'),
      sinonChai = require('sinon-chai'),
      user = require('../lib/middleware/user'),
      getCurrentUser = require('../lib/auth').getCurrentUser,
      getDAO = require('../lib/dao').getDAO,
      FakeDAO = require('../lib/dao/fake_dao');

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

describe('DAO', function () {

  describe('getDAO', function () {

    // This would obviously have to change.

    it('should return FakeDAO for all environments', function () {
      expect(getDAO()).to.be.instanceof(FakeDAO);
    });

  });

  describe('FakeDAO', function () {

    describe('#findUserById', function () {

      beforeEach(function () {
        this.dao = new FakeDAO();
      });

      it('should return a promise', function () {
        expect(this.dao.findUserById(1)).to.be.a('promise');
      });

      it('should resolve for user id=1', function () {
        return expect(this.dao.findUserById(1)).to.eventually.have.property('id', 1);
      });

      it('should reject for user id=2', function () {
        return expect(this.dao.findUserById(2)).to.be.rejected;
      });

    });

  });

});
