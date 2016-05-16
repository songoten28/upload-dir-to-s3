# upload-dir-to-s3

Upload a directory to a s3 bucket with a specified key prefix returning a promise that resolves to a list of modified keys.

## Usage Examples

### Simple

```
var uploadDirToS3 = require('upload-dir-to-s3');

var directory = '/Users/me/stuff-on-local';
var bucket = 'bucket-on-aws';
var keyPrefix = 'stuff';

uploadDirToS3(directory, bucket, keyPrefix)
  .then(function (modifiedKeySet) {
    console.log('Upload Complete, modified the following keys', modifiedKeySet);
  })
;
```

### Default S3 Params For Each File

```
... see Simple example ...
var defaultS3Params = {
  ContentEncoding: 'gzip',
  CacheControl: 'public, max-age=31536000' // ~1 year
};

uploadDirToS3(directory, bucket, keyPrefix, defaultS3Params)
... see Simple example ...
```

### Callback For Each File Uploaded

```
... see Simple example ...
var defaultCacheControl = 'public, max-age=31536000'; // ~1 year
var cacheMap = {
  'index.html': 'private, no-cache, no-store, must-revalidate' // no caching
};
var perFileCallback = function (localFile, stat, s3ParamsCallback) {
  var key = localFile.replace(directory + '/', '');
  var s3Params = {
    ContentEncoding: 'gzip',
    CacheControl: cacheMap[key] || defaultCacheControl
  };
  s3ParamsCallback(null, s3Params);
});

uploadDirToS3(directory, bucket, keyPrefix, perFileCallback)
... see Simple example ...
```

### Non Default S3 Client

```
var AWS = require('aws-sdk');
var uploadDirToS3 = require('upload-dir-to-s3');

var awsS3Client = new AWS.S3({
  accessKeyId: process.env.MY_SPECIAL_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_SPECIAL_SECRET_ACCESS_KEY
});

var directory = '/Users/me/stuff-on-local';
var bucket = 'bucket-on-aws';
var keyPrefix = 'stuff';

uploadDirToS3(directory, bucket, keyPrefix, null, awsS3Client)
  .then(function (modifiedKeySet) {
    console.log('Upload Complete, modified the following keys', modifiedKeySet);
  })
;
```
