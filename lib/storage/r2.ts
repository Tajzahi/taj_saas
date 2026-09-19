import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID || "0b91f22be275347bfb26d0969e74463e";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";
const bucketName = process.env.R2_BUCKET_NAME || "taj-assets";
const publicUrl = process.env.R2_PUBLIC_URL || "https://assets.a6nyusss.com";

function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID || "0b91f22be275347bfb26d0969e74463e";
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("Kredensial Cloudflare R2 belum disetting (R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY).");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Upload buffer to Cloudflare R2 bucket and return public URL
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string = "image/webp"
): Promise<string> {
  const bucketName = process.env.R2_BUCKET_NAME || "taj-assets";
  const publicUrl = process.env.R2_PUBLIC_URL || "https://assets.a6nyusss.com";
  const client = getR2Client();

  const cleanKey = key.replace(/^\/+/, "");
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: cleanKey,
    Body: body,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  await client.send(command);
  return `${publicUrl.replace(/\/$/, "")}/${cleanKey}`;
}
