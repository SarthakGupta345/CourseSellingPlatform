import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config";

export const uploadToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  type: string

) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `${type}/${Date.now()}-${fileName}`,
    Body: fileBuffer,
    ContentType: mimeType,
  });

  await s3.send(command);

  return {
    url: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${type}/${Date.now()}-${fileName}`,
    key: `${type}/${Date.now()}-${fileName}`,
  }
};
