

const chai = require('chai'),
      chaiAsPromised = require('chai-as-promised'),
      expect = chai.expect,
      sinon = require('sinon'),
      sinonChai = require('sinon-chai'),
      user = require('../lib/middleware/user'),
      auth = require('../lib/auth'),
      dao = require('../lib/dao'),
      FakeUser = require('../lib/models/fake_user');

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

  context('when getCurrentUser rejects', function () {

    before(function () {
      sinon.stub(auth, 'getCurrentUser', () => Promise.reject(new Error('some error')));
    });

    it('should call next with 401', function () {
      expect(this.next.args[0][0]).to.have.property('status', 401);
    });

    after(function () {
      auth.getCurrentUser.restore();
    });

  });


});

describe('getCurrentUser', function () {

  beforeEach(function () {
    this.currentUser = auth.getCurrentUser();
  });

  it('should return a promise', function () {
    expect(this.currentUser).to.be.a('Promise');
  });

  it('should fetch user id 1', function () {
    return expect(this.currentUser).to.eventually.have.property('id', 1);
  });

});

describe('dao', function () {

  describe('dao.getUserDao', function () {

    it('should get a fake user model', function () {
      expect(dao.getUserDao().name).to.equal('FakeUser');
      // It might get a real User model if NODE_ENV is production...
    });

  });

});

describe('models', function () {

  describe('FakeUser', function () {

    describe('FakeUser.findUserById', function () {

      it('should return a promise', function () {
        expect(FakeUser.findUserById(1)).to.be.a('promise');
      });

      it('should resolve for user id=1', function () {
        return expect(FakeUser.findUserById(1)).to.be.fulfilled;
      });

      it('should resolve a FakeUser instance for id=1', function () {
        return expect(FakeUser.findUserById(1))
            .to.eventually.be.instanceof(FakeUser)
            .and.have.property('id', 1);
      });

      it('should have a given name of Sam', function () {
        return expect(FakeUser.findUserById(1))
            .to.eventually.have.property('givenName', 'Sam');
      });

      it('should reject for user id=2', function () {
        return expect(FakeUser.findUserById(2)).to.be.rejected;
      });

    });

  });

});

