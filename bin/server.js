const server = require('../app');
const debug = require('debug')('ifttt:server');

server.port = process.env.PORT || 3000;
server.listen(server.port, () => {
  debug(`Started up server listening on port ${server.port}`);
});

module.exports = server;
