"use strict";

var should = require('should'),
	sinon = require('sinon');

var MarkdownAssetExtractor = require('../../modules/MarkdownAssetExtractor');

describe('MarkdownAssetExtractor Spec', function () {
  before(function (done) {
		console.log("*************** BEFORE " + __filename)
    done();
  })

  after(done => {
    console.log("*************** AFTER " + __filename)
    done();
  })

  const markdownWithOneBase64Image = 'bummer *_again_*![](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYxIDY0LjE0MDk0OSwgMjAxMC8xMi8wNy0xMDo1NzowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNS4xIE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFRkYxNEJDQkMzRUExMUU1QUI0RDlGRkRDRUYzNDZENyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFRkYxNEJDQ0MzRUExMUU1QUI0RDlGRkRDRUYzNDZENyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkVGRjE0QkM5QzNFQTExRTVBQjREOUZGRENFRjM0NkQ3IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVGRjE0QkNBQzNFQTExRTVBQjREOUZGRENFRjM0NkQ3Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+dgvZLwAAAi9JREFUeNrEl01LG1EUhidBq1hJtShiiK3B1CaKgojgonRVRARdVAR1oVWstTbFleLCH6BbXbpyo7gUWqpQ3bgSFUpTJCqRQKRUtH5QrRZM8b3wCoHMR2YyMznwkGS+7pOZe8854xi68UhpRAFYBtvgg9GLOKX0ohPU8bMmExKPQBA8AI/Bx0xIvAbVCb87gN9OiRzwXmZ+9Nkp0QbqZbb3Ao8dEmIODCqcW0IRyyVegFcq+/s5US2VCGrs93LJWibRAJo0jnGAd3xsKUWWxr48kA/cnHDD4GEK160Fk2AFHIFf4Ar8BfEka6ZtFwd5CkqBjzmgjNuL08gn/ynyE8TADohQ7BAcCIkxfOnivy0E2ZI9cQvOQTiLheeJZH+IsYvEahMTsxWsS5mLGSHxHfSAHxkQmAej90s0CtptFlkEA+BfYp7YYyXctUFgCbwF13LJKkyRfQsFPrG+/FHLmCE+mogFAl8pcJFK2g4x/0dNFFhlPjrVUzu22LhcmiAQY8NzYqSAXWnUFz3Z8cxoFa0AuSZIiPpTblSiyqT5IOpRpREJh5q9gXhmREL0Es9NlPAbkXCxnzArvErjqUn42F+oxW8wBWZFDdA41q3UHDk1Vobakptj1z3OV4AW8FnlnCKK6JIIKGz/AprBG/AtYfsaX4q6wYbMeYVKj9epY3luMpW3MgUr9ZMLvEMjMvUnoFfiGNxwcHG7X7IHiKcwCUWqnwaNYILN7QXnUFLcCTAAvCVhn6I1JQAAAAAASUVORK5CYII=)';

	describe('Base64 Image Tests', function () {

    it('Should return true when an image is embedded', function () {
      const markdownAssetExtractor = new MarkdownAssetExtractor(markdownWithOneBase64Image);
      markdownAssetExtractor.containsBase64Images().should.be.true();
      const markdownAssetExtractor2 = new MarkdownAssetExtractor('there is no image __here__');
      markdownAssetExtractor2.containsBase64Images().should.be.false();
    });


    it('Should extract images when image is embedded', function () {

      const markdownAssetExtractor = new MarkdownAssetExtractor(markdownWithOneBase64Image);
      const extractedData = markdownAssetExtractor.extractBase64Images();
      // verify the filename is properly formed.  It's not important that it be this exact format but it must have a valid format with appropriate extension
      const d = new Date();
      const expectedFilename = `${d.getFullYear()}${d.getMonth()+1}${d.getDate()}_image0.png`;

      extractedData.should.be.instanceof(Object);
      // this is based off of the markdownWithOneBase64Image at the time this test was written
      extractedData.updatedMarkdown.should.be.instanceof(String).and.equal(`bummer *_again_*![](${expectedFilename})`);
      extractedData.images.should.be.instanceOf(Array).and.have.lengthOf(1);
      extractedData.images[0].fileName.should.equal(expectedFilename);
      extractedData.images[0].imageType.should.equal('image/png');

      // negative test
      const noEmbedMarkdown = 'Heeeeloooooo';
      const extractedData2 = new MarkdownAssetExtractor(noEmbedMarkdown).extractBase64Images();
      extractedData2.images.should.be.instanceOf(Array).and.have.lengthOf(0);
      extractedData2.updatedMarkdown.should.equal(noEmbedMarkdown);

    });

  });

});
