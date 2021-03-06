const sizeOf = require('image-size');
const mime = require('mime-types');

const regexBase64Image = /\(data:(image\/[a-zA-Z]*);base64,([^\)]*)\)/g;

class MarkdownAssetExtractor {

  constructor(markdown) {
    if(!markdown) throw new Error('Invalid null sent to constructor');
    this.markdown = markdown;
  }

  containsBase64Images() {
    return regexBase64Image.test(this.markdown)
  }

  extractBase64Images(){
    var matches = [], matchIdx = 0;
    // clever way to hijack String.replace http://danburzo.ro/string-extract/
    this.markdown.replace(regexBase64Image, function(match, imageType, base64) {
      const extension = mime.extension(imageType);
      var d = new Date();
      const fileName = `${d.getFullYear()}${d.getMonth()+1}${d.getDate()}_image${matchIdx++}.${extension}`;
      const dimensions = sizeOf(new Buffer(base64, 'base64'));
      
      matches.push({
          match,
          imageType,
          base64,
          fileName,
          dimensions
      });
    });

    let markdownTagged = this.markdown;
    matches.forEach(match => {
      markdownTagged = markdownTagged.replace(match.match, `(${match.fileName})`)
    });

    return {
      updatedMarkdown: markdownTagged,
      images: matches
    };
  }

}


module.exports = MarkdownAssetExtractor;
