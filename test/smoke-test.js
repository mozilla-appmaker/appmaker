require('should');

describe('app', function() {
  it('should import without exploding in flame', function() {
    process.env['PERSONA_AUDIENCE'] = 'http://localhost:5000';
    process.env['LOGINAPI'] = 'http://localhost:3200';
    process.env['COOKIE_SECRET'] = 'super secret';
    require('../app').should.be.an.instanceOf(Object);
  });
});
