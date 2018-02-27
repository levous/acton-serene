"use strict";
const markdownIt = require("markdown-it");
const markdownItAttrs = require('markdown-it-attrs');
const errors = {MissingParameterError: Error};

const mdown = markdownIt({xhtmlOut:true});
mdown.use(markdownItAttrs);

var ContentPackageController = function(ContentPackage){

	var Controller = {};
	//TODO: Refactor to receive the params, not the request and response.
	//TODO: refector into promises

	Controller.getManagedContent = function(appKey, resourceTargetPath) {
		return Controller.findPackage(appKey, resourceTargetPath)
		.then(contentPackage => {
			//TODO: convert to rich NotFoundError
			if(!contentPackage) throw new Error('Not Found');

      let managedContent = {id: contentPackage.id, resourceTargetPath: resourceTargetPath, html: {}, markdown: {}};
      contentPackage.contentFragments.forEach(fragment => {
        managedContent.html[fragment.containerKey] = mdown.render(fragment.markdown);
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
		})
		.then(contentPackage => {
			if(!contentPackage) throw new Error('Save failed');
			const contentFragment = contentPackage.contentFragments.find(fragment => fragment.containerKey === containerKey);
			if(!contentFragment) throw new Error('Save failed while trying to find new fragment');
			return {
				appKey: contentPackage.appKey,
				resourceTargetPath: contentPackage.resourceTargetPath,
				containerKey: contentFragment.containerKey,
				markdown: contentFragment.markdown,
				html: mdown.render(contentFragment.markdown)
			}
		});
	}

	Controller.savePackage = function(contentPackage) {
		const find = contentPackage.id ? ContentPackage.findById(contentPackage.id) : Controller.findPackage(contentPackage.appKey, contentPackage.resourceTargetPath);
		return find.then(matchingPackage => {

			if(matchingPackage) {
				Object.assign(matchingPackage, contentPackage);
				return matchingPackage.save();
			} else {
				// ensure empty props where needed, copy passed data
				const newPackage = Object.assign({
						appKey:null,
						resourceTargetPath: null,
						contentFragments: []
					},
					contentPackage
				);
				
				return new ContentPackage(newPackage).save();
			}
		})
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

	Controller.getContentResourceList = appKey => {
		if(!appKey) return Promise.reject(new errors.MissingParameterError('appKey was not provided'));

		return ContentPackage.find({'appKey': appKey})
			.select({
				appKey: 1,
				published: 1,
				resourceTargetPath: 1,
				updatedAt: 1
			})
			.lean()
			.exec();
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
