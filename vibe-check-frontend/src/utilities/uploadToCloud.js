import S3 from "react-aws-s3";
/**
 * Funciton to perform Image upload to S3
 * @param {File} file 
 * @param {String} newFileName 
 * @param {String} newFileExtension 
 * @returns Promise
 */
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
          const response = {
            status: false,
            data: data,
          };
          resolve(response);
        }
      })
      .catch((err) => {
        console.log("file upload error");
        const response = {
          status: false,
          data: err,
        };
        reject(response);
      });
  });
}



/* References: 
 Medium Article used to learn: 
https://medium.com/@steven_creates/uploading-files-to-s3-using-react-js-hooks-react-aws-s3-c4c0684f38b3
*/
