import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,    // Store in .env
    secretAccessKey: process.env.AWS_SECRET_KEY!,   // Store in .env
  },
});
