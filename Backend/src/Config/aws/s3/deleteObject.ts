import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config";

export const deleteFromS3 = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });

  await s3.send(command);
  return true;
};
