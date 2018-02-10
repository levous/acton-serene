"use strict";
const markdown = require( "markdown" ).markdown;

const errors = {MissingParameterError: Error};

var ContentPackageController = function(ContentPackage){

	var Controller = {};
	//TODO: Refactor to receive the params, not the request and response.
	//TODO: refector into promises

	Controller.getManagedContent = function(appKey, resourceTargetPath) {
		return Controller.findPackage(appKey, resourceTargetPath)
		.then(contentPackage => {
      var managedContent = {html: {}, markdown: {}};
      contentPackage.contentFragments.forEach(fragment => {
        managedContent.html[fragment.containerKey] = markdown.toHTML(fragment.markdown);
				managedContent.markdown[fragment.containerKey] = fragment.markdown;
      })
			return managedContent
		})
	}

	Controller.findPackage = function(appKey, resourceTargetPath) {

		if(!appKey) return Promise.reject(new errors.MissingParameterError('appKey was not provided'));
		if(!resourceTargetPath) return Promise.reject(new errors.MissingParameterError('resourceTargetPath was not provided'));

		const query = {
			'appKey': appKey,
			'resourceTargetPath': resourceTargetPath
		 };

		return ContentPackage.findOne(query).exec();
	}

	Controller.saveFragment = function(appKey, resourceTargetPath, containerKey, markdown) {

	  if(!containerKey) {
			return Promise.reject(new errors.MissingParameterError('containerKey was not provided'));
		}

	  return Controller.findPackage(appKey, resourceTargetPath)
		.then(contentPackage => {

			if(contentPackage) {
				let fragment = contentPackage.contentFragments.find(fragment => fragment.containerKey === containerKey);
				if(!fragment){
					fragment = {containerKey: containerKey, markdown: markdown};
					contentPackage.contentFragments.push(fragment);
				}
				fragment.markdown = markdown;

				return contentPackage.save();
			} else {
				const newCP = {
					appKey: appKey,
					resourceTargetPath: resourceTargetPath,
					contentFragments:[
						{
							containerKey: containerKey,
							markdown: markdown
						}
					]
				}

				return new ContentPackage(newCP).save();
			}
		});
	}



	Controller.post = function(req, res, next){
		var newContentPackage = new ContentPackage(req.body);
		newContentPackage.save(function(err, newItem){
			if(err){
				res.json({status: false, error: err.message});
				return;
			}
			res.json({status: true, ContentPackage: newItem});
		});
	}

	Controller.getAll = function(req, res, next){

		ContentPackage.find(function(err, results){
			if(err) {
				res.json({status: false, error: "Something went wrong"});
				return
			}
			res.json({status: true, ContentPackages: results});
		});
	}

	Controller.publish = function(req, res, next){
		var published = req.body.published;
		ContentPackage.findById(req.params.content_doc_id, function(err, item){
			item.published = completed;
			item.save(function(err, updatedItem){
				if(err) {
					res.json({status: false, error: "Doc not published"});
				}
				res.json({status: true, message: "Item published successfully"});
			});
		});
	}

	Controller.delete = function(req, res, next){
		ContentPackage.remove({_id : req.params.content_doc_id }, function(err, items){
			if(err) {
				res.json({status: false, error: "Item delete failed"});
			}
			res.json({status: true, message: "Item deleted successfully"});
		});
	}

	return Controller;
}

module.exports = ContentPackageController;
