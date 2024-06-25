"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("oci-objectstorage");
const fs = require("fs");
const environment_1 = require("../config/environment");
const oci_sdk_provider_1 = __importDefault(require("../config/oci.sdk.provider"));
class BucketService {
    static uploadFileToBucket(objectName, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const putObjectRequest = {
                    namespaceName: BucketService.namespace,
                    bucketName: BucketService.bucketName,
                    putObjectBody: file.buffer,
                    objectName: objectName,
                    contentLength: file.size
                };
                yield BucketService.client.putObject(putObjectRequest);
            }
            catch (error) {
                console.error("Error uploading file:", error);
                throw error;
            }
        });
    }
    static downloadFileFromBucket(objectName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getObjectRequest = {
                    namespaceName: BucketService.namespace,
                    bucketName: BucketService.bucketName,
                    objectName: objectName
                };
                const getObjectResponse = yield BucketService.client.getObject(getObjectRequest);
                const stream = getObjectResponse.value;
                let reader;
                reader = stream.getReader();
                const downloadFilepath = "./download" + objectName;
                const writableStream = fs.createWriteStream(downloadFilepath);
                while (writableStream.bytesWritten < 10000) {
                    const { done, value } = yield reader.read();
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
            }
            catch (error) {
                console.error("Error downloading file:", error);
                throw error;
            }
        });
    }
}
(() => {
    BucketService.client = new os.ObjectStorageClient({ authenticationDetailsProvider: oci_sdk_provider_1.default });
    BucketService.namespace = environment_1.OCI_NAMESPACE;
    BucketService.bucketName = environment_1.OCI_BUCKET;
})();
exports.default = BucketService;
