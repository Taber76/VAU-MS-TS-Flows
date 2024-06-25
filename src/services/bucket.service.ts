import os = require("oci-objectstorage");
import fs = require("fs");
import { OCI_NAMESPACE, OCI_BUCKET } from "../config/environment";

import provider from "../config/oci.sdk.provider";


export default class BucketService {
  private static client: os.ObjectStorageClient
  private static namespace: string
  private static bucketName: string

  static {
    BucketService.client = new os.ObjectStorageClient({ authenticationDetailsProvider: provider });
    BucketService.namespace = OCI_NAMESPACE;
    BucketService.bucketName = OCI_BUCKET;
  }

  public static async uploadFileToBucket(objectName: string, file: any): Promise<void> {
    try {
      const putObjectRequest: os.requests.PutObjectRequest = {
        namespaceName: BucketService.namespace,
        bucketName: BucketService.bucketName,
        putObjectBody: file.buffer,
        objectName: objectName,
        contentLength: file.size
      };
      await BucketService.client.putObject(putObjectRequest);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }


  public static async downloadFileFromBucket(objectName: string): Promise<void> {
    try {
      const getObjectRequest: os.requests.GetObjectRequest = {
        namespaceName: BucketService.namespace,
        bucketName: BucketService.bucketName,
        objectName: objectName
      };

      const getObjectResponse = await BucketService.client.getObject(getObjectRequest);

      const stream = getObjectResponse.value as ReadableStream<any>
      let reader: ReadableStreamDefaultReader<any> | undefined;
      reader = stream.getReader();
      const downloadFilepath = "./download" + objectName;
      const writableStream = fs.createWriteStream(downloadFilepath);

      while (writableStream.bytesWritten < 10000) {
        const { done, value } = await reader.read();
        if (done) {
          writableStream.end();
          reader.releaseLock();
          break;
        }
        writableStream.write(value);
      }

      writableStream.on("finish", () => {
        console.log("File downloaded successfully.", downloadFilepath);
      });

    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    }
  }


}