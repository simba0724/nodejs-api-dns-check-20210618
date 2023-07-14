const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

module.exports = async (req, res, next) => {
    const checkJwt = jwt({
      secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://auth-av.eu.auth0.com/.well-known/jwks.json`
      }),

      audience: 'api.laconfection-digitale.fr/dns',
      issuer: `https://auth.pluggyz.fr/`,
      algorithms: ['RS256']
    });

    let token = await checkJwt();
    // let data = req.body

    // client.get(data.client_id, function(err,user){
    //   if(!user) return next();

      // let data = JSON.parse(user);

      // const clockTimestamp = Math.floor(Date.now() / 1000);

      // if(clockTimestamp >= data.data.expires_in) {
      //   return next();
      // }

    //   res.status(401).json({"data": {"error":"access_denied","error_description":"Unauthorized"}})
    // });
};
