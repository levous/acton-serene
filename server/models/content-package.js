var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Defining schema for our Todo API
var ContentPackageSchema = Schema({
  appKey: String,                 // support multiple apps per CMS
  resourceTargetPath: String,     // matches either URI or route path as determined by the consumer.  '/donuts/chocolate' or '/donuts/:flavor'

  contentFragments:[
    {
      containerKey: String,       // fragment position or container.  'top.left' or simply 'body'.  Determined by consumer.
      markdown: String
    }
  ],
  published: {
    type: Boolean,
    default: false
  }
},
{
  timestamps: true
});
//Exporting our model
var ContentPackageSchema = mongoose.model('ContentPackage', ContentPackageSchema);

module.exports = ContentPackageSchema;
