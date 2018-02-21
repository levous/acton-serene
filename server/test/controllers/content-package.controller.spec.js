"use strict";

var should = require('should'),
	sinon = require('sinon'),
	mongoose = require('mongoose'),
  mongooseHelper = require('../mongoose-helper');

//TODO: mocking just plain failed.  I was able to get the mocked model
//  through findOne but then save never resolved.  Since the test is
//  to verify that the passed info was used to construct a new instance,
//  mocking that condition would miss the point of the test
//  So I went back to connecting to a test database.
/*
	require('sinon-mongoose');
	var ContentPackageMock = sinon.mock(ContentPackage);
	ContentPackageMock
		.expects('findOne')
		.chain('exec')
		.resolves(null);
	*/

var ContentPackage = require('../../models/content-package');


describe('ContentPackageController Spec', function () {
  before(function (done) {
		console.log("*************** BEFORE " + __filename)
    mongooseHelper.connectDatabase(done);
  })

  after(done => {
    console.log("*************** AFTER " + __filename)
    mongooseHelper.resetDatabase(done)
  })

	describe('ContentPackage saveFragment()', function () {

    it('Should create a new ContentPackage when no match found', function () {

			const markdown = 'Test _content_',
        appKey = 'app-key',
        resKey = 'resource-targeting-key',
        containerKey = 'content-container-key';

			var ContentPackageController = require('../../controllers/content-package.controller')(ContentPackage);

			return ContentPackageController.saveFragment(appKey, resKey, containerKey, markdown)
      .then(contentFragment => {
				contentFragment.html.should.be.instanceof(String).and.equal('<p>Test <em>content</em></p>\n');
				contentFragment.markdown.should.be.instanceof(String).and.equal(markdown);
				contentFragment.containerKey.should.equal(containerKey);
        contentFragment.appKey.should.equal(appKey);
        contentFragment.resourceTargetPath.should.equal(resKey);
      });

		});

    it('Should update matching container-key in matching ContentPackage', function () {

			const markdown = 'Testing updates',
        appKey = 'app-key',
        resKey = 'key-to-match',
        containerKey = 'banana';

			var ContentPackageController = require('../../controllers/content-package.controller')(ContentPackage);

			return new ContentPackage({
				appKey: appKey,
				resourceTargetPath: resKey,
				contentFragments:[
					{
						containerKey: containerKey,
						markdown: 'Not the markdown you are looking for'
					}
				]
			})
			.save()
			.then((item) => {
				should.exist(item);
				return ContentPackageController.saveFragment(appKey, resKey, containerKey, markdown);
			})
      .then(contentFragment => {
				contentFragment.markdown.should.be.instanceof(String).and.equal(markdown);
				return ContentPackageController.findPackage(contentFragment.appKey, contentFragment.resourceTargetPath)
			})
			.then(contentPackage => {
				contentPackage.should.be.an.instanceOf(Object);
				contentPackage.contentFragments.should.be.instanceof(Array).and.have.lengthOf(1);
        contentPackage.appKey.should.equal(appKey);
        contentPackage.resourceTargetPath.should.equal(resKey);
				return ContentPackage.find({
					appKey: appKey,
					resourceTargetPath: resKey
				})
				.then(results => {
					results.should.be.instanceOf(Array).and.have.lengthOf(1);
					var match = results[0];
					match.contentFragments.should.be.instanceOf(Array).and.have.lengthOf(1);
					match.contentFragments[0].markdown.should.equal(markdown);
				});

			})

		});

    it('Should append fragment in matching ContentPackage', function () {

			const markdown = 'Testing updates',
        appKey = 'app-key',
        resKey = 'another-key-to-match',
        containerKey = 'frag-me';

			var ContentPackageController = require('../../controllers/content-package.controller')(ContentPackage);

			return new ContentPackage({
				appKey: appKey,
				resourceTargetPath: resKey,
				contentFragments:[
					{
						containerKey: 'non-matching-container',
						markdown: 'Not the markdown you are looking for'
					}
				]
			})
			.save()
			.then((item) => {
				should.exist(item);
				return ContentPackageController.saveFragment(appKey, resKey, containerKey, markdown);
			})
      .then(contentFragment => {
				return ContentPackageController.findPackage(contentFragment.appKey, contentFragment.resourceTargetPath)
			})
      .then(contentPackage => {
				contentPackage.should.be.an.instanceOf(Object);
				contentPackage.contentFragments.should.be.instanceof(Array).and.have.lengthOf(2);
        contentPackage.appKey.should.equal(appKey);
        contentPackage.resourceTargetPath.should.equal(resKey);
				return ContentPackage.find({
					appKey: appKey,
					resourceTargetPath: resKey
				})
				.then(results => {
					results.should.be.instanceOf(Array).and.have.lengthOf(1);
					var match = results[0];
					match.contentFragments.should.be.instanceOf(Array).and.have.lengthOf(2);
				});

			});

		});

  });

	describe('ContentPackage findPackage()', function () {

    it('Should retrieve matching ContentPackage when key matches', function () {

			const appKey = 'app-key',
        resKey = 'resource-targeting-key';

			var ContentPackageController = require('../../controllers/content-package.controller')(ContentPackage);

			return new ContentPackage({
				appKey: appKey,
				resourceTargetPath: resKey,
				contentFragments:[
					{
						containerKey: 'non-matching-container',
						markdown: 'It is the markdown you are looking for'
					}
				]
			})
			.save()
			.then((item) => {
				should.exist(item);
				return ContentPackageController.findPackage(appKey, resKey);
			})
      .then(contentPackage => {
				contentPackage.should.be.an.instanceOf(Object)
				contentPackage.contentFragments.should.be.instanceof(Array).and.have.lengthOf(1);
        contentPackage.appKey.should.equal(appKey);
        contentPackage.resourceTargetPath.should.equal(resKey);
      });

		});

	});

	describe('ContentPackage getManagedContent()', function () {

    it('Should retrieve managedContent when key matches', function () {

			const appKey = 'app-key-managed',
        resKey = 'resource-targeting-key',
				containerKey = 'fragement-key',
				markdown = '**bolded** and _stuff_![alt text](imageurl.gif){style="float:left" width=10px}';

			var ContentPackageController = require('../../controllers/content-package.controller')(ContentPackage);

			return new ContentPackage({
				appKey: appKey,
				resourceTargetPath: resKey,
				contentFragments:[
					{
						containerKey: containerKey,
						markdown: markdown
					}
				]
			})
			.save()
			.then((item) => {
				should.exist(item);
				return ContentPackageController.getManagedContent(appKey, resKey);
			})
      .then(managedContent => {
				managedContent.should.be.an.instanceOf(Object);
				managedContent.html.should.be.instanceof(Object);
        managedContent.html[containerKey].should.be.instanceof(String);
				managedContent.markdown.should.be.instanceof(Object);
        managedContent.markdown[containerKey].should.be.instanceof(String).and.equal(markdown);
        managedContent.html[containerKey].should.be.instanceof(String).and.equal('<p><strong>bolded</strong> and <em>stuff</em><img src="imageurl.gif" alt="alt text" style="float:left" width="10px" /></p>\n');
      });

		});

	});

});
    /*
		it('Should save todo', function (done) {
			var todoMock = sinon.mock(new TodoModel({ todo: 'Save new todo from mock'}));
			var todo = todoMock.object;

			todoMock
			.expects('save')
			.yields(null, 'SAVED');

			todo.save(function(err, result) {
				todoMock.verify();
				todoMock.restore();
				should.equal('SAVED', result, "Test fails due to unexpected result")
				done();
			});
		});

	});

	describe('Get all Todo test', function () {
		it('Should call find once', function (done) {
			var TodoMock = sinon.mock(TodoModel);
			TodoMock
			.expects('find')
			.yields(null, 'TODOS');

			TodoModel.find(function (err, result) {
				TodoMock.verify();
				TodoMock.restore();
				should.equal('TODOS', result, "Test fails due to unexpected result")
				done();
			});
		});
	});

	describe('Delete todo test', function () {
		it('Should delete todo of gived id', function (done) {
			var TodoMock = sinon.mock(TodoModel);

			TodoMock
			.expects('remove')
			.withArgs({_id: 12345})
			.yields(null, 'DELETED');

			TodoModel.remove({_id: 12345}, function(err, result){
				TodoMock.verify();
				TodoMock.restore();
				done();
			})


		});
	});

	describe('Update a todo', function () {
		it('Should update the todo with new value', function (done) {
			var todoMock = sinon.mock(new TodoModel({ todo: 'Save new todo from mock'}));
			var todo = todoMock.object;

			todoMock
			.expects('save')
			.withArgs({_id: 12345})
			.yields(null, 'UPDATED');

			todo.save({_id: 12345}, function(err, result){
				todoMock.verify();
				todoMock.restore();
				done();
			})

		});
	});

});
*/
