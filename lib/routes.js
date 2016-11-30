const express = require('express');
const lib = require('./api');
const router = express.Router();

// Methods
router.post('/create',
  lib.assertIsValidRequest,
  lib.createPdf);
  
router.get('/download/:fileId',
  lib.downloadPdf);

module.exports = router;
