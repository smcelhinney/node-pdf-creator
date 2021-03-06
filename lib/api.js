const ejs = require('ejs');
const uuid = require('uuid');
const redis = require('redis');
const path = require('path');
const pdf = require('html-pdf');
const os = require('os');
const fs = require('fs');
const config = require('./config');
const client = redis.createClient(process.env.REDIS_URL);

const keys = config.applicationKeys;

const handleError = (error, res, statusCode) => {
  return res.status(statusCode || 401).send({
    error
  });
};

module.exports = {
  assertIsValidRequest(req, res, next) {
    // FIXME: Implement this
    if (req.headers && req.headers.authorization) {
      const key = req.headers.authorization.replace(/Bearer /, '');
      if (keys[key]) {
        next();
      } else {
        handleError(`Invalid authorization key passed: ${key}`, res);
      }
    } else {
      handleError('Requires authorization', res);
    }
  },
  downloadPdf(req, res, next) {
    if (req.params && req.params.fileId) {
      client.get(`PDF:${req.params.fileId}`, (error, html) => {
        if (error) {
          res.status(400).json({
            error
          });
        } else {
          if (html) {
            // FIXME: Add more options as required.
            var options = {
              format: 'Letter'
            };

            pdf.create(html, options).toStream(function (err, stream) {
              if (err) {
                res.status(400).send('Stream failed');
              } else {
                res.setHeader('Content-disposition', `attachment; filename=${req.params.fileId}.pdf`);
                res.setHeader('Content-type', 'application/pdf');
                stream.pipe(res);
              }
            });
          } else {
            res.status(401).send(`Cannot find file with ID ${req.params.fileId}, it may have expired.`);
          }
        }
      });
    } else {
      res.status(400).send('Missing file ID');
    }
  },
  createPdf(req, res, next) {
    if (req.body && req.body.fields && req.body.fields.properties && req.body.fields.ejsFile) {
      const fileId = uuid.v4();
      const fileName = path.resolve(__dirname, req.body.fields.ejsFile);
      ejs.renderFile(fileName, req.body.fields.properties, (error, result) => {
        if (error) {
          console.log(error);
          res.status(400).send({
            error, result
          });
        } else {
          client.set(`PDF:${fileId}`, result.replace(/\n+/g, ''));
          client.expire(`PDF:${fileId}`, config.api.pdfExpiryInSeconds);
          res.status(200).send({
            filename: `http://${req.headers.host}/api/v1/download/${fileId}`
          });
        }
      })
    } else {
      handleError('One of fields.properies or fields.ejsFile is missing', res);
    }
  },
  previewHtml(req, res, next) {
    try {
      const file = path.resolve(__dirname, `../${req.params[0]}.ejs`);
      const optionsFile = path.resolve(__dirname, `../${req.params[0]}.json`);
      const options = require(optionsFile).fields.properties;
      ejs.renderFile(file, options, (err, str) => {
        // str => Rendered HTML string
        if (err) {
          console.log(err);
          res.status(400).send(`Error parsing ${file}`);
        } else {
          res.status(200).send(str);
        }
      });

    } catch (e) {
      res.status(400).send(`<h2>Error something went wrong</h2><p>${e}</p>`);
    }

  }
};
