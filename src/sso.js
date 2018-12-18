const Strategy = require('passport-custom');
const axios = require('axios');
const jwtDecode = require('jwt-decode');

module.exports = opts => {
  opts = {
    url: 'http://localhost:3030',
    ...opts
  }
  return function() {
    const verifier = async (req, done) => {
      try {
        const req1 = await axios.post(opts.url + '/authentication', {
          strategy: 'local',
          email: req.body.email,
          password: req.body.password
        }, {
          'Content-Type': 'application/json'
        });

        const token1 = req1.data.accessToken;

        const payload = jwtDecode(token1)

        // console.log(payload)

        const req2 = await axios.get(opts.url + '/users/' + payload.userId, {
          params: {
            _id: 'oinfVJ17sjufECtn'
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: token1
          }
        });

        let userSSO = req2.data;

        user = await this.service('users').create(userSSO);

        return done(null, userSSO, {
          accessToken: token1,
          userId: user.id
        });
        

      } catch (error) {
        // throw new Error(error)
        console.error(error)
        return done(null, false);
      }
      
    };

    // register the strategy in the app.passport instance
    this.passport.use('sso', new Strategy(verifier));
    // Add options for the strategy
    this.passport.options('sso', {});
  };
};