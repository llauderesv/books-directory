import loadConfig from 'src/config/config';
import { expressjwt as jwt } from 'express-jwt';
const jwksRsa = require('jwks-rsa');

const config = loadConfig();

// Middleware to check for valid JWT
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: config.AUTH0_AUDIENCE,
  issuer: `https://${config.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

export default checkJwt;
