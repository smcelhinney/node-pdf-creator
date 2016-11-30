const applicationKeys = require('./app-keys.json');
module.exports = {
  applicationKeys,
  api: {
    // 8 hours.
    pdfExpiryInSeconds: 60 * 60 * 8
  }
};
