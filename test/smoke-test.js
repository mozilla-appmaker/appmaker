require('should');

describe('app', function() {
  it('should import without exploding in flame', function() {
    process.env['PERSONA_AUDIENCE'] = 'http://localhost:5000';
    require('../app').should.be.an.instanceOf(Object);
  });
});
