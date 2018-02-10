var express = require('express');
var router = express.Router();
var ContentPackage = require('../models/content-package');
var ContentPackageController = require('../controllers/content-package.controller')(ContentPackage);

exports.setup = (basePath, app) => {
  /* GET home page. */
  router.get('/', function(req, res, next) {
    console.log('hello');
    ContentPackageController.getManagedContent('example', 'home-page')
    .then(managedContent => {
      return res.render('index', { title: 'Express', managedContent: managedContent});
    })
    .catch(next);
  });

  // Just to test our server is working
  app.get('/health-check', function(req, res) {
    res.send({
      alive: 'yessir'
    });
  });

  // using this to try to get supertest working...  Can be deleted
  router.get('/hmm', function(req, res, next) {
    return new Promise(function(resolve, reject) {
      res.render('index', { title: 'Express', managedContent: {html:{}}});
      resolve();
    });
  });


  app.use(basePath, router);
}
