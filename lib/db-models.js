var schemaDefinitions = {
  'Component': {
    collection: 'components',
    schema: {
      'author': 'string',
      'name': 'string',
      'url': 'string',
      'created-date': 'string',
      'modified-date': 'string'
    }
  },
  'App': {
    collection: 'apps',
    schema: {
      'appid': 'string',
      'author': 'string',
      'name': 'string',
      'html': 'string',
      'last-published-url': 'string',
      'created-date': 'string',
      'published-date': 'string',
      'modified-date': 'string'
    }
  }
};

var models = {};

module.exports = {
  init: function (dbconn) {
    Object.keys(schemaDefinitions).forEach(function (name) {
      var schema = dbconn.Schema(schemaDefinitions[name].schema);
      models[name] = dbconn.model(name, schema, schemaDefinitions[name].collection);
    });
  },
  get: function (name) {
    return models[name];
  }
};
