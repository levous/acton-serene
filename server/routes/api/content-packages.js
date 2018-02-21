const express = require('express');

const ContentPackage = require('../../models/content-package');
const Controller = require('../../controllers/content-package.controller')(ContentPackage);
const S3Publisher = require('../../modules/S3Publisher');
const MarkdownAssetExtractor = require('../../modules/MarkdownAssetExtractor');
const router = express.Router();

exports.setup = (basePath, app) => {

//TODO: Refactor to extract the params and pass rather than the request and response.
//TODO: Refactor to use provided path rather than fully qualified.
//TODO: For now the POST '/:appKey/:resourceTargetPath/:containerKey' returns the ContentPackage it's contained by.  This should probably be either ManagedContent or a json representation of the fragment.
/**
 * POST
 * @param json {markdown=String}
 * @returns ///See TODO
 */
router.post('/:appKey/:resourceTargetPath/:containerKey', (req, res, next) => {
	let markdown = req.body.markdown;
	const {appKey, resourceTargetPath, containerKey} = req.params;

	let markdownPromise = new Promise((resolve, reject) => resolve(markdown));

	// look for base64 embedded images
	const markdownAssetExtractor = new MarkdownAssetExtractor(markdown);
	if(markdownAssetExtractor.containsBase64Images()) {
		// parse them out
		const extracted = markdownAssetExtractor.extractBase64Images();
		const s3Pub = new S3Publisher();
		const folderPath = `test`;

		const publishes = extracted.images.map((match, index) => {
			return s3Pub.publishAsset(match.fileName, match.base64, folderPath, match.imageType);
		})

		markdownPromise = Promise.all(publishes)
			.then(assets => {
				let finalMarkdown = extracted.updatedMarkdown;
				console.log('>>>> finalMarkdown')
				console.log(finalMarkdown)
				assets.forEach(asset => {
					finalMarkdown = finalMarkdown.replace(asset.originalFileName, asset.url);
				})

				return finalMarkdown;
			});
	}

	// markdown has either had it's embedded base64 images published to and linked from S3 or it has been untouched.
	markdownPromise.then(finalMarkdown => {
			return Controller.saveFragment(appKey, resourceTargetPath, containerKey, finalMarkdown)
		})
		.then(contentFragment => {
	    res.json({contentFragment:contentFragment});
	  })
	  .catch(next);
	});

	/**
	 * GET
	 * @returns ManagedContent (see README)
	 */
	router.get('/:appKey/:resourceTargetPath', (req, res, next) => {
		const {appKey, resourceTargetPath} = req.params;
		Controller.getManagedContent(appKey, resourceTargetPath)
	  .then(managedContent => {
			if(!managedContent) throw new Error('Not Found');
	    res.json({managedContent: managedContent});
	  })
	  .catch(next);
	});

	/**
	 * GET
	 * @returns [String] A list of all resource keys given the appKey
	 */
	router.get('/:appKey', (req, res, next) => {
		const {appKey} = req.params;
		Controller.getContentResourceList(appKey)
		.then(resources => {
			const resourceList = resources.map(resource => {
				return {
					appKey: resource.appKey,
					resourceTargetPath: resource.resourceTargetPath,
					published: resource.published,
					updatedAt: resource.updatedAt
				}
			})
			res.json({resourceList: resourceList});
		})
		.catch(next);
	});

	//app.get('/:id', Controller.findById);

	router.put('/:id', Controller.publish);

	router.delete('/:id', Controller.delete);

	app.use(basePath, router);
}
