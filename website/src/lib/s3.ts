import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// Check if we are running in Amplify
const amplifyCredentials = process.env.MY_AWS_ACCESS_KEY_ID
  ? {
      credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY || "",
      },
    }
  : {};

// Initialize S3 Client
const s3 = new S3Client({ 
  region: "ca-central-1",
  ...amplifyCredentials
});
const BUCKET_NAME = "manutd-ecosystem-data-303238378489-ca-central-1";

export async function fetchFromS3(key: string) {
  try {
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
    const response = await s3.send(command);
    return await response.Body?.transformToString() || "";
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    return null;
  }
}
