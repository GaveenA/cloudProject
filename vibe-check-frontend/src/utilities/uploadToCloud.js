import S3 from "react-aws-s3";


/**
 * Funciton to perform Image upload to S3
 * @param {File} file 
 * @param {String} newFileName 
 * @param {String} newFileExtension 
 * @returns Promise
 */

/*
export function UploadToCloud(file, newFileName, newFileExtension) {
  const staticURl = "https://fwpbucket.s3.ap-southeast-2.amazonaws.com/";
  const directory = "fwp/";

  const config = {
    bucketName: process.env.REACT_APP_BUCKET_NAME,
    dirName: process.env.REACT_APP_DIR_NAME,
    region: process.env.REACT_APP_REGION,
    accessKeyId: process.env.REACT_APP_ACCESS_ID,
    secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
  };

  const ReactS3Client = new S3(config);
  let s3FilePathURL;
  let filePath;
  let s3UploadStatus = false;
  return new Promise((resolve, reject) => {
    ReactS3Client.uploadFile(file, newFileName)
      .then((data) => {
        console.log(data);
        if (data.status === 204) {
          console.log("file uplaod success");
          s3FilePathURL = data.location;
          filePath = staticURl + directory + newFileName + newFileExtension;
          s3UploadStatus = true;
          const response = {
            status: true,
            data: data,
          };
          resolve(response);
        } else {
          console.log("file upload fail");
          console.log("Response: " + data)
          const response = {
            status: false,
            data: data,
          };
          resolve(response);
        }
      })
      .catch((err) => {
        console.log("file upload error");
        console.log("Error: " + err)
        const response = {
          status: false,
          data: err,
        };
        reject(response);
      });
  });
}
*/

export function UploadToCloud(file, newFileName, newFileExtension) {

    // Load the SDK for JavaScript
  var AWS = require('aws-sdk');
  // Set the Region and Credentials 

  AWS.config.update({
    region: process.env.REACT_APP_REGION,
    apiVersion: 'latest',
    credentials: {
      accessKeyId: process.env.REACT_APP_ACCESS_ID,
      secretAccessKey: process.env.REACT_APP_ACCESS_KEY,
      // sessionToken: process.env.REACT_APP_SESSION_TOKEN,
    }
  })

  // Create S3 service object
  var s3 = new AWS.S3({apiVersion: '2006-03-01'});

  // call S3 to retrieve upload file to specified bucket
  var uploadParams = {Bucket: process.env.REACT_APP_BUCKET_NAME, Key: process.env.REACT_APP_DIR_NAME + '/' + newFileName, Body:file };
  var file = process.argv[3];

  // Configure the file stream and obtain the upload parameters
  // var fs = require('fs');
  // var fileStream = fs.createReadStream(file);
  // fileStream.on('error', function(err) {
  //   console.log('File Error', err);
  // });

  //uploadParams.Body = fileStream;
  // uploadParams.Body = file;
  // var path = require('path');
  // uploadParams.Key = path.basename(file);

  // call S3 to retrieve upload file to specified bucket
  
  

  return new Promise((resolve, reject) => {
    s3.upload (uploadParams, function (err, data) {
      if (err) {
        console.log("Response: " + err)
          const response = {
            status: false,
            data: data,
            error: err
          };
          reject(response);
      } if (data) {
        console.log("Upload Success", data.Location);
        const response = {
          status: true,
          data: data,
        };
        resolve(response);
      }
    });

  });
}


/* References: 
 Medium Article used to learn: 
https://medium.com/@steven_creates/uploading-files-to-s3-using-react-js-hooks-react-aws-s3-c4c0684f38b3
*/
