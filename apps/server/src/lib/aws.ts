import { S3 } from "@aws-sdk/client-s3";
import crypto from "node:crypto";

class AwsClient {
  bucketName = process.env.AWS_BUCKET_NAME!;
  s3: S3;

  constructor() {
    this.s3 = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      endpoint: process.env.AWS_ENDPOINT,
      maxAttempts: 3,
      region: "auto",
    });
  }

  async deleteFile(Key: string) {
    const result = await this.s3.deleteObject({
      Bucket: this.bucketName,
      Key,
    });

    return result;
  }

  async getFile(Key: string) {
    try {
      const result = await this.s3.getObject({
        Bucket: this.bucketName,
        Key,
      });

      return result;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getFiles() {
    const result = await this.s3.listObjects({
      Bucket: this.bucketName,
    });

    return result.Contents;
  }

  async uploadFile(file: Express.Multer.File) {
    const key = crypto.randomUUID();

    await this.s3.putObject({
      Body: file.buffer,
      Bucket: this.bucketName,
      ContentType: file.mimetype,
      Key: key,
    });

    return key;
  }
}

export const AWS = new AwsClient();
