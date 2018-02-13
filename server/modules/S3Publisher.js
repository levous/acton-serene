const AWS = require('aws-sdk');
const path = require('path');

class S3Publisher {

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_S3_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET,
      subregion: process.env.AWS_S3_REGION
    });
  }

  publishAsset(fileName, file, folderPath, fileType) {
    let key;
    const s3 = new AWS.S3()
    const bucketName = process.env.AWS_S3_ASSET_BUCKET;
    const cloudfrontBaseURL = process.env.AWS_CLOUDFRONT_BASE_URL;
    return s3.listObjects({
      Bucket: bucketName,
      Prefix: folderPath
    }).promise()
      .then(data => {
        key = path.join(folderPath, fileName);
        const keys = data.Contents.map(item => item.Key);
        // version filename by iterating through indexer if existing file found
        let incrementer = 2;
        while(keys.includes(key)){
          console.log('path parse:', key);
          const keyPath = path.parse(key);
          let name = keyPath.name;
          // check for previous versioning
          console.log('/-[0-9]+$/g.test(',name,')', /-[0-9]+$/g.test(name));
          if(/-[0-9]+$/g.test(name)){
            name = name.substring(0, name.lastIndexOf('-'));
          }
          const newKeyFileName = `${name}-${incrementer++}${keyPath.ext}`;
          key = path.join(keyPath.dir, newKeyFileName);
        }
        return;
      })
      .then(() => {
        console.log('S3Publisher publishing file to bucket:', bucketName, ' using key:', key);

        let awsData = {
          Bucket: bucketName,
          Key: key,
          ACL: 'public-read', // your permisions
        };

        if(typeof file === 'string'){

          const buf = new Buffer(file, 'base64');

          Object.assign( awsData, {
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: fileType
          });
        } else {
          Object.assign( awsData, {
            Body: file.buffer,
            ContentType: fileType || file.mimetype
          });
        }

        return s3.putObject(awsData).promise()
      })
      .then(()=>{
        const assetPath = '//' + path.join(cloudfrontBaseURL, key);
        return {
          url: assetPath,
          originalFileName: fileName
        }
      });
   }
 }

module.exports = S3Publisher;
