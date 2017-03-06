const { lensProp, merge, over } = require('ramda')

const defs = {
  credentials: 'true',
  headers: 'content-type',
  methods: 'GET,POST,OPTIONS,PUT,PATCH,DELETE',
  origin: '*'
}

const basics = opts => ({
  'access-control-allow-credentials': opts.credentials || defs.credentials,
  'access-control-allow-origin': opts.origin || defs.origin
})

const options = opts => ({ headers }) => ({
  headers: {
    'access-control-allow-headers': opts.headers || headers['access-control-request-headers'] || defs.headers,
    'access-control-allow-methods': opts.methods || headers['access-control-request-method'] || defs.methods
  },
  statusCode: 204
})

module.exports = (app, opts={}) => req =>
  Promise.resolve(req)
    .then(req.method === 'OPTIONS' && options(opts) || app)
    .then(over(lensProp('headers'), merge(basics(opts))))