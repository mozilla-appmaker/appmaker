require('should');

describe('app', function() {
  it('should import without exploding in flame', function() {
    process.env['PERSONA_AUDIENCE'] = 'http://localhost:5000';
    process.env['LOGINAPI'] = 'http://localhost:3000';
    process.env['COOKIE_SECRET'] = 'super secret';
    process.env['APP_HOSTNAME'] = 'http://localhost:5000';
    process.env['LOGINAPI_WITH_AUTH'] = 'http://testuser:password@localhost:3000';
    require('../app').should.be.an.instanceOf(Object);
  });
});
