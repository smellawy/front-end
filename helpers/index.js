(function () {
  'use strict';
  const axios = require("axios");
  const helpers = {};

  // Error-handling middleware → MUST have 4 parameters
  helpers.errorHandler = function (err, req, res, next) {
    console.error(err.stack); // good for logs

    const status = err.status || 500;
    const response = {
      message: status === 500 ? 'Internal Server Error' : err.message,
      // error: err   // ← uncomment only in development
    };

    res.status(status).json(response);
  };

  // Normal middleware → 3 parameters
  helpers.sessionMiddleware = function (req, res, next) {
    if (!req.cookies.logged_in) {
      req.session.customerId = null;
    }
    next(); // Don't forget this!
  };

  helpers.respondSuccessBody = function (res, body) {
    helpers.respondStatusBody(res, 200, body);
  };

  helpers.respondStatusBody = function (res, statusCode, body) {
    res.writeHead(statusCode);
    res.write(body);
    res.end();
  };

  helpers.respondStatus = function (res, statusCode) {
    res.writeHead(statusCode);
    res.end();
  };

  helpers.rewriteSlash = function (req, res, next) {
    if (req.url.substr(-1) === '/' && req.url.length > 1) {
      res.redirect(301, req.url.slice(0, -1));
    } else {
      next();
    }
  };

  helpers.simpleHttpRequest = function (url, res, next) {
    axios
      .get(url)
      .then(function (response) {
        helpers.respondSuccessBody(res, response.data);
      })
      .catch(function (error) {
        next(error); // pass to error handler
      });
  };

  helpers.getCustomerId = function (req, env) {
    const logged_in = req.cookies.logged_in;

    // TODO REMOVE THIS, SECURITY RISK
    if (env === "development" && req.query.custId != null) {
      return req.query.custId;
    }

    if (!logged_in) {
      if (!req.session.id) {
        throw new Error("User not logged in.");
      }
      return req.session.id;
    }

    return req.session.customerId;
  };

  module.exports = helpers;
})();
