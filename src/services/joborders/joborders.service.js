// Initializes the `joborders` service on path `/joborders`
const createService = require('feathers-nedb');
const createModel = require('../../models/joborders.model');
const hooks = require('./joborders.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/joborders', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('joborders');

  service.hooks(hooks);

  service.publish(() => app.channel('authenticated'))
};
