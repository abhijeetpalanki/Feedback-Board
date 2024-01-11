import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export async function POST(request) {
  const s3Client = new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });

  const formData = await request.formData();
  const links = [];

  for (const fileInfo of formData) {
    const file = fileInfo[1];
    const name = Date.now().toString() + file.name;
    const chunks = [];
    for await (const chunk of file.stream()) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: name,
        ACL: "public-read",
        Body: buffer,
        ContentType: file.type,
      })
    );

    links.push("https://ayp-feedback-board-uploads.s3.amazonaws.com/" + name);
  }
  return Response.json(links);
}
