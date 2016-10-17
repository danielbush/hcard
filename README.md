# hCard

## Synopsis

You start with a blank user with id=1.

Running (production)

    npm start

Running dev

    npm run start:dev

**Note** this may reload express which will rest the user record to blank.

Running tests

    npm test

    npm run test:watch

## Notes and feedback

* I'm assuming node 6.
* I opted for a "User model" approach for the store eg `User.find*`
  `User#save` etc. The other option might have been to go with a
  "collection" model like the mongodb driver eg `db.users.find` etc.

* I didn't pick or build in a store (eg nedb, lowdb, leveldb, mongodb,
  mongoose); I'm assuming the exercise is more interested in how the
  store is decoupled from the application.
  I could have perhaps used **nedb** and had it use a memory
  store for *test* and *development* environments, and a file
  for production.  But it just seemed easier not to pick one
  given the openness of the requirements.

* Instead of a real store, I have a `FakeUser` class that acts as the
  User model with a "just good enough" memory store.  This class
  represents the expected interface this application expects.
* The `FakeUser` User model is not accessed directly; the code gets it by
  calling `getUserDao` function. This decouples the User model
  implementation and underlying connection mechanics from this
  application.

* I wasn't sure about the use of sessions from the instructions.
  I didn't implement any session-based or cookie-based logic in the code.
  The code has some middleware which ensures that `req.user` exists
  (like passport), which can then be used with the hCard components.

* `main.js` is served up from `dist/` by express; it would be pretty easy
  to put nginx reverse proxy in front and have it serve up
  assets in `dist/` and `public/`

* I'm assuming tests are part of the assessment.
  * I used mocha/chai/sinon for units tests.
  * Supertest for integration tests not involving a js-enabled client.
  * To test the js-enabled case I used `zombie`, but found it was
    slow to download some assets (probably the react cdn), and
    greatly slowed tests and even caused timeouts.
    I disabled the tests using `xcontext`.
  * The zombie browser will try to get react from the cdn which
    which isn't a great thing in a test (these are integration tests).
    TODO
  * I'd probably stick with acceptance-style tests in future eg
    mocha + wd or cucumber + wd (selenium) for testing full browser
    functionality even for integration tests.
    However this would make testing things like http status codes harder.

* Not sure if we can put in a csrf token here.
  For the non-js, it would presumably be a hidden form field.
  Didn't attempt to put this in for this exercise.

* Not sure if the avatar code submits.
  The input field looks to have no name attribute.
  The task specified `application/x-www-form-urlencoded` for both /submit
  and /update which would probably be inefficient for an image
  and multer only does multipart.
  So, after playing with multer, I left this one.
  (there is busboy apparently)
