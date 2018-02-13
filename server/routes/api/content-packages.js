var ContentPackage = require('../../models/content-package');
var Controller = require('../../controllers/content-package.controller')(ContentPackage);
const express = require('express');
const router = express.Router();

exports.setup = (basePath, app) => {

//TODO: Refactor to extract the params and pass rather than the request and response.
//TODO: Refactor to use provided path rather than fully qualified.

	router.post('/:appKey/:resourceTargetPath/:containerKey', (req, res, next) => {
		const markdown = req.body.markdown;
		const {appKey, resourceTargetPath, containerKey} = req.params;

		Controller.saveFragment(appKey, resourceTargetPath, containerKey, markdown)
    .then(contentPackage => {
      res.json({contentPackage:contentPackage});
    })
    .catch(next);
  });

	router.get('/:appKey/:resourceTargetPath', (req, res, next) => {
		const {appKey, resourceTargetPath} = req.params;
		Controller.findPackage(appKey, resourceTargetPath)
    .then(contentPackage => {
			if(!contentPackage) throw new Error('Not Found');
      res.json({contentPackage: contentPackage});
    })
    .catch(next);
	});

	app.get('/', Controller.getAll);

	//app.get('/:id', Controller.findById);

	app.put('/:id', Controller.publish);

	app.delete('/:id', Controller.delete);

	app.use(basePath, router);
}
