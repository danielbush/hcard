

const _ = require('lodash'),
      chai = require('chai'),
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

      context('when the record is changed', function () {

        before(function (done) {
          FakeUser.findUserById(1)
            .then(user => {
              this.user = user;
              user.save({ givenName: 'foo' }, err => {
                done(err);
              });
            })
            .catch(err => done(err));
        });

        it('should retrieve the changed user', function () {
          // We want this to behave as an in-memory store
          // to mimic a real store.

          return expect(FakeUser.findUserById(1))
              .to.eventually.have.property('givenName', 'foo');
        });

      });

    });

    describe('FakeUser#save', function () {

      beforeEach(function (done) {
        this.changes = {
          givenName: 'Sam-changed',
          surname: 'Fairfax-changed',
          email: 'sam.fairfax-changed@fairfaxmedia.com.au',
          phone: '0292822833-changed',
          houseNumber: '100-changed',
          street: 'Harris-changed Street',
          suburb: 'Pyrmont-changed',
          state: 'QLD',
          postcode: '2010',
          country: 'New Zealand'
        };
        this.fields = [
          'givenName', 'surname', 'email', 'phone', 'houseNumber',
          'street', 'suburb', 'state', 'postcode', 'country'
        ];
        FakeUser.reset();
        FakeUser.findUserById(1)
          .then(user => {
            this.user = user;
            done();
          })
          .catch(err => done(err));
      });


      it('should not raise an error', function (done) {
        this.user.save(this.changes, (err) => {
          done(err);
        });
      });

      it('should update all hcard attributes', function (done) {
        this.user.save(this.changes, (err) => {
          expect(_.pick(this.user, this.fields))
            .to.deep.equal({
              givenName: 'Sam-changed',
              surname: 'Fairfax-changed',
              email: 'sam.fairfax-changed@fairfaxmedia.com.au',
              phone: '0292822833-changed',
              houseNumber: '100-changed',
              street: 'Harris-changed Street',
              suburb: 'Pyrmont-changed',
              state: 'QLD',
              postcode: '2010',
              country: 'New Zealand'
            });
          done(err);
        });
      });

      it('should not update the id', function (done) {
        this.user.save({ id: 'new-id' }, (err) => {
          expect(this.user.id).to.equal(1);
          done(err);
        });
      });

    });

  });

});

