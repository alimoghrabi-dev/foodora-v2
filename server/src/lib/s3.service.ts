import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class S3Service {
  private s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    region: process.env.S3_BUCKET_REGION!,
  });

  async uploadFile(buffer: Buffer, filename: string, mimetype: string) {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: mimetype,
    });

    await this.s3.send(command);

    return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_BUCKET_REGION}.amazonaws.com/${filename}`;
  }

  async deleteFile(key: string) {
    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    };

    const deleteCommand = new DeleteObjectCommand(deleteParams);

    await this.s3.send(deleteCommand);
  }
}
