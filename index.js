'use strict';

var s3 = require('s3');

module.exports = function (directory, bucket, keyPrefix, defaultS3ParamsOrPerFileCallback, awsS3Client) {
	// the default aws-sdk internals will be used for creating a client unless
	// an AWS S3 client is specified.
	var s3Client = s3.createClient(awsS3Client && {s3Client: awsS3Client});
	
	var s3Params = {
		localDir: directory,
		s3Params: {
			Bucket: bucket,
			Prefix: keyPrefix
		}
	};
	
	if (typeof defaultS3ParamsOrPerFileCallback === 'function') {
		// callback per file
		s3Params.getS3Params = defaultS3ParamsOrPerFileCallback
	} else if (typeof defaultS3ParamsOrPerFileCallback === 'object') {
		// default S3 Params
		Object.assign(s3Params.s3Params, defaultS3ParamsOrPerFileCallback);
	}
	
	return new Promise(function (resolve, reject) {
		var modifiedFileList = [];
		var uploader = s3Client.uploadDir(s3Params);
		uploader.on('error', reject);
		uploader.on('fileUploadEnd', function (path, key) {
			modifiedFileList.push(key.replace(keyPrefix, ''));
		});
		uploader.on('end', function () {
			resolve(modifiedFileList);
		});
	});
};
